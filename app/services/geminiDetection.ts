import { GoogleGenerativeAI } from "@google/generative-ai";
import { appError } from "../../utils/appErrors.js";
import { getConfig } from "./config.js";
import type { DetectedDiseaseInput } from "../types/diseaseDetection.js";

const DISEASE_DETECTION_PROMPT = `
Analyze this plant image and identify any diseases present. Return a strictly formatted JSON array of disease objects.
If the plant is completely healthy, or if only pests or nutrient deficiencies are present (no identifiably pathogenic disease), return [].
Each object must have these keys:
"name" (string): One standardized common name from the [RHS / APS / etc.] disease list. Do NOT include alternatives, parentheses, or words like 'likely', 'possibly', or 'or'.
"treatment" (string): One standardized common name of a chemical or cultural treatment. If none exists, use "none identified". No alternatives or uncertainty words.
"instructions" (string): Concise step-by-step treatment instructions (frequency, method, precautions if known).
"description" (string): Brief description of the disease and visible symptoms.
If multiple diseases are present, include one object per disease.
`;

const getGeminiModel = async () => {
    const apiKey = await getConfig("GEMINI_API_KEY");
    if (!apiKey) {
        throw new appError("Server configuration error: GEMINI_API_KEY is missing", 500);
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" },
    });
};

export const detectDiseasesWithGemini = async (
    imageBuffer: Buffer,
    mimeType: string,
): Promise<DetectedDiseaseInput[]> => {
    const model = await getGeminiModel();
    const imagePart = {
        inlineData: {
            data: imageBuffer.toString("base64"),
            mimeType,
        },
    };

    console.log(`   ⏳ [SCAN] Calling Gemini AI...`);
    const t1 = Date.now();
    const result = await model.generateContent([DISEASE_DETECTION_PROMPT, imagePart]);
    const responseText = result.response.text();
    console.log(`   ✅ [SCAN] Gemini responded in ${Date.now() - t1}ms`);

    const parsed = JSON.parse(responseText) as DetectedDiseaseInput[];
    return Array.isArray(parsed) ? parsed : [];
};
