import mongoose from 'mongoose'
let connectDB = async function () {
    try {
        await mongoose.connect(process.env.MONGO_URL as string);
        console.log('database connected');
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }

}
export default connectDB;