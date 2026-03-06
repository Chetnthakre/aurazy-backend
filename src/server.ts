import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import cors from 'cors';

import connectDB from './config/db';
import errorHandler from './middleware/errorHandler';
import orderRoutes from './routes/orderRoutes';
import paymentRoutes from './routes/paymentRoutes';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';

// Load environment variables
// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
import path from 'path';

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.send('API Running');
});


// API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);


// Error Middleware
app.use(errorHandler);



// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
});


