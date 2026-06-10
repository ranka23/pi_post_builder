import { useState, useEffect, useCallback } from 'react';
import { isInPiBrowser, showPiAd } from '../hooks/usePiSDK';

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function AdModal({ isOpen, onClose, onComplete }: AdModalProps) {
  const [countdown, setCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);
  const [adPhase, setAdPhase] = useState<'loading' | 'playing' | 'done'>('loading');
  const [usingRealAd, setUsingRealAd] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setCanSkip(false);
      setAdPhase('loading');
      setUsingRealAd(false);
      return;
    }

    // Check if we're in Pi Browser and should use real ads
    if (isInPiBrowser()) {
      setUsingRealAd(true);
      setAdPhase('loading');
      
      // Show real Pi Ad
      showPiAd().then((success) => {
        if (success) {
          onComplete();
          onClose();
        } else {
          // Fallback to simulated ad if real ad fails
          setUsingRealAd(false);
          setAdPhase('playing');
        }
      });
      return;
    }

    // Simulate ad loading for non-Pi Browser
    const loadTimer = setTimeout(() => {
      setAdPhase('playing');
    }, 800);

    return () => clearTimeout(loadTimer);
  }, [isOpen, onComplete, onClose]);

  useEffect(() => {
    if (adPhase !== 'playing' || usingRealAd) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanSkip(true);
          setAdPhase('done');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [adPhase, usingRealAd]);

  const handleContinue = useCallback(() => {
    onComplete();
    onClose();
  }, [onComplete, onClose]);

  if (!isOpen) return null;

  // If using real Pi Ad, show minimal loading state
  if (usingRealAd) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="relative flex flex-col items-center gap-4 rounded-2xl bg-white p-8 shadow-2xl">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-500" />
          <p className="text-sm text-gray-600">Loading Pi Ad...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-lg">
                π
              </div>
              <span className="font-bold text-white">Pi Network Ad</span>
            </div>
            {!canSkip && (
              <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white">
                {countdown}s
              </span>
            )}
          </div>
        </div>

        {/* Ad Content */}
        <div className="p-6">
          {adPhase === 'loading' ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-500" />
              <p className="text-sm text-gray-500">Loading Pi Ad...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Simulated Ad */}
              <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-6 text-center">
                <div className="mb-3 text-4xl">🪙</div>
                <h3 className="mb-2 text-xl font-bold text-white">Pi Browser</h3>
                <p className="mb-4 text-sm text-purple-200">
                  Explore the Pi ecosystem — DApps, wallet, and more. The future of Web3 starts here!
                </p>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white">
                  <span>⭐</span>
                  <span>4.8 Rating • 10M+ Downloads</span>
                </div>
              </div>

              {/* Notice for non-Pi Browser users */}
              <div className="flex items-center justify-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                <span>💡</span>
                <span>Open in Pi Browser to see real Pi Ads and support developers!</span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-1000 ease-linear"
                  style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4">
          {canSkip ? (
            <button
              onClick={handleContinue}
              className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-3 font-bold text-white shadow-lg shadow-amber-200 transition-all hover:shadow-xl hover:shadow-amber-300 active:scale-[0.98]"
            >
              ✅ Continue & Copy Text
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 py-2 text-sm text-gray-400">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-20" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <span>Please wait {countdown} seconds...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
