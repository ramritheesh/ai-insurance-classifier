export interface ClaimRecord {
  id: string;
  description: string;
  coverageCode: string; // e.g., AD, GB, PA
  accidentSource: string;
}

export interface ClassificationResult {
  coverageCode: string;
  accidentSource: string;
  confidence: number;
  reasoning: string;
  extractedFeatures: string[];
}

export enum AppView {
  LANDING = 'LANDING',
  OVERVIEW = 'OVERVIEW',     // Merged Dashboard + About
  NEW_CLAIM = 'NEW_CLAIM',   // Was Classifier (Smart Triage)
  SCHEMA_RULES = 'SCHEMA_RULES', // New Classification Rules view
  CHATBOT = 'CHATBOT',
  DATASET = 'DATASET'       // Kept for internal usage if needed, though removed from sidebar
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface User {
  name: string;
  role: string;
  avatar: string;
}