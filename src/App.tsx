import { useState, useCallback, useRef, useEffect } from 'react';
import {
  generateTemplates,
  languageLabels,
  styleLabels,
  getTotalTemplateCount,
  type Language,
  type Style,
} from './templates/index';
import TemplateCard from './components/TemplateCard';
import AdModal from './components/AdModal';
import { initPiSDK, isInPiBrowser } from './hooks/usePiSDK';

export default function App() {
  const [username, setUsername] = useState('');
  const [language, setLanguage] = useState<Language>('english');
  const [style, setStyle] = useState<Style>('excited');
  const [generated, setGenerated] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [totalCopies, setTotalCopies] = useState(0);
  const [inPiBrowser, setInPiBrowser] = useState(false);
  const pendingCopy = useRef<{ text: string; cb: () => void } | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Initialize Pi SDK on mount
  useEffect(() => {
    const isPi = isInPiBrowser();
    setInPiBrowser(isPi);
    if (isPi) {
      // Set sandbox to false for production
      initPiSDK(false);
    }
  }, []);

  const templates = generated ? generateTemplates(username, language, style) : [];

  const handleGenerate = () => {
    if (!username.trim()) return;
    setGenerated(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCopyRequest = useCallback((text: string, cb: () => void) => {
    pendingCopy.current = { text, cb };
    setShowAd(true);
  }, []);

  const handleAdComplete = useCallback(() => {
    if (pendingCopy.current) {
      navigator.clipboard.writeText(pendingCopy.current.text).then(() => {
        pendingCopy.current?.cb();
        pendingCopy.current = null;
        setTotalCopies((prev) => prev + 1);
      }).catch(() => {
        // Fallback for clipboard
        const textarea = document.createElement('textarea');
        textarea.value = pendingCopy.current?.text || '';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        pendingCopy.current?.cb();
        pendingCopy.current = null;
        setTotalCopies((prev) => prev + 1);
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900">
        {/* Background image */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url(/images/pi-hero-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900" />

        {/* Floating orbs */}
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-12 text-center sm:px-6 sm:pb-20 sm:pt-16">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-300 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
            </span>
            {inPiBrowser ? (
              <>Pi Browser Connected • Real Ads Enabled</>
            ) : (
              <>Free Tool • No Login Required</>
            )}
          </div>

          {/* Title */}
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
              Pi Post Builder
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-300 sm:text-xl">
            Generate scroll-stopping, emoji-packed referral posts in{' '}
            <span className="font-semibold text-white">seconds</span>. Grow your Security Circle
            across Facebook, WhatsApp, X, and more.
          </p>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌍</span>
              <span>5 Languages</span>
            </div>
            <div className="h-4 w-px bg-gray-700" />
            <div className="flex items-center gap-2">
              <span className="text-lg">🎨</span>
              <span>3 Styles</span>
            </div>
            <div className="h-4 w-px bg-gray-700" />
            <div className="flex items-center gap-2">
              <span className="text-lg">📄</span>
              <span>{getTotalTemplateCount()}+ Templates</span>
            </div>
            <div className="h-4 w-px bg-gray-700" />
            <div className="flex items-center gap-2">
              <span className="text-lg">📋</span>
              <span>One-Click Copy</span>
            </div>
            {totalCopies > 0 && (
              <>
                <div className="h-4 w-px bg-gray-700" />
                <div className="flex items-center gap-2 text-amber-400">
                  <span className="text-lg">✅</span>
                  <span>{totalCopies} Copied</span>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Builder Section */}
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Builder Card */}
        <div className="-mt-20 relative z-10 mb-12 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl shadow-gray-200/50">
          <div className="border-b border-gray-100 bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-5 sm:px-8">
            <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 text-lg text-white shadow-md shadow-amber-200">
                ⚙️
              </span>
              Configure Your Post
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Enter your details below and we'll generate ready-to-share templates
            </p>
          </div>

          <div className="space-y-8 p-6 sm:p-8">
            {/* Username Input */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                🔑 Your Pi Username / Referral Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (generated) setGenerated(false);
                  }}
                  placeholder="e.g., PioneerJohn123"
                  className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-5 py-3.5 text-lg font-medium text-gray-900 placeholder-gray-400 transition-all focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-100"
                />
                {username && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                      ✓ Ready
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Language Selection */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                🌐 Language
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {(Object.keys(languageLabels) as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      if (generated) setGenerated(false);
                    }}
                    className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all ${
                      language === lang
                        ? 'border-amber-400 bg-amber-50 text-amber-700 shadow-md shadow-amber-100'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {languageLabels[lang]}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selection */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                🎨 Post Style
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                {(Object.keys(styleLabels) as Style[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStyle(s);
                      if (generated) setGenerated(false);
                    }}
                    className={`rounded-xl border-2 px-4 py-4 text-left transition-all ${
                      style === s
                        ? 'border-amber-400 bg-amber-50 shadow-md shadow-amber-100'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{styleLabels[s].icon}</span>
                      <span className={`font-bold ${style === s ? 'text-amber-700' : 'text-gray-800'}`}>
                        {styleLabels[s].label}
                      </span>
                    </div>
                    <p className={`mt-1 text-xs ${style === s ? 'text-amber-600' : 'text-gray-500'}`}>
                      {styleLabels[s].desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!username.trim()}
              className={`w-full rounded-xl px-6 py-4 text-lg font-bold transition-all duration-200 ${
                username.trim()
                  ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-white shadow-lg shadow-amber-200 hover:shadow-xl hover:shadow-amber-300 active:scale-[0.99]'
                  : 'cursor-not-allowed bg-gray-200 text-gray-400'
              }`}
            >
              {username.trim() ? (
                <span className="flex items-center justify-center gap-2">
                  <span>🚀</span>
                  Generate Templates
                  <span>🚀</span>
                </span>
              ) : (
                'Enter your username to generate'
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {generated && templates.length > 0 && (
          <div ref={resultsRef} className="space-y-8">
            {/* Results Header */}
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                ✨ Your Templates Are Ready!
              </h2>
              <p className="text-gray-500">
                Click <span className="font-semibold text-amber-600">"Copy"</span> on any template
                to copy it to your clipboard
              </p>
            </div>

            {/* Template Cards */}
            <div className="grid gap-6 lg:grid-cols-1">
              {templates.map((template, i) => (
                <TemplateCard
                  key={`${language}-${style}-${i}`}
                  title={template.title}
                  body={template.body}
                  platform={template.platform}
                  icon={template.icon}
                  index={i}
                  onCopyRequest={handleCopyRequest}
                />
              ))}
            </div>

            {/* Tips Section */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 sm:p-8">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-blue-900">
                <span>💡</span> Pro Tips for Maximum Conversions
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex gap-3">
                  <span className="mt-0.5 text-xl">🕐</span>
                  <div>
                    <p className="font-semibold text-blue-800">Post at Peak Hours</p>
                    <p className="text-sm text-blue-600">
                      Share between 7-9 AM and 7-10 PM in your target audience's timezone
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5 text-xl">🔄</span>
                  <div>
                    <p className="font-semibold text-blue-800">Rotate Templates</p>
                    <p className="text-sm text-blue-600">
                      Don't post the same template twice — switch styles and languages
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5 text-xl">🎯</span>
                  <div>
                    <p className="font-semibold text-blue-800">Target Crypto Groups</p>
                    <p className="text-sm text-blue-600">
                      Post in crypto-related Facebook groups and Telegram channels
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5 text-xl">📸</span>
                  <div>
                    <p className="font-semibold text-blue-800">Add a Screenshot</p>
                    <p className="text-sm text-blue-600">
                      Include a screenshot of your Pi mining dashboard for credibility
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <div className="mb-3 text-2xl">π</div>
          <p className="text-sm text-gray-500">
            Pi Post Builder — Free referral post generator for Pi Network pioneers
          </p>
          <p className="mt-2 text-xs text-gray-400">
            This tool is not affiliated with or endorsed by Pi Network. It's a free community utility.
          </p>
        </div>
      </footer>

      {/* Ad Modal */}
      <AdModal
        isOpen={showAd}
        onClose={() => setShowAd(false)}
        onComplete={handleAdComplete}
      />
    </div>
  );
}
