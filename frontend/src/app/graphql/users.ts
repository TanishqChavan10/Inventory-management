import { gql } from '@apollo/client';

// Query to fetch employees
export const GET_EMPLOYEES = gql`
  query GetEmployees {
    employees {
      employee_id
      name
    }
  }
`;

// Query to fetch customers
export const GET_CUSTOMERS = gql`
  query GetCustomers {
    customers {
      customer_id
      name
      phone_number
      created_date
    }
  }
`;