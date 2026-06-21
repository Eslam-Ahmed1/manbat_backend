import mongoose from 'mongoose';
import Category from '../app/models/categories.js';
import dotenv from 'dotenv';
dotenv.config();
const categories = [
    { name: "Fruits" },
    { name: "Vegetables" },
    { name: "Crops & Grains" },
    { name: "Aromatic & Medicinal" },
    { name: "Ornamental Plants" },
    { name: "Trees" },
    { name: "Indoor Plants" },
    { name: "Legumes" },
    { name: "Palms" },
    { name: "Citrus" },
    { name: "Succulents & Cacti" },
    { name: "Flowers & Roses" },
    { name: "Climbing Plants" },
    { name: "Herbs" }
];
const seedCategories = async () => {
    try {
        console.log('🌱 Starting categories seeding...');
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error('❌ MONGODB_URI is not defined in .env');
            process.exit(1);
        }
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');
        // Clear existing categories to ensure a clean starting slate
        await Category.deleteMany({});
        console.log('🗑️  Cleared old categories');
        // Track results
        let added = 0;
        let skipped = 0;
        for (const cat of categories) {
            const exists = await Category.findOne({ name: cat.name });
            if (exists) {
                console.log(`⏩ Skipped (already exists): ${cat.name}`);
                skipped++;
            }
            else {
                await Category.create(cat);
                console.log(`✅ Added: ${cat.name}`);
                added++;
            }
        }
        console.log('\n🎉 Categories seeding completed!');
        console.log('📊 Summary:');
        console.log(`   ✅ Added: ${added}`);
        console.log(`   ⏩ Skipped: ${skipped}`);
        console.log(`   📁 Total in DB: ${await Category.countDocuments()}`);
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error seeding categories:', error);
        process.exit(1);
    }
};
seedCategories();
