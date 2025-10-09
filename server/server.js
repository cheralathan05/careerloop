import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'; // 👈 Import the routes

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// A test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Mount Routers
app.use('/api/auth', authRoutes); // 👈 Use the auth routes

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});