import { type Request, type Response, type NextFunction } from "express";
import * as scanModelSettings from "../services/scanModelSettings.ts";

export const getSettings = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
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
    } catch (error) {
        next(error);
    }
};

export const updateSettings = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await scanModelSettings.updateScanDetectionSettings(
            req.body,
        );

        res.status(200).json({
            message: "Scan detection settings updated and applied immediately",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
