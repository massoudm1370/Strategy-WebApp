const express = require('express');
const router = express.Router();
const CollaborationModel = require('../models/CollaborationModel');

// دریافت همه یادداشت‌ها
router.get('/', (req, res) => {
  try {
    const notes = CollaborationModel.getAll();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// افزودن یادداشت جدید
router.post('/', (req, res) => {
  try {
    const saved = CollaborationModel.add(req.body);
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// حذف یادداشت
router.delete('/:id', (req, res) => {
  try {
    CollaborationModel.remove(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
