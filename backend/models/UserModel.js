const db = require('../db');

const UserModel = {
  getAll: (callback) => {
    try {
      const stmt = db.prepare("SELECT * FROM users");
      const rows = stmt.all();
      callback(null, rows);
    } catch (err) {
      callback(err);
    }
  },

  getById: (id, callback) => {
    try {
      const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
      const row = stmt.get(id);
      callback(null, row);
    } catch (err) {
      callback(err);
    }
  },

  add: (user, callback) => {
    try {
      const { name, email, username, password, role, department } = user;
      const stmt = db.prepare("INSERT INTO users (name, email, username, password, role, department) VALUES (?, ?, ?, ?, ?, ?)");
      const info = stmt.run(name, email, username, password, role, department);
      callback(null, { id: info.lastInsertRowid, ...user });
    } catch (err) {
      callback(err);
    }
  },

  update: (id, user, callback) => {
    try {
      const { name, email, username, password, role, department } = user;
      const stmt = db.prepare("UPDATE users SET name = ?, email = ?, username = ?, password = ?, role = ?, department = ? WHERE id = ?");
      stmt.run(name, email, username, password, role, department, id);
      callback(null, { id, ...user });
    } catch (err) {
      callback(err);
    }
  },

  delete: (id, callback) => {
    try {
      const stmt = db.prepare("DELETE FROM users WHERE id = ?");
      const info = stmt.run(id);
      callback(null, { success: info.changes > 0 });
    } catch (err) {
      callback(err);
    }
  },

  authenticate: (username, password, callback) => {
    console.log("🟢 تلاش برای ورود با:", { username, password });
    try {
      const stmt = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?");
      const user = stmt.get(username, password);
      if (!user) {
        console.log("🔴 کاربر یافت نشد برای:", { username, password });
      } else {
        console.log("🟢 کاربر یافت شد:", user);
      }
      callback(null, user);
    } catch (err) {
      console.error("❌ خطا در احراز هویت:", err.message);
      callback(err);
    }
  }
};

module.exports = UserModel;
