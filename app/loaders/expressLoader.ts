import * as errorLoader from './errorLoader.ts'
import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import CORS from 'cors'
import AuthenticationRoute from '../routes/authentication.ts';
import ChatRoute from '../routes/chat.ts';
import { errorHandling } from '../controllers/errorHandling.ts';
import conectDB from './mongooseLoader.ts'
//------
let serverSetup = (async () => {
    let app = express();
    await conectDB();
    app.use(express.json());
    app.use(CORS());
    app.use('/api/authentication', AuthenticationRoute)
    app.use('/api/AI_chat', ChatRoute)
    app.use(errorHandling as express.ErrorRequestHandler)
    let server = app.listen(process.env.PORT, () => {
        console.log('server connect sucessfully');
    })
    errorLoader.setServer(server);
    return server;
})
const server = await serverSetup();
export { server };