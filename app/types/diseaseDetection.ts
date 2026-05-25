/** شكل موحّد لنتيجة التشخيص — يُستهلك من مسار الـ scan الحالي */
export type DetectedDiseaseInput = {
    name: string;
    treatment: string;
    instructions: string;
    description: string;
};

export type DetectionSource = "custom_model" | "gemini" | "hybrid";

export type DetectionMeta = {
    source: DetectionSource;
    detectionMode?: "gemini_only" | "plant_model_only" | "hybrid";
    plantType?: string;
    modelConfidence?: number;
    /** تسمية النموذج الخام مثل Apple___Black_rot */
    modelDiseaseLabel?: string;
    customModelUsed: boolean;
    geminiUsed: boolean;
};

export type DiseaseDetectionResult = {
    diseases: DetectedDiseaseInput[];
    meta: DetectionMeta;
};
