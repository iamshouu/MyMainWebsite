
import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // CORS Settings
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not supported' });
    return;
  }

  try {
    const { messages } = req.body;
    
    // Initialize the SDK using the required process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Convert message history to the format expected by the SDK
    const contents = messages.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.text }]
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
    res.status(500).json({ error: 'Internal proxy error', message: error.message });
  }
}
