const db = require('../db');

const DepartmentModel = {
  getAll: (callback) => {
    try {
      const stmt = db.prepare("SELECT * FROM departments");
      const rows = stmt.all();
      callback(null, rows);
    } catch (err) {
      callback(err);
    }
  },

  add: (name, callback) => {
    try {
      const stmt = db.prepare("INSERT INTO departments (name) VALUES (?)");
      const info = stmt.run(name);
      callback(null, { id: info.lastInsertRowid, name });
    } catch (err) {
      callback(err);
    }
  },

  delete: (id, callback) => {
    try {
      const stmt = db.prepare("DELETE FROM departments WHERE id = ?");
      const info = stmt.run(id);
      callback(null, { success: info.changes > 0 });
    } catch (err) {
      callback(err);
    }
  }
};

module.exports = DepartmentModel;

