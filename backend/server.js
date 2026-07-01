import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

// Load Env
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Enable CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup static uploads folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Route Middleware Registrations
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Career Compass AI API is running...');
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
