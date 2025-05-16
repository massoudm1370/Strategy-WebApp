const express = require('express');
const router = express.Router();
const MessageModel = require('../models/MessageModel');

// دریافت همه پیام‌ها
router.get('/', (req, res) => {
  MessageModel.getAll((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ارسال پیام جدید
router.post('/', (req, res) => {
  const message = req.body;
  MessageModel.add(message, (err, saved) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(saved);
  });
});

// علامت‌گذاری به عنوان خوانده شده
router.put('/:id/read', (req, res) => {
  const { id } = req.params;
  MessageModel.markAsRead(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

module.exports = router;
