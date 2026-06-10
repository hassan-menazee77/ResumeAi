export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  headline: string;
  summary: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string; // Bullet points separated by \n
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description?: string;
}

export interface ResumeContent {
  personalInfo: PersonalInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
}

export interface ResumeDocument {
  id: string;
  userId: string;
  title: string;
  content: ResumeContent;
  template: string;
  atsScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export type TemplateType = 
  | "modern_minimal" 
  | "executive_dark" 
  | "creative_gradient" 
  | "ats_clean" 
  | "tech_pro";

export interface UserPlan {
  uid: string;
  email: string;
  plan: "free" | "pro";
  usageCount: number;
  createdAt: string;
}

export interface ATSCheckResult {
  score: number;
  keywords: {
    matched: string[];
    missing: string[];
  };
  suggestions: string[];
}

export interface JobAnalysisResult {
  skills: string[];
  keywords: string[];
  experienceLevel: string;
  suggestions: string[];
}
