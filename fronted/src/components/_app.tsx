import Layout from '@/components/Layout'; // Import Layout component
import ProtectedRoute from '@/components/ProtectedRoute';
import '@/styles/globals.css'; // Import global styles
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React from 'react';
import { AuthProvider } from '../context/AuthContext';

const noAuthRequired = ['/login', '/register', '/howitworks', '/about', '/contact','/product', '/products', '/productCard', '/[id]', '/checkout', ]; // Pages that don't require authentication

export default function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const [queryClient] = React.useState(() => new QueryClient());

    // Check if the path matches any of the non-protected paths, including dynamic routes.
const isProtected = !noAuthRequired.some((path) => {
  if (path.includes('[')) {
    // For dynamic routes, replace placeholders with regex to check the actual path.
    const dynamicRouteRegex = new RegExp(`^${path.replace(/\[.*\]/, '.*')}$`);
    return dynamicRouteRegex.test(router.pathname);
  }
  return router.pathname.startsWith(path);
});
    return (
        
        
            <AuthProvider>
                <Layout>
            {isProtected ? (
                <ProtectedRoute>
                <QueryClientProvider client={queryClient}>
                    <Component {...pageProps} />
                </QueryClientProvider>
            </ProtectedRoute>
            ) : (
                    
                    <QueryClientProvider client={queryClient}>
                    <Component {...pageProps} />
                    </QueryClientProvider>
            )}
            </Layout>
        </AuthProvider>
        
        
    );
}

