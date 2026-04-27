import 'dotenv/config';
import * as errorLoader from './errorLoader.ts'
import express from 'express'
import CORS from 'cors'
import AuthenticationRoute from '../routes/authentication.ts';
import ChatRoute from '../routes/chat.ts';
import ScanRoute from '../routes/scan.ts';
import TreatmentRoute from '../routes/treatment.ts';
import CatalogRoute from '../routes/catalog.ts';
import CartRoute from '../routes/cart.ts';
import OrderRoute from '../routes/order.ts';
import { errorHandling } from '../controllers/errorHandling.ts';
import conectDB from './mongooseLoader.ts'
import ProductRoute from '../routes/product.ts';
import UserRoute from '../routes/user.ts';
//------
let serverSetup = (async () => {
    let app = express();
    await conectDB();
    app.use(express.json());
    app.use(CORS());
    app.use('/api/authentication', AuthenticationRoute)
    app.use('/api/AI_chat', ChatRoute)
    app.use('/api/scans', ScanRoute)
    app.use('/api/treatment', TreatmentRoute)
    app.use('/api/catalog', CatalogRoute)
    app.use('/api/cart', CartRoute)
    app.use('/api/orders', OrderRoute)
    app.use('/api/product',ProductRoute)
    app.use('/api/user', UserRoute)
    app.use(errorHandling as express.ErrorRequestHandler)
    let server = app.listen(process.env.PORT, () => {
        console.log('server connect sucessfully');
    })
    errorLoader.setServer(server);
    return server;
})
const server = await serverSetup();
export { server };