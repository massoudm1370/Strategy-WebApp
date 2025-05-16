const express = require('express');
const router = express.Router();
const axios = require('axios');

// مسیر هشدار اهداف سازمانی
router.get('/goals/alerts', async (req, res) => {
  try {
    const db = req.db;
    const stmt = db.prepare("SELECT id, title, currentStatus AS successPercentage FROM goals WHERE currentStatus < 50");
    const keyResults = stmt.all();

    if (!keyResults.length) {
      return res.json({ alerts: "✅ همه اهداف سازمانی در وضعیت مناسبی هستند." });
    }

    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-turbo',
        messages: [{
          role: 'system',
          content: 'شما یک دستیار مدیریت استراتژیک هستید که هشدارهایی برای اهداف سازمانی با عملکرد پایین ارائه می‌دهید.'
        }, {
          role: 'user',
          content: `اهداف زیر کمتر از 50 درصد پیشرفت داشته‌اند:\n${keyResults.map(kr => `- ${kr.title}: ${kr.successPercentage}%`).join('\n')}`
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    res.json({ alerts: openaiResponse.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// مسیر هشدار اهداف دپارتمانی
router.get('/department-goals/alerts', async (req, res) => {
  try {
    const db = req.db;
    const stmt = db.prepare("SELECT id, keyResult AS title, finalAchievement AS successPercentage FROM department_goals WHERE finalAchievement < 50");
    const keyResults = stmt.all();

    if (!keyResults.length) {
      return res.json({ alerts: "✅ همه اهداف دپارتمانی در وضعیت مناسبی هستند." });
    }

    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-turbo',
        messages: [{
          role: 'system',
          content: 'شما یک دستیار مدیریت استراتژیک هستید که هشدارهایی برای اهداف دپارتمانی با عملکرد پایین ارائه می‌دهید.'
        }, {
          role: 'user',
          content: `اهداف زیر کمتر از 50 درصد پیشرفت داشته‌اند:\n${keyResults.map(kr => `- ${kr.title}: ${kr.successPercentage}%`).join('\n')}`
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    res.json({ alerts: openaiResponse.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
