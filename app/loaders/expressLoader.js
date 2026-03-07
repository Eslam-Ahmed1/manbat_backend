import express from 'express'
import CORS from 'cors'
import conectDB from './mongooseLoader.js'
import AuthenticationRoute from '../routes/authentication.js';
import ChatRoute from '../routes/chat.js';
//this two line to trigger .env
import * as dotenv from 'dotenv';
dotenv.config();
//------
let app = express();
conectDB();
app.use(express.json({extends:false}));
app.use(CORS());
app.use('/api/authentication',AuthenticationRoute)
app.use('/api/AI_chat',ChatRoute)
// app.use('/api/chat',)
app.listen(process.env.PORT,()=>{
    console.log('server connect sucessfully');
})