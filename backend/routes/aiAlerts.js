const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();
console.log('HUGGINGFACE_API_KEY:', process.env.HUGGINGFACE_API_KEY ? '✅ Loaded' : '❌ Not Loaded');

const useAI = process.env.USE_AI_ALERTS === 'true';
const huggingFaceModelUrl = 'https://api-inference.huggingface.co/models/gpt2'; // یا هر مدل دلخواه

// 📌 مسیر هشدار اهداف سازمانی
router.get('/goals/alerts', async (req, res) => {
  try {
    const db = req.db;
    const stmt = db.prepare("SELECT id, title, currentStatus FROM goals WHERE currentStatus < 50");
    const keyResults = stmt.all();

    if (!keyResults.length) {
      return res.json({ alerts: "✅ همه اهداف سازمانی در وضعیت مناسبی هستند." });
    }

    if (useAI) {
      const aiPrompt = `اهداف زیر کمتر از 50 درصد پیشرفت داشته‌اند:\n${keyResults.map(kr => `- ${kr.title}: ${kr.currentStatus}%`).join('\n')}`;
      const huggingFaceResponse = await axios.post(
        huggingFaceModelUrl,
        { inputs: aiPrompt },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(process.env.HUGGINGFACE_API_KEY && { 'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}` })
          },
          timeout: 10000
        }
      );
      return res.json({ alerts: huggingFaceResponse.data });
    }

    const message = `اهداف زیر کمتر از 50% پیشرفت داشته‌اند:\n${keyResults.map(kr => `- ${kr.title}: ${kr.currentStatus}%`).join('\n')}`;
    res.json({ alerts: message });

  } catch (error) {
    console.error("❌ خطای داخلی در /goals/alerts:", error.message);
    res.status(500).json({ error: "خطای داخلی سرور" });
  }
});

// 📌 مسیر هشدار اهداف دپارتمانی
router.get('/department-goals/alerts', async (req, res) => {
  try {
    const db = req.db;
    const stmt = db.prepare("SELECT id, keyResult, finalAchievement FROM department_goals WHERE finalAchievement < 50");
    const keyResults = stmt.all();

    if (!keyResults.length) {
      return res.json({ alerts: "✅ همه اهداف دپارتمانی در وضعیت مناسبی هستند." });
    }

    if (useAI) {
      const aiPrompt = `اهداف زیر کمتر از 50 درصد پیشرفت داشته‌اند:\n${keyResults.map(kr => `- ${kr.keyResult}: ${kr.finalAchievement}%`).join('\n')}`;
      const huggingFaceResponse = await axios.post(
        huggingFaceModelUrl,
        { inputs: aiPrompt },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(process.env.HUGGINGFACE_API_KEY && { 'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}` })
          },
          timeout: 10000
        }
      );
      return res.json({ alerts: huggingFaceResponse.data });
    }

    const message = `اهداف زیر کمتر از 50% پیشرفت داشته‌اند:\n${keyResults.map(kr => `- ${kr.keyResult}: ${kr.finalAchievement}%`).join('\n')}`;
    res.json({ alerts: message });

  } catch (error) {
    console.error("❌ خطای داخلی در /department-goals/alerts:", error.message);
    res.status(500).json({ error: "خطای داخلی سرور" });
  }
});

// 📌 مسیر تست مستقیم Hugging Face
router.get('/test-openai', async (req, res) => {
  try {
    const response = await axios.post(
      huggingFaceModelUrl,
      { inputs: "Hello from DigiExpress" },
      {
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.HUGGINGFACE_API_KEY && { 'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}` })
        },
        timeout: 10000
      }
    );

    res.json({ reply: response.data });
  } catch (error) {
    console.error("❌ Error contacting Hugging Face:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
