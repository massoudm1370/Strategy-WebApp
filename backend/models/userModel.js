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

  // ✅ متد احراز هویت
  authenticate: (username, password, callback) => {
    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], callback);
  }
};

module.exports = UserModel;
