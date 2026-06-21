import User from '../models/user.js';
import { appError } from '../../utils/appErrors.js';
const AdminAuthorization = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (user && user.role === 'admin') {
            next();
        }
        else {
            next(new appError('Access denied. Admin privileges required.', 403));
        }
    }
    catch (error) {
        next(error);
    }
};
export default AdminAuthorization;
