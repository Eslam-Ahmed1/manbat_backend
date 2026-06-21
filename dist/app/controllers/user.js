import * as userService from '../services/user.js';
export const getProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const profile = await userService.getUserProfile(userId);
        res.status(200).json({ message: "Profile retrieved successfully", data: profile });
    }
    catch (error) {
        next(error);
    }
};
export const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const imageBuffer = req.file?.buffer;
        console.log(imageBuffer);
        const updatedProfile = await userService.updateUserProfile(userId, imageBuffer, req.body);
        res.status(200).json({ message: "Profile updated successfully", data: updatedProfile });
    }
    catch (error) {
        next(error);
    }
};
export const deleteAccount = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const result = await userService.deleteAccount(userId);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
