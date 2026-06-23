import mongoose from 'mongoose';
import Product from '../app/models/product.js';
import Treatment from '../app/models/treatments.js';
import ProductCategory from '../app/models/productCategory.js';
import dotenv from 'dotenv';

dotenv.config();

// Products reference categories and treatments by name — looked up at runtime
const productsData = [
    // --- FERTILIZERS ---
    {
        name: "NPK 20-20-20 General Fertilizer - 5kg",
        description: "Balanced water-soluble NPK fertilizer suitable for all plant types. Provides equal parts nitrogen, phosphorus, and potassium for healthy root development, lush foliage, and abundant flowering. Dissolve 2-3 grams per liter of water and apply every 2 weeks during the growing season.",
        price: 185,
        discount: 10,
        quantity: 80,
        categoryName: "Fertilizers",
        treatmentName: null,
        image_url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400"
    },
    {
        name: "Organic Compost Fertilizer - 10L",
        description: "100% natural composted organic matter enriched with worm castings and beneficial microorganisms. Improves soil structure, water retention, and nutrient availability. Ideal for vegetables, herbs, and fruit trees. Mix into the top 5cm of soil or use as a top dressing.",
        price: 95,
        discount: 0,
        quantity: 120,
        categoryName: "Fertilizers",
        treatmentName: null,
        image_url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400"
    },
    {
        name: "Liquid Seaweed Fertilizer - 1L",
        description: "Concentrated liquid seaweed extract rich in trace minerals, cytokinins, and natural growth hormones. Stimulates root growth, improves stress tolerance, and enhances fruit quality. Dilute 5ml per liter of water and apply as foliar spray or soil drench every 10-14 days.",
        price: 120,
        discount: 15,
        quantity: 65,
        categoryName: "Fertilizers",
        treatmentName: null,
        image_url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400"
    },
    {
        name: "Slow-Release Granular Fertilizer - 3kg",
        description: "Coated granular fertilizer that releases nutrients gradually over 3-4 months. Contains NPK 14-14-14 plus magnesium and trace elements. Simply sprinkle around the base of plants and water in. One application per season is sufficient for most ornamental plants.",
        price: 210,
        discount: 5,
        quantity: 45,
        categoryName: "Fertilizers",
        treatmentName: null,
        image_url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400"
    },

    // --- FUNGICIDES ---
    {
        name: "TopFungus Pro Spray - 500ml",
        description: "Professional-grade systemic fungicide containing azoxystrobin for broad-spectrum control of powdery mildew, rust, leaf spot, and blight. Ready-to-use spray bottle with adjustable nozzle. Apply at first sign of disease and repeat every 7-10 days.",
        price: 180,
        discount: 15,
        quantity: 45,
        categoryName: "Fungicides",
        treatmentName: "Fungicide Spray Treatment",
        image_url: "https://images.unsplash.com/photo-1599598425947-5202edd56fdb?w=400"
    },
    {
        name: "Organic Neem Oil Concentrate - 250ml",
        description: "Cold-pressed 100% pure neem oil extracted from Azadirachta indica seeds. Works as a natural fungicide, insecticide, and miticide. Contains azadirachtin which disrupts pest life cycles. Mix 5ml per liter of water with a few drops of liquid soap as emulsifier.",
        price: 85,
        discount: 0,
        quantity: 90,
        categoryName: "Fungicides",
        treatmentName: "Neem Oil Application",
        image_url: "https://images.unsplash.com/photo-1599598425947-5202edd56fdb?w=400"
    },
    {
        name: "Copper Hydroxide Fungicide - 500g",
        description: "Inorganic copper-based fungicide powder for mixing Bordeaux-style sprays. Effective against bacterial and fungal diseases including blight, canker, and downy mildew. Mix 3-5g per liter of water. Apply as preventive spray before disease onset. Approved for organic farming.",
        price: 145,
        discount: 10,
        quantity: 55,
        categoryName: "Fungicides",
        treatmentName: "Copper-Based Fungicide",
        image_url: "https://images.unsplash.com/photo-1599598425947-5202edd56fdb?w=400"
    },
    {
        name: "Sulfur Powder - 1kg",
        description: "Finely ground elemental sulfur for dusting or mixing as spray. Controls powdery mildew, rust, and scab on fruits, vegetables, and ornamentals. Apply with a powder duster or mix 3g per liter for spray application. Do not use when temperatures exceed 30°C.",
        price: 65,
        discount: 0,
        quantity: 70,
        categoryName: "Fungicides",
        treatmentName: "Sulfur Dust Application",
        image_url: "https://images.unsplash.com/photo-1599598425947-5202edd56fdb?w=400"
    },

    // --- INSECTICIDES ---
    {
        name: "Organic Insecticidal Soap - 500ml",
        description: "Ready-to-use potassium salt-based insecticidal soap that kills soft-bodied insects on contact including aphids, whiteflies, mealybugs, and spider mites. Safe for use on edible crops up to harvest day. Does not leave toxic residues. Spray directly on pests.",
        price: 75,
        discount: 5,
        quantity: 100,
        categoryName: "Insecticides",
        treatmentName: null,
        image_url: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400"
    },
    {
        name: "Pyrethrin Natural Insecticide - 250ml",
        description: "Botanical insecticide derived from chrysanthemum flowers. Provides rapid knockdown of a broad spectrum of insects including beetles, caterpillars, aphids, and thrips. Breaks down quickly in sunlight, minimizing environmental impact. Apply in the evening for best results.",
        price: 110,
        discount: 10,
        quantity: 60,
        categoryName: "Insecticides",
        treatmentName: null,
        image_url: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400"
    },

    // --- SEEDS ---
    {
        name: "Organic Tomato Seeds - Cherry Variety (50 seeds)",
        description: "High-yielding cherry tomato seeds producing sweet, bite-sized fruits perfect for salads and snacking. Indeterminate variety that produces continuously throughout the season. Germination rate above 90%. Suitable for containers and garden beds. Harvest in 60-70 days.",
        price: 35,
        discount: 0,
        quantity: 200,
        categoryName: "Seeds",
        treatmentName: null,
        image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400"
    },
    {
        name: "Mixed Herb Seeds Collection (6 varieties)",
        description: "Curated collection of 6 essential culinary herb seeds: basil, mint, parsley, cilantro, dill, and thyme. Each variety in separate labeled packets with growing instructions. Perfect for kitchen windowsill gardens or outdoor herb beds. Over 500 seeds total.",
        price: 55,
        discount: 0,
        quantity: 150,
        categoryName: "Seeds",
        treatmentName: null,
        image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400"
    },
    {
        name: "Sunflower Giant Seeds (25 seeds)",
        description: "Helianthus annuus giant variety growing up to 3 meters tall with flower heads up to 30cm across. Easy to grow, drought-tolerant, and attractive to pollinators. Seeds are edible when roasted. Plant after last frost in full sun with spacing of 45cm between seeds.",
        price: 25,
        discount: 0,
        quantity: 180,
        categoryName: "Seeds",
        treatmentName: null,
        image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400"
    },

    // --- GARDEN TOOLS ---
    {
        name: "Professional Bypass Pruning Shears",
        description: "Heavy-duty ergonomic pruning shears with SK5 high-carbon steel blades and a comfortable non-slip rubber grip. Bypass cutting action provides clean cuts on branches up to 25mm diameter. Features a safety lock mechanism and sap groove to prevent blade sticking.",
        price: 120,
        discount: 20,
        quantity: 30,
        categoryName: "Garden Tools",
        treatmentName: null,
        image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400"
    },
    {
        name: "Stainless Steel Garden Trowel",
        description: "Premium hand trowel forged from a single piece of polished stainless steel for maximum strength and rust resistance. Ergonomic ash wood handle with soft-touch coating. Depth markings engraved on blade for precise planting. Overall length 33cm.",
        price: 85,
        discount: 0,
        quantity: 50,
        categoryName: "Garden Tools",
        treatmentName: null,
        image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400"
    },
    {
        name: "Digital Soil pH & Moisture Meter",
        description: "3-in-1 digital meter that measures soil pH, moisture level, and light intensity. No batteries required — powered by built-in solar cell. Simply insert the probe 10-15cm into the soil and read the instant results on the LCD display. Essential for optimal plant care and fertilizer management.",
        price: 150,
        discount: 10,
        quantity: 40,
        categoryName: "Garden Tools",
        treatmentName: null,
        image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400"
    },

    // --- POTS & PLANTERS ---
    {
        name: "Terracotta Clay Pot - 30cm Diameter",
        description: "Traditional handmade terracotta pot with drainage hole and matching saucer. Porous clay material allows roots to breathe and prevents waterlogging. Natural reddish-brown color that develops attractive patina over time. Ideal for herbs, succulents, and small flowering plants.",
        price: 45,
        discount: 0,
        quantity: 100,
        categoryName: "Pots & Planters",
        treatmentName: null,
        image_url: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400"
    },
    {
        name: "Self-Watering Planter - Large (40cm)",
        description: "Modern self-watering planter with built-in water reservoir and wicking system. Fill the reservoir every 1-2 weeks and the plant draws water as needed — perfect for busy gardeners or vacation watering. Made from UV-resistant recycled plastic. Water level indicator included.",
        price: 135,
        discount: 15,
        quantity: 35,
        categoryName: "Pots & Planters",
        treatmentName: null,
        image_url: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400"
    },

    // --- SOIL & SUBSTRATES ---
    {
        name: "Premium Potting Mix - 20L",
        description: "Professional-grade potting mix blended from peat moss, composted bark, perlite, and slow-release fertilizer. pH-balanced (5.5-6.5) and enriched with mycorrhizal fungi for enhanced root development. Suitable for all indoor and outdoor container plants.",
        price: 55,
        discount: 0,
        quantity: 90,
        categoryName: "Soil & Substrates",
        treatmentName: null,
        image_url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400"
    },
    {
        name: "Perlite Soil Amendment - 5L",
        description: "Lightweight volcanic glass granules that improve soil aeration and drainage. Mix 20-30% perlite into potting soil to prevent compaction and root rot. Essential for succulents, cacti, and any plants that prefer well-drained growing media. pH-neutral and sterile.",
        price: 35,
        discount: 0,
        quantity: 110,
        categoryName: "Soil & Substrates",
        treatmentName: null,
        image_url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400"
    },

    // --- IRRIGATION ---
    {
        name: "Drip Irrigation Starter Kit - 15m",
        description: "Complete drip irrigation system for up to 20 plants. Includes 15m main tube, 20 adjustable drip emitters, T-connectors, end caps, and garden faucet adapter. Delivers water directly to plant roots, reducing water waste by up to 70% compared to traditional watering methods.",
        price: 195,
        discount: 10,
        quantity: 25,
        categoryName: "Irrigation",
        treatmentName: null,
        image_url: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=400"
    },
    {
        name: "Automatic Plant Watering Globes (Set of 4)",
        description: "Hand-blown glass watering globes that slowly release water into soil over 1-2 weeks. Simply fill the globe with water and insert the stem into the soil. Decorative design doubles as plant pot ornament. Perfect for vacation watering or forgetful gardeners.",
        price: 75,
        discount: 5,
        quantity: 60,
        categoryName: "Irrigation",
        treatmentName: null,
        image_url: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=400"
    }
];

