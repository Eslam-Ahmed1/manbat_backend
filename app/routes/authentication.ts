import express, {type RequestHandler } from 'express'
import { authenticationController } from '../controllers/index.ts';
import Authorization from '../middlewares/authMiddleware.ts'
import { changePasswordSchema, loginSchema, registerSchema } from '../schemas/authentication.ts'
import validate from '../middlewares/validationRequestMiddleware.ts';
let route = express.Router();
//registeration route
route.post('/register', validate({ bodySchema: registerSchema }) as RequestHandler, authenticationController.register as RequestHandler)
route.post('/login', validate({ bodySchema: loginSchema }) as RequestHandler, authenticationController.login as RequestHandler)
//middleware for check valid token 
route.get('/user', Authorization as RequestHandler, authenticationController.user as RequestHandler)
route.put(
    '/change-password',
    Authorization as RequestHandler,
    validate({ bodySchema: changePasswordSchema }) as RequestHandler,
    authenticationController.changePassword as RequestHandler,
)
export default route;