
import { GoogleGenAI, Type } from "@google/genai";
import { Question, Subject, Difficulty, PatternAnalysis, MockQuestion } from "../types";
import { getStaticMockExam } from "./mockDataService";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Updated System Instruction for a more natural "Gemini-like" experience
const TUTOR_SYSTEM_INSTRUCTION = `
You are a helpful, intelligent, and versatile AI assistant powered by Google's Gemini model. 
While you are integrated into "BankEdge" (an IBPS RRB exam preparation app), you should interact naturally, effectively, and friendly, just like the standard Gemini experience.
You can assist with math, logic, writing, planning, and general knowledge.
However, if the user asks about exam specifics, prioritize methods suitable for banking exams (speed math, short tricks).
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
    return "Sorry, I encountered an error connecting to the AI service.";
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

  const prompt = `Generate ${count} ${difficulty} level multiple-choice questions for IBPS RRB ${subject} specifically focusing on the topic: "${topic}".
  
  CRITICAL INSTRUCTION FOR DATA INTERPRETATION (DI):
  If the topic is related to DI, Graphs, Pie Charts, or Caslets:
  1. You MUST create a numerical dataset and populate the 'chartData' field in the JSON.
  2. The 'questionText' should refer to the graph (e.g., "Based on the given bar graph...").
  3. Ensure the data in 'chartData' perfectly matches the solution logic.
  
  For other topics, leave 'chartData' null.
  Provide detailed explanations.`;

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

  const prompt = `Analyze the IBPS RRB ${examType} exam pattern for the year ${year} (or the most recent trend if exact year data is unavailable, but infer based on your knowledge base up to 2024/2025).
  Provide a breakdown of key topics, their weightage, and how the pattern shifted compared to previous years.
  Focus heavily on Quant and Reasoning as they are key for Prelims.`;

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

// --- Smart Notes Analysis ---

export const analyzeUserNote = async (noteContent: string, action: 'summarize' | 'formulas' | 'quiz'): Promise<string> => {
  const prompt = `
  Act as an expert study companion. 
  I will provide you with a study note. Please perform the following action: ${action}.
  
  Action Definitions:
  - summarize: Create a bulleted summary of key points.
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
      You are an exam parser. 
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
      You are an intelligent exam parser and solver.
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
          text: `You are an expert math tutor for IBPS RRB exams. 
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
