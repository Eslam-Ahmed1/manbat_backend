export type ScanDetectionMode = "gemini_only" | "plant_model_only" | "hybrid";

export type ScanDetectionSettings = {
    mode: ScanDetectionMode;
    plantModel: {
        enabled: boolean;
        url: string;
        confidenceThreshold: number;
        diseaseConfidenceThreshold: number;
        alwaysAttempt: boolean;
        supportedPlants: string[];
    };
    gemini: {
        enabled: boolean;
        model: string;
    };
};

export type ScanDetectionSettingsUpdate = {
    mode: ScanDetectionMode;
    plantModelUrl?: string;
    confidenceThreshold?: number;
    diseaseConfidenceThreshold?: number;
    alwaysAttempt?: boolean;
    supportedPlants?: string[];
    geminiEnabled?: boolean;
};
