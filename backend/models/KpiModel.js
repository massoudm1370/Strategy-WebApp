const db = require('../db');

const KPIModel = {
  getAll: (callback) => {
    db.all("SELECT * FROM kpis", callback);
  },

  add: (kpi, callback) => {
    const { name, unit, target, formula } = kpi;
    db.run(
      "INSERT INTO kpis (name, unit, target, formula) VALUES (?, ?, ?, ?)",
      [name, unit, target, formula],
      function (err) {
        if (err) callback(err);
        else callback(null, { id: this.lastID, ...kpi });
      }
    );
  },

  delete: (id, callback) => {
    db.run("DELETE FROM kpis WHERE id = ?", [id], function (err) {
      callback(err, { success: this.changes > 0 });
    });
  }
};

module.exports = KPIModel;
