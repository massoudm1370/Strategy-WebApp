const express = require('express');
const router = express.Router();
const axios = require('axios');

// مسیر هشدارهای AI برای اهداف استراتژیک
router.get('/keyresults/alerts', async (req, res) => {
  try {
    const db = req.db;

    // دریافت Key Results با درصد موفقیت کمتر از 50
    const keyResults = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM key_results WHERE successPercentage < 50", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    if (!keyResults.length) {
      return res.json({ alerts: "✅ همه اهداف عملکرد خوبی دارند و هشدار خاصی وجود ندارد." });
    }

    // فراخوانی OpenAI برای ایجاد هشدار
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
            content: `اهداف زیر پیشرفت کمتر از 50 درصد دارند:\n${keyResults.map(
              (kr) => `- ${kr.title}: ${kr.successPercentage}%`
            ).join('\n')}\nلطفاً یک پیام هشدار کوتاه و کاربردی برای مدیر استراتژیک تولید کن.`,
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
