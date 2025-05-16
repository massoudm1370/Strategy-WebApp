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
console.log('Database initialized.');

// Make DB available to routers
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Routes
const goalsRoutes = require('./routes/goals');
const usersRoutes = require('./routes/users');
const departmentsRoutes = require('./routes/departments');
const strategyRoutes = require('./routes/strategy');
const departmentGoalsRoutes = require('./routes/departmentGoals');
const integrationsRoutes = require('./routes/integrations');
const kpisRoutes = require('./routes/kpis'); // ✅ اضافه شده
const messageRoutes = require('./routes/messages');
const collaborationRoutes = require('./routes/collaboration');
const aiAlertsRoutes = require('./routes/aiAlerts');

app.use('/api', aiAlertsRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/collaboration', collaborationRoutes);
app.use('/api/integrations', integrationsRoutes);
app.use('/api/department-goals', departmentGoalsRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/strategy', strategyRoutes);
app.use('/api/kpis', kpisRoutes); // ✅ اضافه شده
app.use('/api/messages', messageRoutes);
// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('HUGGINGFACE_API_KEY:', process.env.HUGGINGFACE_API_KEY ? '✅ Loaded' : '❌ Not Loaded');
});
