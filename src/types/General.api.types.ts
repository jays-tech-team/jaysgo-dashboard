export type ApiResponse<T = undefined> = {
  success: boolean;
  message: string;
  data: T;
};

// A common sorting consent.
export enum SORTING {
  ASC = "asc",
  DESC = "desc",
}

export enum GENERAL_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DRAFT = "draft",
}
