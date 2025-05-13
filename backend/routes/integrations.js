const express = require('express');
const router = express.Router();
const IntegrationModel = require('../models/IntegrationModel');

// دریافت همه یکپارچگی‌ها
router.get('/', (req, res) => {
  IntegrationModel.getAll((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// افزودن یکپارچگی جدید
router.post('/', (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "آدرس API الزامی است" });

  IntegrationModel.add(url, (err, saved) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(saved);
  });
});

// حذف یکپارچگی
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  IntegrationModel.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

module.exports = router;
