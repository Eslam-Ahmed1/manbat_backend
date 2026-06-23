import mongoose from 'mongoose';
import Plant from '../app/models/Plants.js';
import Category from '../app/models/categories.js';
import dotenv from 'dotenv';
dotenv.config();
// Plants grouped by category name
const plantsByCategory = {
    "Fruits": [
        { name: "Mango", image_url: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400" },
        { name: "Banana", image_url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400" },
        { name: "Apple", image_url: "https://images.unsplash.com/photo-1569870499705-504209102861?w=400" },
        { name: "Strawberry", image_url: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400" },
        { name: "Grape", image_url: "https://images.unsplash.com/photo-1596363505729-4190a9506133?w=400" },
    ],
    "Vegetables": [
        { name: "Tomato", image_url: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400" },
        { name: "Carrot", image_url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400" },
        { name: "Spinach", image_url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400" },
        { name: "Pepper", image_url: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=400" },
        { name: "Cucumber", image_url: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400" },
    ],
    "Herbs": [
        { name: "Basil", image_url: "https://images.unsplash.com/photo-1622205313162-be1d5712a43f?w=400" },
        { name: "Mint", image_url: "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400" },
        { name: "Rosemary", image_url: "https://images.unsplash.com/photo-1515586000433-45406d8e6662?w=400" },
        { name: "Thyme", image_url: "https://images.unsplash.com/photo-1599598425947-5202edd56fdb?w=400" },
        { name: "Parsley", image_url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400" },
    ],
    "Citrus": [
        { name: "Orange", image_url: "https://images.unsplash.com/photo-1547514701-42782101795e?w=400" },
        { name: "Lemon", image_url: "https://images.unsplash.com/photo-1590502593747-42a996133562?w=400" },
        { name: "Lime", image_url: "https://images.unsplash.com/photo-1597714026720-8f74c62310ba?w=400" },
        { name: "Grapefruit", image_url: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400" },
        { name: "Tangerine", image_url: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=400" },
    ],
    "Flowers & Roses": [
        { name: "Rose", image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400" },
        { name: "Sunflower", image_url: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400" },
        { name: "Lavender", image_url: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=400" },
        { name: "Tulip", image_url: "https://images.unsplash.com/photo-1527863280617-15596f92e5c8?w=400" },
        { name: "Jasmine", image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
    ],
    "Indoor Plants": [
        { name: "Peace Lily", image_url: "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400" },
        { name: "Snake Plant", image_url: "https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=400" },
        { name: "Pothos", image_url: "https://images.unsplash.com/photo-1602923668104-8f9e03f54f2b?w=400" },
        { name: "Monstera", image_url: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400" },
        { name: "ZZ Plant", image_url: "https://images.unsplash.com/photo-1632321943714-7c67a3de7765?w=400" },
    ],
    "Succulents & Cacti": [
        { name: "Aloe Vera", image_url: "https://images.unsplash.com/photo-1509937528035-ad76254b0356?w=400" },
        { name: "Echeveria", image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
        { name: "Jade Plant", image_url: "https://images.unsplash.com/photo-1616404595791-8bab22d9f9e5?w=400" },
        { name: "Barrel Cactus", image_url: "https://images.unsplash.com/photo-1560717845-968823efbee1?w=400" },
        { name: "Haworthia", image_url: "https://images.unsplash.com/photo-1599598425947-5202edd56fdb?w=400" },
    ],
    "Aromatic & Medicinal": [
        { name: "Chamomile", image_url: "https://images.unsplash.com/photo-1572968991508-8e8e5a0ab0e0?w=400" },
        { name: "Lemongrass", image_url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400" },
        { name: "Turmeric", image_url: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400" },
        { name: "Echinacea", image_url: "https://images.unsplash.com/photo-1597797204949-9082e6a85f9a?w=400" },
    ],
    "Trees": [
        { name: "Olive Tree", image_url: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=400" },
        { name: "Fig Tree", image_url: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=400" },
        { name: "Pomegranate", image_url: "https://images.unsplash.com/photo-1621955964441-c173e01c135b?w=400" },
    ],
    "Legumes": [
        { name: "Green Bean", image_url: "https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=400" },
        { name: "Chickpea", image_url: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=400" },
        { name: "Lentil", image_url: "https://images.unsplash.com/photo-1615485291234-9d694218aeb2?w=400" },
    ],
    "Crops & Grains": [
        { name: "Wheat", image_url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400" },
        { name: "Corn", image_url: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400" },
        { name: "Barley", image_url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400" },
    ],
    "Palms": [
        { name: "Date Palm", image_url: "https://images.unsplash.com/photo-1547483238-f400e65ccd56?w=400" },
        { name: "Coconut Palm", image_url: "https://images.unsplash.com/photo-1502809737437-1d85c70dd2ca?w=400" },
    ],
    "Ornamental Plants": [
        { name: "Bougainvillea", image_url: "https://images.unsplash.com/photo-1596397249129-c7a8f8b33628?w=400" },
        { name: "Bird of Paradise", image_url: "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=400" },
    ],
    // "Climbing Plants" — intentionally left empty (less common)
};
const seedPlants = async () => {
    try {
        console.log('🌱 Starting plants seeding...');
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error('❌ MONGODB_URI is not defined in .env');
            process.exit(1);
        }
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');
        // Clear existing plants to ensure correct, fresh category linkages
        await Plant.deleteMany({});
        console.log('🗑️  Cleared old plants');
        let added = 0;
        let skipped = 0;
        let categoryNotFound = 0;
        for (const [categoryName, plants] of Object.entries(plantsByCategory)) {
            const category = await Category.findOne({ name: categoryName });
            if (!category) {
                console.log(`⚠️  Category not found: "${categoryName}" — skipping its plants`);
                categoryNotFound++;
                continue;
            }
            console.log(`\n📁 Category: ${categoryName}`);
            for (const plant of plants) {
                const exists = await Plant.findOne({ name: plant.name });
                if (exists) {
                    console.log(`   ⏩ Skipped (exists): ${plant.name}`);
                    skipped++;
                }
                else {
                    await Plant.create({ ...plant, category_id: category._id });
                    console.log(`   ✅ Added: ${plant.name}`);
                    added++;
                }
            }
        }
        console.log('\n🎉 Plants seeding completed!');
        console.log('📊 Summary:');
        console.log(`   ✅ Added:              ${added}`);
        console.log(`   ⏩ Skipped:            ${skipped}`);
        console.log(`   ⚠️  Category not found: ${categoryNotFound}`);
        console.log(`   🌿 Total plants in DB: ${await Plant.countDocuments()}`);
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error seeding plants:', error);
        process.exit(1);
    }
};
seedPlants();
