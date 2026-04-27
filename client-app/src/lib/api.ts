import type { Citation, KnowledgeBase, Message } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? '';
const API_KEY = import.meta.env.VITE_API_KEY ?? '';
const USE_MOCK = !API_URL;

export const knowledgeBases: KnowledgeBase[] = [
  { id: 'kb-default', name: 'All Documents', documentCount: 128 },
  { id: 'kb-policies', name: 'Company Policies', documentCount: 42 },
  { id: 'kb-research', name: 'Research Papers', documentCount: 67 },
];

const mockResponses: Array<{ content: string; citations: Citation[] }> = [
  {
    content:
      "Based on the indexed documents, the **vacation policy** allows for up to 25 days of paid leave per year, accruing at 2.08 days per month. Employees may carry over a maximum of 5 unused days into the following year, with any excess forfeited unless approved by management.\n\nFor parental leave, employees are entitled to 12 weeks of paid leave following the birth or adoption of a child.",
    citations: [
      {
        id: '1',
        title: 'Employee Handbook 2025',
        snippet:
          'Section 4.2: Full-time employees accrue paid time off at a rate of 2.08 days per calendar month, totaling 25 days annually...',
        source: 'handbook-2025.pdf, p.18',
      },
      {
        id: '2',
        title: 'Parental Leave Policy',
        snippet:
          'Eligible employees may take up to twelve (12) consecutive weeks of paid parental leave following a qualifying event...',
        source: 'parental-leave-policy.pdf, p.3',
      },
    ],
  },
  {
    content:
      "The latest **quarterly revenue** reached **$48.2M**, representing a 17% year-over-year increase. Growth was primarily driven by:\n\n- Enterprise tier expansion (+34% YoY)\n- New customer acquisitions in EMEA\n- Improved retention from the customer success program\n\nGross margin held steady at 71%.",
    citations: [
      {
        id: '1',
        title: 'Q3 2025 Earnings Report',
        snippet:
          'Total revenue for the quarter was $48.2M, up from $41.2M in the prior-year quarter, an increase of 17%...',
        source: 'q3-2025-earnings.pdf, p.4',
      },
    ],
  },
  {
    content:
      "Several relevant studies discuss this. The **Chen et al. (2024)** paper demonstrates a 23% improvement in retrieval accuracy when combining dense and sparse representations. Their methodology uses a hybrid scoring function with learned weights.\n\nA follow-up study by **Patel & Kumar (2025)** validated these results on three additional benchmarks.",
    citations: [
      {
        id: '1',
        title: 'Hybrid Retrieval for Enterprise RAG',
        snippet:
          'We propose a hybrid scoring scheme that linearly combines BM25 and dense vector similarity, with weights learned per query type...',
        source: 'chen-2024-hybrid-retrieval.pdf',
      },
      {
        id: '2',
        title: 'Reproducibility Study on Hybrid Retrieval',
        snippet:
          'Across MS MARCO, BEIR, and our internal benchmark, hybrid retrieval consistently outperformed both pure dense and pure sparse baselines...',
        source: 'patel-2025-reproducibility.pdf',
      },
    ],
  },
];

let mockIndex = 0;

async function mockSendMessage(_kbId: string, _history: Message[]): Promise<{ content: string; citations: Citation[] }> {
  await new Promise((r) => setTimeout(r, 900 + Math.random() * 700));
  const response = mockResponses[mockIndex % mockResponses.length];
  mockIndex += 1;
  return response;
}

async function realSendMessage(
  kbId: string,
  history: Message[],
): Promise<{ content: string; citations: Citation[] }> {
  const response = await fetch(`${API_URL}/v1/chats_openai/${kbId}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'rag',
      messages: history.map((m) => ({ role: m.role, content: m.content })),
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  const content: string = data.choices?.[0]?.message?.content ?? '';
  const refs = data.choices?.[0]?.message?.reference?.chunks ?? [];
  const citations: Citation[] = refs.map((c: { id?: string; document_keyword?: string; content?: string; document_id?: string }, i: number) => ({
    id: c.id ?? String(i + 1),
    title: c.document_keyword ?? `Source ${i + 1}`,
    snippet: c.content ?? '',
    source: c.document_id,
  }));

  return { content, citations };
}

export async function sendMessage(
  kbId: string,
  history: Message[],
): Promise<{ content: string; citations: Citation[] }> {
  return USE_MOCK ? mockSendMessage(kbId, history) : realSendMessage(kbId, history);
}

export const isMockMode = USE_MOCK;
