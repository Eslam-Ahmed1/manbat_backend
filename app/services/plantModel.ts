import { getConfig } from "./config.ts";
import { getScanDetectionSettings } from "./scanModelSettings.ts";
import { HF_DISEASE_MAP } from "../config/plantModelHfMap.ts";
import { findDiseaseByName } from "./treatment.ts";

export type PlantModelDiseasePrediction = {
    name: string;
    confidence: number;
    description?: string;
    rawLabel?: string;
};

export type PlantModelPrediction = {
    plantType?: string;
    isSupportedPlant: boolean;
    isHealthy: boolean;
    confidence: number;
    diseases: PlantModelDiseasePrediction[];
    rawLabel?: string;
    modelMessage?: string;
};

export type PlantModelConfig = {
    enabled: boolean;
    url: string;
    apiKey?: string;
    confidenceThreshold: number;
    diseaseConfidenceThreshold: number;
    timeoutMs: number;
    supportedPlants: string[];
    /** دائماً استدعاء النموذج (متطلب أكاديمي) حتى مع fallback لـ Gemini */
    alwaysAttempt: boolean;
};

const DEFAULT_HF_URL =
    "https://mahmoudtharwat-plant-disease-api.hf.space";

export const getPlantModelConfig = async (): Promise<PlantModelConfig> => {
    const detectionSettings = await getScanDetectionSettings();
    const enabled = detectionSettings.plantModel.enabled;
    const url = detectionSettings.plantModel.url.replace(/\/$/, "");
    const apiKey = await getConfig("PLANT_MODEL_API_KEY");
    const confidenceThreshold = detectionSettings.plantModel.confidenceThreshold;
    const diseaseConfidenceThreshold =
        detectionSettings.plantModel.diseaseConfidenceThreshold;
    const timeoutMs = parseInt(
        (await getConfig("PLANT_MODEL_TIMEOUT_MS", "30000")) ?? "30000",
        10,
    );
    const supportedPlants = detectionSettings.plantModel.supportedPlants;
    const alwaysAttempt = detectionSettings.plantModel.alwaysAttempt;

    return {
        enabled,
        url,
        apiKey,
        confidenceThreshold: Number.isFinite(confidenceThreshold)
            ? confidenceThreshold
            : 0.75,
        diseaseConfidenceThreshold: Number.isFinite(diseaseConfidenceThreshold)
            ? diseaseConfidenceThreshold
            : 0.7,
        timeoutMs: Number.isFinite(timeoutMs) ? timeoutMs : 30000,
        supportedPlants,
        alwaysAttempt,
    };
};

type HfApiSuccess = {
    status: "success";
    disease: string;
    confidence: number;
};

type HfApiError = {
    status: "error";
    message: string;
};

const titleCase = (value: string) =>
    value
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");

/** تحويل Apple___Black_rot → { plant: apple, humanName: Black Rot } */
export const parseHfDiseaseLabel = (label: string) => {
    const trimmed = label.trim();
    const parts = trimmed.split("___");
    const plantRaw = parts[0] ?? "";
    const plantType = plantRaw
        .replace(/[(),]/g, "")
        .split(/\s+/)[0]
        .toLowerCase();
    const diseasePart = parts.slice(1).join("___");
    const isHealthy = /^healthy$/i.test(diseasePart);
    const humanName = titleCase(diseasePart.replace(/_/g, " "));

    return { plantType, diseasePart, isHealthy, humanName, rawLabel: trimmed };
};

/**
 * يحوّل تسمية النموذج إلى اسم مرض في DB إن وُجد
 */
export const resolveDiseaseDbName = async (
    modelLabel: string,
): Promise<string | null> => {
    const trimmed = modelLabel.trim();

    if (trimmed in HF_DISEASE_MAP) {
        const mapped = HF_DISEASE_MAP[trimmed];
        return mapped;
    }

    const parsed = parseHfDiseaseLabel(trimmed);
    if (parsed.isHealthy) return null;

    const candidates = [
        parsed.humanName,
        `${titleCase(parsed.plantType)} ${parsed.humanName}`,
        parsed.humanName.replace(new RegExp(`^${parsed.plantType}\\s+`, "i"), "").trim(),
    ].filter((n) => n.length > 0);

    for (const name of candidates) {
        const record = await findDiseaseByName(name);
        if (record) return record.name;
    }

    return null;
};

