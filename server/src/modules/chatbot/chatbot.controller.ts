import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../../config/db';
import { db } from '../../config/firebase';
import admin from 'firebase-admin';

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

        // Save to Firestore
        let finalSessionId = sessionId;
        const newMessageUser = { role: 'user', content: message, timestamp: new Date().toISOString() };
        const newMessageAssistant = { role: 'assistant', content: reply, timestamp: new Date().toISOString() };

        if (sessionId) {
            const sessionRef = db.collection('chat_sessions').doc(sessionId);
            await sessionRef.update({
                messages: admin.firestore.FieldValue.arrayUnion(newMessageUser, newMessageAssistant),
                updatedAt: new Date().toISOString()
            });
        } else {
            const newSession = {
                userId: req.user?.id || null,
                language,
                messages: [newMessageUser, newMessageAssistant],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            const docRef = await db.collection('chat_sessions').add(newSession);
            finalSessionId = docRef.id;
        }

        res.json({ reply, sessionId: finalSessionId });
    } catch (error: any) {
        console.error('Gemini Error:', error);
        res.status(500).json({ message: error.message });
    }
};
