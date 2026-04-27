import User from "../models/user.ts";
import { appError } from "../../utils/appErrors.ts";

export const getUserProfile = async (userId: string) => {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new appError("User not found", 404);
    return user;
};

export const updateUserProfile = async (userId: string, updateData: any) => {
    // Prevent users from updating their password through this generic profile endpoint
    if (updateData.password) {
        delete updateData.password;
    }

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select('-password');
    if (!user) throw new appError("User not found", 404);
    return user;
};