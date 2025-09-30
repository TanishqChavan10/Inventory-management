// src/graphql/product-categories.ts

import { gql } from '@apollo/client';

// Product Category Fragment for reusability
const PRODUCT_CATEGORY_FRAGMENT = gql`
  fragment ProductCategoryFragment on ProductCategory {
    product_id
    category_id
  }
`;

// Get all product-category relationships
export const GET_PRODUCT_CATEGORIES = gql`
  ${PRODUCT_CATEGORY_FRAGMENT}
  query ProductCategories {
    productCategories {
      ...ProductCategoryFragment
    }
  }
`;

// Get product-category relationships by product
export const GET_PRODUCT_CATEGORIES_BY_PRODUCT = gql`
  ${PRODUCT_CATEGORY_FRAGMENT}
  query ProductCategoriesByProduct($productId: Int!) {
    productCategoriesByProduct(productId: $productId) {
      ...ProductCategoryFragment
    }
  }
`;

// Get product-category relationships by category
export const GET_PRODUCT_CATEGORIES_BY_CATEGORY = gql`
  ${PRODUCT_CATEGORY_FRAGMENT}
  query ProductCategoriesByCategory($categoryId: Int!) {
    productCategoriesByCategory(categoryId: $categoryId) {
      ...ProductCategoryFragment
    }
  }
`;

// Create a product-category relationship
export const CREATE_PRODUCT_CATEGORY = gql`
  mutation CreateProductCategory($createProductCategoryInput: CreateProductCategoryInput!) {
    createProductCategory(createProductCategoryInput: $createProductCategoryInput) {
      product_id
      category_id
    }
  }
`;

// Remove a product-category relationship
export const REMOVE_PRODUCT_CATEGORY = gql`
  mutation RemoveProductCategory($removeProductCategoryInput: RemoveProductCategoryInput!) {
    removeProductCategory(removeProductCategoryInput: $removeProductCategoryInput)
  }
`;

// Remove all categories from a product
export const REMOVE_ALL_CATEGORIES_FROM_PRODUCT = gql`
  mutation RemoveAllCategoriesFromProduct($productId: Int!) {
    removeAllCategoriesFromProduct(productId: $productId)
  }
`;

// Remove all products from a category
export const REMOVE_ALL_PRODUCTS_FROM_CATEGORY = gql`
  mutation RemoveAllProductsFromCategory($categoryId: Int!) {
    removeAllProductsFromCategory(categoryId: $categoryId)
  }
`;

// Bulk assign categories to a product
export const BULK_ASSIGN_CATEGORIES_TO_PRODUCT = gql`
  mutation BulkAssignCategoriesToProduct($productId: Int!, $categoryIds: [Int!]!) {
    bulkAssignCategoriesToProduct(productId: $productId, categoryIds: $categoryIds) {
      product_id
      category_id
    }
  }
`;