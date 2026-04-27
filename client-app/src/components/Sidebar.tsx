import { MessageSquarePlus, Trash2, MessageSquare } from 'lucide-react';
import type { Conversation } from '../types';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export function Sidebar({ conversations, activeId, onSelect, onNew, onDelete }: SidebarProps) {
  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <div>
            <h1 className="font-semibold text-slate-900 leading-tight">Archive RAG</h1>
            <p className="text-xs text-slate-500">Knowledge assistant</p>
          </div>
        </div>
        <button
          onClick={onNew}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
        >
          <MessageSquarePlus size={16} />
          New conversation
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-2 py-3">
        <div className="text-xs uppercase tracking-wide text-slate-400 font-medium px-2 mb-2">
          Recent
        </div>
        {conversations.length === 0 ? (
          <div className="px-2 py-4 text-sm text-slate-400 text-center">
            No conversations yet
          </div>
        ) : (
          <ul className="space-y-1">
            {conversations.map((c) => (
              <li key={c.id}>
                <div
                  className={`group flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer transition-colors ${
                    activeId === c.id
                      ? 'bg-indigo-50 text-indigo-900'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                  onClick={() => onSelect(c.id)}
                >
                  <MessageSquare size={14} className="shrink-0 opacity-60" />
                  <span className="text-sm truncate flex-1">{c.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(c.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-red-500 transition-all"
                    aria-label="Delete conversation"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-3 border-t border-slate-200 text-xs text-slate-400">
        v0.1.0
      </div>
    </aside>
  );
}
