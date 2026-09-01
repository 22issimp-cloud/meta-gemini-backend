import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Uses standard Google AI initialization architecture
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/ask', async (req, res) => {
    try {
        const { prompt } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({ text: response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to process text request" });
    }
});

app.post('/api/vision', async (req, res) => {
    try {
        const { base64Image, prompt } = req.body;
        const cleanedBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const imagePart = {
            inlineData: {
                data: cleanedBase64,
                mimeType: "image/jpeg"
            },
        };

        const result = await model.generateContent([
            prompt || "Describe what you see in 2 concise sentences.",
            imagePart
        ]);
        const response = await result.response;
        res.json({ text: response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to process vision request" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server live on port ${PORT}`));
