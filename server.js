import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/generative-ai';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Correct initialization for the current SDK setup
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/ask', async (req, res) => {
    try {
        const { prompt } = req.body;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        res.json({ text: response.text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch response from Gemini." });
    }
});

app.post('/api/vision', async (req, res) => {
    try {
        const { base64Image, prompt } = req.body;
        const cleanedBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                prompt || "Describe what you see in 2 concise sentences.",
                { inlineData: { mimeType: "image/jpeg", data: cleanedBase64 } }
            ],
        });
        res.json({ text: response.text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Vision error." });
    }
});

// Explicitly use port 10000 or the environment fallback for cloud environments
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Running on port ${PORT}`));
