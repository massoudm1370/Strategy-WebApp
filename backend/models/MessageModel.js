const db = require('../db');

// دریافت همه پیام‌ها
exports.getAll = (callback) => {
  db.all('SELECT * FROM messages ORDER BY createdAt DESC', [], callback);
};

// افزودن پیام جدید
exports.add = (message, callback) => {
  const { sender, recipient, text, read = 0 } = message;
  db.run(
    'INSERT INTO messages (sender, recipient, text, read, createdAt) VALUES (?, ?, ?, ?, datetime("now"))',
    [sender, recipient, text, read],
    function (err) {
      callback(err, { id: this.lastID, ...message });
    }
  );
};

// علامت‌گذاری پیام به عنوان خوانده‌شده
exports.markAsRead = (id, callback) => {
  db.run('UPDATE messages SET read = 1 WHERE id = ?', [id], callback);
};
