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

try {
  const existing = db.prepare('SELECT * FROM users WHERE username = ?').get(adminUser.username);

  if (existing) {
    console.log("⚠️ کاربر ادمین قبلاً وجود دارد:", existing);
  } else {
    const stmt = db.prepare(`
      INSERT INTO users (name, email, username, password, role, department)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(adminUser.name, adminUser.email, adminUser.username, adminUser.password, adminUser.role, adminUser.department);
    console.log("✅ کاربر ادمین با موفقیت ایجاد شد.");
  }

} catch (err) {
  console.error("❌ خطا در افزودن ادمین:", err.message);
} finally {
  db.close();
}
