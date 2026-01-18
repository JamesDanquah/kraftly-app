import React, { useEffect, useRef } from 'react';
import { cn } from '../lib/utils';
import { Operator } from '../types';

interface DisplayProps {
  value: string;
  previousValue: string;
  operator: Operator;
  className?: string;
}

export const Display: React.FC<DisplayProps> = ({ 
  value, 
  previousValue, 
  operator,
  className 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to end when value changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [value]);

  // Format number for display (add commas)
  const formatNumber = (numStr: string) => {
    if (numStr === '' || numStr === '-') return numStr;
    const parts = numStr.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  return (
    <div className={cn("flex flex-col items-end justify-end px-6 py-8 space-y-2 w-full", className)}>
      <div className="h-6 text-zinc-500 dark:text-zinc-400 text-sm font-medium tracking-wide flex items-center space-x-2">
        <span>{formatNumber(previousValue)}</span>
        {operator && <span className="text-indigo-500">{operator}</span>}
      </div>
      
      <div 
        ref={scrollRef}
        className="w-full overflow-x-auto scrollbar-hide text-right whitespace-nowrap"
      >
        <span className={cn(
          "text-6xl font-light tracking-tight text-zinc-900 dark:text-white transition-all duration-300",
          value.length > 9 ? "text-4xl" : "text-6xl"
        )}>
          {formatNumber(value)}
        </span>
      </div>
    </div>
  );
};