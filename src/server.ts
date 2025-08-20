import express from 'express';
import mongoose from 'mongoose';
import authRoutes from '@/routes/auth-routes';
import profileRoutes from '@/routes/profile-routes';
import listRoutes from '@/routes/list-routes';
import { config } from '@/config'; 

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/lists', listRoutes);

mongoose.connect(config.mongoUri)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err.message);
  });
