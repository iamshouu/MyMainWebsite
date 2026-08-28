
import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Allow', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not supported' });
    return;
  }

  try {
    const messages = req.body?.messages;
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
      res.status(400).json({ error: 'Messages must be a non-empty array with at most 20 items' });
      return;
    }

    const normalizedMessages = messages.map((message) => ({
      role: message?.role === 'model' ? 'model' : 'user',
      text: typeof message?.text === 'string' ? message.text.trim().slice(0, 2000) : '',
    }));
    if (normalizedMessages.some((message) => !message.text)) {
      res.status(400).json({ error: 'Every message must contain text' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      res.status(503).json({ error: 'AI service is not configured' });
      return;
    }

    const ai = new GoogleGenAI({ apiKey });

    // Convert message history to the format expected by the SDK
    const contents = normalizedMessages.map((message) => ({
      role: message.role,
      parts: [{ text: message.text }]
    }));

    // Use ai.models.generateContent with standard model name and prompt configuration
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: `You are Shou AI, a specialized assistant to the professional trader Danya.shou. 
Your Rules:
1. Topics: Trading, Crypto, Finance, Market Psychology, Smart Money, Price Action.
2. Answering off-topic queries (domestic issues, food, politics) is FORBIDDEN. Politely remind the user of your specialization.
3. Style: Professional, concise, disciplined, with a "cold" analytical mind.
4. Language: Always respond in English.
5. Do not provide financial advice; offer only analysis and educational insights based on Danya.shou's methods.`,
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      },
    });

    // Extract text output from GenerateContentResponse using the .text property as recommended
    res.status(200).json({ text: response.text });

  } catch (error) {
    console.error("Proxy Crash:", error);
    res.status(500).json({ error: 'Internal proxy error' });
  }
}
