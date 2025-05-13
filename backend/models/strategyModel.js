const db = require('../db');

const StrategyModel = {
  get: (callback) => {
    db.get("SELECT * FROM strategy WHERE id = 1", callback);
  },

  save: (data, callback) => {
    const { vision, mission, core_values } = data;
    db.run(`
      INSERT INTO strategy (id, vision, mission, core_values) 
      VALUES (1, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET vision = ?, mission = ?, core_values = ?
    `,
    [vision, mission, core_values, vision, mission, core_values],
    function (err) {
      if (err) callback(err);
      else callback(null, { success: true });
    });
  }
};

module.exports = StrategyModel;
