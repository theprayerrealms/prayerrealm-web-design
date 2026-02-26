import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../../config/db';
import { ChatSession } from './chatbot.model';

const genAI = new GoogleGenerativeAI(config.GEMINI.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const handleChat = async (req: any, res: Response) => {
    const { message, sessionId, language = 'en' } = req.body;

    try {
        const systemPrompt = `You are a helpful Christian prayer assistant for Prayer Realm. Respond in ${language}. Use biblical principles. Stay encouraging.`;

        const chat = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessage(`${systemPrompt}\n\nUser: ${message}`);
        const response = await result.response;
        const reply = response.text();

        // Save to DB
        let session;
        if (sessionId) {
            session = await ChatSession.findById(sessionId);
        }

        if (session) {
            session.messages.push({ role: 'user', content: message } as any);
            session.messages.push({ role: 'assistant', content: reply || '' } as any);
            await session.save();
        } else {
            session = await ChatSession.create({
                userId: req.user?._id,
                language,
                messages: [
                    { role: 'user', content: message },
                    { role: 'assistant', content: reply }
                ]
            });
        }

        res.json({ reply, sessionId: session._id });
    } catch (error: any) {
        console.error('Gemini Error:', error);
        res.status(500).json({ message: error.message });
    }
};
