import apiEngine from "../lib/axios";
import {
  CreateSettingRequest,
  Setting,
  SettingsListResponse,
  UpdateSettingRequest,
} from "../types/Settings.types";

export class SettingsService {
  /**
   * Get all settings
   */
  static async getSettings(): Promise<SettingsListResponse> {
    const response = await apiEngine.get("/admin/settings/config");
    return response.data;
  }

  /**
   * Create a new setting
   */
  static async createSetting(
    settingData: CreateSettingRequest
  ): Promise<{ success: boolean; message: string; data: Setting }> {
    const response = await apiEngine.post(
      "/admin/settings/config",
      settingData
    );
    return response.data;
  }

  /**
   * Update a setting value
   */
  static async updateSetting(
    settingUuid: string,
    settingData: UpdateSettingRequest
  ): Promise<{ success: boolean; message: string; data: Setting }> {
    const response = await apiEngine.patch(
      `/admin/settings/config/${settingUuid}`,
      settingData
    );
    return response.data;
  }
}
