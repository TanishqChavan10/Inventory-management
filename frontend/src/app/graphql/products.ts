// src/graphql/products.ts

import { gql } from '@apollo/client';

// Fetches the list of products for your table
export const GET_PRODUCTS = gql`
  query Products($category: String, $page: Int, $limit: Int) {
    products(category: $category, page: $page, limit: $limit) {
      id
      sku
      name
      category
      quantity
      price
    }
  }
`;

// Creates a new product
export const ADD_PRODUCT = gql`
  mutation AddProduct($createProductInput: CreateProductInput!) {
    addProduct(createProductInput: $createProductInput) {
      id
    }
  }
`;

// Updates an existing product
export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($updateProductInput: UpdateProductInput!) {
    updateProduct(updateProductInput: $updateProductInput) {
      id
    }
  }
`;

// Deletes a product
export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      id
    }
  }
`;
