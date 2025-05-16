// routes/aiAlerts.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

const huggingFaceModelUrl = 'https://api-inference.huggingface.co/models/google/flan-t5-small';
const huggingFaceApiKey = process.env.HUGGINGFACE_API_KEY;

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

    const huggingFaceResponse = await axios.post(
      huggingFaceModelUrl,
      { inputs: userPrompt },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${huggingFaceApiKey}`,
        },
        timeout: 20000,
      }
    );

    res.json({ alerts: huggingFaceResponse.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
