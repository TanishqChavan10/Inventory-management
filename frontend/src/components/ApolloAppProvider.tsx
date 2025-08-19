'use client';

import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apollo-client"; // Adjust path if needed

export function ApolloAppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}