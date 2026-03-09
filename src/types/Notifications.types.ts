import { PaginationMeta } from "../components/ui/Pagination";
import { ApiResponse } from "./General.api.types";


export type NotificationApiResponse = ApiResponse<{
  items: AdminNotification[];
  meta: PaginationMeta;
}>;

export enum WcNotificationTypes {
  // OrdersNotifications
  ORDER_CREATED = "NEW_ORDER_CREATED",

  // Order Confirmation after the payment d
  ORDER_CONFIRMED = "ORDER_IS_CONFIRMED",

  // Order Status Updated
  ORDER_STATUS_UPDATED = "ORDER_STATUS_UPDATED",

  // Address Collection Followup (Need to send to Agent)
  ORDER_ADDRESS_COLLECTION_FOLLOWUP = "ORDER_ADDRESS_COLLECTION_FOLLOWUP",

  // Order Delivery Completed (to Supervisor)
  ORDER_DELIVERY_NOT_SCHEDULED = "ORDER_DELIVERY_NOT_SCHEDULED",

  // Order Delivery Completed (to Shop Manager), saying that order is delivered or mark it as complete
  ORDER_DELIVERY_COMPLETED = "ORDER_DELIVERY_COMPLETED",

  // Order Delivery Failed (to Delivery Agent)
  ORDER_DELIVERY_FAILED = "ORDER_DELIVERY_FAILED",

  // Order Delivery Started (to Delivery Agent)
  ORDER_DELIVERY_STARTED = "ORDER_DELIVERY_STARTED",

  REPORT_GENERATED = "REPORT_GENERATED",

  ORDER_CHANGE_REQUEST = "ORDER_CHANGE_REQUEST",

  ALERT = "ALERT",
}

export interface WCNotification {
  /**
   * The unique identifier for the notification.
   * This can be a UUID or any other unique identifier.
   */
  type: WcNotificationTypes;
  /**
   * The title of the notification.
   * This should be a short and descriptive title that summarizes the notification.
   */
  title: string;
  /**
   * The message content of the notification.
   * This should provide detailed information about the notification.
   */
  message: string;

  /**
   * Optional read status indicating whether the notification has been read by the user.
   * This can be used to filter or sort notifications based on their read status.
   */
  read: boolean;
  /**
   * user ID to whom the notification is sent.
   * This can be used to filter notifications for a specific user.
   */
  userId: string | number;

  user_uuid: string;

  /**
   * Optional data object to send with the notification.
   * This can include any additional information related to the notification.
   */

  data?: {
    /**
     * The unique identifier for the notification.
     * This can be a UUID or any other unique identifier.
     */
    notificationUuid: string;

    order_uuid?: string;
    order_number?: string;
    severity?: AdminNotification["severity"];
    category: AdminNotification["category"];
    /**
     * NOT USING NOW
     */
    requires_action: boolean;

    silent?: boolean;

    sent_at: string;
    read_at: string | null;
    created_at: string;
    [key: string]: string | number | boolean | undefined | null;
  };
}

interface NotificationData {
  action_by: string;
  order_uuid: string;
  order_number: string;
  revision_status: string;
  change_request_uuid: string;
  change_request_revision_uuid: string;
}

export interface AdminNotification {
  admin_notification_uuid: string;
  user_uuid: string;
  title: string;
  message: string;
  type: WcNotificationTypes; // You might want to make this more specific if there are limited types
  category: "orders" | "users" | "general" | "system" | "reports"; // Similarly, you might want to make this more specific
  data: NotificationData;
  read: boolean;
  severity: "info" | "warning" | "error" | "success" | "consent"; // Adjust based on possible values
  requires_action: boolean;
  silent: boolean;
  sent_at: string; // or Date if you'll parse it
  read_at: string; // or Date if you'll parse it
  created_at: string; // or Date if you'll parse it
}
