import React from 'react';
import { HistoryItem } from '../types';
import { Trash2, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

interface HistoryProps {
  history: HistoryItem[];
  isOpen: boolean;
  onClear: () => void;
  onClose: () => void;
}

export const History: React.FC<HistoryProps> = ({ history, isOpen, onClear, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-20 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-3xl flex flex-col transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center space-x-2 text-zinc-900 dark:text-white font-medium">
          <Clock size={18} />
          <span>History</span>
        </div>
        <button 
          onClick={onClear}
          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-red-500 transition-colors"
          aria-label="Clear History"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-2">
            <Clock size={48} className="opacity-20" />
            <p className="text-sm">No calculations yet</p>
          </div>
        ) : (
          history.map((item) => (
            <div key={item.id} className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800/50 space-y-1">
              <div className="text-zinc-500 dark:text-zinc-400 text-sm">{item.expression}</div>
              <div className="text-xl font-medium text-zinc-900 dark:text-white">= {item.result}</div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
        <button 
          onClick={onClose}
          className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          Close
        </button>
      </div>
    </div>
  );
};