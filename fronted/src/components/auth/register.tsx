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
import { FormField } from '../account/formfield';

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
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

interface RegisterFormData {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export default function Register() {
  const router = useRouter();
  const { register: authRegister } = useAuth();
  const [serverMessage, setServerMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });
  
  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setServerMessage('');
    try {
      const response = await authRegister(
        data.username,
        data.first_name,
        data.last_name,
        data.email,
        data.password
      );

      if (response.success && response.user) {
        setServerMessage('Registration successful! Redirecting to login...');
        await new Promise(resolve => setTimeout(resolve, 1500));
        router.push('/auth/login');
      } else {
        setServerMessage(response.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
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
                <h1>Create Account</h1>
                <motion.div
                              id="underline"
                              initial={{ width: '100%' }}
                              whileInView={{width: '50%'}}
                              transition={{ duration: 0.8, delay: 0.2 }}
                            />
              </motion.div>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <FormField
            label="Username"
            name="username"
            register={register}
            error={errors.username?.message}
          />
          <div className="name-fields">
            <FormField
              label="First Name"
              name="first_name"
              register={register}
              error={errors.first_name?.message}
            />
            <FormField
              label="Last Name"
              name="last_name"
              register={register}
              error={errors.last_name?.message}
            />
          </div>
          
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
              'Create Account'
            )}
          </motion.button>

          <div className="auth-links">
            <Link href="/auth/login">
              Already have an account? Login
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