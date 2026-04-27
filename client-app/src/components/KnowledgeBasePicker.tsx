import { useState, useRef, useEffect } from 'react';
import { Database, ChevronDown, Check } from 'lucide-react';
import type { KnowledgeBase } from '../types';

interface Props {
  knowledgeBases: KnowledgeBase[];
  activeId: string;
  onChange: (id: string) => void;
}

export function KnowledgeBasePicker({ knowledgeBases, activeId, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = knowledgeBases.find((k) => k.id === activeId) ?? knowledgeBases[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 transition-colors text-sm"
      >
        <Database size={14} className="text-indigo-600" />
        <span className="font-medium text-slate-800">{active.name}</span>
        <span className="text-xs text-slate-400">{active.documentCount} docs</span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-lg border border-slate-200 bg-white shadow-lg z-10 overflow-hidden animate-fade-in">
          <div className="px-3 py-2 text-xs uppercase tracking-wide text-slate-400 font-medium border-b border-slate-100">
            Knowledge bases
          </div>
          <ul className="py-1 max-h-72 overflow-y-auto scrollbar-thin">
            {knowledgeBases.map((kb) => (
              <li key={kb.id}>
                <button
                  onClick={() => {
                    onChange(kb.id);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-left"
                >
                  <Database size={14} className="text-slate-400" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-800 truncate">{kb.name}</div>
                    <div className="text-xs text-slate-400">{kb.documentCount} documents</div>
                  </div>
                  {kb.id === activeId && <Check size={14} className="text-indigo-600" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
