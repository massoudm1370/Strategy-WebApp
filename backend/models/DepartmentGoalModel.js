const db = require('../db'); // مطمئن شوید این مسیر به sqlite db شما اشاره دارد

const DepartmentGoalModel = {
  getAll: (callback) => {
    db.all("SELECT * FROM department_goals", callback);
  },

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

  updateYTD: (id, ytd, callback) => {
    db.run("UPDATE department_goals SET ytd = ? WHERE id = ?", [ytd, id], function (err) {
      callback(err, { success: this.changes > 0 });
    });
  }
};

module.exports = DepartmentGoalModel;
