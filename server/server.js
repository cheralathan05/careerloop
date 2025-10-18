// server/server.js (FINAL)

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Your MongoDB connection file

dotenv.config();
connectDB();

const app = express();

// ✅ Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// ✅ CORS setup — allow frontend (Vite usually runs on 5173)
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// ✅ Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// ✅ Test route
app.get('/', (req, res) => {
  res.send('🚀 Auth API running successfully...');
});

// ✅ Error handler (optional but helpful)
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(res.statusCode || 500).json({
    message: err.message || 'Server error',
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
