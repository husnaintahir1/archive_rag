import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatView } from './components/ChatView';
import { sendMessage, knowledgeBases } from './lib/api';
import type { Conversation, Message } from './types';

const newId = () => Math.random().toString(36).slice(2, 11);

const newConversation = (kbId: string): Conversation => ({
  id: newId(),
  title: 'New conversation',
  messages: [],
  knowledgeBaseId: kbId,
  updatedAt: Date.now(),
});

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>([
    newConversation(knowledgeBases[0].id),
  ]);
  const [activeId, setActiveId] = useState<string>(conversations[0].id);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];

  const updateActive = (updater: (c: Conversation) => Conversation) => {
    setConversations((prev) => prev.map((c) => (c.id === activeId ? updater(c) : c)));
  };

  const handleNew = () => {
    const c = newConversation(active?.knowledgeBaseId ?? knowledgeBases[0].id);
    setConversations((prev) => [c, ...prev]);
    setActiveId(c.id);
    setInputValue('');
  };

  const handleDelete = (id: string) => {
    setConversations((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (next.length === 0) {
        const c = newConversation(knowledgeBases[0].id);
        setActiveId(c.id);
        return [c];
      }
      if (id === activeId) setActiveId(next[0].id);
      return next;
    });
  };

  const handleChangeKnowledgeBase = (kbId: string) => {
    updateActive((c) => ({ ...c, knowledgeBaseId: kbId }));
  };

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: newId(),
      role: 'user',
      content: text,
      createdAt: Date.now(),
    };
    const pendingMsg: Message = {
      id: newId(),
      role: 'assistant',
      content: '',
      createdAt: Date.now(),
      pending: true,
    };

    const isFirstMessage = active.messages.length === 0;
    updateActive((c) => ({
      ...c,
      title: isFirstMessage ? text.slice(0, 40) : c.title,
      messages: [...c.messages, userMsg, pendingMsg],
      updatedAt: Date.now(),
    }));
    setInputValue('');
    setLoading(true);

    try {
      const history = [...active.messages, userMsg];
      const { content, citations } = await sendMessage(active.knowledgeBaseId, history);
      updateActive((c) => ({
        ...c,
        messages: c.messages.map((m) =>
          m.id === pendingMsg.id ? { ...m, content, citations, pending: false } : m,
        ),
      }));
    } catch (err) {
      const errorText = err instanceof Error ? err.message : 'Something went wrong.';
      updateActive((c) => ({
        ...c,
        messages: c.messages.map((m) =>
          m.id === pendingMsg.id
            ? { ...m, content: `**Error:** ${errorText}`, pending: false }
            : m,
        ),
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex bg-slate-50 font-sans">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onNew={handleNew}
        onDelete={handleDelete}
      />
      <ChatView
        messages={active.messages}
        knowledgeBaseId={active.knowledgeBaseId}
        onChangeKnowledgeBase={handleChangeKnowledgeBase}
        inputValue={inputValue}
        onChangeInput={setInputValue}
        onSend={handleSend}
        loading={loading}
      />
    </div>
  );
}
