// src/graphql/suppliers.ts

import { gql } from '@apollo/client';

// Supplier Fragment for reusability
const SUPPLIER_FRAGMENT = gql`
  fragment SupplierFragment on SupplierModel {
    supplier_id
    name
    email
    phone_no
    address
    contact_person
    registration_number
    tax_id
    status
    category_id
    created_date
    updated_date
  }
`;

// Shipment Fragment for reusability
const SHIPMENT_FRAGMENT = gql`
  fragment ShipmentFragment on ShipmentModel {
    shipment_id
    supplier_id
    ref_no
    received_date
    payment_status
    payment_mthd
    invoice_amt
    total_items
  }
`;

// Shipment Item Fragment for reusability
const SHIPMENT_ITEM_FRAGMENT = gql`
  fragment ShipmentItemFragment on ShipmentItemModel {
    id
    shipment_id
    product_id
    product_name
    quantity_received
    unit_price
    mfg_date
    expiry_date
    batch_number
  }
`;

// Product Fragment for supplier products
const PRODUCT_FRAGMENT = gql`
  fragment ProductFragment on Product {
    product_id
    product_name
    default_price
    stock
    min_stock
  }
`;

// Fetches products available for a supplier (based on supplier's category)
export const GET_SUPPLIER_PRODUCTS = gql`
  ${PRODUCT_FRAGMENT}
  query GetSupplierProducts($supplier_id: ID!) {
    supplierProducts(supplier_id: $supplier_id) {
      ...ProductFragment
    }
  }
`;

// Fetches the list of suppliers
export const GET_SUPPLIERS = gql`
  ${SUPPLIER_FRAGMENT}
  query GetSuppliers($page: Int, $limit: Int, $status: String) {
    suppliers(page: $page, limit: $limit, status: $status) {
      ...SupplierFragment
    }
  }
`;

// Fetches a single supplier by ID
export const GET_SUPPLIER = gql`
  ${SUPPLIER_FRAGMENT}
  query GetSupplier($supplier_id: ID!) {
    supplier(supplier_id: $supplier_id) {
      ...SupplierFragment
    }
  }
`;

// Fetches supplier statistics
export const GET_SUPPLIER_STATS = gql`
  query GetSupplierStats($supplier_id: ID!) {
    supplierStats(supplier_id: $supplier_id)
  }
`;

// Creates a new supplier
export const ADD_SUPPLIER = gql`
  ${SUPPLIER_FRAGMENT}
  mutation AddSupplier($createSupplierInput: CreateSupplierInput!) {
    addSupplier(createSupplierInput: $createSupplierInput) {
      ...SupplierFragment
    }
  }
`;

// Updates an existing supplier
export const UPDATE_SUPPLIER = gql`
  ${SUPPLIER_FRAGMENT}
  mutation UpdateSupplier($updateSupplierInput: UpdateSupplierInput!) {
    updateSupplier(updateSupplierInput: $updateSupplierInput) {
      ...SupplierFragment
    }
  }
`;

// Deletes a supplier
export const DELETE_SUPPLIER = gql`
  ${SUPPLIER_FRAGMENT}
  mutation DeleteSupplier($supplier_id: ID!) {
    deleteSupplier(supplier_id: $supplier_id) {
      ...SupplierFragment
    }
  }
`;

// Fetches shipments
export const GET_SHIPMENTS = gql`
  ${SHIPMENT_FRAGMENT}
  query GetShipments($page: Int, $limit: Int, $supplier_id: String) {
    shipments(page: $page, limit: $limit, supplier_id: $supplier_id) {
      ...ShipmentFragment
    }
  }
`;

// Fetches shipments by supplier
export const GET_SHIPMENTS_BY_SUPPLIER = gql`
  ${SHIPMENT_FRAGMENT}
  query GetShipmentsBySupplier($supplier_id: ID!) {
    shipmentsBySupplier(supplier_id: $supplier_id) {
      ...ShipmentFragment
    }
  }
`;

// Fetches a single shipment
export const GET_SHIPMENT = gql`
  ${SHIPMENT_FRAGMENT}
  query GetShipment($shipment_id: ID!) {
    shipment(shipment_id: $shipment_id) {
      ...ShipmentFragment
    }
  }
`;

// Creates a new shipment
export const ADD_SHIPMENT = gql`
  ${SHIPMENT_FRAGMENT}
  mutation AddShipment($createShipmentInput: CreateShipmentInput!) {
    addShipment(createShipmentInput: $createShipmentInput) {
      ...ShipmentFragment
    }
  }
`;

// Updates shipment payment status
export const UPDATE_SHIPMENT_PAYMENT_STATUS = gql`
  ${SHIPMENT_FRAGMENT}
  mutation UpdateShipmentPaymentStatus($shipment_id: ID!, $payment_status: String!) {
    updateShipmentPaymentStatus(shipment_id: $shipment_id, payment_status: $payment_status) {
      ...ShipmentFragment
    }
  }
`;

// Deletes a shipment
export const DELETE_SHIPMENT = gql`
  ${SHIPMENT_FRAGMENT}
  mutation DeleteShipment($shipment_id: ID!) {
    deleteShipment(shipment_id: $shipment_id) {
      ...ShipmentFragment
    }
  }
`;

// Fetches shipment items by supplier
export const GET_SHIPMENT_ITEMS_BY_SUPPLIER = gql`
  ${SHIPMENT_ITEM_FRAGMENT}
  query GetShipmentItemsBySupplier($supplier_id: ID!) {
    shipmentItemsBySupplier(supplier_id: $supplier_id) {
      ...ShipmentItemFragment
    }
  }
`;

// Fetches shipment items by shipment
export const GET_SHIPMENT_ITEMS_BY_SHIPMENT = gql`
  ${SHIPMENT_ITEM_FRAGMENT}
  query GetShipmentItemsByShipment($shipment_id: ID!) {
    shipmentItemsByShipment(shipment_id: $shipment_id) {
      ...ShipmentItemFragment
    }
  }
`;

// Fetches expiring shipment items
export const GET_EXPIRING_SHIPMENT_ITEMS = gql`
  ${SHIPMENT_ITEM_FRAGMENT}
  query GetExpiringShipmentItems($days: Int) {
    expiringShipmentItems(days: $days) {
      ...ShipmentItemFragment
    }
  }
`;

// Creates shipment items
export const ADD_SHIPMENT_ITEMS = gql`
  ${SHIPMENT_ITEM_FRAGMENT}
  mutation AddShipmentItems($createShipmentItemsInput: [CreateShipmentItemInput!]!) {
    addShipmentItems(createShipmentItemsInput: $createShipmentItemsInput) {
      ...ShipmentItemFragment
    }
  }
`;

// Creates a single shipment item
export const ADD_SHIPMENT_ITEM = gql`
  ${SHIPMENT_ITEM_FRAGMENT}
  mutation AddShipmentItem($createShipmentItemInput: CreateShipmentItemInput!) {
    addShipmentItem(createShipmentItemInput: $createShipmentItemInput) {
      ...ShipmentItemFragment
    }
  }
`;

// Deletes a shipment item
export const DELETE_SHIPMENT_ITEM = gql`
  ${SHIPMENT_ITEM_FRAGMENT}
  mutation DeleteShipmentItem($id: ID!) {
    deleteShipmentItem(id: $id) {
      ...ShipmentItemFragment
    }
  }
`;