import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User, FileText, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import type { Message } from '../types';

interface Props {
  message: Message;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';
  const [showCitations, setShowCitations] = useState(false);
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`flex gap-3 animate-fade-in ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-slate-800 text-white' : 'bg-indigo-100 text-indigo-700'
        }`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      <div className={`max-w-2xl ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1.5`}>
        <div
          className={`rounded-2xl px-4 py-2.5 ${
            isUser
              ? 'bg-indigo-600 text-white rounded-tr-sm'
              : 'bg-white border border-slate-200 rounded-tl-sm shadow-sm'
          }`}
        >
          {message.pending ? (
            <div className="flex gap-1.5 py-1">
              <span className="w-2 h-2 rounded-full bg-slate-300 animate-pulse-soft" />
              <span className="w-2 h-2 rounded-full bg-slate-300 animate-pulse-soft" style={{ animationDelay: '0.2s' }} />
              <span className="w-2 h-2 rounded-full bg-slate-300 animate-pulse-soft" style={{ animationDelay: '0.4s' }} />
            </div>
          ) : isUser ? (
            <p className="whitespace-pre-wrap text-[15px]">{message.content}</p>
          ) : (
            <div className="prose-chat text-[15px]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {!isUser && !message.pending && (
          <div className="flex items-center gap-2 px-1">
            <button
              onClick={onCopy}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            {message.citations && message.citations.length > 0 && (
              <button
                onClick={() => setShowCitations((v) => !v)}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                <FileText size={12} />
                {message.citations.length} source{message.citations.length === 1 ? '' : 's'}
                {showCitations ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            )}
          </div>
        )}

        {showCitations && message.citations && (
          <div className="mt-1 space-y-2 w-full animate-fade-in">
            {message.citations.map((c, idx) => (
              <div
                key={c.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm"
              >
                <div className="flex items-start gap-2">
                  <span className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded bg-indigo-100 text-indigo-700 text-[11px] font-semibold">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-slate-800">{c.title}</div>
                    <p className="text-slate-600 text-[13px] mt-1 line-clamp-3">{c.snippet}</p>
                    {c.source && (
                      <div className="text-xs text-slate-400 mt-1.5">{c.source}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
