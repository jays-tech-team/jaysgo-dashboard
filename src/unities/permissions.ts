export enum USER_ROLES {
  ADMIN = "admin",
  OPERATIONS_MANAGER = "operations-manager",
  AGENT = "agent",
  SHOP_MANAGER = "shop-manager",
  SUPERVISOR = "supervisor",
  CUSTOMER = "customer",
  PREMIUM_AGENT = "premium-agent",
}

// permissions constants keep sync NextJs code and NestJs code

export enum PERMISSIONS {
  /**
   * It will will available for every one no matter who login or not.
   */
  PUBLIC = "public",

  /**
   * Does't matter role, the api can access if the user logged in
   */
  LOGGED_USER = "logged",

  // User management
  USER_READ = "user:read",
  USER_CREATE = "user:create",
  USER_UPDATE = "user:update",
  USER_UPDATE_PASSWORD = "user:update-password",
  USER_DELETE = "user:delete",
  USER_ALL = "user:all",

  // Product management
  PRODUCT_READ = "product:read",
  PRODUCT_CREATE = "product:create",
  PRODUCT_UPDATE = "product:update",
  PRODUCT_DELETE = "product:delete",

  PRODUCT_BULK_IMPORT = "product:bulk-import",
  PRODUCT_BULK_EXPORT = "product:bulk-export",

  // Order management
  ORDER_READ = "order:read",
  ORDER_CREATE = "order:create",
  ORDER_UPDATE = "order:update",
  ORDER_DELETE = "order:delete",
  ORDER_REFUND = "order:refund",
  ORDER_PREMIUM = "order:premium",
  ORDER_READ_ALL_ORDERS = "order:read-all-orders",

  ORDER_STATUS_REVERT = "order:status-revert",
  ORDER_DELIVERY_NOTES_UPDATE = "order:delivery-notes-update",
  ORDER_CONTACT_DETAILS_UPDATE = "order:contact-details-update",
  ORDER_DATE_TIME_UPDATE = "order:date-time-update",
  ORDER_MARK_PAYMENT_PAID = "order:mark-payment-paid",

  // Inventory & stock
  INVENTORY_READ = "inventory:read",
  INVENTORY_UPDATE = "inventory:update",

  // Shipping
  SHIPPING_READ = "shipping:read",
  SHIPPING_UPDATE = "shipping:update",

  // Payments
  PAYMENT_READ = "payment:read",
  PAYMENT_REFUND = "payment:refund",
  PAYMENT_MANAGE = "payment:manage",

  // Reviews
  REVIEW_READ = "review:read",
  REVIEW_CREATE = "review:create",
  REVIEW_DELETE = "review:delete",

  // Promotions & discounts
  COUPON_READ = "coupon:read",
  COUPON_CREATE = "coupon:create",
  COUPON_UPDATE = "coupon:update",
  COUPON_DELETE = "coupon:delete",

  // Dashboard analytics
  DASHBOARD_READ = "dashboard:read",

  // Settings and configuration
  SETTINGS_MANAGE = "settings:manage",
  // Category permissions
  CATEGORY_CREATE = "product_category:create",
  CATEGORY_READ = "product_category:read",
  CATEGORY_UPDATE = "product_category:update",
  CATEGORY_DELETE = "product_category:delete",

  // Customer permissions
  CUSTOMER_CREATE = "customer:create",
  CUSTOMER_READ = "customer:read",
  CUSTOMER_UPDATE = "customer:update",
  CUSTOMER_DELETE = "customer:delete",

  // Customer permissions
  CUSTOMER_GROUP_CREATE = "customer_group:create",
  CUSTOMER_GROUP_READ = "customer_group:read",
  CUSTOMER_GROUP_UPDATE = "customer_group:update",
  CUSTOMER_GROUP_DELETE = "customer_group:delete",
  CUSTOMER_GROUP_MEMBERS_UPDATE = "customer_group_members:update",

  // Customer Address permissions
  CUSTOMER_ADDRESS_CREATE = "customer_address:create",
  CUSTOMER_ADDRESS_READ = "customer_address:read",
  CUSTOMER_ADDRESS_UPDATE = "customer_address:update",
  CUSTOMER_ADDRESS_DELETE = "customer_address:delete",

  // Reports
  REPORT_READ = "report:read",
  REPORT_CREATE = "report:create",
  REPORT_DELETE = "report:delete",

  CLOUDINARY_READ = "cloudinary:read",

  // Content management
  CMS_READ = "cms:read",
  CMS_CREATE = "cms:create",
  CMS_UPDATE = "cms:update",
  CMS_DELETE = "cms:delete",

  // Collection permissions
  COLLECTION_READ = "collection:read",
  COLLECTION_CREATE = "collection:create",
  COLLECTION_UPDATE = "collection:update",
  COLLECTION_DELETE = "collection:delete",

  // FAQ permissions
  FAQ_READ = "faq:read",
  FAQ_CREATE = "faq:create",
  FAQ_UPDATE = "faq:update",
  FAQ_DELETE = "faq:delete",

  // SMS
  SMS_READ = "sms:read",
  SMS_CREATE = "sms:create",
  SMS_UPDATE = "sms:update",
  SMS_DELETE = "sms:delete",

  // Form
  FORM_READ = "form:read",
  FORM_CREATE = "form:create",
  FORM_UPDATE = "form:update",
  FORM_DELETE = "form:delete",
}
