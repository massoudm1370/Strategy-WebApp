const db = require('../db');

const StrategyModel = {
  // دریافت استراتژی
  get: () => {
    try {
      const stmt = db.prepare("SELECT * FROM strategy WHERE id = 1");
      const row = stmt.get();
      return row;
    } catch (err) {
      throw err;
    }
  },

  // ذخیره یا به‌روزرسانی استراتژی
  save: (data) => {
    try {
      const { vision, mission, core_values } = data;
      const stmt = db.prepare(`
        INSERT INTO strategy (id, vision, mission, core_values) 
        VALUES (1, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET 
          vision = excluded.vision, 
          mission = excluded.mission, 
          core_values = excluded.core_values
      `);
      stmt.run(vision, mission, core_values);
      return { success: true };
    } catch (err) {
      throw err;
    }
  }
};

module.exports = StrategyModel;
