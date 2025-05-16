const express = require('express');
const router = express.Router();
const MessageModel = require('../models/MessageModel');

// دریافت همه پیام‌ها
router.get('/', (req, res) => {
  try {
    const messages = MessageModel.getAll();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// افزودن پیام جدید
router.post('/', (req, res) => {
  try {
    const saved = MessageModel.add(req.body);
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// حذف پیام
router.delete('/:id', (req, res) => {
  try {
    MessageModel.remove(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
