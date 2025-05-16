const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ Loaded' : '❌ Not Loaded');

// کنترل فعال یا غیرفعال بودن ChatGPT از طریق متغیر محیطی
const useAI = process.env.USE_AI_ALERTS === 'true';

// مسیر هشدار اهداف سازمانی
router.get('/goals/alerts', async (req, res) => {
  try {
    const db = req.db;
    const stmt = db.prepare("SELECT id, title, currentStatus FROM goals WHERE currentStatus < 50");
    const keyResults = stmt.all();

    if (!keyResults.length) {
      return res.json({ alerts: "✅ همه اهداف سازمانی در وضعیت مناسبی هستند." });
    }

    if (useAI) {
      const openaiResponse = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4-turbo',
          messages: [
            { role: 'system', content: 'شما یک دستیار مدیریت استراتژیک هستید که هشدارهایی برای اهداف سازمانی با عملکرد پایین ارائه می‌دهد.' },
            { role: 'user', content: `اهداف زیر کمتر از 50 درصد پیشرفت داشته‌اند:\n${keyResults.map(kr => `- ${kr.title}: ${kr.currentStatus}%`).join('\n')}` }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          timeout: 10000
        }
      );
      return res.json({ alerts: openaiResponse.data.choices[0].message.content });
    }

    const message = `اهداف زیر کمتر از 50% پیشرفت داشته‌اند:\n${keyResults.map(kr => `- ${kr.title}: ${kr.currentStatus}%`).join('\n')}`;
    res.json({ alerts: message });

  } catch (error) {
    console.error("❌ خطای داخلی در /goals/alerts:", error.message);
    res.status(500).json({ error: "خطای داخلی سرور" });
  }
});

// مسیر هشدار اهداف دپارتمانی
router.get('/department-goals/alerts', async (req, res) => {
  try {
    const db = req.db;
    const stmt = db.prepare("SELECT id, keyResult, finalAchievement FROM department_goals WHERE finalAchievement < 50");
    const keyResults = stmt.all();

    if (!keyResults.length) {
      return res.json({ alerts: "✅ همه اهداف دپارتمانی در وضعیت مناسبی هستند." });
    }

    if (useAI) {
      const openaiResponse = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4-turbo',
          messages: [
            { role: 'system', content: 'شما یک دستیار مدیریت استراتژیک هستید که هشدارهایی برای اهداف دپارتمانی با عملکرد پایین ارائه می‌دهد.' },
            { role: 'user', content: `اهداف زیر کمتر از 50 درصد پیشرفت داشته‌اند:\n${keyResults.map(kr => `- ${kr.keyResult}: ${kr.finalAchievement}%`).join('\n')}` }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          timeout: 10000
        }
      );
      return res.json({ alerts: openaiResponse.data.choices[0].message.content });
    }

    const message = `اهداف زیر کمتر از 50% پیشرفت داشته‌اند:\n${keyResults.map(kr => `- ${kr.keyResult}: ${kr.finalAchievement}%`).join('\n')}`;
    res.json({ alerts: message });

  } catch (error) {
    console.error("❌ خطای داخلی در /department-goals/alerts:", error.message);
    res.status(500).json({ error: "خطای داخلی سرور" });
  }
});

module.exports = router;
