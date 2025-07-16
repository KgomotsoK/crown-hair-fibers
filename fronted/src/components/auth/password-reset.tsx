// pages/password-reset.tsx
'use client';
import { useAuth } from '@/context/AuthContext';
import '@/styles/forms.css';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { FormField } from '../account/formfield';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});

interface PasswordResetFormData {
  email: string;
}

export default function PasswordReset() {
  const { requestPasswordReset } = useAuth();
  const [serverMessage, setServerMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetFormData>({
    resolver: yupResolver(schema),
  });
  
  const onSubmit = async (data: PasswordResetFormData) => {
    setLoading(true);
    setServerMessage('');
    try {
      await requestPasswordReset(data.email);
      setServerMessage(`A password reset link has been sent to your email ${data.email}.`);
    } catch (error) {
      setServerMessage(error instanceof Error ? error.message : 'Failed to send password reset email. Please try again.');
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
        <h1>Password Reset</h1>
        <motion.div
          id="underline"
          initial={{ width: '100%' }}
          whileInView={{ width: '50%' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </motion.div>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <FormField
          label="Email"
          type="email"
          name="email"
          register={register}
          error={errors.email?.message}
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
          className={`alert ${serverMessage.includes('sent') ? 'alert-success' : 'alert-error'}`}
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
