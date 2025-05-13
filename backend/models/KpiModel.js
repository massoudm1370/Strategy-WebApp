const db = require('../db');

const KPIModel = {
  getAll: (callback) => {
    try {
      const stmt = db.prepare("SELECT * FROM kpis");
      const rows = stmt.all();
      callback(null, rows);
    } catch (err) {
      callback(err);
    }
  },

  add: (kpi, callback) => {
    try {
      const { name, unit, target, formula } = kpi;
      const stmt = db.prepare("INSERT INTO kpis (name, unit, target, formula) VALUES (?, ?, ?, ?)");
      const info = stmt.run(name, unit, target, formula);
      callback(null, { id: info.lastInsertRowid, ...kpi });
    } catch (err) {
      callback(err);
    }
  },

  delete: (id, callback) => {
    try {
      const stmt = db.prepare("DELETE FROM kpis WHERE id = ?");
      const info = stmt.run(id);
      callback(null, { success: info.changes > 0 });
    } catch (err) {
      callback(err);
    }
  }
};

module.exports = KPIModel;
