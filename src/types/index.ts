// Core application types

export type AppScreen = 
  | 'welcome'
  | 'questionnaire'
  | 'iris-upload'
  | 'analysis'
  | 'report'
  | 'history'
  | 'admin';

export interface PersonalInfo {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  occupation: string;
  weight: number;
  height: number;
}

export interface HealthQuestionnaire {
  personalInfo: PersonalInfo;
  symptoms: string[];
  medicalHistory: string[];
  lifestyle: {
    sleepHours: number;
    exerciseFrequency: string;
    diet: string;
    smoking: boolean;
    alcohol: boolean;
  };
  familyHistory: string[];
  emotionalState: string[];
  additionalNotes: string;
}

export interface IrisImage {
  id: string;
  eye: 'left' | 'right';
  imageData: string; // base64
  timestamp: Date;
  processed: boolean;
}

export interface IrisZone {
  zone: number; // 1-12 (clock positions)
  name: string;
  findings: string[];
  severity: 'normal' | 'minor' | 'moderate' | 'severe';
}

export interface AIAnalysisResult {
  id: string;
  timestamp: Date;
  questionnaire: HealthQuestionnaire;
  leftIris?: IrisImage;
  rightIris?: IrisImage;
  analysis: {
    leftIrisZones: IrisZone[];
    rightIrisZones: IrisZone[];
    correlations: string[];
    findings: {
      alarming: string[];
      important: string[];
      minor: string[];
    };
  };
  recommendations: {
    nutrition: string[];
    supplements: string[];
    psychological: string[];
    medical: string[];
  };
  actionPlan: {
    phase1: string[]; // 0-2 months
    phase2: string[]; // 2-4 months
    phase3: string[]; // 4-6 months
    phase4: string[]; // 6+ months
  };
}

export interface AIConfig {
  provider: 'spark' | 'openai' | 'gemini';
  model: string;
  apiKey?: string;
  requestDelay: number; // seconds
  requestCount: number; // 4-12
}

export interface AppState {
  currentScreen: AppScreen;
  questionnaire?: HealthQuestionnaire;
  leftIris?: IrisImage;
  rightIris?: IrisImage;
  currentAnalysis?: AIAnalysisResult;
  analysisHistory: AIAnalysisResult[];
  aiConfig: AIConfig;
  isAnalyzing: boolean;
  analysisProgress: number;
}
