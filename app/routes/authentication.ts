import express, { RequestHandler } from 'express'
import { authenticationController } from '../controllers/index.ts';
import Authorization from '../middlewares/authMiddleware.ts'
import { loginSchema, registerSchema } from '../schemas/authentication.ts'
import validate from '../middlewares/validationRequestMiddleware.ts';
let route = express.Router();
//registeration route
route.post('/register', validate({ bodySchema: registerSchema }) as RequestHandler, authenticationController.register as RequestHandler)
route.post('/login', validate({ bodySchema: loginSchema }) as RequestHandler, authenticationController.login as RequestHandler)
//middleware for check valid token 
route.get('/user', Authorization as RequestHandler, authenticationController.user as RequestHandler)
export default route;