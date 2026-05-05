import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { OPENROUTER_MODEL } from '../config/ai.js';

const router = express.Router();

// All routes require admin authentication
router.use(protect);

// System prompt for Teacher Assistant
const TEACHER_ASSISTANT_PROMPT = `You are an expert **Teacher Assistant AI** for **Vidyadham School**.

## Your Capabilities
1. **Generate Assignments** — Create well-structured questions for any subject, topic, and grade level
2. **Evaluate Answers** — Assess student answers, give scores, and provide detailed feedback
3. **Suggest Improvements** — Recommend how to improve questions, assignments, and teaching approaches

## Response Format
Always respond with a valid JSON object matching the requested action. Do NOT include markdown code fences or any extra text outside the JSON.

### For "generate" action:
{
  "title": "Assignment title",
  "subject": "Subject name",
  "grade": "Grade/Class level",
  "topic": "Topic name",
  "totalMarks": 50,
  "duration": "1 hour",
  "difficulty": "Easy/Medium/Hard/Mixed",
  "questions": [
    {
      "questionNumber": 1,
      "question": "Full question text",
      "type": "MCQ/Short Answer/Long Answer/True-False/Fill in the Blanks",
      "marks": 5,
      "difficulty": "Easy/Medium/Hard",
      "answerKey": "Model answer or correct option",
      "rubric": "How to evaluate this answer"
    }
  ],
  "instructions": ["Instruction 1", "Instruction 2"]
}

### For "evaluate" action:
{
  "overallScore": 35,
  "totalMarks": 50,
  "percentage": 70,
  "grade": "B+",
  "evaluations": [
    {
      "questionNumber": 1,
      "marksAwarded": 4,
      "maxMarks": 5,
      "feedback": "Detailed feedback",
      "strength": "What was done well",
      "improvement": "What could be better"
    }
  ],
  "overallFeedback": "Summary feedback",
  "strengths": ["Strength 1"],
  "areasForImprovement": ["Area 1"],
  "recommendations": ["Recommendation 1"]
}

### For "improve" action:
{
  "originalQuestion": "The original question",
  "analysis": {
    "currentDifficulty": "Easy/Medium/Hard",
    "bloomsLevel": "Remember/Understand/Apply/Analyze/Evaluate/Create",
    "clarity": "Score out of 10",
    "issues": ["Issue 1"]
  },
  "improvedVersions": [
    {
      "version": "Improved question text",
      "difficulty": "Medium",
      "bloomsLevel": "Apply",
      "explanation": "Why this version is better"
    }
  ],
  "markingScheme": {
    "suggestedMarks": 5,
    "distribution": "How to distribute marks"
  },
  "tips": ["Teaching tip 1"]
}`;

// POST /api/teacher-assistant/generate — Generate assignment
router.post('/generate', async (req, res) => {
  try {
    const { subject, topic, grade, numberOfQuestions, difficulty, questionTypes } = req.body;

    if (!subject || !topic) {
      return res.status(400).json({ message: 'Subject and topic are required' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'AI service not configured' });
    }

    const userPrompt = `Generate an assignment with these specifications:
- Subject: ${subject}
- Topic: ${topic}
- Grade/Class: ${grade || 'Not specified'}
- Number of Questions: ${numberOfQuestions || 5}
- Difficulty Level: ${difficulty || 'Mixed'}
- Question Types: ${questionTypes || 'Mix of MCQ, Short Answer, and Long Answer'}

Create a comprehensive, well-structured assignment. Respond ONLY with the JSON object, no markdown fences.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://vidyadham.app',
        'X-Title': 'Vidyadham Teacher Assistant',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: TEACHER_ASSISTANT_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 4096,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('AI API error:', response.status, errorData);
      return res.status(502).json({ message: 'AI service temporarily unavailable' });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Parse the JSON response - strip markdown fences if present
    let parsed;
    try {
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleanContent);
    } catch {
      // If parsing fails, return raw content
      parsed = { raw: content, parseError: true };
    }

    res.json({ result: parsed, action: 'generate' });
  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ message: 'Failed to generate assignment' });
  }
});

// POST /api/teacher-assistant/evaluate — Evaluate student answers
router.post('/evaluate', async (req, res) => {
  try {
    const { questions, answers } = req.body;

    if (!questions || !answers) {
      return res.status(400).json({ message: 'Questions and answers are required' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'AI service not configured' });
    }

    const userPrompt = `Evaluate the following student answers:

Questions and Answer Keys:
${questions}

Student's Answers:
${answers}

Provide detailed evaluation with scores, feedback, strengths, and areas for improvement. Respond ONLY with the JSON object, no markdown fences.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://vidyadham.app',
        'X-Title': 'Vidyadham Teacher Assistant',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: TEACHER_ASSISTANT_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 4096,
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      return res.status(502).json({ message: 'AI service temporarily unavailable' });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    let parsed;
    try {
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleanContent);
    } catch {
      parsed = { raw: content, parseError: true };
    }

    res.json({ result: parsed, action: 'evaluate' });
  } catch (error) {
    console.error('Evaluate error:', error);
    res.status(500).json({ message: 'Failed to evaluate answers' });
  }
});

// POST /api/teacher-assistant/improve — Suggest improvements for questions
router.post('/improve', async (req, res) => {
  try {
    const { question, subject, targetDifficulty } = req.body;

    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'AI service not configured' });
    }

    const userPrompt = `Analyze and improve this question:

Question: "${question}"
Subject: ${subject || 'Not specified'}
Target Difficulty: ${targetDifficulty || 'Medium'}

Provide analysis, improved versions, marking scheme, and teaching tips. Respond ONLY with the JSON object, no markdown fences.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://vidyadham.app',
        'X-Title': 'Vidyadham Teacher Assistant',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: TEACHER_ASSISTANT_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 3072,
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      return res.status(502).json({ message: 'AI service temporarily unavailable' });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    let parsed;
    try {
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleanContent);
    } catch {
      parsed = { raw: content, parseError: true };
    }

    res.json({ result: parsed, action: 'improve' });
  } catch (error) {
    console.error('Improve error:', error);
    res.status(500).json({ message: 'Failed to analyze question' });
  }
});

export default router;
