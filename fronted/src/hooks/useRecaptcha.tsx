import { executeRecaptcha, verifyRecaptcha } from '@/utils/api';
import { useCallback } from 'react';

export const useRecaptcha = () => {
  const validateRecaptcha = useCallback(async (action: string): Promise<boolean> => {
    try {
      const token = await executeRecaptcha(action);
      if (!token) {
        console.error('Failed to execute reCAPTCHA');
        return false;
      }

      const isValid = await verifyRecaptcha(token);
      if (!isValid) {
        console.error('reCAPTCHA verification failed');
        return false;
      }

      return true;
    } catch (error) {
      console.error('reCAPTCHA validation error:', error);
      return false;
    }
  }, []);

  return { validateRecaptcha };
}; 