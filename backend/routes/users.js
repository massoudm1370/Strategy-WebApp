const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');

// 🛠️ Debug - نمایش همه کاربران در لاگ
router.get('/debug/all', (req, res) => {
  try {
    const users = UserModel.getAllSync();
    console.log("🟢 کاربران موجود در دیتابیس:", users);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// دریافت همه کاربران
router.get('/', (req, res) => {
  try {
    const users = UserModel.getAllSync();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// افزودن کاربر جدید
router.post('/', (req, res) => {
  try {
    const user = UserModel.addSync(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// به‌روزرسانی کاربر
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const user = UserModel.updateSync(id, req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// حذف کاربر
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = UserModel.deleteSync(id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ورود به سیستم
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'نام کاربری و رمز عبور الزامی است.' });
    }

    const user = UserModel.authenticateSync(username, password);
    if (!user) {
      return res.status(401).json({ error: 'نام کاربری یا رمز عبور نادرست است.' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
