import * as configService from '../services/config.js';
import { appError } from '../../utils/appErrors.js';
export const getAll = async (req, res, next) => {
    try {
        const configs = await configService.getAllConfigs();
        // Mask sensitive values in response
        const masked = configs.map(c => ({
            ...c.toObject(),
            value: maskValue(c.key, c.value)
        }));
        res.status(200).json({ message: "Configs retrieved", data: masked });
    }
    catch (error) {
        next(error);
    }
};
export const set = async (req, res, next) => {
    try {
        const { key, value, description } = req.body;
        if (!key || !value)
            throw new appError("key and value are required", 400);
        const config = await configService.setConfig(key, value, description);
        res.status(200).json({
            message: `Config '${key}' updated and applied immediately`,
            data: { key: config.key, description: config.description, updatedAt: config.updatedAt }
        });
    }
    catch (error) {
        next(error);
    }
};
export const remove = async (req, res, next) => {
    try {
        await configService.deleteConfig(req.params.key);
        res.status(200).json({ message: `Config '${req.params.key}' deleted. .env fallback will be used.` });
    }
    catch (error) {
        next(error);
    }
};
// Mask sensitive keys so values don't leak in API responses
const maskValue = (key, value) => {
    const sensitiveKeys = ['API_KEY', 'SECRET', 'PASSWORD', 'TOKEN', 'URI', 'URL'];
    const isSensitive = sensitiveKeys.some(k => key.toUpperCase().includes(k));
    if (!isSensitive)
        return value;
    if (value.length <= 8)
        return '****';
    return value.slice(0, 4) + '****' + value.slice(-4);
};
