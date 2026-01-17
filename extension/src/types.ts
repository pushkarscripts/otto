export type RiskLevel = 'low' | 'medium' | 'high';

export type AppStatus = 'idle' | 'reading' | 'thinking' | 'result' | 'error' | 'chatting' | 'analyzing_vision';
export type MascotState = 'idle' | 'reading' | 'thinking' | 'happy' | 'concerned' | 'alert';
export type Persona = 'standard' | 'parent' | 'content_creator' | 'developer' | 'privacy_advocate';

export interface NotableClause {
  title: string;
  risk: 'low' | 'medium' | 'high';
  explanation: string;
  quote?: string;
}

export interface AnalysisResult {
  overall_risk: 'low' | 'medium' | 'high';
  summary: string;
  notable_clauses: NotableClause[];
  trust_score?: number;
  from_cache?: boolean;
}

export interface DarkPatternResult {
  has_dark_patterns: boolean;
  details: {
    element_description: string;
    pattern_type: string;
    explanation: string;
    location_hint?: string;
  }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
