const express = require('express');
const router = express.Router();
const DepartmentGoalModel = require('../models/DepartmentGoalModel');

// ✅ دریافت همه اهداف دپارتمانی
router.get('/', (req, res) => {
  DepartmentGoalModel.getAll((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const parsed = rows.map(row => ({
      ...row,
      monthlyProgress: JSON.parse(row.monthlyProgress || "[]")
    }));

    res.json(parsed);
  });
});

// ✅ افزودن هدف جدید
router.post('/', (req, res) => {
  const goal = req.body;
  DepartmentGoalModel.add(goal, (err, saved) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(saved);
  });
});

// ✅ به‌روزرسانی فقط YTD
router.put('/:id/ytd', (req, res) => {
  const { id } = req.params;
  const { ytd } = req.body;

  if (!ytd) {
    return res.status(400).json({ error: "مقدار YTD الزامی است." });
  }

  DepartmentGoalModel.updateYTD(id, ytd, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// ✅ ویرایش کامل هدف دپارتمان
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updatedGoal = req.body;

  DepartmentGoalModel.update(id, updatedGoal, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// ✅ حذف هدف دپارتمان
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  DepartmentGoalModel.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

module.exports = router;
