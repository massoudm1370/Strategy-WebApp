const db = require('../db');

const IntegrationModel = {
  getAll: (callback) => {
    try {
      const stmt = db.prepare("SELECT * FROM integrations");
      const rows = stmt.all();
      callback(null, rows);
    } catch (err) {
      callback(err);
    }
  },

  add: (url, callback) => {
    try {
      const stmt = db.prepare("INSERT INTO integrations (url) VALUES (?)");
      const info = stmt.run(url);
      callback(null, { id: info.lastInsertRowid, url });
    } catch (err) {
      callback(err);
    }
  },

  delete: (id, callback) => {
    try {
      const stmt = db.prepare("DELETE FROM integrations WHERE id = ?");
      const info = stmt.run(id);
      callback(null, { success: info.changes > 0 });
    } catch (err) {
      callback(err);
    }
  }
};

module.exports = IntegrationModel;
