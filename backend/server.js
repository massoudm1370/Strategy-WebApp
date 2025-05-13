const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Database Setup
const db = new sqlite3.Database('./strategy.db', (err) => {
  if (err) console.error(err.message);
  else console.log('📦 SQLite database connected.');
});

// Create Users Table
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    username TEXT UNIQUE,
    password TEXT,
    department TEXT,
    role TEXT
  )
`);

// User Registration
app.post('/api/register', (req, res) => {
  const { name, username, password, department, role } = req.body;
  const query = `INSERT INTO users (name, username, password, department, role) VALUES (?, ?, ?, ?, ?)`;
  db.run(query, [name, username, password, department, role], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id: this.lastID, name, username, department, role });
  });
});

// User Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
  db.get(query, [username, password], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'نام کاربری یا رمز عبور اشتباه است' });
    res.json(user);
  });
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
