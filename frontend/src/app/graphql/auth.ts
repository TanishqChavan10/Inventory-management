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
      companies {
        id
        name
        role
        isActive
      }
      activeCompanyId
    }
  }
`;

// Company mutations
export const CREATE_COMPANY = gql`
  mutation CreateCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      id
      name
      gstNumber
      currency
      businessType
      logoUrl
      createdAt
    }
  }
`;

export const SWITCH_COMPANY = gql`
  mutation SwitchCompany($companyId: ID!) {
    switchCompany(companyId: $companyId) {
      success
      activeCompanyId
    }
  }
`;

export const ACCEPT_INVITE = gql`
  mutation AcceptInvite($token: String!) {
    acceptInvite(token: $token) {
      success
      company {
        id
        name
      }
      role
    }
  }
`;

export const JOIN_COMPANY_WITH_CODE = gql`
  mutation JoinCompanyWithCode($code: String!) {
    joinCompanyWithCode(code: $code) {
      success
      company {
        id
        name
      }
      role
    }
  }
`;