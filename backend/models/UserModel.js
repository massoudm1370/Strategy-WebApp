const db = require('../db');

const UserModel = {
  getAll: (callback) => {
    db.all("SELECT * FROM users", callback);
  },

  getById: (id, callback) => {
    db.get("SELECT * FROM users WHERE id = ?", [id], callback);
  },

  add: (user, callback) => {
    const { name, email, username, password, role, department } = user;
    db.run(
      "INSERT INTO users (name, email, username, password, role, department) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, username, password, role, department],
      function (err) {
        if (err) callback(err);
        else callback(null, { id: this.lastID, ...user });
      }
    );
  },

  update: (id, user, callback) => {
    const { name, email, username, password, role, department } = user;
    db.run(
      "UPDATE users SET name = ?, email = ?, username = ?, password = ?, role = ?, department = ? WHERE id = ?",
      [name, email, username, password, role, department, id],
      function (err) {
        if (err) callback(err);
        else callback(null, { id, ...user });
      }
    );
  },

  delete: (id, callback) => {
    db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
      callback(err, { success: this.changes > 0 });
    });
  },

  // ✅ متد احراز هویت با لاگ کامل
  authenticate: (username, password, callback) => {
    console.log("🟢 تلاش برای ورود با:", { username, password });

    // لاگ همه کاربران دیتابیس
    db.all("SELECT * FROM users", [], (err, rows) => {
      if (err) {
        console.error("❌ خطا در دریافت کاربران:", err.message);
      } else {
        console.log("🟢 کاربران فعلی دیتابیس:", rows);
      }
    });

    // بررسی وجود کاربر
    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, user) => {
      if (err) {
        console.error("❌ خطا در اجرای کوئری:", err.message);
      } else if (!user) {
        console.log("🔴 کاربر یافت نشد برای:", { username, password });
      } else {
        console.log("🟢 کاربر یافت شد:", user);
      }
      callback(err, user);
    });
  }
};

module.exports = UserModel;
