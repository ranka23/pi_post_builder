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

// Check if running inside Pi Browser
export function isInPiBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.Pi !== 'undefined';
}

// Initialize Pi SDK
export function initPiSDK(sandbox = false): void {
  if (window.Pi) {
    window.Pi.init({ version: '2.0', sandbox });
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
    console.warn('Pi SDK not available - showing fallback');
    return true; // Allow action outside Pi Browser
  }

  try {
    const result = await window.Pi.showAd({ type: 'interstitial' });
    return result.result === 'completed' || result.result === 'dismissed';
  } catch (error) {
    console.error('Pi Ad failed:', error);
    // Still allow action if ad fails
    return true;
  }
}

export default {
  isInPiBrowser,
  initPiSDK,
  authenticateUser,
  showPiAd,
};
