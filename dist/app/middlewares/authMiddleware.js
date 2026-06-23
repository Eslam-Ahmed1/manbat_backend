import JWT from 'jsonwebtoken';
import { appError } from '../../utils/appErrors.js';
let Authorization = (req, res, next) => {
    try {
        //authontication:"bearer token"
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return next(new appError('Authorization header missing', 401));
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return next(new appError('token empty', 401));
        }
        // JWT.verify()
        const decodedPayload = JWT.verify(token, process.env.SECRET_TOKEN);
        req.user = decodedPayload;
        next();
    }
    catch (err) {
        next(err);
    }
};
export default Authorization;
