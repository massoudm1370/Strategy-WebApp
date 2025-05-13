const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');
router.get('/debug/all', (req, res) => {
  UserModel.getAll((err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    console.log("🟢 کاربران موجود در دیتابیس:", users);  // لاگ به کنسول
    res.json(users);
  });
});

// دریافت همه کاربران
router.get('/', (req, res) => {
  UserModel.getAll((err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(users);
  });
});

// افزودن کاربر جدید
router.post('/', (req, res) => {
  UserModel.add(req.body, (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(user);
  });
});

// به‌روزرسانی کاربر
router.put('/:id', (req, res) => {
  const { id } = req.params;
  UserModel.update(id, req.body, (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(user);
  });
});

// حذف کاربر
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  UserModel.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// ✅ مسیر ورود به سیستم
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'نام کاربری و رمز عبور الزامی است.' });
  }

  UserModel.authenticate(username, password, (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'نام کاربری یا رمز عبور نادرست است.' });
    res.json(user);
  });
});

module.exports = router;