const mimeToExtension = (mimeType: string) => {
    if (mimeType.includes("png")) return "png";
    if (mimeType.includes("webp")) return "webp";
    if (mimeType.includes("gif")) return "gif";
    return "jpg";
};

const normalizeHfResponse = async (
    data: HfApiSuccess | HfApiError,
): Promise<PlantModelPrediction | null> => {
    if (data.status === "error") {
        console.warn(`   ⚠️ [SCAN] Plant model: ${data.message}`);
        return {
            plantType: undefined,
            isSupportedPlant: false,
            isHealthy: false,
            confidence: 0,
            diseases: [],
            modelMessage: data.message,
        };
    }

    const parsed = parseHfDiseaseLabel(data.disease);

    if (parsed.isHealthy) {
        return {
            plantType: parsed.plantType,
            isSupportedPlant: true,
            isHealthy: true,
            confidence: data.confidence,
            diseases: [],
            rawLabel: data.disease,
        };
    }

    const dbDiseaseName = await resolveDiseaseDbName(data.disease);
    if (!dbDiseaseName) {
        console.warn(
            `   ⚠️ [SCAN] HF label not mapped to DB: "${data.disease}" — Gemini fallback`,
        );
        return {
            plantType: parsed.plantType,
            isSupportedPlant: true,
            isHealthy: false,
            confidence: data.confidence,
            diseases: [],
            rawLabel: data.disease,
            modelMessage: `Unmapped disease label: ${data.disease}`,
        };
    }

    return {
        plantType: parsed.plantType,
        isSupportedPlant: true,
        isHealthy: false,
        confidence: data.confidence,
        diseases: [
            {
                name: dbDiseaseName,
                confidence: data.confidence,
                rawLabel: data.disease,
            },
        ],
        rawLabel: data.disease,
    };
};

/**
 * Hugging Face Space API:
 * POST /predict  multipart/form-data  field: file
 * { status: "success", disease: "Apple___Black_rot", confidence: 0.9 }
 */
export const predictWithPlantModel = async (
    imageBuffer: Buffer,
    mimeType: string,
    config: PlantModelConfig,
): Promise<PlantModelPrediction | null> => {
    if (!config.enabled || !config.url) return null;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

    try {
        const ext = mimeToExtension(mimeType);
        const blob = new Blob([imageBuffer], { type: mimeType });
        const form = new FormData();
        form.append("file", blob, `scan.${ext}`);

        const headers: Record<string, string> = {
            accept: "application/json",
        };
        if (config.apiKey) {
            headers.Authorization = `Bearer ${config.apiKey}`;
        }

        console.log(`   ⏳ [SCAN] Calling HF plant model: ${config.url}/predict`);
        const t0 = Date.now();

        const response = await fetch(`${config.url}/predict`, {
            method: "POST",
            headers,
            body: form,
            signal: controller.signal,
        });

        if (!response.ok) {
            console.warn(
                `   ⚠️ [SCAN] Plant model HTTP ${response.status} — fallback to Gemini`,
            );
            return null;
        }

        const data = (await response.json()) as HfApiSuccess | HfApiError;
        const prediction = await normalizeHfResponse(data);

        if (!prediction) return null;

        console.log(
            `   ✅ [SCAN] HF model (${Date.now() - t0}ms) — label: ${prediction.rawLabel ?? "—"}, db: ${prediction.diseases[0]?.name ?? "healthy"}, confidence: ${prediction.confidence}`,
        );

        return prediction;
    } catch (error) {
        console.warn(`   ⚠️ [SCAN] Plant model unavailable — fallback to Gemini`, error);
        return null;
    } finally {
        clearTimeout(timeout);
    }
};

export const isPlantSupported = (
    prediction: PlantModelPrediction,
    config: PlantModelConfig,
): boolean => {
    if (prediction.modelMessage) return false;
    if (!prediction.isSupportedPlant) return false;
    if (!config.supportedPlants.length) return true;

    const plantKey = (prediction.plantType ?? "").trim().toLowerCase();
    return plantKey.length > 0 && config.supportedPlants.includes(plantKey);
};
