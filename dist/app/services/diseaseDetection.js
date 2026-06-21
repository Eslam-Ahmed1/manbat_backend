import { detectDiseasesWithGemini } from "./geminiDetection.js";
import { getPlantModelConfig, isPlantSupported, parseHfDiseaseLabel, predictWithPlantModel, } from "./plantModel.js";
import { findDiseaseByName } from "./treatment.js";
import Treatment from "../models/treatments.js";
import Product from "../models/product.js";
import { getScanDetectionSettings } from "./scanModelSettings.js";
import { appError } from "../../utils/appErrors.js";
const dedupeByName = (diseases) => {
    const seen = new Map();
    for (const d of diseases) {
        const key = d.name.trim().toLowerCase();
        if (!seen.has(key))
            seen.set(key, d);
    }
    return Array.from(seen.values());
};
const getDefaultTreatmentForDisease = async (diseaseId) => {
    const treatments = await Treatment.find({ disease_ids: diseaseId }).sort({
        name: 1,
    });
    if (!treatments.length) {
        return { treatment: "none identified", instructions: "" };
    }
    for (const treatment of treatments) {
        const productCount = await Product.countDocuments({
            treatment_id: treatment._id,
            quantity: { $gt: 0 },
        });
        if (productCount > 0) {
            return {
                treatment: treatment.name,
                instructions: treatment.instructions ?? "",
            };
        }
    }
    const first = treatments[0];
    return {
        treatment: first.name,
        instructions: first.instructions ?? "",
    };
};
const mapCustomModelToDetectedDiseases = async (prediction, config) => {
    if (prediction.isHealthy) {
        return { diseases: [], allKnownInDb: true };
    }
    const diseases = [];
    let allKnownInDb = true;
    for (const item of prediction.diseases) {
        if (item.confidence < config.diseaseConfidenceThreshold) {
            allKnownInDb = false;
            continue;
        }
        const diseaseRecord = await findDiseaseByName(item.name);
        if (!diseaseRecord) {
            allKnownInDb = false;
            continue;
        }
        const { treatment, instructions } = await getDefaultTreatmentForDisease(diseaseRecord._id.toString());
        diseases.push({
            name: diseaseRecord.name,
            description: item.description?.trim() ||
                diseaseRecord.description ||
                "Detected by custom plant model",
            treatment,
            instructions,
        });
    }
    return { diseases: dedupeByName(diseases), allKnownInDb };
};
const canUseCustomModelOnly = (prediction, config, mapped) => {
    if (prediction.modelMessage)
        return false;
    if (!isPlantSupported(prediction, config))
        return false;
    if (prediction.confidence < config.confidenceThreshold)
        return false;
    if (prediction.isHealthy)
        return true;
    const confidentDiseases = prediction.diseases.filter((d) => d.confidence >= config.diseaseConfidenceThreshold);
    if (!confidentDiseases.length)
        return false;
    return mapped.allKnownInDb && mapped.diseases.length > 0;
};
const buildMetaFromPlantModel = (prediction, source) => ({
    source,
    plantType: prediction.plantType,
    modelConfidence: prediction.confidence,
    modelDiseaseLabel: prediction.rawLabel,
    customModelUsed: true,
    geminiUsed: false,
});
const tryPlantModel = async (imageBuffer, mimeType, plantConfig, mode) => {
    if (!plantConfig.enabled || !plantConfig.url) {
        if (mode === "plant_model_only") {
            throw new appError("Plant model is not configured. Set PLANT_MODEL_URL via admin scan-detection settings.", 503);
        }
        return {};
    }
    const t0 = Date.now();
    const prediction = await predictWithPlantModel(imageBuffer, mimeType, plantConfig);
    if (!prediction) {
        if (mode === "plant_model_only") {
            throw new appError("Plant disease model is unavailable. Try again later.", 503);
        }
        return {};
    }
    if (prediction.modelMessage && mode === "plant_model_only") {
        throw new appError(prediction.modelMessage, 422);
    }
    if (!prediction.modelMessage) {
        const mapped = await mapCustomModelToDetectedDiseases(prediction, plantConfig);
        if (canUseCustomModelOnly(prediction, plantConfig, mapped)) {
            console.log(`   ✅ [SCAN] HF model (${Date.now() - t0}ms) — mode: ${mode}`);
            return {
                result: {
                    diseases: mapped.diseases,
                    meta: buildMetaFromPlantModel(prediction, "custom_model"),
                },
            };
        }
        if (mode === "plant_model_only") {
            const reason = prediction.isHealthy
                ? "Plant appears healthy"
                : mapped.diseases.length > 0
                    ? "Disease detected but confidence or DB mapping insufficient"
                    : (prediction.modelMessage ??
                        "Could not map model result to a known disease");
            throw new appError(`Plant model could not produce a final diagnosis: ${reason}`, 422);
        }
        console.log(`   ↪️ [SCAN] HF inconclusive (hybrid) — Gemini fallback`);
    }
    return {
        prediction,
        modelRawLabel: prediction.rawLabel,
    };
};
/**

 * gemini_only | plant_model_only | hybrid — يُتحكم به من الأدمن

 */
export const detectDiseasesFromImage = async (imageBuffer, mimeType) => {
    const detectionSettings = await getScanDetectionSettings();
    const { mode } = detectionSettings;
    const plantConfig = await getPlantModelConfig();
    console.log(`   🔧 [SCAN] Detection mode: ${mode}`);
    const withMode = (meta) => ({ ...meta, detectionMode: mode });
    if (mode === "gemini_only") {
        if (!detectionSettings.gemini.enabled) {
            throw new appError("Gemini scan is disabled in admin settings", 503);
        }
        const diseases = dedupeByName(await detectDiseasesWithGemini(imageBuffer, mimeType));
        return {
            diseases,
            meta: withMode({
                source: "gemini",
                customModelUsed: false,
                geminiUsed: true,
            }),
        };
    }
    const plantAttempt = await tryPlantModel(imageBuffer, mimeType, plantConfig, mode);
    if (plantAttempt.result) {
        return {
            ...plantAttempt.result,
            meta: withMode(plantAttempt.result.meta),
        };
    }
    if (mode === "plant_model_only") {
        throw new appError("Plant model failed to return a diagnosis", 503);
    }
    if (!detectionSettings.gemini.enabled) {
        throw new appError("Gemini fallback is disabled in admin settings", 503);
    }
    const geminiDiseases = dedupeByName(await detectDiseasesWithGemini(imageBuffer, mimeType));
    return {
        diseases: geminiDiseases,
        meta: withMode({
            source: "hybrid",
            customModelUsed: plantConfig.enabled,
            geminiUsed: true,
            plantType: plantAttempt.modelRawLabel
                ? parseHfDiseaseLabel(plantAttempt.modelRawLabel).plantType
                : undefined,
            modelDiseaseLabel: plantAttempt.modelRawLabel,
        }),
    };
};
