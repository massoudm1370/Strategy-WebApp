const express = require('express');
const router = express.Router();
const GoalModel = require('../models/GoalModel');

// دریافت همه اهداف
router.get('/', (req, res) => {
  GoalModel.getAll((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// افزودن هدف جدید
router.post('/', (req, res) => {
  const { title, status, department, owner, startDate, endDate } = req.body;
  if (!title) return res.status(400).json({ error: "عنوان الزامی است" });

  GoalModel.add({ title, status, department, owner, startDate, endDate }, (err, saved) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(saved);
  });
});

// حذف هدف
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  GoalModel.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

module.exports = router;
