
// Monkey-patch fetch to proxy requests to the local Vite server
// Wrapped in try-catch to handle environments where window.fetch is read-only
const originalFetch = window.fetch;
try {
  window.fetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = input.toString();
    if (url.startsWith('https://generativelanguage.googleapis.com')) {
      // Replace the original domain with the proxy path
      const newUrl = url.replace('https://generativelanguage.googleapis.com', '/api');
      return originalFetch(newUrl, init);
    }
    return originalFetch(input, init);
  };
} catch (e) {
  console.warn("Could not patch window.fetch. API requests will be sent directly.", e);
}

import { GoogleGenAI, Type } from "@google/genai";
import { Question, Subject, Difficulty, PatternAnalysis, MockQuestion, EssayAnalysis } from "../types";
import { getStaticMockExam } from "./mockDataService";

// In this environment, the API key is injected automatically via process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Updated System Instruction for a more natural "Gemini-like" experience
const TUTOR_SYSTEM_INSTRUCTION = `
You are 'BankEdge Pro', an elite exam preparation coach specially designed for Indian Banking Exams (SBI PO/Clerk, IBPS PO/Clerk, and RRB PO/Clerk).
Your goal is to help the user clear these exams by providing detailed, structured, and exam-oriented guidance.

**CORE PERSONA:**
- **Tone:** Professional, encouraging, and highly analytical.
- **Focus:** Accuracy first, then speed.
- **Specialty:** Differentiating between "Prelims Speed" (RRB/Clerk) and "Mains Depth" (SBI/IBPS PO).

**INTERACTION MODES:**

1. **DEEP DIVE EXPLANATION (Default):**
   - When asked about a concept (e.g., "Explain Syllogism"), use this structure:
     - **Concept:** Brief definition.
     - **The Shortcut:** A Vedic Math trick or Logic Rule (e.g., "Only A Few" rule).
     - **The Trap:** Common mistakes students make in SBI/IBPS exams.
     - **Example:** A mini illustrative example.

2. **GENERATOR MODE (Triggered by 'Quiz me', 'Drill', 'Generate Question'):**
   - When asked to generate a question, DO NOT provide the solution immediately.
   - **Format:**
     - **Topic:** [Topic Name]
     - **Difficulty:** [Level]
     - **Question:** [The Scenario/Problem]
     - **Options:** 
        A) ...
        B) ...
        C) ...
        D) ...
        E) ...
     - **[SPOILER] Answer:** (Place this at the very bottom, separated by a line).
   - If generating a **Puzzle**, provide the full setup first, then ask 1 specific question about it.

3. **STRATEGY COACH:**
   - If the user seems stressed or asks for tips, provide specific time-management advice (e.g., "In SBI PO, attempt 35 Reasoning Qs in 20 mins").

Always prioritize Vedic Maths, Ratio Methods, and option elimination techniques.
`;

