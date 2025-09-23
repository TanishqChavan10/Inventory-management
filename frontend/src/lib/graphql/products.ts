// Optimized GraphQL operations with proper typing
import { gql, TypedDocumentNode } from '@apollo/client';
import type { Product } from '@/types';

// Fragments for reusability and better caching
const PRODUCT_FRAGMENT = gql`
  fragment ProductFragment on Product {
    id
    name
    category
    quantity
    price
    minCount
  }
`;

// Optimized queries with fragments
export const GET_PRODUCTS: TypedDocumentNode<
  { products: Product[]; productsCount: number },
  { page?: number; limit?: number; category?: string | null }
> = gql`
  ${PRODUCT_FRAGMENT}
  query GetProducts($page: Int, $limit: Int, $category: String) {
    products(page: $page, limit: $limit, category: $category) {
      ...ProductFragment
    }
    productsCount(category: $category)
  }
`;

export const ADD_PRODUCT: TypedDocumentNode<
  { addProduct: Product },
  { createProductInput: Omit<Product, 'id'> }
> = gql`
  ${PRODUCT_FRAGMENT}
  mutation AddProduct($createProductInput: CreateProductInput!) {
    addProduct(createProductInput: $createProductInput) {
      ...ProductFragment
    }
  }
`;

export const UPDATE_PRODUCT: TypedDocumentNode<
  { updateProduct: Product },
  { updateProductInput: Product }
> = gql`
  ${PRODUCT_FRAGMENT}
  mutation UpdateProduct($updateProductInput: UpdateProductInput!) {
    updateProduct(updateProductInput: $updateProductInput) {
      ...ProductFragment
    }
  }
`;

export const DELETE_PRODUCT: TypedDocumentNode<{ deleteProduct: boolean }, { id: string }> = gql`
  mutation DeleteProduct($id: String!) {
    deleteProduct(id: $id)
  }
`;
