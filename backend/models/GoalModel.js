const db = require('../db');

const GoalModel = {
  // دریافت همه اهداف
  getAll: (callback) => {
    try {
      const stmt = db.prepare("SELECT * FROM goals");
      const rows = stmt.all();
      callback(null, rows);
    } catch (err) {
      callback(err);
    }
  },

  // افزودن هدف جدید
  add: (goal, callback) => {
    try {
      const stmt = db.prepare(`
        INSERT INTO goals (
          title, target, failure, currentStatus, ytd, year, half,
          calculationMethod, weight, unit, definitionOfDone
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const info = stmt.run(
        goal.title,
        goal.target,
        goal.failure,
        goal.currentStatus,
        goal.ytd,
        goal.year,
        goal.half,
        goal.calculationMethod,
        goal.weight,
        goal.unit,
        goal.definitionOfDone
      );

      callback(null, { id: info.lastInsertRowid, ...goal });
    } catch (err) {
      callback(err);
    }
  },

  // ویرایش هدف
  update: (id, goal, callback) => {
    try {
      console.log('🔄 Updating goal with ID:', id);
      const stmt = db.prepare(`
        UPDATE goals SET 
          title = ?, 
          target = ?, 
          failure = ?, 
          currentStatus = ?, 
          ytd = ?, 
          year = ?, 
          half = ?, 
          calculationMethod = ?, 
          weight = ?, 
          unit = ?, 
          definitionOfDone = ?
        WHERE id = ?
      `);

      const info = stmt.run(
        goal.title,
        goal.target,
        goal.failure,
        goal.currentStatus,
        goal.ytd,
        goal.year,
        goal.half,
        goal.calculationMethod,
        goal.weight,
        goal.unit,
        goal.definitionOfDone,
        id
      );

      callback(null, { success: info.changes > 0, id });
    } catch (err) {
      callback(err);
    }
  },

  // حذف هدف
  delete: (id, callback) => {
    try {
      const stmt = db.prepare("DELETE FROM goals WHERE id = ?");
      const info = stmt.run(id);
      console.log('🔄 تعداد رکوردهای حذف‌شده:', info.changes);
      callback(null, { success: info.changes > 0 });
    } catch (err) {
      callback(err);
    }
  }
};

module.exports = GoalModel;
