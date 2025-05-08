'use client';
import { useAuth } from '@/context/AuthContext';
import '@/styles/forms.css';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useRecaptcha } from '../../hooks/useRecaptcha';
import { FormField } from '../account/formfield';

interface LoginFormData {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [serverMessage, setServerMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { validateRecaptcha } = useRecaptcha();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {

    /*const recaptchaToken = await validateRecaptcha("contact_form");
    if (!recaptchaToken) {
      setSubmitStatus({
        type: 'error',
        message: 'Recaptcha validation failed. Please try again.'
      });
    }*/
    setLoading(true);
    setServerMessage(''); // Clear any previous messages
    try {
      const response = await login(data.email, data.password);
      if (response.success && response.user) {
        setServerMessage('Login successful! Redirecting...');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push('/');
      } else {
        setServerMessage(response.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setServerMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
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
        <h1>Welcome Back</h1>
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
        <FormField
          label="Password"
          type="password"
          name="password"
          register={register}
          error={errors.password?.message}
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
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <div className="loading-spinner"></div>
            </motion.div>
          ) : (
            'Login'
          )}
        </motion.button>

        <div className="auth-links">
          <Link href="/password-reset" className="forgot-link">
            Forgot Password?
          </Link>
          <Link href="/auth/register" className="register-link">
            Create Account
          </Link>
        </div>
      </form>

      {/* Display server messages (errors or success) */}
      {serverMessage && (
        <motion.div
          className={`alert ${
            serverMessage.includes('successful') ? 'alert-success' : 'alert-error'
          }`}
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