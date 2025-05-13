const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const dbFile = './strategy.db';
const initSQLFile = './init.sql';

// حذف دیتابیس قبلی اگر وجود دارد
if (fs.existsSync(dbFile)) {
  console.log('🗑️ در حال حذف دیتابیس قبلی...');
  fs.unlinkSync(dbFile);
} else {
  console.log('ℹ️ دیتابیس قبلی یافت نشد.');
}

// ایجاد دیتابیس جدید
console.log('🚀 در حال ایجاد دیتابیس جدید...');
const db = new sqlite3.Database(dbFile);

// اجرای دستورهای init.sql
const initSQL = fs.readFileSync(initSQLFile, 'utf8');
db.exec(initSQL, (err) => {
  if (err) {
    console.error('❌ خطا در اجرای init.sql:', err.message);
    db.close();
    return;
  }

  console.log('✅ جداول با موفقیت ایجاد شدند.');

  // افزودن کاربر تستی
  const insertUserSql = `
    INSERT INTO users (name, email, username, password, role, department)
    VALUES ('Masoud Mahdavi', 'masoud@example.com', 'masoud', 'password', 'admin', 'مدیریت');
  `;

  db.run(insertUserSql, (err) => {
    if (err) {
      console.error('❌ خطا در افزودن کاربر تستی:', err.message);
    } else {
      console.log('✅ کاربر تستی با موفقیت افزوده شد.');
    }
    db.close();
  });
});
