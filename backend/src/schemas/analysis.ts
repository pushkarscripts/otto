import { z } from 'zod';

export const NotableClauseSchema = z.object({
  title: z.string(),
  risk: z.enum(['low', 'medium', 'high']),
  explanation: z.string(),
  quote: z.string().optional().describe("The exact text from the document to highlight"),
});

export const AnalysisResultSchema = z.object({
  overall_risk: z.enum(['low', 'medium', 'high']),
  summary: z.string(),
  notable_clauses: z.array(NotableClauseSchema),
  trust_score: z.number().optional().describe("Community trust score 0-100"),
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

// Request Schemas

export const AnalyzeRequestSchema = z.object({
  text: z.string().min(1),
  url: z.string().optional(),
  persona: z.enum(['standard', 'parent', 'content_creator', 'developer', 'privacy_advocate']).default('standard'),
});

export const ChatRequestSchema = z.object({
  text: z.string().describe("The T&C text context"),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(z.object({ text: z.string() }))
  })).optional(),
  message: z.string(),
});

export const DarkPatternRequestSchema = z.object({
  imageBase64: z.string().describe("Base64 encoded screenshot"),
});

export const DarkPatternResultSchema = z.object({
  has_dark_patterns: z.boolean(),
  details: z.array(z.object({
    element_description: z.string(),
    pattern_type: z.string(),
    explanation: z.string(),
    location_hint: z.string().optional()
  }))
});
