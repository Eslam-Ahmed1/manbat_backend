import express from 'express'
import {handleAuthentication} from '../controllers/index.js';
import Authorization from '../middlewares/authMiddleware.js'
let route=express.Router();
//registeraiton route
route.post('/register',handleAuthentication.register)
route.post('/login',handleAuthentication.login)
//middleware for check valid token 
route.get('/user',Authorization,handleAuthentication.user)
export default route;