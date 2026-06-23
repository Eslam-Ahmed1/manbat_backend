import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../app/loaders/mongooseLoader.js';
import Disease from '../app/models/diseases.js';
import Treatment from '../app/models/treatments.js';
import Product from '../app/models/product.js';
import ProductCategory from '../app/models/productCategory.js';
import { diseasesData } from './diseases.seed.js';
// ─── Peach Scab ──────────────────────────────────────────────
const peachScabDisease = {
    name: "Peach Scab",
    description: "A fungal disease of peach, nectarine, plum, and apricot caused by Cladosporium carpophilum. Appears as small olive-green to dark brown or black circular spots (2-6mm) on fruit skin, often cracking the surface. Spots may merge on heavily infected fruit causing deformity. Also affects twigs with small raised lesions and leaves with yellow spots that drop out leaving shot-holes. Thrives in warm, humid conditions during spring. Fruit infection occurs 6-8 weeks before harvest."
};
const peachScabTreatment = {
    name: "Peach Scab Fungicide Program",
    instructions: "Begin preventive sprays at petal fall (when 75% of petals have dropped). Apply a fungicide containing captan, myclobutanil, or propiconazole every 10-14 days until 40 days before harvest. Ensure thorough coverage of all fruit and foliage. Remove and destroy all mummified fruit and infected twigs during dormant pruning. Improve air circulation by thinning the canopy. Avoid overhead irrigation. Apply copper-based fungicide during dormant season for additional protection.",
    diseaseNames: ["Peach Scab"]
};
const peachScabProducts = [
    {
        name: "Captan 50% WP Fungicide - 500g",
        description: "Broad-spectrum protective fungicide containing 50% captan. Highly effective against peach scab, brown rot, and apple scab. Mix 2-3g per liter of water and apply as a thorough cover spray. Begin at petal fall and repeat every 10-14 days. Pre-harvest interval: 7 days. Do not mix with alkaline pesticides.",
        price: 165, discount: 0, quantity: 60,
        categoryName: "Fungicides", treatmentName: "Peach Scab Fungicide Program",
        image_url: "https://images.unsplash.com/photo-1599598425947-5202edd56fdb?w=400"
    },
    {
        name: "Myclobutanil Systemic Fungicide - 250ml",
        description: "Systemic triazole fungicide with both protective and curative action against peach scab, powdery mildew, and rust. Absorbed through leaves and redistributed throughout the plant. Mix 1ml per liter of water. Apply every 14 days starting at petal fall. Excellent rainfastness after 2 hours.",
        price: 210, discount: 10, quantity: 40,
        categoryName: "Fungicides", treatmentName: "Peach Scab Fungicide Program",
        image_url: "https://images.unsplash.com/photo-1599598425947-5202edd56fdb?w=400"
    },
    {
        name: "Copper Oxychloride Dormant Spray - 1kg",
        description: "Copper-based fungicide for dormant season application on stone fruit trees. Controls overwintering fungal spores including peach scab, leaf curl, and bacterial canker. Mix 4-5g per liter and apply thoroughly to all bark surfaces after leaf fall and before bud swell. One application per dormant season.",
        price: 130, discount: 5, quantity: 55,
        categoryName: "Fungicides", treatmentName: "Peach Scab Fungicide Program",
        image_url: "https://images.unsplash.com/photo-1599598425947-5202edd56fdb?w=400"
    }
];
// ─────────────────────────────────────────────────────────────
// ─── Treatments data ────────────────────────────────────────
const treatmentsData = [
    {
        name: "Fungicide Spray Treatment",
        instructions: "Dilute the fungicide according to label instructions (typically 2-3 ml per liter of water). Spray thoroughly on all affected foliage, covering both upper and lower leaf surfaces. Apply early in the morning or late afternoon to avoid leaf burn. Repeat every 7-10 days for 3-4 applications. Remove severely infected leaves before spraying.",
        diseaseNames: ["Powdery Mildew", "Downy Mildew", "Cercospora Leaf Spot"]
    },
    {
        name: "Neem Oil Application",
        instructions: "Mix 5 ml of cold-pressed neem oil with 1 liter of water and a few drops of liquid soap as an emulsifier. Shake well and spray on all plant surfaces, paying special attention to the undersides of leaves. Apply every 5-7 days.",
        diseaseNames: ["Anthracnose Leaf Blight", "Cercospora Leaf Spot", "Septoria Leaf Spot"]
    },
    {
        name: "Copper-Based Fungicide",
        instructions: "Mix copper hydroxide or copper sulfate at 3-5 grams per liter of water. Apply as a preventive spray before disease symptoms appear. Reapply after rain. Do not apply in temperatures above 30°C.",
        diseaseNames: ["Early Blight", "Late Blight", "Bacterial Wilt", "Fire Blight"]
    },
    {
        name: "Soil Drainage & Aeration",
        instructions: "Immediately reduce watering frequency by 50%. Remove the plant from its pot, trim all brown and mushy roots with sterilized scissors. Repot in fresh, well-draining potting mix amended with 30% perlite. Water only when the top 3cm of soil feels completely dry.",
        diseaseNames: ["Root Rot", "Damping Off", "Pythium Root Rot", "Rhizoctonia Root Rot"]
    },
    {
        name: "Sulfur Dust Application",
        instructions: "Apply finely ground sulfur powder directly to affected leaves using a powder duster or by mixing 3 grams per liter of water as a spray. Apply when temperatures are between 20-30°C. Reapply every 7-14 days.",
        diseaseNames: ["Leaf Rust", "Wheat Stem Rust", "Rose Rust", "Powdery Mildew"]
    },
    {
        name: "Systemic Fungicide Treatment",
        instructions: "Apply a systemic fungicide as a soil drench at the base of the plant. Use 1-2 ml per liter of water. Apply once every 14-21 days for up to 3 applications per season.",
        diseaseNames: ["Fusarium Wilt", "Verticillium Wilt", "Panama Wilt"]
    },
    {
        name: "Biological Control (Bacillus)",
        instructions: "Apply Bacillus subtilis-based biological fungicide as a soil drench or foliar spray. Mix 2-3 grams per liter. Apply every 7-10 days as a preventive measure. Safe for organic gardening.",
        diseaseNames: ["Damping Off", "Root Rot", "Crown Rot"]
    },
    {
        name: "Pruning & Sanitation Protocol",
        instructions: "Using sterilized pruning shears, remove all infected leaves, stems, and branches. Cut at least 5cm below the visible infection point. Dispose of all debris — do not compost infected material. Apply a preventive fungicide after pruning.",
        diseaseNames: ["Bacterial Canker", "Cytospora Canker", "Dieback", "Gray Mold"]
    },
    {
        name: "Virus Management Protocol",
        instructions: "There is no cure for viral plant diseases. Remove and destroy all severely infected plants. Control insect vectors using insecticidal soap or neem oil. Sterilize all tools with 10% bleach solution.",
        diseaseNames: ["Tobacco Mosaic Virus", "Cucumber Mosaic Virus", "Tomato Yellow Leaf Curl Virus", "Tomato Mosaic Virus"]
    },
    {
        name: "Hydrogen Peroxide Root Treatment",
        instructions: "Prepare a solution of 3% hydrogen peroxide mixed at 1 part H2O2 to 2 parts water. Soak roots for 15-20 minutes. Repot in fresh sterile potting mix and reduce watering for 2 weeks.",
        diseaseNames: ["Root Rot", "Crown Rot", "Stem Rot"]
    }
];
// ─── Products data ───────────────────────────────────────────
const productsData = [
    // Fungicides
    {
        name: "TopFungus Pro Spray - 500ml",
        description: "Professional-grade systemic fungicide containing azoxystrobin for broad-spectrum control of powdery mildew, rust, leaf spot, and blight. Apply at first sign of disease and repeat every 7-10 days.",
        price: 180, discount: 15, quantity: 45,
        categoryName: "Fungicides", treatmentName: "Fungicide Spray Treatment",
        image_url: "https://images.unsplash.com/photo-1599598425947-5202edd56fdb?w=400"
    },
    {
        name: "Organic Neem Oil Concentrate - 250ml",
        description: "Cold-pressed 100% pure neem oil. Works as a natural fungicide, insecticide, and miticide. Mix 5ml per liter of water with a few drops of liquid soap.",
        price: 85, discount: 0, quantity: 90,
        categoryName: "Fungicides", treatmentName: "Neem Oil Application",
        image_url: "https://images.unsplash.com/photo-1599598425947-5202edd56fdb?w=400"
    },
    {
        name: "Copper Hydroxide Fungicide - 500g",
        description: "Inorganic copper-based fungicide powder. Effective against bacterial and fungal diseases including blight, canker, and downy mildew. Mix 3-5g per liter of water.",
        price: 145, discount: 10, quantity: 55,
        categoryName: "Fungicides", treatmentName: "Copper-Based Fungicide",
        image_url: "https://images.unsplash.com/photo-1599598425947-5202edd56fdb?w=400"
    },
    {
        name: "Sulfur Powder - 1kg",
        description: "Finely ground elemental sulfur for dusting or mixing as spray. Controls powdery mildew, rust, and scab. Do not use when temperatures exceed 30°C.",
        price: 65, discount: 0, quantity: 70,
        categoryName: "Fungicides", treatmentName: "Sulfur Dust Application",
        image_url: "https://images.unsplash.com/photo-1599598425947-5202edd56fdb?w=400"
    },
    // Fertilizers
    {
        name: "NPK 20-20-20 General Fertilizer - 5kg",
        description: "Balanced water-soluble NPK fertilizer suitable for all plant types. Dissolve 2-3 grams per liter of water and apply every 2 weeks during the growing season.",
        price: 185, discount: 10, quantity: 80,
        categoryName: "Fertilizers", treatmentName: null,
        image_url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400"
    },
    {
        name: "Organic Compost Fertilizer - 10L",
        description: "100% natural composted organic matter enriched with worm castings and beneficial microorganisms. Improves soil structure and nutrient availability.",
        price: 95, discount: 0, quantity: 120,
        categoryName: "Fertilizers", treatmentName: null,
        image_url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400"
    },
    // Insecticides
    {
        name: "Organic Insecticidal Soap - 500ml",
        description: "Ready-to-use potassium salt-based insecticidal soap. Kills aphids, whiteflies, mealybugs, and spider mites on contact. Safe for edible crops.",
        price: 75, discount: 5, quantity: 100,
        categoryName: "Insecticides", treatmentName: null,
        image_url: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400"
    },
    // Garden Tools
    {
        name: "Professional Bypass Pruning Shears",
        description: "Heavy-duty ergonomic pruning shears with SK5 high-carbon steel blades. Clean cuts on branches up to 25mm diameter. Features a safety lock mechanism.",
        price: 120, discount: 20, quantity: 30,
        categoryName: "Garden Tools", treatmentName: null,
        image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400"
    },
    {
        name: "Digital Soil pH & Moisture Meter",
        description: "3-in-1 digital meter measuring soil pH, moisture level, and light intensity. No batteries required. Essential for optimal plant care.",
        price: 150, discount: 10, quantity: 40,
        categoryName: "Garden Tools", treatmentName: null,
        image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400"
    },
    // Soil
    {
        name: "Premium Potting Mix - 20L",
        description: "Professional-grade potting mix blended from peat moss, composted bark, perlite, and slow-release fertilizer. pH-balanced and enriched with mycorrhizal fungi.",
        price: 55, discount: 0, quantity: 90,
        categoryName: "Soil & Substrates", treatmentName: null,
        image_url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400"
    },
    {
        name: "Perlite Soil Amendment - 5L",
        description: "Lightweight volcanic glass granules that improve soil aeration and drainage. Mix 20-30% perlite into potting soil to prevent compaction and root rot.",
        price: 35, discount: 0, quantity: 110,
        categoryName: "Soil & Substrates", treatmentName: null,
        image_url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400"
    }
];
// ─── Product Categories ──────────────────────────────────────
const categoriesData = [
    { name: "Fungicides", description: "Chemical and organic fungicides for plant disease control" },
    { name: "Fertilizers", description: "Nutrients and soil amendments for healthy plant growth" },
    { name: "Insecticides", description: "Pest control products for insects and mites" },
    { name: "Garden Tools", description: "Hand tools and equipment for gardening" },
    { name: "Seeds", description: "Vegetable, herb, and flower seeds" },
    { name: "Pots & Planters", description: "Containers and planters for indoor and outdoor use" },
    { name: "Soil & Substrates", description: "Potting mixes, perlite, and growing media" },
    { name: "Irrigation", description: "Watering systems and accessories" },
];
// ─── Main seed runner ────────────────────────────────────────
const runSeeds = async () => {
    await connectDB();
    console.log('\n🌱 Starting full database seed...\n');
    // 1. Product Categories (no dependencies)
    console.log('── Step 1: Product Categories ──────────────────');
    const categoryOps = categoriesData.map(c => ({
        updateOne: { filter: { name: c.name }, update: { $set: c }, upsert: true }
    }));
    await ProductCategory.bulkWrite(categoryOps);
    const allCategories = await ProductCategory.find();
    const categoryMap = new Map(allCategories.map(c => [c.name, c._id]));
    console.log(`✅ ${allCategories.length} categories ready\n`);
    // 2. Diseases (no dependencies)
    console.log('── Step 2: Diseases ─────────────────────────────');
    const allDiseasesData = [...diseasesData, peachScabDisease];
    const diseaseOps = allDiseasesData.map(d => ({
        updateOne: { filter: { name: d.name }, update: { $set: d }, upsert: true }
    }));
    await Disease.bulkWrite(diseaseOps);
    const allDiseases = await Disease.find();
    const diseaseMap = new Map(allDiseases.map(d => [d.name, d._id]));
    console.log(`✅ ${allDiseases.length} diseases ready\n`);
    // 3. Treatments (depends on Diseases)
    console.log('── Step 3: Treatments ───────────────────────────');
    const allTreatmentsData = [
        ...treatmentsData,
        { ...peachScabTreatment }
    ];
    let treatmentWarnings = 0;
    const treatmentOps = allTreatmentsData.map(t => {
        const disease_ids = t.diseaseNames
            .map(name => {
            const id = diseaseMap.get(name);
            if (!id) {
                console.log(`   ⚠️  Disease not found: "${name}"`);
                treatmentWarnings++;
            }
            return id;
        })
            .filter(Boolean);
        return {
            updateOne: {
                filter: { name: t.name },
                update: { $set: { name: t.name, instructions: t.instructions, disease_ids: disease_ids } },
                upsert: true
            }
        };
    });
    await Treatment.bulkWrite(treatmentOps);
    const allTreatments = await Treatment.find();
    const treatmentMap = new Map(allTreatments.map(t => [t.name, t._id]));
    console.log(`✅ ${allTreatments.length} treatments ready${treatmentWarnings ? ` (${treatmentWarnings} warnings)` : ''}\n`);
    // 4. Products (depends on Treatments + Categories)
    console.log('── Step 4: Products ─────────────────────────────');
    const allProductsData = [
        ...productsData,
        ...peachScabProducts
    ];
    let productWarnings = 0;
    const productOps = allProductsData.map(p => {
        const treatment_id = p.treatmentName ? treatmentMap.get(p.treatmentName) ?? null : null;
        const product_category_id = p.categoryName ? categoryMap.get(p.categoryName) ?? null : null;
        if (p.treatmentName && !treatment_id) {
            console.log(`   ⚠️  Treatment not found: "${p.treatmentName}"`);
            productWarnings++;
        }
        if (p.categoryName && !product_category_id) {
            console.log(`   ⚠️  Category not found: "${p.categoryName}"`);
            productWarnings++;
        }
        const doc = {
            name: p.name, description: p.description,
            price: p.price, discount: p.discount, quantity: p.quantity,
            image_url: p.image_url, treatment_id, product_category_id
        };
        return { updateOne: { filter: { name: p.name }, update: { $set: doc }, upsert: true } };
    });
    await Product.bulkWrite(productOps);
    const totalProducts = await Product.countDocuments();
    console.log(`✅ ${totalProducts} products ready${productWarnings ? ` (${productWarnings} warnings)` : ''}\n`);
    // ─── Summary ─────────────────────────────────────────────
    console.log('═══════════════════════════════════════════════');
    console.log('🎉 Seed completed!');
    console.log(`   📁 Categories : ${allCategories.length}`);
    console.log(`   🦠 Diseases   : ${allDiseases.length}`);
    console.log(`   💊 Treatments : ${allTreatments.length}`);
    console.log(`   📦 Products   : ${totalProducts}`);
    console.log('═══════════════════════════════════════════════\n');
    await mongoose.disconnect();
    process.exit(0);
};
runSeeds().catch(err => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
