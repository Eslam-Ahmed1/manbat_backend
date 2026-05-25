import mongoose from 'mongoose';
import Treatment from '../app/models/treatments.ts';
import Disease from '../app/models/diseases.ts';
import dotenv from 'dotenv';

dotenv.config();

// Each treatment references diseases by name — they will be looked up at runtime
const treatmentsData = [
    {
        name: "Fungicide Spray Treatment",
        instructions: "Dilute the fungicide according to label instructions (typically 2-3 ml per liter of water). Spray thoroughly on all affected foliage, covering both upper and lower leaf surfaces. Apply early in the morning or late afternoon to avoid leaf burn. Repeat every 7-10 days for 3-4 applications. Remove severely infected leaves before spraying.",
        diseaseNames: ["Powdery Mildew", "Downy Mildew", "Leaf Spot"]
    },
    {
        name: "Neem Oil Application",
        instructions: "Mix 5 ml of cold-pressed neem oil with 1 liter of water and a few drops of liquid soap as an emulsifier. Shake well and spray on all plant surfaces, paying special attention to the undersides of leaves. Apply every 5-7 days. Neem oil works as both a fungicide and insecticide, disrupting pest feeding and reproduction cycles.",
        diseaseNames: ["Sooty Mold", "Anthracnose", "Black Spot"]
    },
    {
        name: "Copper-Based Fungicide",
        instructions: "Mix copper hydroxide or copper sulfate (Bordeaux mixture) at 3-5 grams per liter of water. Apply as a preventive spray before disease symptoms appear, ideally during cool, humid weather. Reapply after rain. Do not apply in temperatures above 30°C. Copper accumulates in soil, so limit applications to 3-4 per season.",
        diseaseNames: ["Early Blight", "Late Blight", "Bacterial Wilt"]
    },
    {
        name: "Soil Drainage & Aeration",
        instructions: "Immediately reduce watering frequency by 50%. Remove the plant from its pot, trim all brown and mushy roots with sterilized scissors. Repot in fresh, well-draining potting mix amended with 30% perlite. Ensure pots have adequate drainage holes. Water only when the top 3cm of soil feels completely dry to the touch.",
        diseaseNames: ["Root Rot", "Damping Off"]
    },
    {
        name: "Sulfur Dust Application",
        instructions: "Apply finely ground sulfur powder directly to affected leaves using a powder duster or by mixing 3 grams per liter of water as a spray. Apply when temperatures are between 20-30°C — sulfur can cause leaf burn in extreme heat. Reapply every 7-14 days. Do not combine with oil-based sprays as the combination is phytotoxic.",
        diseaseNames: ["Rust", "Powdery Mildew"]
    },
    {
        name: "Systemic Fungicide Treatment",
        instructions: "Apply a systemic fungicide (containing active ingredients like thiophanate-methyl or azoxystrobin) as a soil drench at the base of the plant. The chemical is absorbed through roots and distributed throughout the vascular system. Use 1-2 ml per liter of water. Apply once every 14-21 days for up to 3 applications per season.",
        diseaseNames: ["Fusarium Wilt", "Anthracnose"]
    },
    {
        name: "Biological Control (Bacillus)",
        instructions: "Apply Bacillus subtilis or Bacillus amyloliquefaciens-based biological fungicide as a soil drench or foliar spray. Mix according to product label (typically 2-3 grams per liter). The beneficial bacteria colonize root zones and leaf surfaces, outcompeting pathogenic fungi. Apply every 7-10 days as a preventive measure. Safe for organic gardening.",
        diseaseNames: ["Damping Off", "Root Rot"]
    },
    {
        name: "Pruning & Sanitation Protocol",
        instructions: "Using sterilized pruning shears (dip in 70% alcohol between cuts), remove all infected leaves, stems, and branches. Cut at least 5cm below the visible infection point. Collect and dispose of all fallen debris — do not compost infected material. Improve air circulation by spacing plants adequately. Apply a preventive fungicide after pruning.",
        diseaseNames: ["Black Spot", "Leaf Spot", "Anthracnose"]
    },
    {
        name: "Virus Management Protocol",
        instructions: "There is no cure for viral plant diseases. Remove and destroy all severely infected plants to prevent spread. Control insect vectors (especially aphids) using insecticidal soap or neem oil. Sterilize all tools with 10% bleach solution. Plant virus-resistant varieties when available. Use reflective mulch to repel aphid vectors.",
        diseaseNames: ["Mosaic Virus", "Leaf Curl"]
    },
    {
        name: "Hydrogen Peroxide Root Treatment",
        instructions: "Prepare a solution of 3% hydrogen peroxide mixed at 1 part H2O2 to 2 parts water. Remove the plant from soil, wash roots under running water, then soak roots in the H2O2 solution for 15-20 minutes. This kills anaerobic fungi and adds oxygen to damaged roots. Repot in fresh sterile potting mix and reduce watering for 2 weeks.",
        diseaseNames: ["Root Rot", "Fusarium Wilt"]
    }
];

const seedTreatments = async () => {
    try {
        console.log('🌱 Starting treatments seeding...');

        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error('❌ MONGODB_URI is not defined in .env');
            process.exit(1);
        }

        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Clear existing treatments
        await Treatment.deleteMany({});
        console.log('🗑️  Cleared old treatments');

        let added = 0;
        let skipped = 0;
        let diseaseNotFound = 0;

        for (const treatment of treatmentsData) {
            const exists = await Treatment.findOne({ name: treatment.name });
            if (exists) {
                console.log(`   ⏩ Skipped (exists): ${treatment.name}`);
                skipped++;
                continue;
            }

            // Look up disease IDs by name
            const diseaseIds: mongoose.Types.ObjectId[] = [];
            for (const diseaseName of treatment.diseaseNames) {
                const disease = await Disease.findOne({ name: diseaseName });
                if (disease) {
                    diseaseIds.push(disease._id as mongoose.Types.ObjectId);
                } else {
                    console.log(`      ⚠️  Disease not found: "${diseaseName}"`);
                    diseaseNotFound++;
                }
            }

            await Treatment.create({
                name: treatment.name,
                instructions: treatment.instructions,
                disease_ids: diseaseIds
            });
            console.log(`   ✅ Added: ${treatment.name} (linked to ${diseaseIds.length} diseases)`);
            added++;
        }

        console.log('\n🎉 Treatments seeding completed!');
        console.log('📊 Summary:');
        console.log(`   ✅ Added:              ${added}`);
        console.log(`   ⏩ Skipped:            ${skipped}`);
        console.log(`   ⚠️  Diseases not found: ${diseaseNotFound}`);
        console.log(`   💊 Total in DB: ${await Treatment.countDocuments()}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding treatments:', error);
        process.exit(1);
    }
};

seedTreatments();
