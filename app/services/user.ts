import User from "../models/user.js";
import { appError } from "../../utils/appErrors.js";
import { uploadToCloudinary } from "../../utils/helpFuncitons.js";


export const getUserProfile = async (userId: string) => {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new appError("User not found", 404);
    return user;
};


export const updateUserProfile = async (userId: string, imageBuffer: Buffer | undefined, updateData: any = {}) => {
    if (updateData.password) {
        delete updateData.password;
    }
    if (imageBuffer) {
        try {
            const uploadResult = await uploadToCloudinary(imageBuffer, "manbut_users");
            updateData.image_url = uploadResult.secure_url;
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            throw new appError("Failed to upload image to Cloudinary", 500);
        }
    }
    else  updateData.image_url ="";

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select('-password');
    if (!user) throw new appError("User not found", 404);
    return user;
};

export const deleteAccount = async (userId: string) => {
    const user = await User.findByIdAndDelete(userId);
    if (!user) throw new appError("User not found", 404);
    return { message: "Account deleted successfully" };
};