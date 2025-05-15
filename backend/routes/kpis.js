const express = require('express');
const router = express.Router();
const KPIModel = require('../models/KPIModel');

// دریافت همه KPIها
router.get('/', (req, res) => {
  KPIModel.getAll((err, rows) => {
    if (err) {
      console.error('خطا در دریافت KPIها:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(rows);
  });
});

// افزودن KPI جدید بدون target
router.post('/', (req, res) => {
  const { name, unit, formula } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "عنوان الزامی است" });
  }

  const newKpi = {
    name: name.trim(),
    unit: unit?.trim() || "",
    formula: formula?.trim() || ""
  };

  KPIModel.add(newKpi, (err, saved) => {
    if (err) {
      console.error('خطا در افزودن KPI:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json(saved);
  });
});

// حذف KPI با تأیید وجود شناسه
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "شناسه نامعتبر است" });
  }

  KPIModel.delete(id, (err, result) => {
    if (err) {
      console.error('خطا در حذف KPI:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "KPI با موفقیت حذف شد", result });
  });
});

module.exports = router;
