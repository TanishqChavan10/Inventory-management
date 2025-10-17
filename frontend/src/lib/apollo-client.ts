// lib/apollo-client.ts
import { ApolloClient, InMemoryCache, from, ApolloLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { HttpLink } from "@apollo/client/link/http";
import { getAuthToken } from "./auth-utils";

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      // Don't auto-redirect on auth errors - let the components handle it
      // This prevents infinite redirect loops
      if (message.includes('Unauthorized') || message.includes('Invalid token')) {
        console.log('Authentication error detected, components will handle redirect');
      }
    });
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

// Auth middleware link
const authMiddleware = new ApolloLink((operation, forward) => {
  // Get the auth token from local storage
  const token = getAuthToken();
  
  // Add the auth token to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }));

  return forward(operation);
});

// HTTP link
const httpLink = new HttpLink({
  uri: "http://localhost:5000/api/graphql",
});

const client = new ApolloClient({
  link: from([errorLink, authMiddleware, httpLink]),
  cache: new InMemoryCache(),
  connectToDevTools: true, // Enable dev tools in development
});

export default client;