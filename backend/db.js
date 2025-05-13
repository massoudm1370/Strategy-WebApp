const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./strategy.db', (err) => {
  if (err) {
    console.error('❌ خطا در اتصال به دیتابیس:', err.message);
  } else {
    console.log('✅ اتصال به دیتابیس برقرار شد.');
  }
});
module.exports = db;
