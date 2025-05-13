const Database = require('better-sqlite3');  // ✅ تغییر به better-sqlite3

// اتصال به دیتابیس
const db = new Database('./strategy.db');
console.log('✅ اتصال به دیتابیس برقرار شد.');

// خروجی ماژول
module.exports = db;
