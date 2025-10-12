import { gql } from '@apollo/client';

// Query to fetch transactions with pagination, filtering, and sorting
export const GET_TRANSACTIONS = gql`
  query GetTransactions(
    $page: Int = 1
    $limit: Int = 10
    $status: String
    $customer_id: String
    $transaction_date: String
  ) {
    transactions(
      page: $page
      limit: $limit
      status: $status
      customer_id: $customer_id
      transaction_date: $transaction_date
    ) {
      transaction_id
      transaction_date
      payment_method
      total_amount
      payment_refno
      status
      customer_id
      customer_name
      employee_id
      employee_name
      items {
        transaction_id
        product_id
        quantity
        unit_price
        discount
        product_name
      }
    }
  }
`;

// Query to fetch single transaction details
export const GET_TRANSACTION = gql`
  query GetTransaction($transaction_id: ID!, $includeCustomerDetails: Boolean = false, $includeEmployeeDetails: Boolean = false) {
    transaction(transaction_id: $transaction_id) {
      transaction_id
      transaction_date
      payment_method
      total_amount
      payment_refno
      status
      customer_id
      customer_name
      employee_id
      employee_name
      tax_amount
      discount_amount
      items {
        transaction_id
        product_id
        quantity
        unit_price
        discount
        product_name
        category_name
      }
    }
    
    # Get customer details related to this transaction - use customer ID from the transaction
    customer(customer_id: $transaction_id) @include(if: $includeCustomerDetails) {
      customer_id
      name
      phone_number
      email
      address
      loyalty_points
      total_purchases
      created_date
    }
    
    # Get employee details related to this transaction - use employee ID from the transaction
    employee(employee_id: $transaction_id) @include(if: $includeEmployeeDetails) {
      employee_id
      name
    }
  }
`;

// Mutation to create a new transaction
export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($createTransactionInput: CreateTransactionInput!) {
    createTransaction(createTransactionInput: $createTransactionInput) {
      transaction_id
      transaction_date
      payment_method
      total_amount
      payment_refno
      customer_id
      employee_id
      items {
        product_id
        quantity
        unit_price
        discount
      }
    }
  }
`;

// Query to get sales overview statistics
export const GET_SALES_OVERVIEW = gql`
  query GetSalesOverview {
    salesOverview {
      totalRevenue
      totalTransactions
      avgOrderValue
      growthRate
    }
  }
`;

// Query to get comprehensive sales analytics
export const GET_SALES_ANALYTICS = gql`
  query GetSalesAnalytics {
    salesAnalytics {
      overview {
        totalRevenue
        totalTransactions
        avgOrderValue
        growthRate
      }
      topProducts {
        product_id
        product_name
        category_name
        total_sold
        revenue
        avg_price
        trend
      }
      paymentMethods {
        method
        count
        total_amount
        percentage
      }
      revenueByCategory {
        category
        revenue
        percentage
      }
    }
  }
`;

// Query to get top products
export const GET_TOP_PRODUCTS = gql`
  query GetTopProducts($limit: Int = 5) {
    topProducts(limit: $limit) {
      product_id
      product_name
      category_name
      total_sold
      revenue
      avg_price
      trend
    }
  }
`;

// Query to get payment method statistics
export const GET_PAYMENT_METHOD_STATS = gql`
  query GetPaymentMethodStats {
    paymentMethodStats {
      method
      count
      total_amount
      percentage
    }
  }
`;

// Query to get revenue by category
export const GET_REVENUE_BY_CATEGORY = gql`
  query GetRevenueByCategory {
    revenueByCategory {
      category
      revenue
      percentage
    }
  }
`;