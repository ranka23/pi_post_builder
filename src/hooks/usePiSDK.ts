// Pi SDK TypeScript declarations
declare global {
  interface Window {
    Pi?: {
      init: (config: { version: string; sandbox?: boolean }) => void;
      authenticate: (
        scopes: string[],
        onIncompletePaymentFound?: (payment: unknown) => void
      ) => Promise<{ accessToken: string; user: { uid: string; username: string } }>;
      createPayment: (
        paymentData: { amount: number; memo: string; metadata: Record<string, unknown> },
        callbacks: {
          onReadyForServerApproval: (paymentId: string) => void;
          onReadyForServerCompletion: (paymentId: string, txid: string) => void;
          onCancel: (paymentId: string) => void;
          onError: (error: Error, paymentId?: string) => void;
        }
      ) => Promise<unknown>;
      showAd: (options?: { type?: 'interstitial' | 'rewarded' }) => Promise<{ result: string }>;
    };
  }
}

export interface PiUser {
  uid: string;
  username: string;
}

// Detect if running inside Pi Browser by checking the user agent
function isPiBrowserUserAgent(): boolean {
  if (typeof navigator === 'undefined') return false;
  return navigator.userAgent.toLowerCase().includes('pibrowser');
}

// Check if the Pi SDK is already loaded on window
export function isInPiBrowser(): boolean {
  return typeof window !== 'undefined' && (typeof window.Pi !== 'undefined' || isPiBrowserUserAgent());
}

// Dynamically load the Pi SDK script — only called inside Pi Browser
function loadPiSDKScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Already loaded
    if (window.Pi) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.minepi.com/pi-sdk.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Pi SDK'));
    document.head.appendChild(script);
  });
}

// Initialize Pi SDK — only attempts to load the SDK in Pi Browser
export async function initPiSDK(sandbox = false): Promise<void> {
  if (!isPiBrowserUserAgent()) {
    // Not in Pi Browser, skip loading to avoid MIME errors
    return;
  }

  try {
    await loadPiSDKScript();
    if (window.Pi) {
      window.Pi.init({ version: '2.0', sandbox });
    }
  } catch (error) {
    console.warn('Pi SDK could not be loaded:', error);
  }
}

// Authenticate user
export async function authenticateUser(): Promise<PiUser | null> {
  if (!window.Pi) return null;

  try {
    const auth = await window.Pi.authenticate(['username'], (payment) => {
      console.log('Incomplete payment found:', payment);
    });
    return auth.user;
  } catch (error) {
    console.error('Pi authentication failed:', error);
    return null;
  }
}

// Show Pi Ad - returns true if ad completed successfully
export async function showPiAd(): Promise<boolean> {
  if (!window.Pi) {
    console.warn('Pi SDK not available — showing fallback ad');
    return false; // Fall back to simulated ad
  }

  try {
    const result = await window.Pi.showAd({ type: 'interstitial' });
    return result.result === 'completed' || result.result === 'dismissed';
  } catch (error) {
    console.error('Pi Ad failed:', error);
    return false; // Fall back to simulated ad
  }
}

export default {
  isInPiBrowser,
  initPiSDK,
  authenticateUser,
  showPiAd,
};
