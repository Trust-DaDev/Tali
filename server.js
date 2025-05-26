const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // Make sure node-fetch v2 is installed

const app = express();
app.use(cors());
app.use(bodyParser.json());

const OPENROUTER_API_KEY = "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"; // ideally from env
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

app.post("/chat", async (req, res) => {
  const userMsg = req.body.message;
  console.log("📩 /chat route was hit. Message:", userMsg);

  if (!OPENROUTER_API_KEY) {
    console.error("❌ OPENROUTER_API_KEY is not set!");
    return res.status(500).json({ reply: "Server error: API key not configured." });
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: userMsg }]
      }),
    });

    const data = await response.json();
    console.log("OpenRouter API response:", JSON.stringify(data, null, 2));

    if (data.choices && data.choices.length > 0) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      res.status(500).json({ reply: "No response from OpenRouter." });
    }

  } catch (err) {
    console.error("🔥 OpenRouter ERROR:", err);
    res.status(500).json({ reply: "Error getting response from OpenRouter." });
  }
});

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