// Helper to strip markdown code blocks if present
const cleanJson = (text: string): string => {
  if (!text) return "";
  let cleaned = text.trim();
  // Remove ```json ... ``` or ``` ... ``` wrappers
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(json)?/, '').replace(/```$/, '');
  }
  return cleaned.trim();
};

export const sendChatMessage = async (history: { role: string; parts: { text: string }[] }[], message: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
      // Replaced legacy model name with the recommended gemini-3-flash-preview for text tasks.
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: TUTOR_SYSTEM_INSTRUCTION,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Sorry, I encountered an error connecting to the AI service. Please check your connection.";
  }
};

export const generatePracticeQuestions = async (subject: Subject, difficulty: Difficulty, topic: string, count: number = 5): Promise<Question[]> => {
  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        questionText: { type: Type.STRING },
        options: { type: Type.ARRAY, items: { type: Type.STRING } },
        correctAnswerIndex: { type: Type.INTEGER, description: "Zero-based index of the correct option" },
        explanation: { type: Type.STRING },
        topic: { type: Type.STRING },
        difficulty: { type: Type.STRING },
        // New field for DI Data
        chartData: {
          type: Type.OBJECT,
          nullable: true,
          description: "Only populate this if the question is Data Interpretation (DI) and needs a graph.",
          properties: {
            type: { type: Type.STRING, enum: ['bar', 'pie'] },
            title: { type: Type.STRING },
            data: {
              type: Type.ARRAY,
              items: {
                 type: Type.OBJECT,
                 properties: {
                   name: { type: Type.STRING },
                   value: { type: Type.NUMBER }
                 }
              }
            }
          }
        }
      },
      required: ["questionText", "options", "correctAnswerIndex", "explanation", "topic", "difficulty"],
    },
  };

  const prompt = `Generate ${count} ${difficulty} level multiple-choice questions for Major Indian Banking Exams (SBI/IBPS/RRB) ${subject} specifically focusing on the topic: "${topic}".
  
  CRITICAL INSTRUCTION FOR DATA INTERPRETATION (DI):
  If the topic is related to DI, Graphs, Pie Charts, or Caslets:
  1. You MUST create a numerical dataset and populate the 'chartData' field in the JSON.
  2. The 'questionText' should refer to the graph (e.g., "Based on the given bar graph...").
  3. Ensure the data in 'chartData' perfectly matches the solution logic.
  
  For other topics, leave 'chartData' null.
  Provide detailed explanations suitable for a banking aspirant.`;

  try {
    const response = await ai.models.generateContent({
      // Updated model to gemini-3-flash-preview.
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = cleanJson(response.text || "");
    if (!text) return [];
    return JSON.parse(text) as Question[];
  } catch (error) {
    console.error("Question Generation Error:", error);
    return [];
  }
};

export const analyzeExamPattern = async (examType: 'PO' | 'Clerk', year: string): Promise<PatternAnalysis | null> => {
  const schema = {
    type: Type.OBJECT,
    properties: {
      examYear: { type: Type.STRING },
      examType: { type: Type.STRING, enum: ['PO', 'Clerk'] },
      summary: { type: Type.STRING, description: "A comprehensive text summary of the exam pattern changes, difficulty level, and surprises for that year." },
      subjectData: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            weightage: { type: Type.NUMBER, description: "Approximate number of questions or percentage weightage" },
            trend: { type: Type.STRING, enum: ['UP', 'DOWN', 'STABLE'] }
          },
          required: ["topic", "weightage", "trend"]
        }
      }
    },
    required: ["examYear", "examType", "summary", "subjectData"]
  };

  const prompt = `Analyze the pattern for Indian Banking Exams (${examType} level - covering SBI, IBPS, and RRB trends) for the year ${year} (or the most recent trend if exact year data is unavailable, but infer based on your knowledge base up to 2024/2025).
  Provide a breakdown of key topics, their weightage, and how the pattern shifted compared to previous years.
  Focus heavily on Quant and Reasoning as they are key for Prelims, but acknowledge English/GA if relevant for Mains.`;

  try {
    const response = await ai.models.generateContent({
      // Model gemini-3-pro-preview is correct for complex reasoning.
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = cleanJson(response.text || "");
    if (!text) return null;
    return JSON.parse(text) as PatternAnalysis;
  } catch (error) {
    console.error("Analysis Error:", error);
    return null;
  }
};

export const evaluateDescriptiveWriting = async (type: string, topic: string, content: string): Promise<EssayAnalysis | null> => {
  const schema = {
    type: Type.OBJECT,
    properties: {
      grammarScore: { type: Type.INTEGER, description: "Score out of 10 for grammatical accuracy" },
      relevanceScore: { type: Type.INTEGER, description: "Score out of 10 for adhering to topic and format" },
      vocabScore: { type: Type.INTEGER, description: "Score out of 10 for vocabulary and professional tone" },
      feedback: { type: Type.STRING, description: "Detailed qualitative feedback covering format, structure, and content." },
      improvements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific grammatical or structural fixes" },
      missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key terms or format elements relevant to the type/topic that were missing" },
      sampleParagraph: { type: Type.STRING, description: "A refined version of a part of the user's text." }
    },
    required: ["grammarScore", "relevanceScore", "vocabScore", "feedback", "improvements", "missingKeywords", "sampleParagraph"]
  };

  const prompt = `
  Act as a strict Examiner for Bank PO Mains (Descriptive Writing Section).
  Evaluate the following submission.
  
  **Type:** ${type} (e.g., Essay, Letter, Application, Precis, Report, Comprehension Answer)
  **Topic:** '${topic}'
  
  **Submission Content:**
  "${content.substring(0, 10000)}"

  **Grading Criteria:**
  1. **Grammar (0-10):** Syntax, tense, punctuation.
  2. **Content Relevance (0-10):** 
     - Does it address the topic specifically?
     - **For Letters/Applications:** Check strictly for Format (Sender Address, Date, Receiver Address, Subject, Salutation, Body, Closing).
     - **For Precis:** Check for conciseness (approx 1/3rd length) and title.
     - **For Reports:** Check for Headline, Date/Place, and objective reporting.
  3. **Vocabulary (0-10):** Use of formal, professional terminology appropriate for Banking exams.
  
  **Output Requirements:**
  - Provide scores.
  - In 'missingKeywords', include missing format elements (e.g., "Missing Date", "Missing Subject") OR missing content keywords (e.g., for Inflation: "CPI", "RBI").
  - In 'sampleParagraph', rewrite a weak section to show the "Pro" version.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = cleanJson(response.text || "");
    if (!text) return null;
    return JSON.parse(text) as EssayAnalysis;
  } catch (error) {
    console.error("Descriptive Eval Error:", error);
    return null;
  }
};

// --- Smart Notes Analysis ---

