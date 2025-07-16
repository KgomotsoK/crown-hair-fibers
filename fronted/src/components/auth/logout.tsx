'use client';
import { useAuth } from '@/context/AuthContext';
import '@/styles/forms.css';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function Logout() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

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
        <h1>Logging Out</h1>
        <motion.div
          id="underline"
          initial={{ width: '100%' }}
          whileInView={{ width: '50%' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </motion.div>
      <motion.div
        className="form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p>You have been logged out successfully.</p>
        <p>Redirecting to homepage...</p>
      </motion.div>
    </motion.main>
  );
}