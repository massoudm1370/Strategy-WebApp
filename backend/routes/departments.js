const express = require('express');
const router = express.Router();
const DepartmentModel = require('../models/DepartmentModel');

// دریافت همه دپارتمان‌ها
router.get('/', (req, res) => {
  DepartmentModel.getAll((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// افزودن دپارتمان جدید
router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "نام الزامی است" });

  DepartmentModel.add(name, (err, saved) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(saved);
  });
});

// حذف دپارتمان
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  DepartmentModel.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

module.exports = router;
