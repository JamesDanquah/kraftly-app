import React, { useState, useEffect, useCallback, useRef } from 'react';
import { History, Moon, Sun, Delete, RotateCcw } from 'lucide-react';
import { Button } from './components/Button';
import { cn } from './lib/utils';

// --- Types ---
type Operator = '/' | '*' | '-' | '+' | '=' | null;

interface HistoryItem {
  expression: string;
  result: string;
  id: number;
}

// --- Main Component ---
export default function App() {
  const [displayValue, setDisplayValue] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Toggle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // --- Logic ---
  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
  };

  const inputDot = () => {
    if (waitingForSecondOperand) {
      setDisplayValue('0.');
      setWaitingForSecondOperand(false);
    } else if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const clear = () => {
    setDisplayValue('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const toggleSign = () => {
    const newValue = parseFloat(displayValue) * -1;
    setDisplayValue(String(newValue));
  };

  const inputPercent = () => {
    const currentValue = parseFloat(displayValue);
    if (currentValue === 0) return;
    const fixedDigits = displayValue.replace(/^-?\d*\.?/, '');
    const newValue = parseFloat(displayValue) / 100;
    setDisplayValue(String(newValue.toFixed(fixedDigits.length + 2)));
  };

  const performOperation = (nextOperator: Operator) => {
    const inputValue = parseFloat(displayValue);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const currentValue = firstOperand || 0;
      const newValue = calculate(currentValue, inputValue, operator);
      
      setFirstOperand(newValue);
      setDisplayValue(String(newValue));
      
      // Add to history if it's a completion
      if (nextOperator === '=') {
        addToHistory(currentValue, inputValue, operator, newValue);
      }
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (first: number, second: number, op: Operator): number => {
    switch (op) {
      case '+': return first + second;
      case '-': return first - second;
      case '*': return first * second;
      case '/': return first / second;
      default: return second;
    }
  };

  const addToHistory = (first: number, second: number, op: string, result: number) => {
    const opSymbols: Record<string, string> = { '/': '÷', '*': '×', '-': '-', '+': '+' };
    const newEntry: HistoryItem = {
      id: Date.now(),
      expression: `${first} ${opSymbols[op]} ${second}`,
      result: String(result)
    };
    setHistory(prev => [newEntry, ...prev].slice(0, 50));
  };

  const handleBackspace = () => {
    if (waitingForSecondOperand) return;
    setDisplayValue(displayValue.length > 1 ? displayValue.slice(0, -1) : '0');
  };

  // --- Keyboard Support ---
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key } = event;

    if (/[0-9]/.test(key)) {
      event.preventDefault();
      inputDigit(key);
    } else if (key === '.') {
      event.preventDefault();
      inputDot();
    } else if (key === 'Enter' || key === '=') {
      event.preventDefault();
      if (operator) performOperation('=');
    } else if (key === 'Backspace') {
      event.preventDefault();
      handleBackspace();
    } else if (key === 'Escape') {
      event.preventDefault();
      clear();
    } else if (['+', '-', '*', '/'].includes(key)) {
      event.preventDefault();
      performOperation(key as Operator);
    }
  }, [displayValue, firstOperand, operator, waitingForSecondOperand]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // --- Render Helpers ---
  const formatDisplay = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '0';
    return num.toLocaleString('en-US', { maximumFractionDigits: 10 });
  };

  return (
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4 transition-colors duration-300 font-sans selection:bg-indigo-500/30">
      
      {/* Main Container */}
      <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[850px] max-h-[90vh]">
        
        {/* Header / Top Bar */}
        <div className="flex items-center justify-between p-6 pb-2 z-20">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={cn(
              "p-2 rounded-full transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800",
              showHistory ? "text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" : "text-zinc-500"
            )}
          >
            <History size={20} />
          </button>
          
          <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-full">
            <button
              onClick={() => setIsDarkMode(false)}
              className={cn("p-1.5 rounded-full transition-all", !isDarkMode ? "bg-white dark:bg-zinc-700 shadow-sm text-amber-500" : "text-zinc-400")}
            >
              <Sun size={16} />
            </button>
            <button
              onClick={() => setIsDarkMode(true)}
              className={cn("p-1.5 rounded-full transition-all", isDarkMode ? "bg-zinc-700 shadow-sm text-indigo-400" : "text-zinc-400")}
            >
              <Moon size={16} />
            </button>
          </div>
        </div>

        {/* Display Area */}
        <div className="flex-1 flex flex-col items-end justify-end px-8 pb-6 z-10 relative">
           {/* Previous operation hint */}
           <div className="h-8 text-zinc-400 dark:text-zinc-500 text-lg font-medium mb-1 transition-all">
             {firstOperand !== null && operator && !waitingForSecondOperand ? 
               `${firstOperand} ${operator === '*' ? '×' : operator === '/' ? '÷' : operator}` : ''}
           </div>
           
           {/* Main Display */}
           <div className="w-full text-right">
             <span className={cn(
               "block font-light transition-all duration-200 text-zinc-900 dark:text-zinc-50",
               displayValue.length > 9 ? "text-4xl" : displayValue.length > 6 ? "text-5xl" : "text-6xl"
             )}>
               {formatDisplay(displayValue)}
             </span>
           </div>
        </div>

        {/* Keypad */}
        <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 pt-2 pb-8 rounded-t-[2.5rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-20">
          <div className="grid grid-cols-4 gap-3">
            <Button variant="secondary" onClick={clear} className="text-red-500 dark:text-red-400 font-semibold">AC</Button>
            <Button variant="secondary" onClick={toggleSign}><span className="text-xl">+/-</span></Button>
            <Button variant="secondary" onClick={inputPercent}><span className="text-xl">%</span></Button>
            <Button variant="primary" onClick={() => performOperation('/')} className={operator === '/' ? 'ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-zinc-900' : ''}>÷</Button>

            <Button onClick={() => inputDigit('7')}>7</Button>
            <Button onClick={() => inputDigit('8')}>8</Button>
            <Button onClick={() => inputDigit('9')}>9</Button>
            <Button variant="primary" onClick={() => performOperation('*')} className={operator === '*' ? 'ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-zinc-900' : ''}>×</Button>

            <Button onClick={() => inputDigit('4')}>4</Button>
            <Button onClick={() => inputDigit('5')}>5</Button>
            <Button onClick={() => inputDigit('6')}>6</Button>
            <Button variant="primary" onClick={() => performOperation('-')} className={operator === '-' ? 'ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-zinc-900' : ''}>-</Button>

            <Button onClick={() => inputDigit('1')}>1</Button>
            <Button onClick={() => inputDigit('2')}>2</Button>
            <Button onClick={() => inputDigit('3')}>3</Button>
            <Button variant="primary" onClick={() => performOperation('+')} className={operator === '+' ? 'ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-zinc-900' : ''}>+</Button>

            <Button onClick={() => inputDigit('0')} className="col-span-2 pl-8 justify-start">0</Button>
            <Button onClick={inputDot}>.</Button>
            <Button variant="accent" onClick={() => performOperation('=')}>=</Button>
          </div>
        </div>

        {/* History Overlay Panel */}
        <div className={cn(
          "absolute inset-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md z-30 transition-transform duration-300 ease-in-out flex flex-col",
          showHistory ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">History</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setHistory([])} 
                className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                title="Clear History"
              >
                <RotateCcw size={18} />
              </button>
              <button 
                onClick={() => setShowHistory(false)} 
                className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <Delete size={18} className="rotate-180" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                <History size={48} className="mb-4 opacity-20" />
                <p>No history yet</p>
              </div>
            ) : (
              history.map((item) => (
                <div 
                  key={item.id} 
                  className="group p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  onClick={() => {
                    setDisplayValue(item.result);
                    setShowHistory(false);
                  }}
                >
                  <div className="text-zinc-500 dark:text-zinc-400 text-sm mb-1">{item.expression}</div>
                  <div className="text-zinc-900 dark:text-zinc-100 text-xl font-medium">= {parseFloat(item.result).toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
      
      {/* Footer Info */}
      <div className="fixed bottom-4 text-zinc-400 text-xs font-medium tracking-wider opacity-60">
        PRESS KEYBOARD KEYS OR TAP
      </div>
    </div>
  );
}