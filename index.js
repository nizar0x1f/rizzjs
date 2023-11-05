const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const OpenAI = require('openai');
const path = require('path');
const dotenv = require('dotenv');


const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
	// baseURL: process.env.OPENAI_BASE_URL ,
});

const upload = multer({ dest: 'uploads/' });
const app = express();

app.post('/api/pickupline', upload.single('image'), async (req, res) => {
    try {
        const { data: { text } } = await Tesseract.recognize(req.file.path, 'eng');
        const gpt4Response = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "Rizz” is derived from “charisma” — or someone who has “game” when it comes to romantic pursuits. For example, someone would say that “Taylor has rizz” if they’re very charming. " },
                { role: "system", content: "You are RIZZGPT, a language model trained to generate short, flirty, rizzy, and cheesy introductory messages for potential matches on OkCupid. The messages should be very short (max 6 words), possibly include an emoji, and be very flirty (flirtiness score: 9)." },   
                { role: "user", content: `The profile says: "${text}".` }
            ],
            model: "gpt-4",
        });
        res.json({ message: gpt4Response.choices[0].message.content });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(3000, () => console.log('Server started on port 3000'));