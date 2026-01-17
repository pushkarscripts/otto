import { GoogleGenAI } from '@google/genai';
import { AnalysisResultSchema, AnalysisResult, DarkPatternResultSchema } from '../schemas/analysis';

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not defined');
  return new GoogleGenAI({ apiKey });
};

export async function analyzeText(text: string, persona: string = 'standard'): Promise<AnalysisResult> {
  const genAI = getClient();
  
  const personaPrompts: Record<string, string> = {
    standard: "You are a helpful legal assistant.",
    parent: "You are a protective parent concerned about child safety, data collection on minors, and hidden costs.",
    content_creator: "You are a digital creator concerned about IP rights, content ownership, and licensing.",
    developer: "You are a software engineer concerned about API limits, reverse engineering clauses, and data portability.",
    privacy_advocate: "You are a strict privacy activist concerned about data selling, third-party sharing, and encryption.",
  };

  const role = personaPrompts[persona] || personaPrompts['standard'];

  const prompt = `
    ${role}
    Analyze the following Terms and Conditions text. 
    Identify the overall risk level (low, medium, high) based on user-hostile clauses specifically relevant to your persona.
    Provide a brief summary.
    List notable clauses with their titles, risk levels, and explanations.
    CRITICAL: For each notable clause, you MUST extract a short, unique "quote" (substring) from the original text that represents the bad clause. This quote will be used to highlight the text in the browser. It must be exact.

    Return ONLY valid JSON in the following format:
    {
      "overall_risk": "low" | "medium" | "high",
      "summary": "string",
      "notable_clauses": [
        { 
          "title": "string", 
          "risk": "low" | "medium" | "high", 
          "explanation": "string",
          "quote": "string (EXACT text match from input)"
        }
      ]
    }

    Text to analyze (truncated):
    ${text.substring(0, 30000)}
  `;

  const result = await genAI.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' },
  });

  const responseText = result.text;
  if (!responseText) throw new Error('No response from Gemini');

  try {
    const json = JSON.parse(responseText);
    return AnalysisResultSchema.parse(json);
  } catch (error) {
    console.error('Gemini validation failed:', error);
    throw new Error('Failed to parse Gemini response');
  }
}

export async function analyzeDarkPatterns(imageBase64: string) {
  const genAI = getClient();
  // Strip header if present
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
  
  const prompt = `
    Analyze this screenshot of a website/signup page. 
    Look for "Dark Patterns" - deceptive UI designs meant to trick users.
    Examples:
    - Visual Interference: Hidden "skip" buttons, greyed out "reject" options.
    - Trick Questions: Confusing checkboxes.
    - Urgency: Fake countdown timers.
    
    Return JSON:
    {
      "has_dark_patterns": boolean,
      "details": [
        { "element_description": "string", "pattern_type": "string", "explanation": "string" }
      ]
    }
  `;

  const result = await genAI.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      { text: prompt },
      { inlineData: { mimeType: "image/png", data: base64Data } }
    ],
    config: { responseMimeType: 'application/json' }
  });

  const responseText = result.text;
  if (!responseText) throw new Error('No response from Gemini');

  return DarkPatternResultSchema.parse(JSON.parse(responseText));
}

export async function chatWithTerms(message: string, contextText: string, history: any[]) {
  const genAI = getClient();
  
  // Create a chat session
  // We include the context (T&C text) in the system instruction or first message
  const systemInstruction = `
    You are a legal AI assistant helping a user understand a Terms and Conditions document.
    Here is the document text:
    """
    ${contextText.substring(0, 30000)}
    """
    Answer the user's questions based strictly on this text. Be concise and helpful.
  `;

  // We need to map the history format if necessary, or just append the system prompt
  // simple approach: just generate content with the new message + context if history is complex
  // but gemini-2.5-flash supports chat history nicely.
  
  const contents = [
    { role: 'user', parts: [{ text: systemInstruction }] },
    { role: 'model', parts: [{ text: "Understood. I am ready to answer questions about this document." }] },
    ...history,
    { role: 'user', parts: [{ text: message }] }
  ];

  const result = await genAI.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: contents,
  });

  return { response: result.text };
}
