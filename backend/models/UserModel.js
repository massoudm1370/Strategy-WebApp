const db = require('../db');

const UserModel = {
  // دریافت همه کاربران
  getAllSync: () => {
    const stmt = db.prepare("SELECT * FROM users");
    return stmt.all();
  },

  // دریافت کاربر بر اساس ID
  getByIdSync: (id) => {
    const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
    return stmt.get(id);
  },

  // افزودن کاربر جدید
  addSync: (user) => {
    const { name, email, username, password, role, department } = user;
    const stmt = db.prepare("INSERT INTO users (name, email, username, password, role, department) VALUES (?, ?, ?, ?, ?, ?)");
    const info = stmt.run(name, email, username, password, role, department);
    return { id: info.lastInsertRowid, ...user };
  },

  // به‌روزرسانی کاربر
  updateSync: (id, user) => {
    const { name, email, username, password, role, department } = user;
    const stmt = db.prepare("UPDATE users SET name = ?, email = ?, username = ?, password = ?, role = ?, department = ? WHERE id = ?");
    stmt.run(name, email, username, password, role, department, id);
    return { id, ...user };
  },

  // حذف کاربر
  deleteSync: (id) => {
    const stmt = db.prepare("DELETE FROM users WHERE id = ?");
    const info = stmt.run(id);
    return { success: info.changes > 0 };
  },

  // احراز هویت
  authenticateSync: (username, password) => {
    console.log("🟢 تلاش برای ورود با:", { username, password });
    const stmt = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?");
    const user = stmt.get([username, password]);
    if (!user) {
      console.log("🔴 کاربر یافت نشد برای:", { username, password });
    } else {
      console.log("🟢 کاربر یافت شد:", user);
    }
    return user;
  }
};

module.exports = UserModel;
