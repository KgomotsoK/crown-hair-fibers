import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || !user) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user) {
        return null; // Or a loading spinner
    }

    return <>{children}</>;
};

export default ProtectedRoute;