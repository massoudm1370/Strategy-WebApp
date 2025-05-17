const express = require('express');
const router = express.Router();
const axios = require('axios');

const openRouterModelUrl = 'https://openrouter.ai/api/v1/chat/completions';
const openRouterApiKey = process.env.OPENROUTER_API_KEY;

// 📌 تابع آماده سازی هدر
const prepareHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${openRouterApiKey}`
});

// 📌 تابع درخواست به OpenRouter
const requestOpenRouter = async (prompt) => {
  const response = await axios.post(
    openRouterModelUrl,
    {
      model: "mistralai/mistral-7b-instruct",
      messages: [{ role: "user", content: prompt }]
    },
    { headers: prepareHeaders(), timeout: 20000 }
  );
  return response.data;
};

// 📌 مسیر هشدار Key Results
router.get('/keyresults/alerts', async (req, res) => {
  try {
    const db = req.db;

    const keyResults = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM key_results WHERE successPercentage < 50", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    if (!keyResults.length) {
      return res.json({ alerts: [] });
    }

    const userPrompt = `Key Results زیر درصد موفقیت کمتر از 50 دارند:\n${keyResults.map(
      (kr) => `- ${kr.title}: ${kr.successPercentage}%`
    ).join('\n')}\nلطفاً یک پیام هشدار کوتاه و کاربردی برای مدیر استراتژیک ایجاد کن.`;

    const aiResponse = await requestOpenRouter(userPrompt);

    res.json({ alerts: aiResponse });

  } catch (error) {
    console.error("❌ خطا در /keyresults/alerts:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
