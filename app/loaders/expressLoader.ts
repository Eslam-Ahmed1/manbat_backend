import 'dotenv/config';
import * as errorLoader from './errorLoader.ts'
import express from 'express'
import CORS from 'cors'
import { requestLogger } from '../middlewares/requestLogger.ts';
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
import AdminRoute from '../routes/admin.ts';
import ArticleRoute from '../routes/article.ts';
import PlantRoute from '../routes/plant.ts';
import { registerGlobalErrorHandlers } from '../../utils/errorLogger.ts';
import { syncConfigToEnv } from '../services/config.ts';
//------
let serverSetup = (async () => {
    registerGlobalErrorHandlers();
    let app = express();
    await conectDB();
    // Load remote config from DB, overrides .env where keys match
    await syncConfigToEnv();
    app.use(express.json());
    app.use(CORS());
    app.use(requestLogger);
    app.use('/api/authentication', AuthenticationRoute)
    app.use('/api/AI_chat', ChatRoute)
    app.use('/api/scans', ScanRoute)
    app.use('/api/treatment', TreatmentRoute)
    app.use('/api/catalog', CatalogRoute)
    app.use('/api/cart', CartRoute)
    app.use('/api/orders', OrderRoute)
    app.use('/api/product',ProductRoute)
    app.use('/api/articles', ArticleRoute)
    app.use('/api/plants', PlantRoute)
    app.use('/api/user', UserRoute)
    app.use('/api/admin', AdminRoute)
    app.use(errorHandling as express.ErrorRequestHandler)
    const port = process.env.PORT || '3000';
    const host = process.env.HOST || 'localhost';
    const baseUrl = process.env.BASE_URL || `http://${host}:${port}`;

    let server = app.listen(port, () => {
        console.log(`Server running on base URL: ${baseUrl}`);
    })
    errorLoader.setServer(server);
    return server;
})
const server = await serverSetup();
export { server };
