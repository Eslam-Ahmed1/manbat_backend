import { request, type Response, type Request, type NextFunction } from 'express';
import { authenticationService } from '../services/index.ts'
import validate from '../middlewares/validationRequestMiddleware.ts';
import { loginSchema, registerSchema } from '../schemas/authentication.ts';
import z, { json } from 'zod'
import { fromError, isZodErrorLike } from 'zod-validation-error'
import { appError } from '../../utils/appErrors.ts';
const registermiddleware = validate({ bodySchema: registerSchema })
const loginmiddleware = validate({ bodySchema: loginSchema })
const register: typeof registermiddleware = async (req, res, next) => {
    try {
        const userDTO = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }
        const token = await authenticationService.register(userDTO);
        return res.status(201).json({ token });

    }
    catch (err) {
        next(err)
    }
}
const login: typeof loginmiddleware = async (req, res, next) => {
    try {
        const loginDTO = { email: req.body.email, password: req.body.password }
        const token = await authenticationService.login(loginDTO);
        return res.status(200).json({ token })
    }
    catch (err) {
        next(err)
    }
}
const user = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //i need get this user from database by using unique email
        let user = req.user;
        res.json(user);
    }
    catch (err) {
        //this error may come from database
        next(err)
    }
}
export { register, login, user }