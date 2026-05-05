import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import teacherRoutes from './routes/teacher.js';
import driverRoutes from './routes/driver.js';
import vehicleRoutes from './routes/vehicle.js';
import chatRoutes from './routes/chat.js';
import teacherAssistantRoutes from './routes/teacherAssistant.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/teacher-assistant', teacherAssistantRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.get('/', (req, res) => {
  res.send('Welcome to Vidyadham Backend API');
});
// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
