import mongoose from 'mongoose';
import User from '../app/models/user.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const users = [
    {
        name: "أحمد محمد",
        email: "ahmed@example.com",
        password: "User@123456",
        role: "user",
        address: "22 شارع الهرم، الجيزة",
        phone: "+201012345678"
    },
    {
        name: "فاطمة علي",
        email: "fatma@example.com",
        password: "User@123456",
        role: "user",
        address: "8 شارع المعز، الحسين، القاهرة",
        phone: "+201098765432"
    },
    {
        name: "محمد إبراهيم",
        email: "mohamed@example.com",
        password: "User@123456",
        role: "user",
        address: "45 كورنيش النيل، المعادي، القاهرة",
        phone: "+201155555555"
    },
    {
        name: "نور الدين حسن",
        email: "nour@example.com",
        password: "User@123456",
        role: "user",
        address: "12 شارع خالد بن الوليد، الإسكندرية",
        phone: "+201234567890"
    },
    {
        name: "سارة يوسف",
        email: "sara@example.com",
        password: "User@123456",
        role: "user",
        address: "3 شارع الجمهورية، المنصورة، الدقهلية",
        phone: "+201111222333"
    }
];

const seedUsers = async () => {
    try {
        console.log('🌱 Starting users seeding...');

        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error('❌ MONGODB_URI is not defined in .env');
            process.exit(1);
        }

        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Clear existing regular users (preserving admins)
        await User.deleteMany({ role: 'user' });
        console.log('🗑️  Cleared old regular users (admins preserved)');

        let added = 0;
        let skipped = 0;

        const salt = await bcrypt.genSalt(10);

        for (const user of users) {
            const exists = await User.findOne({ email: user.email });
            if (exists) {
                console.log(`   ⏩ Skipped (exists): ${user.email} (${user.name})`);
                skipped++;
            } else {
                const hashedPassword = await bcrypt.hash(user.password, salt);
                await User.create({
                    ...user,
                    password: hashedPassword
                });
                console.log(`   ✅ Added: ${user.email} (${user.name}) [${user.role}]`);
                added++;
            }
        }

        console.log('\n🎉 Users seeding completed!');
        console.log('📊 Summary:');
        console.log(`   ✅ Added:   ${added}`);
        console.log(`   ⏩ Skipped: ${skipped}`);
        console.log(`   👥 Total in DB: ${await User.countDocuments()}`);
        console.log('\n🔑 Test Credentials:');
        console.log('   User:  ahmed@example.com / User@123456');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding users:', error);
        process.exit(1);
    }
};

seedUsers();
