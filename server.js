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

        const response = await openai.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [{ role: 'user', content: prompt }],
        });

        res.json(response.choices[0].message);
    } catch (error) {
        console.error('Error calling Groq API:', error);
        res.status(500).json({ error: 'Failed to fetch response from Groq API' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});