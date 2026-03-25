// Entry point for Express backend
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());

const envAllowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const defaultAllowedOrigins = [
  'http://localhost:3000',
  'https://project-nebula-frontend-production.up.railway.app'
];

const allowedOrigins = new Set([...defaultAllowedOrigins, ...envAllowedOrigins]);

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser clients (no Origin header) and same-origin server calls.
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.has(origin) || /^https:\/\/[a-z0-9-]+\.up\.railway\.app$/i.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

const getMongoUri = () => {
  const envUri = process.env.MONGO_URI;

  if (envUri && envUri.trim()) {
    return envUri.trim();
  }

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return 'mongodb://localhost:27017/nebula';
};

const mongoURI = getMongoUri();

if (!mongoURI) {
  console.error('MONGO_URI is not set. Add it in Railway backend Variables.');
  process.exit(1);
}

mongoose.set('strictQuery', true);
mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 10000
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

// Import and use user routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);

// Import and use treatment routes
const treatmentRoutes = require('./routes/treatment');
app.use('/api/treatment', treatmentRoutes);

// Import and use event routes
const eventRoutes = require('./routes/eventRoutes');
app.use('/api', eventRoutes);

// Import and use educational resource routes
const educationalResourceRoutes = require('./routes/educationalResourceRoutes');
app.use('/api', educationalResourceRoutes);

// Import and use research update routes
const researchUpdateRoutes = require('./routes/researchUpdateRoutes');
app.use('/api', researchUpdateRoutes);

app.get('/', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.status(dbConnected ? 200 : 503).json({
    message: 'API is running',
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connection.asPromise();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server due to database connection issue:', err.message);
    process.exit(1);
  }
};

startServer();
