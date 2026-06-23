import mongoose from 'mongoose';
import ProductCategory from '../app/models/productCategory.js';
import dotenv from 'dotenv';
dotenv.config();
const productCategories = [
    {
        name: "Fertilizers",
        description: "Organic and chemical fertilizers to boost plant growth, improve soil nutrition, and maximize crop yield. Includes granular, liquid, and slow-release formulations.",
        image_url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400"
    },
    {
        name: "Fungicides",
        description: "Preventive and curative treatments to eliminate fungal infections, mold, mildew, and blight from your plants. Available in spray, powder, and concentrate forms.",
        image_url: "https://images.unsplash.com/photo-1599598425947-5202edd56fdb?w=400"
    },
    {
        name: "Insecticides",
        description: "Organic and chemical solutions to control harmful insect pests including aphids, whiteflies, spider mites, and caterpillars without harming beneficial insects.",
        image_url: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400"
    },
    {
        name: "Seeds",
        description: "High-quality, certified organic and hybrid seeds for vegetables, herbs, flowers, and fruit plants. Tested for high germination rates and disease resistance.",
        image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400"
    },
    {
        name: "Garden Tools",
        description: "Professional-grade gardening and harvesting tools including pruning shears, trowels, rakes, hoes, and specialized equipment for plant care and maintenance.",
        image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400"
    },
    {
        name: "Pots & Planters",
        description: "Decorative and functional plant containers including terracotta pots, ceramic planters, self-watering systems, and hanging baskets for indoor and outdoor use.",
        image_url: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400"
    },
    {
        name: "Soil & Substrates",
        description: "Premium potting mixes, perlite, vermiculite, peat moss, coco coir, and specialized growing media for seed starting, container gardening, and hydroponics.",
        image_url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400"
    },
    {
        name: "Irrigation",
        description: "Water management solutions including drip irrigation kits, automatic watering systems, spray nozzles, timers, and moisture sensors for efficient plant watering.",
        image_url: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=400"
    }
];
const seedProductCategories = async () => {
    try {
        console.log('🌱 Starting product categories seeding...');
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error('❌ MONGODB_URI is not defined in .env');
            process.exit(1);
        }
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');
        // Clear existing product categories
        await ProductCategory.deleteMany({});
        console.log('🗑️  Cleared old product categories');
        let added = 0;
        let skipped = 0;
        for (const cat of productCategories) {
            const exists = await ProductCategory.findOne({ name: cat.name });
            if (exists) {
                console.log(`   ⏩ Skipped (exists): ${cat.name}`);
                skipped++;
            }
            else {
                await ProductCategory.create(cat);
                console.log(`   ✅ Added: ${cat.name}`);
                added++;
            }
        }
        console.log('\n🎉 Product categories seeding completed!');
        console.log('📊 Summary:');
        console.log(`   ✅ Added:   ${added}`);
        console.log(`   ⏩ Skipped: ${skipped}`);
        console.log(`   🏷️  Total in DB: ${await ProductCategory.countDocuments()}`);
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error seeding product categories:', error);
        process.exit(1);
    }
};
seedProductCategories();
