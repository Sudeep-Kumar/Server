import express from 'express';
import UserRoutes from './routes/user.js';
import CategoryRoutes from './routes/category.js';
import ProductRoutes from './routes/product.js';
import orderRoutes from './routes/order.js';
import connectDB from './config/connect.js';
import { buildAdminRouter } from './config/setup.js';
import dotenv from 'dotenv';
import { PORT } from './config/config.js';

dotenv.config();

const app = express();

app.use(express.json());

// Initialize AdminJS
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        
        // Setup AdminJS
      await buildAdminRouter(app);
        
        // Routes
        app.use('/user', UserRoutes);
        app.use('/Category', CategoryRoutes);
        app.use('/Product', ProductRoutes);
        app.use('/Order', orderRoutes);

        app.listen(PORT, '0.0.0.0', (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`Server is running on port ${PORT}`);
                console.log(`AdminJS started on http://localhost:${PORT}/admin`);
            }
        });
    } catch (err) {
        console.log(err);
    }
}

start();