import { type Request, type Response, type NextFunction } from 'express';
import * as userService from '../services/user.js';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id as string;
        const profile = await userService.getUserProfile(userId);
        res.status(200).json({ message: "Profile retrieved successfully", data: profile });
    } catch (error) { next(error); }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id as string;
        const imageBuffer = req.file?.buffer;
        const updatedProfile = await userService.updateUserProfile(userId, imageBuffer, req.body);
        res.status(200).json({ message: "Profile updated successfully", data: updatedProfile });
    }
    catch (error) { next(error); }
};

export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id as string;
        const result = await userService.deleteAccount(userId);
        res.status(200).json(result);
    } catch (error) { next(error); }
};