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
    const {
      department, orgGoalTitle, year, half, keyResult, weight, target,
      failure, unit, baseline, calculationMethod, definitionOfDone,
      monthlyProgress, ytd, finalAchievement, status
    } = goal;

    db.run(
      `INSERT INTO department_goals (
        department, orgGoalTitle, year, half, keyResult, weight, target,
        failure, unit, baseline, calculationMethod, definitionOfDone,
        monthlyProgress, ytd, finalAchievement, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        department, orgGoalTitle, year, half, keyResult, weight, target,
        failure, unit, baseline, calculationMethod, definitionOfDone,
        JSON.stringify(monthlyProgress), ytd, finalAchievement, status
      ],
      function (err) {
        if (err) callback(err);
        else callback(null, { id: this.lastID, ...goal });
      }
    );
  },

  // به‌روزرسانی YTD
  updateYTD: (id, ytd, callback) => {
    db.run("UPDATE department_goals SET ytd = ? WHERE id = ?", [ytd, id], function (err) {
      callback(err, { success: this.changes > 0 });
    });
  },

  // ویرایش کامل رکورد
  update: (id, goal, callback) => {
    const {
      department, orgGoalTitle, year, half, keyResult, weight, target,
      failure, unit, baseline, calculationMethod, definitionOfDone,
      monthlyProgress, ytd, finalAchievement, status
    } = goal;

    db.run(
      `UPDATE department_goals SET 
        department = ?, orgGoalTitle = ?, year = ?, half = ?, keyResult = ?, 
        weight = ?, target = ?, failure = ?, unit = ?, baseline = ?, 
        calculationMethod = ?, definitionOfDone = ?, monthlyProgress = ?, 
        ytd = ?, finalAchievement = ?, status = ?
       WHERE id = ?`,
      [
        department, orgGoalTitle, year, half, keyResult, weight, target,
        failure, unit, baseline, calculationMethod, definitionOfDone,
        JSON.stringify(monthlyProgress), ytd, finalAchievement, status, id
      ],
      function (err) {
        if (err) callback(err);
        else callback(null, { id, ...goal });
      }
    );
  },

  // حذف رکورد
  delete: (id, callback) => {
    db.run("DELETE FROM department_goals WHERE id = ?", [id], function (err) {
      callback(err, { success: this.changes > 0 });
    });
  }
};

module.exports = DepartmentGoalModel;
