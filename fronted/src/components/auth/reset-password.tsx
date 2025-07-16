'use client';
import { useAuth } from '@/context/AuthContext';
import '@/styles/forms.css';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { FormField } from '../account/formfield';

const schema = yup.object().shape({
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

interface ResetPasswordFormData {
  password: string;
  confirm_password: string;
}

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();
  const [serverMessage, setServerMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(schema),
  });
  
  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token || !email) {
      setServerMessage('Invalid or missing reset token.');
      return;
    }

    setLoading(true);
    setServerMessage('');
    try {
      await resetPassword(token, data.password);
      setServerMessage('Password reset successful! Redirecting to login...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push('/login');
    } catch (error) {
      setServerMessage(error instanceof Error ? error.message : 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.main
      className="formpage-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="page-title"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Reset Password</h1>
        <motion.div
          id="underline"
          initial={{ width: '100%' }}
          whileInView={{ width: '50%' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </motion.div>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <FormField
          label="New Password"
          type="password"
          name="password"
          register={register}
          error={errors.password?.message}
        />
        
        <FormField
          label="Confirm Password"
          type="password"
          name="confirm_password"
          register={register}
          error={errors.confirm_password?.message}
        />
        
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              ⟳
            </motion.div>
          ) : (
            'Reset Password'
          )}
        </motion.button>

        <div className="auth-links">
          <Link href="/login">
            Back to Login
          </Link>
        </div>
      </form>
      
      {serverMessage && (
        <motion.div
          className={`alert ${serverMessage.includes('successful') ? 'alert-success' : 'alert-error'}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {serverMessage}
        </motion.div>
      )}
    </motion.main>
  );
}
