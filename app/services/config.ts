import AppConfig from "../models/appConfig.ts";

/**
 * Get a config value with fallback priority:
 * 1. DB (admin-managed remote config)
 * 2. process.env (local .env file)
 * 3. defaultValue
 */
export const getConfig = async (key: string, defaultValue?: string): Promise<string | undefined> => {
    try {
        const record = await AppConfig.findOne({ key, isActive: true });
        if (record?.value) return record.value;
    } catch {
        // DB not ready yet, fall through to env
    }
    return process.env[key] ?? defaultValue;
};

/**
 * Sync all active DB configs into process.env at startup
 * so existing code using process.env still works
 */
export const syncConfigToEnv = async (): Promise<void> => {
    try {
        const configs = await AppConfig.find({ isActive: true });
        for (const config of configs) {
            process.env[config.key] = config.value;
        }
        if (configs.length > 0) {
            console.log(`🔧 Loaded ${configs.length} remote config(s) from DB`);
        }
    } catch (err) {
        console.warn("⚠️  Could not load remote config from DB, using .env only");
    }
};

export const setConfig = async (key: string, value: string, description?: string) => {
    const config = await AppConfig.findOneAndUpdate(
        { key },
        { value, description, isActive: true },
        { upsert: true, new: true }
    );
    // Apply immediately to running process
    process.env[key] = value;
    return config;
};

export const deleteConfig = async (key: string) => {
    await AppConfig.findOneAndDelete({ key });
    // Don't delete from process.env — .env file is the fallback
};

export const getAllConfigs = async () => {
    return await AppConfig.find().sort({ key: 1 });
};
