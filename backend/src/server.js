import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import noticeRoutes from './routes/noticeRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173'
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ message: 'Notice module API is running.' });
});

app.use('/api/notices', noticeRoutes);

app.use((err, _req, res, _next) => {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({
    message: err.message || 'Something went wrong.'
  });
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

start();