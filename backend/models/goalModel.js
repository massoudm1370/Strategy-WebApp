const db = require('../db');

const GoalModel = {
  getAll: (callback) => {
    db.all("SELECT * FROM goals", callback);
  },

  add: (goal, callback) => {
    const { title, status, department, owner, startDate, endDate } = goal;
    db.run(
      "INSERT INTO goals (title, status, department, owner, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?)",
      [title, status, department, owner, startDate, endDate],
      function (err) {
        if (err) callback(err);
        else callback(null, { id: this.lastID, ...goal });
      }
    );
  },

  delete: (id, callback) => {
    db.run("DELETE FROM goals WHERE id = ?", [id], function (err) {
      callback(err, { success: this.changes > 0 });
    });
  }
};

module.exports = GoalModel;
