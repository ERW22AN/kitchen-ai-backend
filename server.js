import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/generate-3d", async (req, res) => {
  try {
    const { prompt, planImage } = req.body;

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024"
    });

    res.json({
      image: result.data[0].b64_json
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

app.get("/", (req, res) => {
  res.send("Kitchen AI backend OK");
});

app.listen(process.env.PORT || 3000);
