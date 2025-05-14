const express = require('express');
const router = express.Router();
const StrategyModel = require('../models/StrategyModel');

// دریافت اطلاعات استراتژی
router.get('/', (req, res) => {
  try {
    const strategy = StrategyModel.get();
    res.json(strategy || { vision: "", mission: "", core_values: "" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ذخیره اطلاعات استراتژی
router.post('/', (req, res) => {
  try {
    const { vision, mission, core_values } = req.body;
    const result = StrategyModel.save({ vision, mission, core_values });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
