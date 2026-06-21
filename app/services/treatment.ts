import Treatment from "../models/treatments.js";
import Disease from "../models/diseases.js";
import Product from "../models/product.js";
import { appError } from "../../utils/appErrors.js";

export type ScanDetectedEntry = {
    disease: { _id?: unknown; name: string; description?: string };
    treatment: { _id?: unknown; name: string; instructions?: string };
    products: ReturnType<typeof mapProductForScan>[];
    hasProducts: boolean;
    isNew?: boolean;
};

const escapeRegex = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeTreatmentKey = (name: string): string =>
    name
        .toLowerCase()
        .replace(
            /\b(application|applications|treatment|treatments|program|spray)\b/g,
            "",
        )
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();

/** أسماء علاجات عامة من AI لا تُعرض إذا وُجد علاج متجر للمرض */
export const isGenericTreatmentName = (name: string): boolean => {
    const n = name.trim().toLowerCase();
    if (!n || n === "none identified") return true;

    const exactGeneric = new Set([
        "fungicide",
        "fungicide application",
        "pesticide",
        "pesticide application",
        "insecticide",
        "insecticide application",
        "herbicide",
        "spray",
        "treatment",
        "chemical treatment",
    ]);
    if (exactGeneric.has(n)) return true;

    if (
        n.length < 28 &&
        /^(fungicide|pesticide|insecticide|herbicide)(\s+application)?$/i.test(n)
    ) {
        return true;
    }

    return false;
};

const pickBetterScanEntry = (
    a: ScanDetectedEntry,
    b: ScanDetectedEntry,
): ScanDetectedEntry => {
    if (a.hasProducts !== b.hasProducts) return a.hasProducts ? a : b;
    if (a.products.length !== b.products.length) {
        return a.products.length >= b.products.length ? a : b;
    }
    const aGeneric = isGenericTreatmentName(a.treatment.name);
    const bGeneric = isGenericTreatmentName(b.treatment.name);
    if (aGeneric !== bGeneric) return aGeneric ? b : a;
    return a.treatment.name.length >= b.treatment.name.length ? a : b;
};

/**
 * تحسين القائمة دون تغيير شكل العنصر:
 * - إزالة التكرار
 * - إخفاء العلاجات العامة/بدون منتجات عند وجود علاج متجر
 * - ترتيب العلاجات ذات المنتجات أولاً
 */
export const optimizeScanDetectedEntries = (
    entries: ScanDetectedEntry[],
): ScanDetectedEntry[] => {
    if (!entries.length) return entries;

    const newEntries = entries.filter((e) => e.isNew);
    const existingEntries = entries.filter((e) => !e.isNew);

    const byDisease = new Map<string, ScanDetectedEntry[]>();
    for (const entry of existingEntries) {
        const key =
            entry.disease._id?.toString() ?? entry.disease.name.toLowerCase();
        if (!byDisease.has(key)) byDisease.set(key, []);
        byDisease.get(key)!.push(entry);
    }

    const optimized: ScanDetectedEntry[] = [...newEntries];

    for (const group of byDisease.values()) {
        const deduped = new Map<string, ScanDetectedEntry>();
        for (const entry of group) {
            const key = normalizeTreatmentKey(entry.treatment.name);
            const prev = deduped.get(key);
            deduped.set(key, prev ? pickBetterScanEntry(prev, entry) : entry);
        }

        let list = Array.from(deduped.values());
        const hasStoreProducts = list.some((e) => e.hasProducts);

        if (hasStoreProducts) {
            list = list.filter(
                (e) =>
                    e.hasProducts ||
                    !isGenericTreatmentName(e.treatment.name),
            );
            list = list.filter((e) => e.hasProducts);
        }

        list.sort((a, b) => {
            if (a.hasProducts !== b.hasProducts) return a.hasProducts ? -1 : 1;
            return b.products.length - a.products.length;
        });

        optimized.push(...list);
    }

    return optimized;
};

export const findDiseaseByName = async (name: string) => {
    const regex = new RegExp(`^${escapeRegex(name)}$`, "i");
    return Disease.findOne({ name: { $regex: regex } });
};

