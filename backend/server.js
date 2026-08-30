import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* Health Check Route */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "CareerMatrix Backend",
    timestamp: new Date().toISOString()
  });
});


// Routes
app.use('/api/auth', (await import('./routes/authRoutes.js')).default);
app.use('/api/applications', (await import('./routes/applicationRoutes.js')).default);
app.use('/api/companies', (await import('./routes/companyRoutes.js')).default);

app.get('/', (req, res) => res.send('CareerMatrix API is running 🚀'));

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
