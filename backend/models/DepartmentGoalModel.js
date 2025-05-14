const db = require('../db');

const DepartmentGoalModel = {
  // دریافت همه رکوردها
  getAll: (callback) => {
    try {
      const stmt = db.prepare("SELECT * FROM department_goals");
      const rows = stmt.all();
      callback(null, rows);
    } catch (err) {
      callback(err);
    }
  },

  // افزودن رکورد جدید
  add: (goal, callback) => {
    try {
      const stmt = db.prepare(`
        INSERT INTO department_goals (
          department, orgGoalTitle, year, half, keyResult, weight, target,
          failure, unit, baseline, calculationMethod, definitionOfDone,
          monthlyProgress, ytd, finalAchievement, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const info = stmt.run(
        goal.department, goal.orgGoalTitle, goal.year, goal.half, goal.keyResult, goal.weight,
        goal.target, goal.failure, goal.unit, goal.baseline, goal.calculationMethod,
        goal.definitionOfDone, JSON.stringify(goal.monthlyProgress), goal.ytd,
        goal.finalAchievement, goal.status
      );

      callback(null, { id: info.lastInsertRowid, ...goal });
    } catch (err) {
      callback(err);
    }
  },

  // به‌روزرسانی YTD
  updateYTD: (id, ytd, callback) => {
    try {
      const stmt = db.prepare("UPDATE department_goals SET ytd = ? WHERE id = ?");
      const info = stmt.run(ytd, id);
      callback(null, { success: info.changes > 0 });
    } catch (err) {
      callback(err);
    }
  },

  // ویرایش کامل رکورد
  update: (id, goal, callback) => {
    try {
      const stmt = db.prepare(`
        UPDATE department_goals SET 
          department = ?, orgGoalTitle = ?, year = ?, half = ?, keyResult = ?, 
          weight = ?, target = ?, failure = ?, unit = ?, baseline = ?, 
          calculationMethod = ?, definitionOfDone = ?, monthlyProgress = ?, 
          ytd = ?, finalAchievement = ?, status = ?
        WHERE id = ?
      `);

      const info = stmt.run(
        goal.department, goal.orgGoalTitle, goal.year, goal.half, goal.keyResult, goal.weight,
        goal.target, goal.failure, goal.unit, goal.baseline, goal.calculationMethod,
        goal.definitionOfDone, JSON.stringify(goal.monthlyProgress), goal.ytd,
        goal.finalAchievement, goal.status, id
      );

      callback(null, { id, ...goal });
    } catch (err) {
      callback(err);
    }
  },

  // حذف رکورد
  delete: (id, callback) => {
    try {
      const stmt = db.prepare("DELETE FROM department_goals WHERE id = ?");
      const info = stmt.run(id);
      callback(null, { success: info.changes > 0 });
    } catch (err) {
      callback(err);
    }
  }
};

module.exports = DepartmentGoalModel;
