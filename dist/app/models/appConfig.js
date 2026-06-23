import mongoose from "mongoose";
// Stores sensitive config keys in DB, managed by admin
const appConfigSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: String, required: true },
    description: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
const AppConfig = mongoose.model('app_config', appConfigSchema);
AppConfig.syncIndexes();
export default AppConfig;
