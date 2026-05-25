import mongoose from 'mongoose';
import User from '../app/models/user.ts';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
    try {
        console.log('🌱 Starting admin user seeding/reset...');
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error('❌ MONGODB_URI is not defined in .env');
            process.exit(1);
        }
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        const adminEmail = 'admin@example.com';
        const adminPassword = 'adminpass123';

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(adminPassword, salt);

        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('⚠️ Admin user already exists! Updating password and role to guarantee alignment...');
            existingAdmin.password = hashPassword;
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log('🎉 Admin user updated/reset successfully!');
            console.log(`📧 Email: ${adminEmail}`);
            console.log(`🔑 Password: ${adminPassword}`);
            process.exit(0);
        }

        const admin = new User({
            name: 'Admin User',
            email: adminEmail,
            password: hashPassword,
            role: 'admin'
        });

        await admin.save();
        console.log('🎉 Admin user created successfully!');
        console.log(`📧 Email: ${adminEmail}`);
        console.log(`🔑 Password: ${adminPassword}`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
