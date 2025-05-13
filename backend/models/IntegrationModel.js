const db = require('../db');

const IntegrationModel = {
  getAll: (callback) => {
    db.all("SELECT * FROM integrations", callback);
  },

  add: (url, callback) => {
    db.run("INSERT INTO integrations (url) VALUES (?)", [url], function (err) {
      if (err) callback(err);
      else callback(null, { id: this.lastID, url });
    });
  },

  delete: (id, callback) => {
    db.run("DELETE FROM integrations WHERE id = ?", [id], function (err) {
      callback(err, { success: this.changes > 0 });
    });
  }
};

module.exports = IntegrationModel;
