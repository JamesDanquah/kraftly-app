export type Operator = '+' | '-' | '*' | '/' | null;

export interface CalculatorState {
  currentValue: string;
  previousValue: string;
  operator: Operator;
  history: HistoryItem[];
  isNewEquation: boolean;
}

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export type Theme = 'light' | 'dark';