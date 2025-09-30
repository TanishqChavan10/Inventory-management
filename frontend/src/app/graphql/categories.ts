// src/graphql/categories.ts

import { gql } from '@apollo/client';

// Category Fragment for reusability
const CATEGORY_FRAGMENT = gql`
  fragment CategoryFragment on Category {
    category_id
    name
    products {
      product_id
      product_name
      default_price
      stock
      min_stock
    }
  }
`;

// Fetches the list of categories
export const GET_CATEGORIES = gql`
  ${CATEGORY_FRAGMENT}
  query Categories {
    categories {
      ...CategoryFragment
    }
  }
`;

// Get a single category by ID
export const GET_CATEGORY = gql`
  ${CATEGORY_FRAGMENT}
  query Category($id: Int!) {
    category(id: $id) {
      ...CategoryFragment
    }
  }
`;

// Search categories by name
export const SEARCH_CATEGORIES = gql`
  ${CATEGORY_FRAGMENT}
  query SearchCategories($searchTerm: String!) {
    searchCategories(searchTerm: $searchTerm) {
      ...CategoryFragment
    }
  }
`;

// Get categories by exact name
export const GET_CATEGORIES_BY_NAME = gql`
  ${CATEGORY_FRAGMENT}
  query CategoriesByName($name: String!) {
    categoriesByName(name: $name) {
      ...CategoryFragment
    }
  }
`;

// Creates a new category
export const CREATE_CATEGORY = gql`
  mutation CreateCategory($createCategoryInput: CreateCategoryInput!) {
    createCategory(createCategoryInput: $createCategoryInput) {
      category_id
      name
    }
  }
`;

// Updates an existing category
export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($updateCategoryInput: UpdateCategoryInput!) {
    updateCategory(updateCategoryInput: $updateCategoryInput) {
      category_id
      name
    }
  }
`;

// Deletes a category
export const DELETE_CATEGORY = gql`
  mutation RemoveCategory($id: Int!) {
    removeCategory(id: $id)
  }
`;