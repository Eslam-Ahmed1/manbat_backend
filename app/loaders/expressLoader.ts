import 'dotenv/config';
import * as errorLoader from './errorLoader.js'
import express from 'express'
import CORS from 'cors'
import { requestLogger } from '../middlewares/requestLogger.js';
import AuthenticationRoute from '../routes/authentication.js';
import ChatRoute from '../routes/chat.js';
import ScanRoute from '../routes/scan.js';
import TreatmentRoute from '../routes/treatment.js';
import CatalogRoute from '../routes/catalog.js';
import CartRoute from '../routes/cart.js';
import OrderRoute from '../routes/order.js';
import { errorHandling } from '../controllers/errorHandling.js';
import conectDB from './mongooseLoader.js'
import ProductRoute from '../routes/product.js';
import UserRoute from '../routes/user.js';
import AdminRoute from '../routes/admin.js';
import ArticleRoute from '../routes/article.js';
import PlantRoute from '../routes/plant.js';
import { registerGlobalErrorHandlers } from '../../utils/errorLogger.js';
import { syncConfigToEnv } from '../services/config.js';
//------
let serverSetup = (async () => {
    registerGlobalErrorHandlers();
    let app = express();
    await conectDB();
    // Load remote config from DB, overrides .env where keys match
    await syncConfigToEnv();
    app.use(express.json());
    app.use(CORS());
    app.use(requestLogger as express.RequestHandler);
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
