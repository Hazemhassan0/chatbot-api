import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
    });
    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat error" });
  }
});

app.post("/api/image", async (req, res) => {
  try {
    const { prompt } = req.body;
    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "512x512",
    });
    res.json({ imageUrl: result.data[0].url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image generation error" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));