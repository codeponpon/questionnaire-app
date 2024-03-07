export interface IQuestion {
  id: number;
  question: string;
  answers: string[];
  selectedAnswerIndex: number;
  correctAnswerIndex: number;
}

export interface IScoreBoard extends IQuestion {
  correct: boolean;
}
