const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:27017/task-manager';

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/tasks', taskRoutes);

// Home route - Redirecionar para a interface web
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API Info route
app.get('/api', (req, res) => {
  res.json({
    message: 'Task Manager API',
    endpoints: {
      tasks: '/api/tasks'
    }
  });
});

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully!');
    // Start server after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  });

module.exports = app; 