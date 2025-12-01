// lib/clerk-apollo-client.ts

import { ApolloClient, InMemoryCache, ApolloLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { HttpLink } from "@apollo/client/link/http";

// Auth link that gets token from window (set by ApolloAppProvider)
const authLink = new ApolloLink((operation, forward) => {
  const token = typeof window !== 'undefined'
    ? (window as any).__clerk_session_token
    : null;

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  }));

  return forward(operation);
});

// Error handling
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message }) => {
      console.error(`[GraphQL error]: ${message}`);
    });

  if (networkError) console.error(`[Network error]: ${networkError}`);
});

// HTTP link
const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:5000/api/graphql",
});

// Final Apollo client
const clerkApolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

export default clerkApolloClient;
