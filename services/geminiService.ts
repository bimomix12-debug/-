import { GoogleGenAI, Type } from "@google/genai";
import { Question, QuestionType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Prompt schema definition
const questionSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    type: { type: Type.STRING, enum: Object.values(QuestionType) },
    prompt: { type: Type.STRING, description: "The question text or sentence to translate." },
    options: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Options for multiple choice. Required for MULTIPLE_CHOICE and FILL_IN_BLANK."
    },
    correctAnswer: { type: Type.STRING, description: "The primary correct answer." },
    acceptableAnswers: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of other valid answers (e.g. synonyms, contractions)."
    },
    explanation: { type: Type.STRING, description: "Short explanation in Arabic why the answer is correct." }
  },
  required: ["type", "prompt", "correctAnswer", "explanation"],
};

export const generateLessonContent = async (topic: string, level: string): Promise<Question[]> => {
  try {
    const prompt = `
      Create a dynamic English lesson for an Arabic speaker.
      Topic: "${topic}".
      Level: "${level}".
      Generate 5 distinct questions.
      
      Requirements:
      1. Include a mix of translation (English to Arabic, Arabic to English), multiple choice, and fill-in-the-blank.
      2. Ensure the "prompt" is clear. For translation questions, give the source sentence.
      3. For "options", provide 4 choices if it is multiple choice.
      4. "explanation" MUST be in Arabic to help the learner.
      5. "acceptableAnswers" should handle common variations (e.g., "I am" vs "I'm").
      6. Return a valid JSON array.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: questionSchema
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      // Ensure IDs are unique if model didn't generate them perfectly
      return data.map((q: any, idx: number) => ({ ...q, id: `q-${Date.now()}-${idx}` }));
    }
    
    throw new Error("No data returned from Gemini");
  } catch (error) {
    console.error("Gemini generation error:", error);
    // Fallback data in case of error to keep app usable
    return [
      {
        id: 'fallback-1',
        type: QuestionType.MULTIPLE_CHOICE,
        prompt: 'How do you say "Hello" in Arabic?',
        options: ['مرحباً', 'مع السلامة', 'شكراً', 'نعم'],
        correctAnswer: 'مرحباً',
        explanation: 'Hello تعني مرحباً.',
        acceptableAnswers: ['اهلا']
      }
    ];
  }
};
