import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a compatibility instance
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('next').NextConfig['eslint']} */
export default {
  ignorePatterns: ['.eslintrc.js'],
  extends: [
    'eslint:recommended',
    'next/core-web-vitals'
  ],
  rules: {
    // Disable specific error rules that are causing issues
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_', 
      varsIgnorePattern: '^_',
      ignoreRestSiblings: true 
    }],
    'react-hooks/exhaustive-deps': 'warn',
    'react/no-unescaped-entities': 'warn',
    '@next/next/no-img-element': 'warn'
  }
};
