// routes/aiAlerts.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/keyresults/alerts', async (req, res) => {
  try {
    const db = req.db;

    // دریافت تمام Key Results با درصد موفقیت کمتر از 50
    const keyResults = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM key_results WHERE successPercentage < 50", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    if (!keyResults.length) {
      return res.json({ alerts: [] });
    }

    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: 'شما یک دستیار مدیریت استراتژیک هستید که هشدارهایی برای Key Results با عملکرد پایین ارائه می‌دهید.',
          },
          {
            role: 'user',
            content: `Key Results زیر درصد موفقیت کمتر از 50 دارند:\n${keyResults.map(
              (kr) => `- ${kr.title}: ${kr.successPercentage}%`
            ).join('\n')}\nلطفاً یک پیام هشدار کوتاه و کاربردی برای مدیر استراتژیک ایجاد کن.`,
          },
        ],
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
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
