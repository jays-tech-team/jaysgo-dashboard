export enum API_ENDPOINTS {
  DELIVERY_SLOTS = "admin/orders/shipment/delivery-slots",

  COUNTRIES = "admin/locations/countries",

  CITIES = "admin/locations/cities",

  CITIES_PUBLIC = "public/locations/cities",

  AREAS = "admin/locations/areas",

  USER_LOGIN = "users/auth/login",

  LOG_OUT = "users/auth/logout",

  CURRENT_USER = "admin/users/me",

  CATEGORIES = "admin/product-categories",

  // Collections
  COLLECTIONS = "admin/collections",
  COLLECTION_TYPES = "admin/collections/types",

  ATTRIBUTES = "admin/attributes",

  PRODUCTS = "admin/products",

  PRODUCT_GET = "admin/products/:productUuid",

  PRODUCTS_VARIATION_GET_PRICE = "admin/products/:productUuid/variants/get-price",

  SHOPS = "admin/shops",

  /**
   * Used on create orders only. its required order body
   */
  SHIPPING_METHODS = "admin/orders/shipment/shipping-methods",

  /**
   * API to update a specific address (billing or shipping) for an order.
   *
   * :orderUuid   - order uuid
   * :addressType - shipping-addresses | billing-addresses
   * :addressUuid - address UUID
   *
   * Use buildUrl() to replace :orderUuid, :addressType, and :addressUuid.
   *
   */
  UPDATE_ORDER_ADDRESS = "admin/orders/:orderUuid/:addressType/:addressUuid",

  /**
   * A general api to get all delivery methods
   */
  SETTINGS_SHIPPING_METHODS = "admin/settings/shipping-methods",

  /**
   * A general api to get all delivery methods
   */
  SETTINGS_DELIVERY_METHODS = "admin/settings/delivery-methods",

  ORDERS = "admin/orders",

  /** Get single order details */
  ORDER_GET = "admin/orders/:orderUuid",

  STORE_PICKUP_TIMES = "admin/orders/shipment/pickup-times",

  /**
   * api to assign order to agent
   */
  ASSIGN_TO_AGENT = "admin/orders/:uuid/assign-to-agent",

  /**
   * api to assign order to shop
   */
  ASSIGN_TO_SHOP = "admin/orders/:uuid/assign-to-shop",

  /**
   * API to verify the salt when opening the recipient address collection form. use buildUrl() function replace :salt
   */
  PUBLIC_COLLECT_ADDRESS_FORM_VERIFY = "public/orders/address-collection/:salt/verify",

  /**
   * API to submit the recipient address in the address collection form. use buildUrl() function replace :salt
   */
  PUBLIC_COLLECT_ADDRESS_FORM_SUBMIT = "public/orders/address-collection/:salt/submit",

  /**
   * API link to download the PDF
   */
  INVOICE_DOWNLOAD = "admin/invoices/:invoiceId/download/:type",

  CHANGE_ORDER_STATUS = "admin/orders/:orderUuid/change-status",

  ORDER_CHANGE_REQUEST = "admin/orders/:orderUuid/change-requests",

  /**
   * API for Closing Change Requests
   * This API is used to close a change request when a customer has requested modifications to an order, such as changes to a cake or flower arrangement.
   * */
  ORDER_CLOSE_CHANGE_REQUEST = "admin/orders/:orderUuid/change-requests/:requestUuid/close",

  /**
   * API for Closing Orders After Return Completion.
   * This API is used to close an order once the return process has been completed successfully.
   */
  ORDER_CLOSE = "admin/orders/:orderUuid/close",

  /**
   * API to update order notes and delivery notes
   */
  UPDATE_ORDER_NOTES = "admin/orders/:orderUuid/update-order-notes",

  REVISE_CHANGE_REQUEST = "admin/orders/:orderUuid/change-requests/:requestUuid/revise",

  /**
   * API to get all order status
   */
  ORDER_STATUS = "admin/settings/order-statuses",

  /**
   * API to download kitchen print.
   */
  DOWNLOAD_KITCHEN_PRINT = "admin/orders/:orderUuid/download/kitchen-print",

  /**
   * list of notification API
   */
  NOTIFICATION_GET = "admin/notifications",

  NOTIFICATION_MARK_READ = "admin/notifications/:notificationUUID/read",

  QC_PRINT = "/admin/orders/:orderUuid/download/qc-print/:qcUuid",

  QC_SUBMIT = "/admin/orders/qc-checks/:orderUuid",

  REPORT_TYPES = "admin/reports/types",

  CUSTOMERS = "admin/customers",

  CUSTOMERS_GROUP = "admin/customer-groups",

  PAYMENT_STATUS_LIST = "admin/settings/payment-statuses",

  /** CMS */
  CMS_PAGE = "admin/cms",

  /** SMS */
  SMS_SEND = "admin/notifications/sms/send",

  /** Analytics */
  ANALYTICS_CUSTOMERS = "/admin/analytics/customers",

  /** Analytics */
  ANALYTICS_ORDERS = "/admin/analytics/orders",

  /** Analytics Orders Sales Period Chart */
  ANALYTICS_ORDERS_SALES_PERIOD_CHART = "/admin/analytics/orders-sales-period-chart",

  /** Forms */
  CONTACT_FORMS = "admin/forms/contact-forms",
  CONTACT_FORM_UPDATE = "admin/forms/contact-forms/:contactFormUuid",

  /** Settings */
  SETTINGS_CONFIG = "admin/settings/config",
}
