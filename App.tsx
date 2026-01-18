import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, Delete } from 'lucide-react';
import { useCalculator } from './hooks/useCalculator';
import { Button } from './components/Button';
import { Display } from './components/Display';
import { History } from './components/History';
import { ThemeToggle } from './components/ThemeToggle';
import { Theme } from './types';

function App() {
  const { state, actions } = useCalculator();
  const [showHistory, setShowHistory] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');

  // Handle theme changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <div className="min-h-screen w-full bg-[#f0f2f5] dark:bg-[#09090b] flex items-center justify-center p-4 transition-colors duration-500 overflow-hidden relative selection:bg-indigo-500/30">
      
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-rose-500/20 dark:bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Calculator Container */}
      <div className="relative w-full max-w-sm bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 dark:border-zinc-800 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          
          <button 
            onClick={() => setShowHistory(true)}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors relative"
            aria-label="View History"
          >
            <HistoryIcon size={20} />
            {state.history.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white dark:border-zinc-900" />
            )}
          </button>
        </div>

        {/* Display Area */}
        <Display 
          value={state.currentValue} 
          previousValue={state.previousValue} 
          operator={state.operator}
        />

        {/* Keypad */}
        <div className="p-6 grid grid-cols-4 gap-3">
          <Button variant="secondary" onClick={actions.handleClear} className="text-rose-500 font-bold">
            AC
          </Button>
          <Button variant="secondary" onClick={actions.handleToggleSign}>
            +/-
          </Button>
          <Button variant="secondary" onClick={actions.handlePercentage}>
            %
          </Button>
          <Button variant="accent" onClick={() => actions.handleOperator('/')}>
            ÷
          </Button>

          <Button onClick={() => actions.handleDigit('7')}>7</Button>
          <Button onClick={() => actions.handleDigit('8')}>8</Button>
          <Button onClick={() => actions.handleDigit('9')}>9</Button>
          <Button variant="accent" onClick={() => actions.handleOperator('*')}>
            ×
          </Button>

          <Button onClick={() => actions.handleDigit('4')}>4</Button>
          <Button onClick={() => actions.handleDigit('5')}>5</Button>
          <Button onClick={() => actions.handleDigit('6')}>6</Button>
          <Button variant="accent" onClick={() => actions.handleOperator('-')}>
            -
          </Button>

          <Button onClick={() => actions.handleDigit('1')}>1</Button>
          <Button onClick={() => actions.handleDigit('2')}>2</Button>
          <Button onClick={() => actions.handleDigit('3')}>3</Button>
          <Button variant="accent" onClick={() => actions.handleOperator('+')}>
            +
          </Button>

          <Button onClick={() => actions.handleDigit('0')} size="wide" className="pl-8 !justify-start">
            0
          </Button>
          <Button onClick={actions.handleDot}>
            .
          </Button>
          <Button variant="accent" className="bg-gradient-to-br from-indigo-500 to-purple-600 border-none" onClick={actions.handleEqual}>
            =
          </Button>
        </div>

        {/* History Overlay */}
        <History 
          history={state.history} 
          isOpen={showHistory} 
          onClose={() => setShowHistory(false)}
          onClear={actions.clearHistory}
        />
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-4 text-zinc-400 dark:text-zinc-600 text-xs font-medium tracking-wider uppercase">
        Lumina Calc
      </div>
    </div>
  );
}

export default App;