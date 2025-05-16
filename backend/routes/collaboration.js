const express = require('express');
const router = express.Router();
const CollaborationModel = require('../models/CollaborationModel');

// دریافت همه یادداشت‌ها
router.get('/', (req, res) => {
  CollaborationModel.getAll((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// افزودن یادداشت جدید
router.post('/', (req, res) => {
const note = {
  ...req.body,
  timestamp: new Date().toISOString(),
  sender: "سیستم" // یا از توکن کاربر، یا مقدار دلخواه
};
});

// حذف یادداشت
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  CollaborationModel.remove(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

module.exports = router;
