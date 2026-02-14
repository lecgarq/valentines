export interface Question {
  id: number;
  text: string;
  answer: string;
  options?: string[];
}

export enum AppStep {
  INTRO = 'INTRO',
  QUIZ = 'QUIZ',
  PROPOSAL = 'PROPOSAL',
  SUCCESS = 'SUCCESS',
  LETTER = 'LETTER'
}