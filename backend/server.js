const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Setup
const db = new sqlite3.Database('./strategy.db', (err) => {
  if (err) console.error(err.message);
  else {
    console.log('📦 SQLite database connected.');
    const initSQL = fs.readFileSync('./init.sql', 'utf-8');
    db.exec(initSQL, (err) => {
      if (err) console.error('❌ Database init failed:', err.message);
      else console.log('✅ Database structure initialized.');
    });
  }
});

// Make db accessible to routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Import routes
const goalsRoutes = require('./routes/goals');
const usersRoutes = require('./routes/users');
const departmentsRoutes = require('./routes/departments');
const strategyRoutes = require('./routes/strategy');
const departmentGoalsRoutes = require('./routes/departmentGoals');
const integrationsRoutes = require('./routes/integrations');
const kpisRoutes = require('./routes/kpis');

// Register routes
app.use('/api/goals', goalsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/strategy', strategyRoutes);
app.use('/api/department-goals', departmentGoalsRoutes);
app.use('/api/integrations', integrationsRoutes);
app.use('/api/kpis', kpisRoutes);

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
