import { useState, useCallback, useEffect } from 'react';
import { CalculatorState, HistoryItem, Operator } from '../types';

const MAX_DIGITS = 15;

export const useCalculator = () => {
  const [state, setState] = useState<CalculatorState>({
    currentValue: '0',
    previousValue: '',
    operator: null,
    history: [],
    isNewEquation: true,
  });

  const handleDigit = useCallback((digit: string) => {
    setState((prev) => {
      if (prev.isNewEquation) {
        return {
          ...prev,
          currentValue: digit,
          isNewEquation: false,
        };
      }
      
      if (prev.currentValue.replace('.', '').length >= MAX_DIGITS) {
        return prev;
      }

      return {
        ...prev,
        currentValue: prev.currentValue === '0' ? digit : prev.currentValue + digit,
      };
    });
  }, []);

  const handleDot = useCallback(() => {
    setState((prev) => {
      if (prev.isNewEquation) {
        return {
          ...prev,
          currentValue: '0.',
          isNewEquation: false,
        };
      }
      if (prev.currentValue.includes('.')) return prev;
      return {
        ...prev,
        currentValue: prev.currentValue + '.',
      };
    });
  }, []);

  const handleClear = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentValue: '0',
      previousValue: '',
      operator: null,
      isNewEquation: true,
    }));
  }, []);

  const handleDelete = useCallback(() => {
    setState((prev) => {
      if (prev.isNewEquation) return prev;
      if (prev.currentValue.length === 1) {
        return { ...prev, currentValue: '0' };
      }
      return { ...prev, currentValue: prev.currentValue.slice(0, -1) };
    });
  }, []);

  const calculate = useCallback((a: number, b: number, op: Operator): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b === 0 ? 0 : a / b;
      default: return b;
    }
  }, []);

  const handleOperator = useCallback((nextOperator: Operator) => {
    setState((prev) => {
      const inputValue = parseFloat(prev.currentValue);

      if (prev.operator && !prev.isNewEquation) {
        const result = calculate(parseFloat(prev.previousValue), inputValue, prev.operator);
        return {
          ...prev,
          previousValue: String(result),
          currentValue: String(result),
          operator: nextOperator,
          isNewEquation: true,
        };
      }

      return {
        ...prev,
        previousValue: prev.currentValue,
        operator: nextOperator,
        isNewEquation: true,
      };
    });
  }, [calculate]);

  const handleEqual = useCallback(() => {
    setState((prev) => {
      if (!prev.operator) return prev;

      const current = parseFloat(prev.currentValue);
      const previous = parseFloat(prev.previousValue);
      const result = calculate(previous, current, prev.operator);
      
      // Format result to avoid long decimals but keep precision
      const formattedResult = parseFloat(result.toPrecision(12)).toString();

      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        expression: `${previous} ${prev.operator} ${current}`,
        result: formattedResult,
        timestamp: Date.now(),
      };

      return {
        ...prev,
        currentValue: formattedResult,
        previousValue: '',
        operator: null,
        isNewEquation: true,
        history: [newHistoryItem, ...prev.history].slice(0, 10),
      };
    });
  }, [calculate]);

  const handlePercentage = useCallback(() => {
    setState((prev) => {
      const current = parseFloat(prev.currentValue);
      return {
        ...prev,
        currentValue: (current / 100).toString(),
        isNewEquation: true,
      };
    });
  }, []);

  const handleToggleSign = useCallback(() => {
    setState((prev) => {
      const current = parseFloat(prev.currentValue);
      return {
        ...prev,
        currentValue: (current * -1).toString(),
      };
    });
  }, []);

  const clearHistory = useCallback(() => {
    setState((prev) => ({ ...prev, history: [] }));
  }, []);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      
      if (/[0-9]/.test(key)) {
        handleDigit(key);
      } else if (key === '.') {
        handleDot();
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEqual();
      } else if (key === 'Backspace') {
        handleDelete();
      } else if (key === 'Escape') {
        handleClear();
      } else if (['+', '-', '*', '/'].includes(key)) {
        handleOperator(key as Operator);
      } else if (key === '%') {
        handlePercentage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleDot, handleEqual, handleDelete, handleClear, handleOperator, handlePercentage]);

  return {
    state,
    actions: {
      handleDigit,
      handleDot,
      handleClear,
      handleDelete,
      handleOperator,
      handleEqual,
      handlePercentage,
      handleToggleSign,
      clearHistory,
    },
  };
};