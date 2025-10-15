import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
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
  mutation Login($input: LoginInput!) {
    login(input: $input) {
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