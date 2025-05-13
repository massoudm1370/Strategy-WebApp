const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// ایجاد دیتابیس یا اتصال به دیتابیس
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error('Database opening error:', err);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// ساخت جدول اگر وجود ندارد
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

// روت ثبت کاربر
app.post('/api/register', (req, res) => {
  const { name, username, password, department, role } = req.body;
  const query = `INSERT INTO users (name, username, password, department, role) VALUES (?, ?, ?, ?, ?)`;
  
  db.run(query, [name, username, password, department, role], function(err) {
    if (err) {
      console.error(err.message);
      res.status(400).json({ error: "User already exists or invalid data." });
    } else {
      res.json({ message: "User registered successfully", userId: this.lastID });
    }
  });
});

// روت ورود کاربر
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;

  db.get(query, [username, password], (err, row) => {
    if (err) {
      res.status(500).json({ error: "Database error" });
    } else if (!row) {
      res.status(401).json({ error: "Invalid username or password" });
    } else {
      res.json({ message: "Login successful", user: row });
    }
  });
});

// شروع سرور
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
