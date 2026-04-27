import { GoogleGenerativeAI } from "@google/generative-ai";
import Disease from "../models/diseases.ts";
import PlantScan from "../models/plantScans.ts";
import { appError } from "../../utils/appErrors.ts";
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import Treatment from "../models/treatments.ts";
import { getTreatmentsByDiseaseIds } from "./treatment.ts";
import Product from "../models/product.ts";

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
      Analyze this plant image and identify any diseases present. Return a strictly formatted JSON array of objects with the following keys:
- 'name' (string): A single, standardized common name of the disease. Do NOT include alternative names, parentheses, or words like 'likely', 'possibly', or 'or' in this field.
- 'treatment' (string): A single, standardized common name of the treatment. If no standard treatment exists, use "none identified". Do NOT include alternatives or uncertainty words.
- 'description' (string): A brief description of the disease and symptoms. You may include specific variants, alternative names, or uncertainties here.

If the plant is completely healthy OR has no identifiable disease (including pests or nutrient issues), return an empty array [].

If multiple diseases are present, include one object per disease.
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
        //2. Parse the JSON returned by the AI
        const detectedDiseases: { name: string, treatment: string, description: string }[] = JSON.parse(responseText);

        const diseaseIds = [];
        const treatments = [];
        const Products=[];
        // 3. Save any new diseases to the knowledge base (Diseases collection)
        for (const d of detectedDiseases) {
            let diseaseRecord = await Disease.findOne({ name: d.name });
            let treatmentRecord = await Treatment.findOne({ name: d.treatment });
            
            if (!diseaseRecord) {
                diseaseRecord = new Disease({ name: d.name, description: d.description });
                await diseaseRecord.save();
            }

            if (!treatmentRecord) {
                treatmentRecord = new Treatment({ name: d.treatment, disease_ids: [diseaseRecord._id] });
                await treatmentRecord.save();
            } else if (!treatmentRecord.disease_ids.some(id => id.toString() === diseaseRecord._id.toString())) {
                // Check if the disease is already linked to the treatment to prevent duplicates
                treatmentRecord.disease_ids.push(diseaseRecord._id);
                await treatmentRecord.save();
            }

            let productRecord = await Product.findOne({ treatment_id: treatmentRecord._id});

            treatments.push(treatmentRecord);
            diseaseIds.push(diseaseRecord._id);
            if (productRecord) Products.push(productRecord);
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
            return {PlantScan:await PlantScan.findById(newScan._id).populate('disease_ids'),treatments:treatments,Products:Products};
    } catch (error) {
        console.log(error);
        throw new appError("Failed to analyze image or save to database", 500);
    }
};
const getScanHistory = async (userId: string) => {
    // Use .lean() to convert Mongoose documents to plain JS objects so we can easily add new properties
    const data = await PlantScan.find({ user_id: userId }).populate('disease_ids').lean();

    // Wait for all the asynchronous treatment fetches to complete
    await Promise.all(data.map(async (scan: any) => {
        // Extract the IDs into a string array safely
        const extractedDiseaseIds: string[] = (scan.disease_ids || [])
            .filter((disease: any) => disease && disease._id)
            .map((disease: any) => disease._id.toString());

        // Fetch treatments only if diseases were detected
        scan.treatments = extractedDiseaseIds.length > 0 
            ? await getTreatmentsByDiseaseIds(extractedDiseaseIds)
            : [];
    }));



    return data;
}
const getScanHistoryByPlantId = async (plantId: string) => {
    const data = await PlantScan.find({ _id: plantId }).populate('disease_ids');
    return data;
}
export { analyzePlantImage, getScanHistory, getScanHistoryByPlantId };