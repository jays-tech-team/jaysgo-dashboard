export enum SettingDataType {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
  JSON = "json",
  ARRAY = "array",
  OBJECT = "object",
}

export interface Setting {
  setting_uuid: string;
  name: string;
  value: string;
  data_type: SettingDataType;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface SettingsListResponse {
  success: boolean;
  message: string;
  data: {
    items: Setting[];
  };
}

export interface CreateSettingRequest {
  name: string;
  value: string;
  data_type: SettingDataType;
}

export interface UpdateSettingRequest {
  value: string;
}
