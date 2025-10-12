'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }

    // Check if user has required role (if specified)
    if (!loading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
      router.push('/dashboard'); // Redirect to dashboard if not authorized
    }
  }, [isAuthenticated, loading, router, user, requiredRole]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Only render children if authenticated and (no required role or has required role)
  return isAuthenticated && (!requiredRole || user?.role === requiredRole) ? <>{children}</> : null;
}
