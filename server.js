import express from "express";
import cors from "cors";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/generate-3d", async (req, res) => {
  try {
    const { prompt, planImage } = req.body;

    if (!planImage) {
      return res.status(400).json({
        error: "Image du plan manquante."
      });
    }

    const base64Data = planImage.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    const imagePath = path.join("/tmp", "plan-cuisine.jpg");
    fs.writeFileSync(imagePath, imageBuffer);

    const result = await openai.images.edit({
      model: "gpt-image-1",
      image: fs.createReadStream(imagePath),
      prompt: prompt,
      size: "1024x1024"
    });

    res.json({
      image: result.data[0].b64_json
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
});

app.get("/", (req, res) => {
  res.send("Kitchen AI backend OK");
});

app.listen(process.env.PORT || 3000);
