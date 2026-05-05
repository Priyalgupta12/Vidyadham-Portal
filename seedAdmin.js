import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { OPENROUTER_MODEL } from '../config/ai.js';

const router = express.Router();

// All chat routes require admin authentication
router.use(protect);

// System prompt with Vidyadham context
const SYSTEM_PROMPT = `You are **Vidya** — the intelligent AI assistant for **Vidyadham School Admin Portal**.

## Your Role
You help the school administrator manage daily operations efficiently. You are friendly, concise, and professional.

## What You Know About Vidyadham
- Vidyadham is a school management system with an admin portal
- The portal manages: **Teachers**, **Drivers**, and **Vehicles**
- Teachers have: name, email, subject, phone, availability
- Drivers have: name, phone, license type, availability
- Vehicles have: vehicle number, type, capacity, fuel type
- The admin can add, view, and delete teachers/drivers/vehicles from the dashboard
- Schedule generation (AI-powered timetables & transport assignments) is planned

## What You Can Help With
- Answering questions about how to use the admin portal
- Best practices for school management & scheduling
- Suggestions for organizing teachers, classes, and transport
- General education administration advice
- Technical guidance about the portal features

## How You Should Respond
- Keep responses concise (2-4 paragraphs max unless asked for detail)
- Use bullet points and formatting for clarity
- Be warm and use the school's name "Vidyadham" naturally
- If asked something outside school management, politely redirect
- Use emojis sparingly for a friendly tone 📚`;

// POST /api/chat — Send a message to the AI
router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'Messages array is required' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        message: 'AI service not configured. Please add OPENROUTER_API_KEY to your environment.',
      });
    }

    // Build the messages payload with system prompt
    const payload = {
      model: OPENROUTER_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ],
      max_tokens: 1024,
      temperature: 0.7,
    };

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://vidyadham.app',
        'X-Title': 'Vidyadham Admin Portal',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', response.status, errorData);
      return res.status(502).json({
        message: 'AI service temporarily unavailable. Please try again.',
      });
    }

    const data = await response.json();

    const assistantMessage =
      data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

    res.json({
      reply: assistantMessage,
      usage: data.usage || null,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Failed to process chat request' });
  }
});

export default router;
