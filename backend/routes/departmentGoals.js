const express = require('express');
const router = express.Router();
const DepartmentGoalModel = require('../models/DepartmentGoalModel');

// دریافت همه اهداف دپارتمانی
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

// افزودن هدف جدید
router.post('/', (req, res) => {
  const goal = req.body;
  DepartmentGoalModel.add(goal, (err, saved) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(saved);
  });
});

// به‌روزرسانی YTD
router.post('/update-ytd', (req, res) => {
  const { id, ytd } = req.body;
  DepartmentGoalModel.updateYTD(id, ytd, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

module.exports = router;
