import { GoogleGenerativeAI } from "@google/generative-ai";
import Disease from "../models/diseases.ts";
import PlantScan from "../models/plantScans.ts";
import { appError } from "../../utils/appErrors.ts";
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = (buffer: Buffer): Promise<any> => {
    return new Promise((resolve, reject) => {
        const cld_upload_stream = cloudinary.uploader.upload_stream(
            { folder: "manbut_plant_scans" },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );
        streamifier.createReadStream(buffer).pipe(cld_upload_stream);
    });
};

const getAIModel = () => {
    if (!process.env.GEMINI_API_KEY) {
        throw new appError("Server configuration error: GEMINI_API_KEY is missing", 500);
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // We enforce JSON output so it's easy to parse the AI's response
    return genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
    });
};

const analyzePlantImage = async (userId: string, imageBuffer: Buffer, mimeType: string) => {
    try {
        const model = getAIModel();
        const prompt = `
        Analyze this plant image. Identify any diseases present. 
        Return a JSON array of objects, where each object has a 'name' (string) and 'description' (string) of the disease.
        If the plant is healthy, return an empty array [].
        `;
        const imagePart = {
            inlineData: {
                data: imageBuffer.toString("base64"),
                mimeType: mimeType
            }
        };
        // 1. Call Gemini to analyze the image
        const result = await model.generateContent([prompt, imagePart]);
        const responseText = result.response.text();
        // 2. Parse the JSON returned by the AI
        const detectedDiseases: { name: string, description: string }[] = JSON.parse(responseText);
        const diseaseIds = [];
        // 3. Save any new diseases to the knowledge base (Diseases collection)
        for (const d of detectedDiseases) {
            let diseaseRecord = await Disease.findOne({ name: d.name });
            if (!diseaseRecord) {
                diseaseRecord = new Disease({ name: d.name, description: d.description });
                await diseaseRecord.save();
            }
            diseaseIds.push(diseaseRecord._id);
        }

        // 4. Upload the image to Cloudinary
        let imageUrl = "";
        try {
            const uploadResult = await uploadToCloudinary(imageBuffer);
            imageUrl = uploadResult.secure_url;
        } catch (error) {
            console.error("Cloudinary upload error:", error);
        }

        // 5. Save the scan history (PlantScans collection)
        const newScan = new PlantScan({
            user_id: userId,
            status: 'completed',
            image_url: imageUrl,
            disease_ids: diseaseIds
        });

        await newScan.save();

        // 6. Return the populated scan to the user
        return await PlantScan.findById(newScan._id).populate('disease_ids');

    } catch (error) {
        console.log(error);
        throw new appError("Failed to analyze image or save to database", 500);
    }
};
const getScanHistory = async(userId: string) => {
    const data = await PlantScan.find({ user_id: userId }).populate('disease_ids');
    return data;
}
const getScanHistoryByPlantId = async(plantId: string) => {
    const data = await PlantScan.find({ _id: plantId }).populate('disease_ids');
    return data;
}
export { analyzePlantImage, getScanHistory, getScanHistoryByPlantId };