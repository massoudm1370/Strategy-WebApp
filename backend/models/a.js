const db = require('../db');

const KPIModel = {
  // دریافت همه KPIها
  getAll: (callback) => {
    try {
      const stmt = db.prepare("SELECT * FROM kpis");
      const rows = stmt.all();
      callback(null, rows);
    } catch (err) {
      callback(err);
    }
  },

  // افزودن KPI جدید
  add: (kpi, callback) => {
    try {
      const { name, unit, target, formula } = kpi;
      const stmt = db.prepare("INSERT INTO kpis (name, unit, target, formula) VALUES (?, ?, ?, ?)");
      const info = stmt.run(name, unit, target, formula);

      // بازگرداندن رکورد ذخیره‌شده به همراه شناسه جدید
      callback(null, { id: info.lastInsertRowid, name, unit, target, formula });
    } catch (err) {
      callback(err);
    }
  },

  // حذف KPI با بررسی نتیجه
  delete: (id, callback) => {
    try {
      const stmt = db.prepare("DELETE FROM kpis WHERE id = ?");
      const info = stmt.run(id);

      if (info.changes === 0) {
        // در صورتی که رکوردی حذف نشده باشد
        callback(new Error("KPI یافت نشد یا قبلاً حذف شده است."));
      } else {
        callback(null, { success: true });
      }
    } catch (err) {
      callback(err);
    }
  }
};

module.exports = KPIModel;
