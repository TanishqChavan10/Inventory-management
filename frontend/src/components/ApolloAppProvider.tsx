'use client';

import { ApolloProvider } from '@apollo/client';
import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';
import client from '@/lib/apollo-client';
import { AuthProvider } from '@/context/auth-context';

export function ApolloAppProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, getToken } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    const injectToken = async () => {
      // Remove template parameter - just get the default session token
      const token = await getToken();

      // Set token in window for Apollo client auth link to use
      if (typeof window !== 'undefined') {
        (window as any).__clerk_session_token = token;
      }
    };

    injectToken();
  }, [isLoaded, getToken]);

  if (!isLoaded) {
    // Prevent Apollo from running before Clerk is ready
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <AuthProvider>{children}</AuthProvider>
    </ApolloProvider>
  );
}
