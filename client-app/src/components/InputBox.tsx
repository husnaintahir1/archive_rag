import { useRef, useEffect, KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function InputBox({ value, onChange, onSend, disabled, loading }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) onSend();
    }
  };

  const canSend = !disabled && !loading && value.trim().length > 0;

  return (
    <div className="border-t border-slate-200 bg-white px-4 py-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative rounded-2xl border border-slate-200 bg-white shadow-sm focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask a question about your documents…"
            rows={1}
            className="block w-full resize-none bg-transparent border-0 outline-none px-4 py-3 pr-14 text-[15px] text-slate-800 placeholder-slate-400"
            disabled={disabled}
          />
          <button
            onClick={onSend}
            disabled={!canSend}
            className={`absolute right-2 bottom-2 w-9 h-9 flex items-center justify-center rounded-xl transition-all ${
              canSend
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
            aria-label="Send message"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
        <p className="text-[11px] text-slate-400 text-center mt-2">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px]">Enter</kbd> to send,{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px]">Shift+Enter</kbd> for newline
        </p>
      </div>
    </div>
  );
}
