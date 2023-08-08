import type {
  InvoiceStatus,
  OrderStatus,
  ProductOnOrderStatus,
} from "@prisma/client";

export const ORDER_STATUS: OrderStatus[] = [
  "ORDER_PLACED",
  "PROCESSING",
  "PREPARING_TO_SHIP",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export const INVOICE_STATUS: InvoiceStatus[] = [
  "PAID",
  "PENDING",
  "CANCELLED",
  "REFUND_PENDING",
  "REFUNDED",
];

export const PRODUCT_ON_ORDER_STATUS: ProductOnOrderStatus[] = [
  "FULFILLED",
  "UN_FULFILLED",
];

export const ORDER_STATUS_COLOR = {
  ORDER_PLACED: "gray",
  PROCESSING: "gray",
  PREPARING_TO_SHIP: "orange",
  SHIPPED: "orange",
  DELIVERED: "green",
  CANCELLED: "red",
};

export const INVOICE_STATUS_COLOR = {
  PAID: "green",
  PENDING: "orange",
  CANCELLED: "red",
  REFUND_PENDING: "orange",
  REFUNDED: "red",
};

export const PRODUCT_ON_ORDER_STATUS_COLOR = {
  FULFILLED: "green",
  UN_FULFILLED: "orange",
};
