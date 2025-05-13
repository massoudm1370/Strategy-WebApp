const Database = require('better-sqlite3');
const db = new Database('./strategy.db');


const adminUser = {
  name: "مدیر سیستم",
  email: "massoud.ati@gmail.com",
  username: "masoud",
  password: "2980310247",
  role: "Admin",
  department: "مدیریت"
};

db.run(`
  INSERT INTO users (name, email, username, password, role, department)
  VALUES (?, ?, ?, ?, ?, ?)
`, [adminUser.name, adminUser.email, adminUser.username, adminUser.password, adminUser.role, adminUser.department], function(err) {
  if (err) {
    return console.error("❌ خطا در افزودن ادمین:", err.message);
  }
  console.log("✅ کاربر ادمین با موفقیت ایجاد شد.");
  db.close();
});
