const db = require('../db');

exports.getAll = () => {
  try {
    return db.prepare('SELECT * FROM messages ORDER BY createdAt DESC').all();
  } catch (error) {
    throw error;
  }
};

exports.add = (message) => {
  const { sender, recipient, text } = message;
  try {
    const stmt = db.prepare('INSERT INTO messages (sender, recipient, text, createdAt) VALUES (?, ?, ?, datetime("now"))');
    const info = stmt.run(sender, recipient, text);
    return { id: info.lastInsertRowid, ...message };
  } catch (error) {
    throw error;
  }
};

exports.remove = (id) => {
  try {
    const stmt = db.prepare('DELETE FROM messages WHERE id = ?');
    stmt.run(id);
  } catch (error) {
    throw error;
  }
};
