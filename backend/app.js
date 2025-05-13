const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');  // ✅ تغییر به better-sqlite3
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
const db = new Database('./strategy.db');  // ✅ تغییر به better-sqlite3
console.log('Connected to SQLite database.');

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
app.use('/api/integrations', integrationsRoutes);
app.use('/api/department-goals', departmentGoalsRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/strategy', strategyRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
