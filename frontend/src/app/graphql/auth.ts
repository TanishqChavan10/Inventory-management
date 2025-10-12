import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation Register($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      accessToken
      user {
        id
        username
        email
        fullName
        role
        isActive
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      accessToken
      user {
        id
        username
        email
        fullName
        role
        isActive
      }
    }
  }
`;

export const GET_CURRENT_USER = gql`
  query Me {
    me {
      id
      username
      email
      fullName
      role
      isActive
      createdAt
      updatedAt
      lastLogin
    }
  }
`;