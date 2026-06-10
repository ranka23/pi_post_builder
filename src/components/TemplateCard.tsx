import { useState } from 'react';

interface TemplateCardProps {
  title: string;
  body: string;
  platform: string;
  icon: string;
  index: number;
  onCopyRequest: (text: string, cb: () => void) => void;
}

export default function TemplateCard({
  title,
  body,
  platform,
  icon,
  index,
  onCopyRequest,
}: TemplateCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = () => {
    onCopyRequest(body, () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const lineCount = body.split('\n').length;
  const isLong = lineCount > 8;
  const displayBody = !expanded && isLong ? body.split('\n').slice(0, 8).join('\n') + '\n...' : body;

  const platformColors: Record<string, string> = {
    Facebook: 'bg-blue-100 text-blue-700',
    'Twitter/X': 'bg-sky-100 text-sky-700',
    Instagram: 'bg-pink-100 text-pink-700',
    LinkedIn: 'bg-blue-100 text-blue-800',
    Forum: 'bg-green-100 text-green-700',
    Email: 'bg-purple-100 text-purple-700',
    Message: 'bg-purple-100 text-purple-700',
    Stories: 'bg-orange-100 text-orange-700',
    Comments: 'bg-gray-100 text-gray-700',
    Any: 'bg-amber-100 text-amber-700',
  };

  const delays = ['', 'delay-100', 'delay-200'];

  return (
    <div
      className={`group animate-fade-in-up ${delays[index] || ''} relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100/50`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="font-bold text-gray-900">{title}</h3>
            <span
              className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                platformColors[platform] || 'bg-gray-100 text-gray-600'
              }`}
            >
              {platform}
            </span>
          </div>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-600">
          {index + 1}
        </div>
      </div>

      {/* Card Body */}
      <div className="px-5 py-4">
        <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-gray-700">
          {displayBody}
        </pre>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            {expanded ? '▲ Show less' : '▼ Show more'}
          </button>
        )}
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
        <span className="text-xs text-gray-400">
          {body.length} chars • {body.split('\n').length} lines
        </span>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-200 active:scale-95 ${
            copied
              ? 'bg-green-500 text-white shadow-lg shadow-green-200'
              : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md shadow-amber-200 hover:shadow-lg hover:shadow-amber-300'
          }`}
        >
          {copied ? (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}
