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
  console.log("📥 داده دریافتی:", req.body);  // لاگ برای بررسی داده دریافتی

  const {
    title,
    target,
    failure,
    currentStatus,
    ytd,
    year,
    half,
    calculationMethod,
    weight,
    unit,
    definitionOfDone
  } = req.body;

  if (!title) {
    return res.status(400).json({ error: "عنوان الزامی است" });
  }

  GoalModel.add({
    title,
    target,
    failure,
    currentStatus,
    ytd,
    year,
    half,
    calculationMethod,
    weight,
    unit,
    definitionOfDone
  }, (err, saved) => {
    if (err) {
      console.error('❌ خطا در ذخیره هدف:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(saved);
  });
});

// ✅ ویرایش کامل هدف
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const updatedGoal = req.body;

  console.log("📝 به‌روزرسانی هدف:", id, updatedGoal);  // لاگ برای بررسی به‌روزرسانی

  GoalModel.update(id, updatedGoal, (err, result) => {
    if (err) {
      console.error('❌ خطا در به‌روزرسانی هدف:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

// ✅ حذف هدف
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);  // ✅ تبدیل به عدد
  console.log('🗑️ در حال حذف هدف با شناسه:', id);  // ✅ لاگ اضافه شده
  GoalModel.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});


module.exports = router;
