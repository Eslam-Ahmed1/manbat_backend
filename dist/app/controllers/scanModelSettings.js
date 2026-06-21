import * as scanModelSettings from "../services/scanModelSettings.js";
export const getSettings = async (req, res, next) => {
    try {
        const settings = await scanModelSettings.getScanDetectionSettings();
        const modes = scanModelSettings.getModeDescriptions();
        res.status(200).json({
            message: "Scan detection settings retrieved",
            data: {
                ...settings,
                availableModes: modes,
                description: modes[settings.mode],
            },
        });
    }
    catch (error) {
        next(error);
    }
};
export const updateSettings = async (req, res, next) => {
    try {
        const result = await scanModelSettings.updateScanDetectionSettings(req.body);
        res.status(200).json({
            message: "Scan detection settings updated and applied immediately",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
