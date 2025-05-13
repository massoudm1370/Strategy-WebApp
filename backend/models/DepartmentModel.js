const db = require('../db');

const DepartmentModel = {
  getAll: (callback) => {
    db.all("SELECT * FROM departments", callback);
  },

  add: (name, callback) => {
    db.run("INSERT INTO departments (name) VALUES (?)", [name], function (err) {
      if (err) callback(err);
      else callback(null, { id: this.lastID, name });
    });
  },

  delete: (id, callback) => {
    db.run("DELETE FROM departments WHERE id = ?", [id], function (err) {
      callback(err, { success: this.changes > 0 });
    });
  }
};

module.exports = DepartmentModel;
