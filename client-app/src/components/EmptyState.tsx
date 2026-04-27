import { Sparkles, FileSearch, BarChart3, BookOpen } from 'lucide-react';

interface Props {
  onPromptClick: (prompt: string) => void;
}

const suggestions = [
  {
    icon: BookOpen,
    title: 'What is the vacation policy?',
    description: 'Summarize PTO and parental leave from the handbook',
  },
  {
    icon: BarChart3,
    title: 'Latest quarterly revenue?',
    description: 'Pull the headline numbers from the most recent report',
  },
  {
    icon: FileSearch,
    title: 'Compare hybrid retrieval studies',
    description: 'Find research on combining dense and sparse retrieval',
  },
];

export function EmptyState({ onPromptClick }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
        <Sparkles size={26} className="text-white" />
      </div>
      <h2 className="text-2xl font-semibold text-slate-900 mb-1">How can I help today?</h2>
      <p className="text-slate-500 mb-8 text-center max-w-md">
        Ask anything about your indexed documents. Answers come with source citations.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl">
        {suggestions.map((s) => (
          <button
            key={s.title}
            onClick={() => onPromptClick(s.title)}
            className="group text-left p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-50 transition-all"
          >
            <s.icon size={18} className="text-indigo-600 mb-2" />
            <div className="font-medium text-sm text-slate-800 mb-1 group-hover:text-indigo-700">
              {s.title}
            </div>
            <div className="text-xs text-slate-500 leading-relaxed">{s.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
