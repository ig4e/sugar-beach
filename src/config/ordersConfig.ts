import type { InvoiceStatus, OrderStatus } from "@prisma/client";

export const ORDER_STATUS: OrderStatus[] = [
  "ORDER_PLACED",
  "PROCESSING",
  "PREPARING_TO_SHIP",
  "SHIPPED",
  "DELIVERED",
  "REFUNDED",
  "CANCELLED",
];

export const INVOICE_STATUS: InvoiceStatus[] = ["PAID", "PENDING", "CANCELLED"];
