// lib/apollo-client.ts
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    // Make sure this URL points to your NestJS backend's GraphQL endpoint
    uri: "http://localhost:5000/api/graphql", 
    cache: new InMemoryCache(),
});

export default client;