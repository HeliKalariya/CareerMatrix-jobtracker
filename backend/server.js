import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', (await import('./routes/authRoutes.js')).default);
app.use('/api/applications', (await import('./routes/applicationRoutes.js')).default);
app.use('/api/notifications', (await import('./routes/notificationRoutes.js')).default);

app.get('/', (req, res) => res.send('CareerMatrix API is running 🚀'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});