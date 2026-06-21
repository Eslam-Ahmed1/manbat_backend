import mongoose from 'mongoose';
import Article from '../app/models/articles.js';
import Plant from '../app/models/Plants.js';
import dotenv from 'dotenv';
dotenv.config();
const articlesData = [
    {
        title: "How to Grow Juicy Tomatoes at Home: A Complete Guide",
        summary: "Discover the secrets of growing high-yielding, flavorful tomatoes in your home garden or containers.",
        content: "Tomatoes are one of the most rewarding crops to grow at home. To achieve the best results, start with high-quality organic soil and place them in a location that receives at least 6-8 hours of direct sunlight daily. Plant them deep—burying up to 2/3 of the stem to promote a massive root system. Water consistently at the base of the plant to keep the soil moist but not soggy, avoiding wet foliage to prevent blight. Provide a sturdy trellis or cage early on, and prune lower suckers to improve air circulation and direct energy to fruit production.",
        plantName: "Tomato",
        tags: ["Tomatoes", "Home Gardening", "Vegetables", "Plant Care"],
        status: "published",
        image_url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=600"
    },
    {
        title: "Managing Powdery Mildew in Cucumber Plants",
        summary: "Learn how to identify, prevent, and treat powdery mildew on your cucumber foliage.",
        content: "Powdery mildew is a common fungal infection that presents as powdery white spots on cucumber leaves. To prevent it, ensure optimal plant spacing to facilitate air circulation and avoid overhead watering. If infected, prune the worst-affected leaves using sterilized shears. Apply a natural treatment like diluted neem oil or copper-based fungicide once a week in the early morning or evening. You can also spray a mild baking soda solution (1 tablespoon baking soda, 1 teaspoon liquid soap, 4 liters water) as a highly effective organic prevention method.",
        plantName: "Cucumber",
        tags: ["Cucumbers", "Fungal Disease", "Organic Treatment", "Mildew"],
        status: "published",
        image_url: "https://images.unsplash.com/photo-1591857177580-fc82b9520557?w=600"
    },
    {
        title: "Caring for your Snake Plant: The Ultimate Indoor Guide",
        summary: "A robust guide to keeping your indoor Snake Plant thriving with minimal maintenance.",
        content: "The Snake Plant (Sansevieria) is renowned for its air-purifying qualities and extreme resilience. The number one rule for snake plant care is to avoid overwatering. Use a highly porous, sandy potting mix (cacti/succulent soil) and let the soil dry out completely between waterings. Place in indirect sunlight, though they can tolerate low light or bright shade. They only require moderate fertilizing once or twice during the spring and summer active growing periods.",
        plantName: "Snake Plant",
        tags: ["Indoor Plants", "Succulents", "Low Maintenance", "Air Purifying"],
        status: "published",
        image_url: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600"
    },
    {
        title: "The Complete Mint Growing Guide: Window Sill & Pots",
        summary: "How to grow aromatic, fast-spreading mint in containers without it taking over your garden.",
        content: "Mint is a hardy, fast-growing herb that is best grown in containers to restrict its aggressive root systems (runners) from invasive spreading. Use a general potting mix and keep the soil consistently damp. Mint thrives in partial shade to full sun. Harvest leaves regularly from the top to encourage bushier growth and prevent the plant from becoming leggy. Pinch off any flower buds that appear to maintain the best leaf flavor.",
        plantName: "Mint",
        tags: ["Herbs", "Container Gardening", "Window Garden", "Culinary"],
        status: "published",
        image_url: "https://images.unsplash.com/photo-1536882240095-0379873feb4e?w=600"
    },
    {
        title: "Maximizing Mango Tree Harvest: Watering and Fertilizing",
        summary: "Expert advice on boosting fruit yields and ensuring healthy development of mango trees.",
        content: "Mango trees thrive in warm, subtropical climates. Young trees require regular watering to establish roots, while mature trees need deep, infrequent irrigation, particularly during fruit development. Apply a balanced NPK organic fertilizer enriched with micronutrients in early spring before blooms appear. Mulch the base with compost to retain moisture and suppress weed growth. Prune branches annually to allow sunlight to penetrate the inner canopy, which increases flowering sites.",
        plantName: "Mango",
        tags: ["Fruit Trees", "Mangoes", "Fertilizers", "Harvesting"],
        status: "published",
        image_url: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600"
    },
    {
        title: "How to Plant and Maintain a Healthy Olive Tree",
        summary: "Everything you need to know about olive tree soil, watering, and pruning requirements.",
        content: "Olive trees are extremely drought-tolerant and thrive in Mediterranean-like conditions with excellent drainage and sandy, rocky soil. Water young olive trees deeply once a week, but reduce frequency for mature trees. They require at least 6 hours of full sun daily. Prune olive trees in late winter or early spring to remove dead wood and create an open-center structure that maximizes air circulation and light penetration.",
        plantName: "Olive Tree",
        tags: ["Trees", "Olives", "Drought Tolerant", "Landscaping"],
        status: "published",
        image_url: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=600"
    },
    {
        title: "Growing Basil in Containers: From Seed to Harvest",
        summary: "Steps to grow aromatic basil continuously for fresh homemade pesto and dishes.",
        content: "Basil is a warm-weather herb that loves full sun and moist, rich soil. When growing in pots, ensure they have drainage holes to prevent root rot. Water whenever the topsoil feels dry, avoiding the leaves. To harvest, pinch off the top set of leaves just above a leaf node; this encourages side branches to grow, doubling your yield. Never let basil flower, as it changes the leaf taste to bitter.",
        plantName: "Basil",
        tags: ["Herbs", "Basil", "Pesto", "Container Gardening"],
        status: "published",
        image_url: "https://images.unsplash.com/photo-1622205313162-be1d5712a43f?w=600"
    },
    {
        title: "Caring for Aloe Vera: Watering, Soil, and Sunlight",
        summary: "Keep your Aloe Vera healthy to harvest its soothing medicinal gel whenever needed.",
        content: "Aloe Vera is a succulent that stores water in its thick leaves. Plant in a sandy succulent mix with excellent drainage. Water deeply but infrequently—only when the soil is completely dry (roughly every 2-3 weeks). Place in bright, indirect sunlight. If the leaves turn brown or yellow, it is a sign of either too much direct scorching sun or overwatering. Harvest gel from mature outer leaves by cutting them close to the base.",
        plantName: "Aloe Vera",
        tags: ["Succulents", "Aloe Vera", "Medicinal", "Skincare"],
        status: "published",
        image_url: "https://images.unsplash.com/photo-1598880940080-ff9a29891b85?w=600"
    },
    {
        title: "How to Grow Sweet Strawberries in Hanging Baskets",
        summary: "Grow delicious strawberries vertically in hanging planters or elevated containers.",
        content: "Strawberry plants are highly suited for hanging baskets, keeping the fruits off the ground and away from crawling pests. Use a hanging basket lined with coco coir and filled with premium potting soil. Plant 3-4 strawberry crowns per basket. Water daily during hot summer weather to keep soil evenly moist. Apply a potassium-rich liquid seaweed fertilizer every two weeks during the flowering and fruiting phase to boost strawberry sweetness.",
        plantName: "Strawberry",
        tags: ["Fruits", "Strawberries", "Vertical Gardening", "Hanging Pots"],
        status: "published",
        image_url: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600"
    },
    {
        title: "The Secrets to Growing Large, Beautiful Rose Blooms",
        summary: "Professional tips on pruning, feeding, and protecting roses from black spot.",
        content: "To grow stunning roses, plant them in a spot receiving 6 hours of morning sun. Feed them with high-quality rose fertilizer monthly during spring and summer. Prune roses in late winter, removing dead or crossing branches and cutting stems at a 45-degree angle above an outward-facing bud. Apply a thick layer of organic mulch around the root zone to retain moisture. Watch out for black spot and treat early with organic neem oil spray.",
        plantName: "Rose",
        tags: ["Flowers", "Roses", "Pruning", "Gardening Tips"],
        status: "published",
        image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600"
    }
];
const seedArticles = async () => {
    try {
        console.log('🌱 Starting articles seeding...');
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error('❌ MONGODB_URI is not defined in .env');
            process.exit(1);
        }
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');
        // Clear existing articles
        await Article.deleteMany({});
        console.log('🗑️  Cleared old articles');
        let added = 0;
        let skipped = 0;
        let warnings = 0;
        for (const article of articlesData) {
            const exists = await Article.findOne({ title: article.title });
            if (exists) {
                console.log(`   ⏩ Skipped (exists): ${article.title}`);
                skipped++;
                continue;
            }
            // Look up plant ID by name
            let plantId = null;
            if (article.plantName) {
                const plant = await Plant.findOne({ name: article.plantName });
                if (plant) {
                    plantId = plant._id;
                }
                else {
                    console.log(`      ⚠️  Plant not found: "${article.plantName}" for article "${article.title}"`);
                    warnings++;
                }
            }
            await Article.create({
                title: article.title,
                summary: article.summary,
                content: article.content,
                image_url: article.image_url,
                plant_id: plantId,
                tags: article.tags,
                status: article.status,
                published_at: new Date()
            });
            console.log(`   ✅ Added: ${article.title}`);
            added++;
        }
        console.log('\n🎉 Articles seeding completed!');
        console.log('📊 Summary:');
        console.log(`   ✅ Added:    ${added}`);
        console.log(`   ⏩ Skipped:  ${skipped}`);
        console.log(`   ⚠️  Warnings: ${warnings}`);
        console.log(`   📝 Total in DB: ${await Article.countDocuments()}`);
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error seeding articles:', error);
        process.exit(1);
    }
};
seedArticles();
