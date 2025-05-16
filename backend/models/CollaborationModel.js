const db = require('../db');

exports.getAll = () => {
  try {
    return db.prepare('SELECT * FROM collaboration_notes ORDER BY createdAt DESC').all();
  } catch (error) {
    throw error;
  }
};

exports.add = (note) => {
  const { text, fileName, recipient } = note;
  try {
    const stmt = db.prepare('INSERT INTO collaboration_notes (text, fileName, recipient, createdAt) VALUES (?, ?, ?, datetime("now"))');
    const info = stmt.run(text, fileName, recipient);
    return { id: info.lastInsertRowid, ...note };
  } catch (error) {
    throw error;
  }
};

exports.remove = (id) => {
  try {
    const stmt = db.prepare('DELETE FROM collaboration_notes WHERE id = ?');
    stmt.run(id);
  } catch (error) {
    throw error;
  }
};
