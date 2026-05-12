import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import channelMartRoutes from './routes/datamart/channelMartRoutes.js';
import reportsRoutes from './routes/reports/reportsRoutes.js';
import dataMiningRoutes from './routes/datamining/dataMiningRoutes.js';

const app = express();
const port = 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/datamart', channelMartRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/datamining', dataMiningRoutes);

app.listen(port, () => {
  console.log(`🚀 BlueMart Analytics Server running on port ${port}`);
  console.log(`📊 Data Mart API: http://localhost:${port}/api/datamart`);
  console.log(`📄 Reports API: http://localhost:${port}/api/reports`);
  console.log(`🔬 Data Mining API: http://localhost:${port}/api/datamining`);
});
 