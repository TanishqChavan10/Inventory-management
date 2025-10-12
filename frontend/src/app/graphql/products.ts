// src/graphql/products.ts

import { gql } from '@apollo/client';

// Product Fragment for reusability
const PRODUCT_FRAGMENT = gql`
  fragment ProductFragment on Product {
    product_id
    product_name
    default_price
    stock
    min_stock
    categories {
      category_id
      name
    }
  }
`;

// Fetches the list of products
export const GET_PRODUCTS = gql`
  ${PRODUCT_FRAGMENT}
  query Products {
    products {
      ...ProductFragment
    }
  }
`;

// Get a single product by ID
export const GET_PRODUCT = gql`
  ${PRODUCT_FRAGMENT}
  query Product($id: Int!) {
    product(id: $id) {
      ...ProductFragment
    }
  }
`;

// Search products by name
export const SEARCH_PRODUCTS = gql`
  ${PRODUCT_FRAGMENT}
  query SearchProducts($searchTerm: String!) {
    searchProducts(searchTerm: $searchTerm) {
      ...ProductFragment
    }
  }
`;

// Get products by exact name
export const GET_PRODUCTS_BY_NAME = gql`
  ${PRODUCT_FRAGMENT}
  query ProductsByName($name: String!) {
    productsByName(name: $name) {
      ...ProductFragment
    }
  }
`;

// Gets products by category
export const GET_PRODUCTS_BY_CATEGORY = gql`
  ${PRODUCT_FRAGMENT}
  query ProductsByCategory($categoryId: Int!) {
    productsByCategory(categoryId: $categoryId) {
      ...ProductFragment
    }
  }
`;

// Gets low stock products
export const GET_LOW_STOCK_PRODUCTS = gql`
  ${PRODUCT_FRAGMENT}
  query LowStockProducts {
    lowStockProducts {
      ...ProductFragment
    }
  }
`;

// Get total inventory value
export const GET_TOTAL_INVENTORY_VALUE = gql`
  query TotalInventoryValue {
    totalInventoryValue
  }
`;

// Creates a new product
export const CREATE_PRODUCT = gql`
  mutation CreateProduct($createProductInput: CreateProductInput!) {
    createProduct(createProductInput: $createProductInput) {
      product_id
      product_name
      default_price
      stock
      min_stock
      categories {
        category_id
        name
      }
    }
  }
`;

// Updates an existing product
export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($updateProductInput: UpdateProductInput!) {
    updateProduct(updateProductInput: $updateProductInput) {
      product_id
      product_name
      default_price
      stock
      min_stock
      categories {
        category_id
        name
      }
    }
  }
`;

// Update product stock
export const UPDATE_PRODUCT_STOCK = gql`
  mutation UpdateProductStock($id: Int!, $quantity: Int!) {
    updateProductStock(id: $id, quantity: $quantity) {
      product_id
      product_name
      stock
      min_stock
    }
  }
`;

// Deletes a product
export const DELETE_PRODUCT = gql`
  mutation RemoveProduct($id: Int!) {
    removeProduct(id: $id)
  }
`;

// Query for comprehensive inventory analytics
export const GET_INVENTORY_ANALYTICS = gql`
  query GetInventoryAnalytics {
    products {
      product_id
      product_name
      default_price
      stock
      min_stock
      categories {
        category_id
        name
      }
    }
    lowStockProducts {
      product_id
      product_name
      default_price
      stock
      min_stock
      categories {
        category_id
        name
      }
    }
    totalInventoryValue
  }
`;

// Query for inventory overview statistics
export const GET_INVENTORY_OVERVIEW = gql`
  query GetInventoryOverview {
    products {
      product_id
      stock
      min_stock
    }
    totalInventoryValue
  }
`;