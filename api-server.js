const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Server check
app.get("/", (req, res) => {
  res.json({
    status: "FitAI Smart API is running",
  });
});

// AI Coach API — uses local Ollama, not OpenAI
app.post("/api/coach", async (req, res) => {
  try {
    const { query, message } = req.body;
const userMessage = message || query;

    const ollamaResponse = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.2:1b",
        options: {
  num_predict: 100
},
        stream: false,
        messages: [
          {
            role: "system",
            content:
              "You are FitAI Smart, a friendly fitness coach. Give safe, short, practical fitness guidance. For injuries, severe pain, or medical conditions, advise the user to consult a doctor.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    if (!ollamaResponse.ok) {
      throw new Error("Ollama response failed");
    }

    const data = await ollamaResponse.json();

    res.json({
      reply: data.message.content,
    });
  } catch (error) {
    console.error("Coach error:", error.message);

    res.status(500).json({
      reply: "AI Coach இப்போ connect ஆகவில்லை. Ollama open ஆக இருக்கிறதா check பண்ணு.",
    });
  }
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`FitAI API running at http://localhost:${PORT}`);
});