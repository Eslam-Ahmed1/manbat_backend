import JWT from 'jsonwebtoken'
import { appError } from '../../utils/appErrors.ts';
let Authorization = (req, res, next) => {
    try {
        //authontication:"bearer token"
        const token: string = req.headers['authorization'].split(' ')[1];
        if (!token) {
            return next(new appError('token empty', 401))
        }
        // JWT.verify()
        const decodedPayload = JWT.verify(token, process.env.secret_token as string);
        req.user = decodedPayload;
        next();
    }
    catch (err) {
        next(err);
    }
}
export default Authorization;
