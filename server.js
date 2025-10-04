require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
});

app.post('/api/chat', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const stream = await openai.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [{ role: 'user', content: prompt }],
            stream: true,
        });

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        for await (const chunk of stream) {
            if (chunk.choices[0]?.delta?.content) {
                res.write(`data: ${JSON.stringify(chunk.choices[0].delta.content)}\n\n`);
            }
        }

        res.end();
    } catch (error) {
        console.error('Error calling Groq API:', error);
        res.status(500).json({ error: 'Failed to fetch response from Groq API' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});