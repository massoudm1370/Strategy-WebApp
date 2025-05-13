const express = require('express');
const router = express.Router();
const KPIModel = require('../models/KPIModel');

// دریافت همه KPIها
router.get('/', (req, res) => {
  KPIModel.getAll((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// افزودن KPI جدید
router.post('/', (req, res) => {
  const { name, unit, target, formula } = req.body;
  if (!name) return res.status(400).json({ error: "عنوان الزامی است" });

  KPIModel.add({ name, unit, target, formula }, (err, saved) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(saved);
  });
});

// حذف KPI
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  KPIModel.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

module.exports = router;
