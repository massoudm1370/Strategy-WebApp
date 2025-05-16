const express = require('express');
const router = express.Router();
const MessageModel = require('../models/MessageModel');

router.get('/', (req, res) => {
  try {
    const rows = MessageModel.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', (req, res) => {
  try {
    const newMsg = MessageModel.add(req.body);
    res.json(newMsg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    MessageModel.remove(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
