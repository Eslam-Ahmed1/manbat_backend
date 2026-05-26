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

        const getUser = (index: number) => users[index % users.length];
        const getProduct = (index: number) => products[index % products.length];

        // 2. Generate past dates (spread over the last 30 days)
        const getPastDate = (daysAgo: number) => {
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            return date;
        };

        // 3. Seed Orders (about 510 realistic orders)
        const cities = [
            "Cairo, Egypt", "Giza, Egypt", "Alexandria, Egypt", "Mansoura, Egypt", 
            "Tanta, Egypt", "Asyut, Egypt", "Hurghada, Egypt", "Sharm El Sheikh, Egypt", 
            "Port Said, Egypt", "Suez, Egypt", "Luxor, Egypt", "Aswan, Egypt", 
            "Zagazig, Egypt", "Damietta, Egypt", "Ismailia, Egypt"
        ];

        console.log('🌱 Generating 510 realistic orders...');
        let ordersAdded = 0;
        const totalOrdersToSeed = 510;

        // First, guarantee exactly 10 orders for EACH user in the DB
        for (const user of users) {
            for (let k = 0; k < 10; k++) {
                const itemCount = Math.floor(Math.random() * 3) + 1;
                const itemsList = [];
                const selectedProductIds = new Set();

                for (let j = 0; j < itemCount; j++) {
                    let product;
                    do {
                        product = products[Math.floor(Math.random() * products.length)];
                    } while (selectedProductIds.has(product._id.toString()) && selectedProductIds.size < products.length);
                    
                    selectedProductIds.add(product._id.toString());
                    
                    const quantity = Math.floor(Math.random() * 4) + 1;
                    itemsList.push({
                        product_id: product._id,
                        quantity,
                        price: product.price
                    });
                }

                const total_amount = itemsList.reduce((sum, item) => sum + (item.price * item.quantity), 0);

                const roll = Math.random();
                let status = 'delivered';
                if (roll < 0.05) {
                    status = 'cancelled';
                } else if (roll < 0.12) {
                    status = 'pending';
                } else if (roll < 0.20) {
                    status = 'processing';
                } else if (roll < 0.35) {
                    status = 'shipped';
                }

                const daysAgo = Math.floor(Math.random() * 60);
                const address = user.address || cities[Math.floor(Math.random() * cities.length)];

                const newOrder = new Order({
                    user_id: user._id,
                    items: itemsList,
                    total_amount,
                    shipping_address: address,
                    status,
                    createdAt: getPastDate(daysAgo),
                    updatedAt: getPastDate(daysAgo)
                });

                await newOrder.save();
                ordersAdded++;
            }
        }

        // Then, generate the remaining orders randomly
        const remainingOrders = totalOrdersToSeed - ordersAdded;
        for (let i = 0; i < remainingOrders; i++) {
            const user = users[Math.floor(Math.random() * users.length)];
            
            const itemCount = Math.floor(Math.random() * 3) + 1;
            const itemsList = [];
            const selectedProductIds = new Set();

            for (let j = 0; j < itemCount; j++) {
                let product;
                do {
                    product = products[Math.floor(Math.random() * products.length)];
                } while (selectedProductIds.has(product._id.toString()) && selectedProductIds.size < products.length);
                
                selectedProductIds.add(product._id.toString());
                
                const quantity = Math.floor(Math.random() * 4) + 1;
                itemsList.push({
                    product_id: product._id,
                    quantity,
                    price: product.price
                });
            }

            const total_amount = itemsList.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            const roll = Math.random();
            let status = 'delivered';
            if (roll < 0.05) {
                status = 'cancelled';
            } else if (roll < 0.12) {
                status = 'pending';
            } else if (roll < 0.20) {
                status = 'processing';
            } else if (roll < 0.35) {
                status = 'shipped';
            }

            const daysAgo = Math.floor(Math.random() * 60);
            const address = user.address || cities[Math.floor(Math.random() * cities.length)];

            const newOrder = new Order({
                user_id: user._id,
                items: itemsList,
                total_amount,
                shipping_address: address,
                status,
                createdAt: getPastDate(daysAgo),
                updatedAt: getPastDate(daysAgo)
            });

            await newOrder.save();
            ordersAdded++;
        }
        console.log(`✅ Seeded ${ordersAdded} orders successfully!`);

        // 4. Seed Plant Scans (20 realistic scans, some healthy, some diseased, spread across dates)
        const scansData = [
            { user: getUser(0), plantName: "Tomato", status: "completed", diseaseNames: ["Early Blight"], daysAgo: 28, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" },
            { user: getUser(1), plantName: "Cucumber", status: "completed", diseaseNames: ["Powdery Mildew"], daysAgo: 26, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" },
            { user: getUser(2), plantName: "Mint", status: "completed", diseaseNames: [], daysAgo: 24, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" }, // Healthy
            { user: getUser(3), plantName: "Mango", status: "completed", diseaseNames: ["Anthracnose"], daysAgo: 22, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" },
            { user: getUser(4), plantName: "Rose", status: "completed", diseaseNames: ["Black Spot"], daysAgo: 20, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" },
            { user: getUser(0), plantName: "Tomato", status: "completed", diseaseNames: ["Late Blight"], daysAgo: 18, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" },
            { user: getUser(1), plantName: "Basil", status: "completed", diseaseNames: ["Leaf Spot"], daysAgo: 16, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" },
            { user: getUser(2), plantName: "Aloe Vera", status: "completed", diseaseNames: [], daysAgo: 14, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" }, // Healthy
            { user: getUser(3), plantName: "Peach", status: "completed", diseaseNames: ["Leaf Curl"], daysAgo: 12, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" },
            { user: getUser(4), plantName: "Strawberry", status: "completed", diseaseNames: [], daysAgo: 10, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" }, // Healthy
            { user: getUser(0), plantName: "Tomato", status: "completed", diseaseNames: [], daysAgo: 9, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" }, // Healthy
            { user: getUser(1), plantName: "Lemon", status: "completed", diseaseNames: ["Sooty Mold"], daysAgo: 7, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" },
            { user: getUser(2), plantName: "Apple", status: "completed", diseaseNames: ["Rust"], daysAgo: 5, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" },
            { user: getUser(3), plantName: "Grape", status: "completed", diseaseNames: ["Downy Mildew"], daysAgo: 4, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" },
            { user: getUser(4), plantName: "Peace Lily", status: "completed", diseaseNames: ["Root Rot"], daysAgo: 3, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" },
            { user: getUser(0), plantName: "Tomato", status: "completed", diseaseNames: ["Early Blight", "Leaf Spot"], daysAgo: 2, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" },
            { user: getUser(1), plantName: "Watermelon", status: "failed", diseaseNames: [], daysAgo: 15, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" }, // Failed scan
            { user: getUser(2), plantName: "Orange", status: "pending", diseaseNames: [], daysAgo: 1, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" }, // Pending scan
            { user: getUser(3), plantName: "Cucumber", status: "completed", diseaseNames: [], daysAgo: 1, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" }, // Healthy
            { user: getUser(4), plantName: "Rose", status: "completed", diseaseNames: ["Rust"], daysAgo: 0, url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500" }
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