export const analyzeUserNote = async (noteContent: string, action: 'summarize' | 'formulas' | 'quiz'): Promise<string> => {
  const prompt = `
  Act as an expert study companion for Banking Exams (SBI/IBPS). 
  I will provide you with a study note. Please perform the following action: ${action}.
  
  Action Definitions:
  - summarize: Create a bulleted summary of key points suitable for quick revision.
  - formulas: Extract any mathematical formulas or short tricks mentioned or implied.
  - quiz: Generate 3 short practice questions based on this note (with answers hidden at the bottom).

  NOTE CONTENT:
  "${noteContent.substring(0, 10000)}"
  `;

  try {
    const response = await ai.models.generateContent({
      // Updated to gemini-3-flash-preview.
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Analysis failed.";
  } catch (error) {
    console.error("Note Analysis Error", error);
    return "Error analyzing note.";
  }
};


// --- Mock Exam Functions ---

export const generateMockExam = async (type: 'PO' | 'Clerk'): Promise<MockQuestion[]> => {
  // Prefer using the static generator for full mocks to ensure 80 questions (40+40) reliability
  // The AI API often times out with such large output requirements.
  console.log("Using local high-performance generator for full mock...");
  const questions = getStaticMockExam();
  // Initialize with 0 time spent
  return questions.map(q => ({...q, timeSpent: 0}));
};

export const parseMockFromText = async (questionText: string, answerText: string): Promise<MockQuestion[]> => {
  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        questionText: { type: Type.STRING },
        options: { type: Type.ARRAY, items: { type: Type.STRING } },
        correctAnswerIndex: { type: Type.INTEGER },
        explanation: { type: Type.STRING, description: "Generate a brief explanation." },
        topic: { type: Type.STRING, description: "Infer topic" },
        difficulty: { type: Type.STRING, description: "Infer difficulty" },
        section: { type: Type.STRING, enum: ['Reasoning', 'Quantitative Aptitude', 'General'], description: "Infer section based on content" }
      },
      required: ["questionText", "options", "correctAnswerIndex", "section"]
    }
  };

  let prompt = '';
  if (answerText.trim()) {
     prompt = `
      You are an exam parser for Banking Exams. 
      Input 1 contains Questions. Input 2 contains the Answer Key/Solutions.
      
      Task:
      1. Extract questions from Input 1.
      2. Match them with correct answers from Input 2.
      3. Extract all options (usually 4 or 5, e.g., a, b, c, d, e).
      4. Return a clean JSON array.
      
      INPUT 1 (Questions):
      ${questionText.substring(0, 20000)}

      INPUT 2 (Answers):
      ${answerText.substring(0, 5000)}
     `;
  } else {
     prompt = `
      You are an intelligent exam parser and solver for Banking Exams (SBI/IBPS).
      I have pasted a raw text containing questions (and possibly options) from an exam paper.
      
      CRITICAL INSTRUCTIONS:
      1. The input text may contain conversational noise, preambles, or headers (e.g., "Here is the plain text version..."). **IGNORE ALL non-question text.**
      2. Look for numbered patterns like "1.", "2.", "Q1", "1)" to identify questions.
      3. The text contains Unicode math symbols (e.g., √ for square root, ÷ for division, × or * for multiplication). Handle them correctly.
      4. It may contain mixed fractions (e.g., "4 3/6" or "8(2/3)"). Parse them as numbers in your solution logic.
      5. Extract ALL options if present ((a), (b), (c), (d), (e)). Do not limit to 4.
      
      Task:
      1. Extract individual questions only.
      2. SOLVE THEM YOURSELF to find the correct answer index. 
      3. Generate a brief explanation for the solution.
      4. Return a clean JSON array.
      
      RAW TEXT:
      ${questionText.substring(0, 25000)}
     `;
  }

  try {
    const response = await ai.models.generateContent({
      // Model gemini-3-pro-preview is correct for complex reasoning.
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = cleanJson(response.text || "");
    if (!text) return [];
    
    // Safety check for JSON parsing
    try {
      const questions = JSON.parse(text) as MockQuestion[];
      return questions.map(q => ({ 
        ...q, 
        status: 'not_visited', 
        explanation: q.explanation || "Derived from uploaded text.",
        timeSpent: 0
      }));
    } catch (parseError) {
      console.error("JSON Parse Error on: ", text);
      return [];
    }
  } catch (error) {
    console.error("Text Parse Error:", error);
    return [];
  }
};

// --- PDF Question Extraction ---

export const extractQuestionsFromPdf = async (pdfBase64: string): Promise<{ q: string; a: string }[]> => {
  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        q: { type: Type.STRING, description: "The question text, including options if present." },
        a: { type: Type.STRING, description: "The numerical answer or the correct option text." }
      },
      required: ["q", "a"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      // Updated to gemini-3-flash-preview.
      model: 'gemini-3-flash-preview',
      contents: [
        {
          inlineData: {
            mimeType: 'application/pdf',
            data: pdfBase64
          }
        },
        {
          text: `You are an expert math tutor for Indian Banking exams (SBI/IBPS). 
          Analyze the provided PDF file. 
          Identify multiple-choice or numerical aptitude questions and their answers. 
          You must map the answers to the questions correctly. 
          Return a JSON array of objects with 'q' (question) and 'a' (answer). 
          Ignore non-mathematical content. Extract as many questions as possible (up to 30).
          If the PDF contains an answer key at the end, use it to populate the 'a' field.`
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const text = cleanJson(response.text || "");
    if (!text) return [];
    return JSON.parse(text) as { q: string; a: string }[];
  } catch (error) {
    console.error("PDF Extraction Error:", error);
    return [];
  }
};
