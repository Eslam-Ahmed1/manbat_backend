import express from 'express'
import { authenticationController } from '../controllers/index.ts';
import Authorization from '../middlewares/authMiddleware.ts'
import { loginSchema, registerSchema } from '../schemas/authentication.ts'
import validate from '../middlewares/validationRequestMiddleware.ts';
let route = express.Router();
//registeration route
route.post('/register', validate({ bodySchema: registerSchema }), authenticationController.register)
route.post('/login', validate({ bodySchema: loginSchema }), authenticationController.login)
//middleware for check valid token 
route.get('/user', Authorization, authenticationController.user)
export default route;