const db = require('../db');

exports.getAll = () => {
  try {
    const rows = db.prepare('SELECT * FROM messages ORDER BY createdAt DESC').all();
    return rows;
  } catch (err) {
    throw err;
  }
};

exports.add = (message) => {
  try {
    const stmt = db.prepare('INSERT INTO messages (sender, recipient, text, read, createdAt) VALUES (?, ?, ?, 0, datetime("now"))');
    const info = stmt.run(message.sender, message.recipient, message.text);
    return { id: info.lastInsertRowid, ...message, read: 0, createdAt: new Date().toISOString() };
  } catch (err) {
    throw err;
  }
};

exports.remove = (id) => {
  try {
    const stmt = db.prepare('DELETE FROM messages WHERE id = ?');
    stmt.run(id);
  } catch (err) {
    throw err;
  }
};
