import { gql, TypedDocumentNode } from '@apollo/client';
import { Category, CreateCategoryInput, UpdateCategoryInput } from '../../types';

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

// Get all categories (with products)
export const GET_CATEGORIES: TypedDocumentNode<
  { categories: Category[] },
  {}
> = gql`
  ${CATEGORY_FRAGMENT}
  query GetCategories {
    categories {
      ...CategoryFragment
    }
  }
`;

// Get all categories (simple - without products relation)
export const GET_CATEGORIES_SIMPLE: TypedDocumentNode<
  { categoriesSimple: Category[] },
  {}
> = gql`
  query GetCategoriesSimple {
    categoriesSimple {
      category_id
      name
    }
  }
`;

// Get a single category by ID
export const GET_CATEGORY: TypedDocumentNode<
  { category: Category },
  { id: number }
> = gql`
  ${CATEGORY_FRAGMENT}
  query GetCategory($id: Int!) {
    category(id: $id) {
      ...CategoryFragment
    }
  }
`;

// Search categories by name
export const SEARCH_CATEGORIES: TypedDocumentNode<
  { searchCategories: Category[] },
  { searchTerm: string }
> = gql`
  ${CATEGORY_FRAGMENT}
  query SearchCategories($searchTerm: String!) {
    searchCategories(searchTerm: $searchTerm) {
      ...CategoryFragment
    }
  }
`;

// Get categories by exact name
export const GET_CATEGORIES_BY_NAME: TypedDocumentNode<
  { categoriesByName: Category[] },
  { name: string }
> = gql`
  ${CATEGORY_FRAGMENT}
  query GetCategoriesByName($name: String!) {
    categoriesByName(name: $name) {
      ...CategoryFragment
    }
  }
`;

// Creates a new category
export const CREATE_CATEGORY: TypedDocumentNode<
  { createCategory: Category },
  { createCategoryInput: CreateCategoryInput }
> = gql`
  mutation CreateCategory($createCategoryInput: CreateCategoryInput!) {
    createCategory(createCategoryInput: $createCategoryInput) {
      category_id
      name
    }
  }
`;

// Updates an existing category
export const UPDATE_CATEGORY: TypedDocumentNode<
  { updateCategory: Category },
  { updateCategoryInput: UpdateCategoryInput }
> = gql`
  mutation UpdateCategory($updateCategoryInput: UpdateCategoryInput!) {
    updateCategory(updateCategoryInput: $updateCategoryInput) {
      category_id
      name
    }
  }
`;

// Deletes a category
export const DELETE_CATEGORY: TypedDocumentNode<
  { removeCategory: boolean },
  { id: number }
> = gql`
  mutation DeleteCategory($id: Int!) {
    removeCategory(id: $id)
  }
`;