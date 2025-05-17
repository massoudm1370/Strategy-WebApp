const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

console.log('OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY ? '✅ Loaded' : '❌ Not Loaded');

const useAI = process.env.USE_AI_ALERTS === 'true';
const openRouterModelUrl = 'https://openrouter.ai/api/v1/chat/completions';

const prepareHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
});

const requestOpenRouter = async (prompt) => {
  const response = await axios.post(
    openRouterModelUrl,
    {
      model: "openai/gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    },
    { headers: prepareHeaders(), timeout: 10000 }
  );
  return response.data;
};

// 📌 هشدار اهداف سازمانی
router.get('/goals/alerts', async (req, res) => {
  try {
    const db = req.db;
    const allGoals = db.prepare("SELECT id, title, currentStatus FROM goals").all();

    if (!allGoals.length) {
      return res.json({ alerts: "⚠️ هنوز هیچ هدفی ثبت نشده است." });
    }

    const riskyGoals = allGoals.filter(kr => kr.currentStatus < 40);

    if (!riskyGoals.length) {
      return res.json({ alerts: "✅ همه اهداف سازمانی بالای 40 درصد هستند." });
    }

    const list = riskyGoals
      .map(kr => `**${kr.title} (${kr.currentStatus}%)**`)
      .join('\n');

    const prompt = `بر اساس داده‌های زیر، برای هر هدف یک هشدار کوتاه بنویس که با عنوان هدف و درصد به صورت Bold شروع شود و در ادامه یک اقدام پیشنهادی ارائه شود. هر هشدار در یک خط جداگانه باشد.
داده‌ها:
${list}`;

    if (useAI) {
      const aiResponse = await requestOpenRouter(prompt);
      return res.json({ alerts: aiResponse });
    }

    res.json({ alerts: list });

  } catch (error) {
    console.error("❌ خطای داخلی در /goals/alerts:", error.message);
    res.status(500).json({ error: "خطای داخلی سرور" });
  }
});

// 📌 هشدار اهداف دپارتمانی
router.get('/department-goals/alerts', async (req, res) => {
  try {
    const db = req.db;
    const allDeptGoals = db.prepare("SELECT id, keyResult, finalAchievement FROM department_goals").all();

    if (!allDeptGoals.length) {
      return res.json({ alerts: "⚠️ هنوز هیچ هدفی ثبت نشده است." });
    }

    const riskyGoals = allDeptGoals.filter(kr => kr.finalAchievement < 40);

    if (!riskyGoals.length) {
      return res.json({ alerts: "✅ همه اهداف دپارتمانی بالای 40 درصد هستند." });
    }

    const list = riskyGoals
      .map(kr => `**${kr.keyResult} (${kr.finalAchievement}%)**`)
      .join('\n');

    const prompt = `بر اساس داده‌های زیر، برای هر هدف یک هشدار کوتاه بنویس که با عنوان هدف و درصد به صورت Bold شروع شود و در ادامه یک اقدام پیشنهادی ارائه شود. هر هشدار در یک خط جداگانه باشد.
داده‌ها:
${list}`;

    if (useAI) {
      const aiResponse = await requestOpenRouter(prompt);
      return res.json({ alerts: aiResponse });
    }

    res.json({ alerts: list });

  } catch (error) {
    console.error("❌ خطای داخلی در /department-goals/alerts:", error.message);
    res.status(500).json({ error: "خطای داخلی سرور" });
  }
});

// 📌 مسیر تست OpenRouter
router.get('/test-openrouter', async (req, res) => {
  try {
    const aiResponse = await requestOpenRouter("سلام، تست ارتباط از DigiExpress.");
    res.json({ reply: aiResponse });
  } catch (error) {
    console.error("❌ Error contacting OpenRouter:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
