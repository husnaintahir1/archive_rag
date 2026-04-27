import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { EmptyState } from './EmptyState';
import { InputBox } from './InputBox';
import { KnowledgeBasePicker } from './KnowledgeBasePicker';
import { knowledgeBases, isMockMode } from '../lib/api';
import type { Message } from '../types';

interface Props {
  messages: Message[];
  knowledgeBaseId: string;
  onChangeKnowledgeBase: (id: string) => void;
  inputValue: string;
  onChangeInput: (v: string) => void;
  onSend: () => void;
  loading: boolean;
}

export function ChatView({
  messages,
  knowledgeBaseId,
  onChangeKnowledgeBase,
  inputValue,
  onChangeInput,
  onSend,
  loading,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length, loading]);

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
      <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-slate-800">Chat</h2>
          {isMockMode && (
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
              Demo mode
            </span>
          )}
        </div>
        <KnowledgeBasePicker
          knowledgeBases={knowledgeBases}
          activeId={knowledgeBaseId}
          onChange={onChangeKnowledgeBase}
        />
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
        {messages.length === 0 ? (
          <EmptyState onPromptClick={(p) => onChangeInput(p)} />
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
          </div>
        )}
      </div>

      <InputBox
        value={inputValue}
        onChange={onChangeInput}
        onSend={onSend}
        disabled={loading}
        loading={loading}
      />
    </main>
  );
}
