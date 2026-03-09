import { ReportFilterFormData } from "../validations/reportGenerate.z";
import { ApiResponse, SORTING } from "./General.api.types";

export interface ReportTypeColumn {
  column_key: string;
  label: string;
  data_type: "string" | "integer" | "currency"; // Add more types as needed
  is_sortable: boolean;
}

export interface ReportTypeFilters {
  description: string;
  filter_key: keyof ReportFilterFormData;
  filter_label: string;
}

export interface ReportType {
  report_type_uuid: string;
  report_title: string;
  description: string;
  report_type_columns: ReportTypeColumn[];
  report_type_filters: ReportTypeFilters[];
}

export enum EXPORT_FORMAT {
  CSV = "csv",
}

export interface ReportGenerated {
  report_generated_id: number;
  report_generated_uuid: string;
  report_name: string;
  report_type_id: string;
  file_path: string | null;
  file_storage_type: string | null;
  page_number: number;
  page_size: number | null;
  selected_columns: string; // JSON stringified array
  sort_column: string | null;
  sort_direction: SORTING;
  filters_json: string; // JSON stringified object
  total_records: number | null;
  execution_time_ms: number | null;
  generated_by_user_id: number;
  generated_by_ip: string;
  user_agent: string;
  queue_status: "failed" | "pending" | "completed" | "processing";
  export_format: EXPORT_FORMAT;
  download_count: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  report_type: {
    report_name: string;
    report_title: string;
    report_type_uuid: string;
  };
}

export type ReportTypeApi = ApiResponse<{ items: ReportType[] }>;

export interface AnalyticsOrdersSalesPeriodChartData {
  period: "daily" | "monthly" | "yearly";
  data: Array<{
    label: string;
    value: number;
    date: string;
  }>;
  total: number;
  startDate: string;
  endDate: string;
}

export type AnalyticsOrdersSalesPeriodChartResponse =
  ApiResponse<AnalyticsOrdersSalesPeriodChartData>;
