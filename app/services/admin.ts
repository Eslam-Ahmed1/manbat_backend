import Product from "../models/product.ts";
import Order from "../models/orders.ts";
import User from "../models/user.ts";
import { appError } from "../../utils/appErrors.ts";
import { uploadToCloudinary } from "../../utils/helpFuncitons.ts";
import Treatment from "../models/treatments.ts";

// --- PRODUCT MANAGEMENT ---
interface IProductData {
    treatmentName: string,
    productName: string,
    description: string,
    price: number,
    quantity: number
}
export const createProduct = async (imageBuffer: Buffer, productData: IProductData) => {
    const treatment = await Treatment.findOne({ name: productData.treatmentName })
    if (!treatment)
        throw new appError('Treatment name does not exist or is incorrect', 400)
    let imageUrl = "";
    try {
        const uploadResult = await uploadToCloudinary(imageBuffer, "manbut_plant_scans");
        imageUrl = uploadResult.secure_url;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw new appError("Failed to upload image to Cloudinary", 500);
    }
    const product = new Product({ name:productData.productName,description:productData.description,price:productData.price,treatment_id:treatment._id,quantity:productData.quantity, image_url: imageUrl });
    return await product.save();
};

export const updateProduct = async (id: string, imageBuffer: Buffer | undefined, productData: Partial<IProductData>) => {
    const updatePayload: any = {};

    if (productData.productName) updatePayload.name = productData.productName;
    if (productData.description) updatePayload.description = productData.description;
    if (productData.price) updatePayload.price = productData.price;
    if (productData.quantity) updatePayload.quantity = productData.quantity;

    if (productData.treatmentName) {
        const treatment = await Treatment.findOne({ name: productData.treatmentName });
        if (!treatment) throw new appError('Treatment name does not exist or is incorrect', 400);
        updatePayload.treatment_id = treatment._id;
    }

    if (imageBuffer) {
        try {
            const uploadResult = await uploadToCloudinary(imageBuffer, "manbut_plant_scans");
            updatePayload.image_url = uploadResult.secure_url;
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            throw new appError("Failed to upload image to Cloudinary", 500);
        }
    }

    const product = await Product.findByIdAndUpdate(id, updatePayload, { new: true, runValidators: true });
    if (!product) throw new appError("Product not found", 404);
    return product;
};

export const deleteProduct = async (id: string) => {
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new appError("Product not found", 404);
    return product;
};

// --- ORDER MANAGEMENT ---
export const getAllOrders = async () => {
    return await Order.find().sort({ createdAt: -1 })
        .populate('user_id', 'name email address phone')
        .populate('items.product_id', 'name price');
};

export const updateOrderStatus = async (orderId: string, status: string) => {
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) throw new appError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) throw new appError("Order not found", 404);
    return order;
};

// --- DASHBOARD STATS ---
export const getDashboardStats = async () => {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    
    // Fetch only delivered orders directly from MongoDB for better performance
    const deliveredOrders = await Order.find({ status: 'delivered' });
    const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.total_amount, 0);

    return { totalProducts, totalOrders, totalUsers, totalRevenue };
};