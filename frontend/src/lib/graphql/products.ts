// Optimized GraphQL operations with proper typing
import { gql, TypedDocumentNode } from '@apollo/client';
import { Product, CreateProductInput, UpdateProductInput } from '../../types';

// Product Fragment for reusability and better caching
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

// Get all products
export const GET_PRODUCTS: TypedDocumentNode<
  { products: Product[] },
  {}
> = gql`
  ${PRODUCT_FRAGMENT}
  query GetProducts {
    products {
      ...ProductFragment
    }
  }
`;

// Get a single product by ID
export const GET_PRODUCT: TypedDocumentNode<
  { product: Product },
  { id: number }
> = gql`
  ${PRODUCT_FRAGMENT}
  query GetProduct($id: Int!) {
    product(id: $id) {
      ...ProductFragment
    }
  }
`;

// Search products by name
export const SEARCH_PRODUCTS: TypedDocumentNode<
  { searchProducts: Product[] },
  { searchTerm: string }
> = gql`
  ${PRODUCT_FRAGMENT}
  query SearchProducts($searchTerm: String!) {
    searchProducts(searchTerm: $searchTerm) {
      ...ProductFragment
    }
  }
`;

// Get products by exact name
export const GET_PRODUCTS_BY_NAME: TypedDocumentNode<
  { productsByName: Product[] },
  { name: string }
> = gql`
  ${PRODUCT_FRAGMENT}
  query GetProductsByName($name: String!) {
    productsByName(name: $name) {
      ...ProductFragment
    }
  }
`;

// Get products by category
export const GET_PRODUCTS_BY_CATEGORY: TypedDocumentNode<
  { productsByCategory: Product[] },
  { categoryId: number }
> = gql`
  ${PRODUCT_FRAGMENT}
  query GetProductsByCategory($categoryId: Int!) {
    productsByCategory(categoryId: $categoryId) {
      ...ProductFragment
    }
  }
`;

// Get low stock products
export const GET_LOW_STOCK_PRODUCTS: TypedDocumentNode<
  { lowStockProducts: Product[] },
  {}
> = gql`
  ${PRODUCT_FRAGMENT}
  query GetLowStockProducts {
    lowStockProducts {
      ...ProductFragment
    }
  }
`;

// Get total inventory value
export const GET_TOTAL_INVENTORY_VALUE: TypedDocumentNode<
  { totalInventoryValue: number },
  {}
> = gql`
  query GetTotalInventoryValue {
    totalInventoryValue
  }
`;

// Create a new product
export const CREATE_PRODUCT: TypedDocumentNode<
  { createProduct: Product },
  { createProductInput: CreateProductInput }
> = gql`
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

// Update an existing product
export const UPDATE_PRODUCT: TypedDocumentNode<
  { updateProduct: Product },
  { updateProductInput: UpdateProductInput }
> = gql`
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
export const UPDATE_PRODUCT_STOCK: TypedDocumentNode<
  { updateProductStock: Product },
  { id: number; quantity: number }
> = gql`
  mutation UpdateProductStock($id: Int!, $quantity: Int!) {
    updateProductStock(id: $id, quantity: $quantity) {
      product_id
      product_name
      stock
      min_stock
    }
  }
`;

// Delete a product
export const DELETE_PRODUCT: TypedDocumentNode<
  { removeProduct: boolean },
  { id: number }
> = gql`
  mutation DeleteProduct($id: Int!) {
    removeProduct(id: $id)
  }
`;