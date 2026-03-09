import { z } from "zod";
import { SORTING } from "../types/General.api.types";
import { EXPORT_FORMAT } from "../types/Reports.typs";
export const ReportFilterFormDataSchema = z.object({
  orderDateFrom: z.string().optional(),
  orderDateTo: z.string().optional(),
  paymentDateFrom: z.string().optional(),
  paymentDateTo: z.string().optional(),
  emirate: z.string().optional(),
  shop: z.string().optional(),
  paymentGateway: z.string().optional(),
  paymentMethod: z.string().optional(),
  paymentStatus: z.array(z.string()).or(z.string()).optional(),
  deliveryMethod: z.string().optional(),
  shippingMethod: z.string().optional(),
  orderStatus: z.array(z.string()).or(z.string()).optional(),
  mainCategory: z.string().optional(),
  subCategory: z.string().optional(),
  category: z.string().optional(),
});

export const reportApiBodySchema = z.object({
  reportName: z
    .string()
    .min(1, "Report name is required")
    .regex(
      /^[\p{L}\p{M}\s0-9]{2,50}$/u,
      "Name should not contain special characters"
    ),
  reportTypeUuid: z.string().min(1, "Report Type required"),
  selectedColumns: z.array(z.string()).min(1, "Select at least one column"),
  sortDirection: z.nativeEnum(SORTING),
  exportFormat: z.nativeEnum(EXPORT_FORMAT),
  filters: ReportFilterFormDataSchema,
});

// Infer the TypeScript type from the Zod schema
export type ReportFilterFormData = z.infer<typeof ReportFilterFormDataSchema>;
export type ReportApiBody = z.infer<typeof reportApiBodySchema>;
