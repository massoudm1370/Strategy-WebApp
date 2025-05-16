const express = require('express');
const router = express.Router();
const CollaborationModel = require('../models/CollaborationModel');
const multer = require('multer');
const path = require('path');

// تنظیمات ذخیره فایل در پوشه uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // پوشه uploads در ریشه پروژه backend
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// دریافت همه یادداشت‌ها
router.get('/', (req, res) => {
  try {
    const notes = CollaborationModel.getAll();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// افزودن یادداشت جدید همراه با فایل (در صورت وجود)
router.post('/', upload.single('file'), (req, res) => {
  try {
    const { text, recipient } = req.body;
    const fileName = req.file ? req.file.filename : null;

    const note = { text, recipient, fileName };
    const savedNote = CollaborationModel.add(note);

    res.json(savedNote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// حذف یادداشت
router.delete('/:id', (req, res) => {
  try {
    CollaborationModel.remove(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
