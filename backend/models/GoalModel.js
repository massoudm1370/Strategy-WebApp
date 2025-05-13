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
    const {
      title,
      target,
      failure,
      currentStatus,
      ytd,
      year,
      half,
      calculationMethod,
      weight,
      unit,
      definitionOfDone
    } = goal;

    db.run(
      `INSERT INTO goals (
        title, target, failure, currentStatus, ytd, year, half,
        calculationMethod, weight, unit, definitionOfDone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        target,
        failure,
        currentStatus,
        ytd,
        year,
        half,
        calculationMethod,
        weight,
        unit,
        definitionOfDone
      ],
      function (err) {
        if (err) callback(err);
        else callback(null, { id: this.lastID, ...goal });
      }
    );
  },

  // ✅ ویرایش هدف
  update: (id, goal, callback) => {
    const {
      title,
      target,
      failure,
      currentStatus,
      ytd,
      year,
      half,
      calculationMethod,
      weight,
      unit,
      definitionOfDone
    } = goal;

    console.log('🔄 Updating goal with ID:', id);

    db.run(
      `UPDATE goals SET 
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
       WHERE id = ?`,
      [
        title,
        target,
        failure,
        currentStatus,
        ytd,
        year,
        half,
        calculationMethod,
        weight,
        unit,
        definitionOfDone,
        id
      ],
      function (err) {
        if (err) callback(err);
        else callback(null, { success: this.changes > 0, id });
      }
    );
  },

  // حذف هدف
delete: (id, callback) => {
  db.run("DELETE FROM goals WHERE id = ?", [id], function (err) {
    console.log('🔄 تعداد رکوردهای حذف‌شده:', this.changes);  // ✅ لاگ اضافه شده
    callback(err, { success: this.changes > 0 });
  });
}

};

module.exports = GoalModel;
