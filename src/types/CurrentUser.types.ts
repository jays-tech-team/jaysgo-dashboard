import { PERMISSIONS, USER_ROLES } from "../unities/permissions";


export type UserData = {
  last_login_at?: string | null;
  last_login_ip?: string | null;
  default_currency_code?: string | null;
  preferred_language_code?: string | null;

  permissions: PERMISSIONS[];

  access_token?: string;

  home_page: string;

  image?: string;

  unreadNotificationsCount?: number;
} & UserType;

export interface UserType {
  user_uuid: string;
  first_name: string;
  last_name?: string | null;
  email: string;
  phone_number: string | null;
  user_status: "active" | "inactive" | "suspended" | "pending"; // Adjust based on possible statuses
  roles: USER_ROLES[]; // Or use a union type like ('agent' | 'admin' | 'manager')[] if roles are known

  created_at: string; // or Date if you'll parse it
  updated_at: string; // or Date if you'll parse it
  deleted_at: string | null; // or Date | null if you'll parse it
}
