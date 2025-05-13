const express = require('express');
const router = express.Router();
const StrategyModel = require('../models/StrategyModel');

// دریافت اطلاعات استراتژی
router.get('/', (req, res) => {
  StrategyModel.get((err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row || { vision: "", mission: "", core_values: "" });
  });
});

// ذخیره اطلاعات استراتژی
router.post('/', (req, res) => {
  const { vision, mission, core_values } = req.body;
  StrategyModel.save({ vision, mission, core_values }, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

module.exports = router;