/** يحفظ مرضاً وعلاجه من AI للاستخدام في المسحات القادمة */
export const persistNewDiseaseWithTreatment = async (ai: {
    name: string;
    description?: string;
    treatment: string;
    instructions?: string;
}) => {
    const disease = new Disease({
        name: ai.name,
        description: ai.description?.trim() || "Detected by AI scan",
    });
    await disease.save();

    const treatmentName = ai.treatment?.trim();
    const skipTreatment =
        !treatmentName || treatmentName.toLowerCase() === "none identified";

    if (skipTreatment) {
        return { disease, treatment: null };
    }

    // لا تُربط أسماء عامة (Fungicide…) بعلاجات عالمية مكررة في DB
    if (!isGenericTreatmentName(treatmentName)) {
        const treatmentRegex = new RegExp(
            `^${escapeRegex(treatmentName)}$`,
            "i",
        );
        let treatment = await Treatment.findOne({
            name: { $regex: treatmentRegex },
        });

        if (treatment) {
            if (
                !treatment.disease_ids.some(
                    (id) => id.toString() === disease._id.toString(),
                )
            ) {
                treatment.disease_ids.push(disease._id);
                if (ai.instructions && !treatment.instructions) {
                    treatment.instructions = ai.instructions;
                }
                await treatment.save();
            }
            return { disease, treatment };
        }
    }

    const treatment = new Treatment({
        name: treatmentName,
        instructions: ai.instructions,
        disease_ids: [disease._id],
    });
    await treatment.save();

    return { disease, treatment };
};

/** استجابة المسح الأول لمرض جديد: الاسم فقط بدون منتجات */
export const buildNewDiseaseScanEntry = (
    disease: { name: string },
    treatment: { name: string } | null,
): ScanDetectedEntry => ({
    disease: { name: disease.name },
    treatment: { name: treatment?.name ?? "none identified" },
    products: [],
    hasProducts: false,
    isNew: true,
});

const mapProductForScan = (p: {
    _id: unknown;
    name: string;
    description?: string | null;
    price: number;
    discount?: number | null;
    quantity: number;
    image_url?: string | null;
}) => {
    const discount = p.discount ?? 0;
    const discountedPrice =
        discount > 0
            ? Math.round(p.price * (1 - discount / 100) * 100) / 100
            : p.price;

    return {
        _id: p._id,
        name: p.name,
        description: p.description,
        price: p.price,
        discount,
        discountedPrice,
        quantity: p.quantity,
        image_url: p.image_url,
        status:
            p.quantity === 0
                ? "out_of_stock"
                : p.quantity <= 10
                  ? "low_stock"
                  : "in_stock",
    };
};

/** Treatments linked to diseases in DB, each with in-stock products from the store */
export const getTreatmentsWithProductsForDiseaseIds = async (diseaseIds: string[]) => {
    if (!diseaseIds.length) return [];

    const diseases = await Disease.find({ _id: { $in: diseaseIds } });
    const treatments = await Treatment.find({
        disease_ids: { $in: diseaseIds },
    }).sort({ name: 1 });

    const results: ScanDetectedEntry[] = [];

    for (const disease of diseases) {
        const diseaseId = disease._id.toString();
        const linkedTreatments = treatments.filter((t) =>
            t.disease_ids.some((id) => id.toString() === diseaseId),
        );

        for (const treatment of linkedTreatments) {
            const products = await Product.find({
                treatment_id: treatment._id,
                quantity: { $gt: 0 },
            }).sort({ price: 1 });

            results.push({
                disease: {
                    _id: disease._id,
                    name: disease.name,
                    description: disease.description,
                },
                treatment: {
                    _id: treatment._id,
                    name: treatment.name,
                    instructions: treatment.instructions ?? undefined,
                },
                products: products.map((p) => mapProductForScan(p)),
                hasProducts: products.length > 0,
            });
        }
    }

    return optimizeScanDetectedEntries(results);
};

export const getAllTreatments = async () => {
    return await Treatment.find().populate('disease_ids', 'name');
};

export const getTreatmentsByDiseaseId = async (diseaseId: string) => {
    const disease = await Disease.findById(diseaseId);
    if (!disease) throw new appError("Disease not found", 404);
    
    return await Treatment.find({ disease_ids: diseaseId });
};

export const getTreatmentsByDiseaseIds = async (diseaseIds: string[]) => {
    // Finds all treatments where the 'disease_ids' array contains AT LEAST ONE of the provided IDs
    return await Treatment.find({ disease_ids: { $in: diseaseIds } }).populate('disease_ids', 'name');
};

export const getTreatmentById = async (id: string) => {
    const treatment = await Treatment.findById(id).populate('disease_ids', 'name description');
    if (!treatment) throw new appError("Treatment not found", 404);
    return treatment;
};
