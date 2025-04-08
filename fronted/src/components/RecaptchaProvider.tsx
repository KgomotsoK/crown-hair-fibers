'use client';
import { useEffect } from 'react';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export default function RecaptchaProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Load the reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY || '6LcTHQorAAAAAE8-_l0ZYwOPVhMca8p8d9yu0gvw'}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      document.head.removeChild(script);
    };
  }, []);

  return <>{children}</>;
} 