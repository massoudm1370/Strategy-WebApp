const db = require('../db');

exports.getAll = (callback) => {
  db.all('SELECT * FROM collaboration_notes ORDER BY createdAt DESC', [], callback);
};

exports.add = (note, callback) => {
  const { text, fileName, recipient } = note;
  db.run(
    'INSERT INTO collaboration_notes (text, fileName, recipient, createdAt) VALUES (?, ?, ?, datetime("now"))',
    [text, fileName, recipient],
    function (err) {
      callback(err, { id: this.lastID, ...note });
    }
  );
};

exports.remove = (id, callback) => {
  db.run('DELETE FROM collaboration_notes WHERE id = ?', [id], callback);
};
