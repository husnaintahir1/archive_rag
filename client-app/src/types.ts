export type Role = 'user' | 'assistant';

export interface Citation {
  id: string;
  title: string;
  snippet: string;
  source?: string;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  citations?: Citation[];
  createdAt: number;
  pending?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  knowledgeBaseId: string;
  updatedAt: number;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  documentCount: number;
}
