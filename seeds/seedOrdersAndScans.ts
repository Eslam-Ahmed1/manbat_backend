import mongoose from 'mongoose';
import Order from '../app/models/orders.ts';
import PlantScan from '../app/models/plantScans.ts';
import User from '../app/models/user.ts';
import Product from '../app/models/product.ts';
import Plant from '../app/models/Plants.ts';
import Disease from '../app/models/diseases.ts';
import dotenv from 'dotenv';

dotenv.config();

const seedOrdersAndScans = async () => {
    try {
        console.log('🌱 Starting orders and scans seeding...');

        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error('❌ MONGODB_URI is not defined in .env');
            process.exit(1);
        }

        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Clear existing orders and scans to avoid duplicates or orphans
        await Order.deleteMany({});
        await PlantScan.deleteMany({});
        console.log('🗑️  Cleared old orders and scans');

        // 1. Get references
        const users = await User.find({ role: 'user' });
        const products = await Product.find({});
        const plants = await Plant.find({});
        const diseases = await Disease.find({});

        if (users.length === 0 || products.length === 0 || plants.length === 0) {
            console.error('❌ Requirements not met. Ensure Users, Products, and Plants are seeded first!');
            process.exit(1);
        }

        // 2. Generate past dates (spread over the last 30 days)
        const getPastDate = (daysAgo: number) => {
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            return date;
        };

        // 3. Seed Orders (12 realistic orders with items, statuses, and varying timestamps)
        const ordersData = [
            {
                user: users[0],
                items: [
                    { product: products[0], quantity: 2 }, // NPK Fertilizer
                    { product: products[4], quantity: 1 }  // TopFungus Pro Spray
                ],
                status: 'delivered',
                daysAgo: 25,
                address: users[0].address || "Cairo, Egypt"
            },
            {
                user: users[1],
                items: [
                    { product: products[1], quantity: 3 }  // Organic Compost
                ],
                status: 'delivered',
                daysAgo: 20,
                address: users[1].address || "Cairo, Egypt"
            },
            {
                user: users[2],
                items: [
                    { product: products[10], quantity: 5 }, // Cherry Tomato Seeds
                    { product: products[13], quantity: 1 }  // Pruning Shears
                ],
                status: 'delivered',
                daysAgo: 18,
                address: users[2].address || "Cairo, Egypt"
            },
            {
                user: users[3],
                items: [
                    { product: products[5], quantity: 2 }, // Neem Oil
                    { product: products[14], quantity: 2 }  // Stainless Trowel
                ],
                status: 'delivered',
                daysAgo: 15,
                address: users[3].address || "Alexandria, Egypt"
            },
            {
                user: users[4],
                items: [
                    { product: products[18], quantity: 4 }, // Premium Potting Mix
                    { product: products[16], quantity: 2 }  // Terracotta Pot
                ],
                status: 'delivered',
                daysAgo: 12,
                address: users[4].address || "Mansoura, Egypt"
            },
            {
                user: users[0],
                items: [
                    { product: products[20], quantity: 1 }  // Drip Irrigation Kit
                ],
                status: 'shipped',
                daysAgo: 8,
                address: users[0].address || "Cairo, Egypt"
            },
            {
                user: users[1],
                items: [
                    { product: products[2], quantity: 2 },  // Seaweed Fertilizer
                    { product: products[11], quantity: 3 }  // Mixed Herb Seeds
                ],
                status: 'shipped',
                daysAgo: 6,
                address: users[1].address || "Cairo, Egypt"
            },
            {
                user: users[2],
                items: [
                    { product: products[6], quantity: 1 }  // Copper Fungicide
                ],
                status: 'processing',
                daysAgo: 4,
                address: users[2].address || "Cairo, Egypt"
            },
            {
                user: users[3],
                items: [
                    { product: products[15], quantity: 1 }, // Soil pH Meter
                    { product: products[19], quantity: 3 }  // Perlite Amendment
                ],
                status: 'pending',
                daysAgo: 2,
                address: users[3].address || "Alexandria, Egypt"
            },
            {
                user: users[4],
                items: [
                    { product: products[8], quantity: 2 }  // Insecticidal Soap
                ],
                status: 'pending',
                daysAgo: 1,
                address: users[4].address || "Mansoura, Egypt"
            },
            {
                user: users[0],
                items: [
                    { product: products[13], quantity: 1 }  // Pruning Shears
                ],
                status: 'cancelled',
                daysAgo: 14,
                address: users[0].address || "Cairo, Egypt"
            },
            {
                user: users[1],
                items: [
                    { product: products[21], quantity: 2 }  // Watering Globes
                ],
                status: 'delivered',
                daysAgo: 22,
                address: users[1].address || "Cairo, Egypt"
            }
        ];

        let ordersAdded = 0;
        for (const ord of ordersData) {
            const itemsList = ord.items.map(item => ({
                product_id: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            }));

            const total_amount = itemsList.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            const newOrder = new Order({
                user_id: ord.user._id,
                items: itemsList,
                total_amount,
                shipping_address: ord.address,
                status: ord.status,
                createdAt: getPastDate(ord.daysAgo),
                updatedAt: getPastDate(ord.daysAgo)
            });

            await newOrder.save();
            ordersAdded++;
        }
        console.log(`✅ Seeded ${ordersAdded} orders successfully!`);

        // 4. Seed Plant Scans (20 realistic scans, some healthy, some diseased, spread across dates)
        const scansData = [
            { user: users[0], plantName: "Tomato", status: "completed", diseaseNames: ["Early Blight"], daysAgo: 28, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" },
            { user: users[1], plantName: "Cucumber", status: "completed", diseaseNames: ["Powdery Mildew"], daysAgo: 26, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" },
            { user: users[2], plantName: "Mint", status: "completed", diseaseNames: [], daysAgo: 24, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" }, // Healthy
            { user: users[3], plantName: "Mango", status: "completed", diseaseNames: ["Anthracnose"], daysAgo: 22, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" },
            { user: users[4], plantName: "Rose", status: "completed", diseaseNames: ["Black Spot"], daysAgo: 20, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" },
            { user: users[0], plantName: "Tomato", status: "completed", diseaseNames: ["Late Blight"], daysAgo: 18, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" },
            { user: users[1], plantName: "Basil", status: "completed", diseaseNames: ["Leaf Spot"], daysAgo: 16, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" },
            { user: users[2], plantName: "Aloe Vera", status: "completed", diseaseNames: [], daysAgo: 14, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" }, // Healthy
            { user: users[3], plantName: "Peach", status: "completed", diseaseNames: ["Leaf Curl"], daysAgo: 12, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" },
            { user: users[4], plantName: "Strawberry", status: "completed", diseaseNames: [], daysAgo: 10, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" }, // Healthy
            { user: users[0], plantName: "Tomato", status: "completed", diseaseNames: [], daysAgo: 9, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" }, // Healthy
            { user: users[1], plantName: "Lemon", status: "completed", diseaseNames: ["Sooty Mold"], daysAgo: 7, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" },
            { user: users[2], plantName: "Apple", status: "completed", diseaseNames: ["Rust"], daysAgo: 5, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" },
            { user: users[3], plantName: "Grape", status: "completed", diseaseNames: ["Downy Mildew"], daysAgo: 4, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" },
            { user: users[4], plantName: "Peace Lily", status: "completed", diseaseNames: ["Root Rot"], daysAgo: 3, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" },
            { user: users[0], plantName: "Tomato", status: "completed", diseaseNames: ["Early Blight", "Leaf Spot"], daysAgo: 2, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" },
            { user: users[1], plantName: "Watermelon", status: "failed", diseaseNames: [], daysAgo: 15, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" }, // Failed scan
            { user: users[2], plantName: "Orange", status: "pending", diseaseNames: [], daysAgo: 1, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" }, // Pending scan
            { user: users[3], plantName: "Cucumber", status: "completed", diseaseNames: [], daysAgo: 1, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" }, // Healthy
            { user: users[4], plantName: "Rose", status: "completed", diseaseNames: ["Rust"], daysAgo: 0, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" }
        ];

        let scansAdded = 0;
        for (const scan of scansData) {
            // Get plant reference
            const plantObj = plants.find(p => p.name === scan.plantName);
            const plantId = plantObj ? plantObj._id : null;

            // Get disease references
            const diseaseIds = [];
            for (const dName of scan.diseaseNames) {
                const dObj = diseases.find(d => d.name === dName);
                if (dObj) diseaseIds.push(dObj._id);
            }

            const newScan = new PlantScan({
                user_id: scan.user._id,
                plant_id: plantId,
                image_url: scan.url,
                scan_date: getPastDate(scan.daysAgo),
                status: scan.status,
                disease_ids: diseaseIds
            });

            await newScan.save();
            scansAdded++;
        }
        console.log(`✅ Seeded ${scansAdded} plant scans successfully!`);

        console.log('\n🎉 Orders and Scans seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding orders and scans:', error);
        process.exit(1);
    }
};

seedOrdersAndScans();
