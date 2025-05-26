

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// install if you don't have it: npm install node-fetch

const app = express();
app.use(cors());
app.use(bodyParser.json());

const OPENROUTER_API_KEY = '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'; // Replace with your OpenRouter API key
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';


app.post("/chat", async (req, res) => {
  const userMsg = req.body.message;
  console.log("📩 /chat route was hit. Message:", userMsg);


  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",  // OpenRouter’s free GPT-4 mini model
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