const seedProducts = async () => {
    try {
        console.log('🌱 Starting products seeding...');

        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error('❌ MONGODB_URI is not defined in .env');
            process.exit(1);
        }

        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('🗑️  Cleared old products');

        let added = 0;
        let skipped = 0;
        let warnings = 0;

        for (const product of productsData) {
            const exists = await Product.findOne({ name: product.name });
            if (exists) {
                console.log(`   ⏩ Skipped (exists): ${product.name}`);
                skipped++;
                continue;
            }

            // Look up product category
            let productCategoryId = null;
            if (product.categoryName) {
                const category = await ProductCategory.findOne({ name: product.categoryName });
                if (category) {
                    productCategoryId = category._id;
                } else {
                    console.log(`      ⚠️  Category not found: "${product.categoryName}"`);
                    warnings++;
                }
            }

            // Look up treatment
            let treatmentId = null;
            if (product.treatmentName) {
                const treatment = await Treatment.findOne({ name: product.treatmentName });
                if (treatment) {
                    treatmentId = treatment._id;
                } else {
                    console.log(`      ⚠️  Treatment not found: "${product.treatmentName}"`);
                    warnings++;
                }
            }

            await Product.create({
                name: product.name,
                description: product.description,
                price: product.price,
                discount: product.discount,
                quantity: product.quantity,
                product_category_id: productCategoryId,
                treatment_id: treatmentId,
                image_url: product.image_url
            });
            console.log(`   ✅ Added: ${product.name} (${product.categoryName})`);
            added++;
        }

        console.log('\n🎉 Products seeding completed!');
        console.log('📊 Summary:');
        console.log(`   ✅ Added:    ${added}`);
        console.log(`   ⏩ Skipped:  ${skipped}`);
        console.log(`   ⚠️  Warnings: ${warnings}`);
        console.log(`   📦 Total in DB: ${await Product.countDocuments()}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
