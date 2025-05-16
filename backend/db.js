const Database = require('better-sqlite3');  // ✅ تغییر به better-sqlite3
const path = require('path');

// تعیین مسیر کامل دیتابیس
const dbPath = path.resolve(__dirname, 'strategy.db');
const db = new Database(dbPath);
console.log('✅ اتصال به دیتابیس برقرار شد.');

// خروجی ماژول
module.exports = db;
