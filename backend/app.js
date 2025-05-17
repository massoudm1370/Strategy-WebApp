// app.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ اتصال به دیتابیس از طریق db.js
const db = require('./db');

// Initialize Database Structure
const initSQL = fs.readFileSync('./init.sql', 'utf-8');
db.exec(initSQL);
console.log('✅ Database initialized.');

// Make DB available to all routers
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Static Files
app.use('/uploads', express.static('uploads'));

// API Routes
const goalsRoutes = require('./routes/goals');
const usersRoutes = require('./routes/users');
const departmentsRoutes = require('./routes/departments');
const strategyRoutes = require('./routes/strategy');
const departmentGoalsRoutes = require('./routes/departmentGoals');
const integrationsRoutes = require('./routes/integrations');
const kpisRoutes = require('./routes/kpis');
const messageRoutes = require('./routes/messages');
const collaborationRoutes = require('./routes/collaboration');
const aiAlertsRoutes = require('./routes/aiAlerts');

app.use('/api/collaboration', collaborationRoutes);
app.use('/api/integrations', integrationsRoutes);
app.use('/api/department-goals', departmentGoalsRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/strategy', strategyRoutes);
app.use('/api/kpis', kpisRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api', aiAlertsRoutes);  // AI route last to avoid conflicts

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// General Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`✅ API available at: http://localhost:${PORT}/api`);
    console.log('🔑 HUGGINGFACE_API_KEY:', process.env.HUGGINGFACE_API_KEY ? '✅ Loaded' : '❌ Not Loaded - Check your .env file');
});
