import { gql } from "@apollo/client";

export const GET_CURRENT_USER = gql`
  query Me {
    me {
      id
      clerkId
      email
      firstName
      lastName
      imageUrl
      username
      role
      isActive
      createdAt
      updatedAt
      lastLogin
    }
  }
`;

// Legacy mutations - no longer used with Clerk
export const REGISTER_USER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      user {
        id
        username
        email
        role
        isActive
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        id
        username
        email
        role
        isActive
      }
    }
  }
`;