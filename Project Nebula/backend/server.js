// Entry point for Express backend
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection (will update with URI later)
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/nebula';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import and use user routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);

// Import and use treatment routes
const treatmentRoutes = require('./routes/treatment');
app.use('/api/treatment', treatmentRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
