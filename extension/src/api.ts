import { AnalysisResult, ChatMessage, DarkPatternResult, Persona } from './types';

const API_URL = 'http://localhost:3000';

export async function analyzeText(text: string, url: string, persona: Persona): Promise<AnalysisResult> {
  const response = await fetch(`${API_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, url, persona }),
  });

  if (!response.ok) {
    throw new Error('Analysis failed');
  }

  return response.json();
}

export async function chatWithTerms(message: string, text: string, history: ChatMessage[]) {
  const historyParts = history.map(h => ({
    role: h.role,
    parts: [{ text: h.text }]
  }));

  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, text, history: historyParts }),
  });

  if (!response.ok) throw new Error('Chat failed');
  return response.json(); // returns { response: string }
}

export async function detectDarkPatterns(imageBase64: string): Promise<DarkPatternResult> {
  const response = await fetch(`${API_URL}/detect-dark-patterns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64 }),
  });

  if (!response.ok) throw new Error('Vision analysis failed');
  return response.json();
}
