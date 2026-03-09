import { toast } from "sonner";
import { useNotification } from "../../../context/NotificationContext";
import Button from "../../ui/button/Button";
import { NavigateFunction, useNavigate } from "react-router";
import { useEffect, useRef } from "react";
import {
  AdminNotification,
  NotificationApiResponse,
  WCNotification,
} from "../../../types/Notifications.types";
import apiEngine from "../../../lib/axios";
import { API_ENDPOINTS } from "../../../types/ApiEndpoints.enum";

export function ConcentNotification() {
  const { lastNotification: notification, markAsRead } = useNotification();
  const redirect = useNavigate();

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!notification) {
      return;
    }
    if (notification.data?.severity !== "consent") {
      return;
    }
    doToast(notification, redirect, markAsRead);
  }, [notification, markAsRead]);

  useEffect(() => {
    const fetchConcentNotifications = async () => {
      try {
        const params: {
          page: number;
          limit: number;
          severity: AdminNotification["severity"];
          read?: boolean;
        } = {
          page: 1,
          limit: 10,
          severity: "consent",
          read: false,
        };
        const response = await apiEngine.get<NotificationApiResponse>(
          API_ENDPOINTS.NOTIFICATION_GET,
          {
            params,
          }
        );

        if (response.data) {
          const items = response.data?.data?.items;
          if (items.length > 0) {
            items.forEach((item) => {
              if (item.read) return;
              doToast(
                {
                  type: item.type,
                  title: item.title,
                  message: item.message,
                  read: item.read,
                  userId: item.user_uuid,
                  user_uuid: item.user_uuid,
                  data: {
                    notificationUuid: item.admin_notification_uuid,
                    order_uuid: item.data.order_uuid,
                    order_number: item.data.order_number,
                    severity: item.severity,
                    category: item.category,
                    requires_action: item.requires_action,
                    silent: item.silent,
                    sent_at: item.sent_at,
                    read_at: item.read_at,
                    created_at: item.created_at,
                  },
                },
                redirect,
                markAsRead
              );
            });
          }
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        hasFetchedRef.current = false;
      }
    };
    fetchConcentNotifications();
  }, [markAsRead]);

  return <></>;
}

function doToast(
  notification: WCNotification,
  redirect: NavigateFunction,
  markAsRead: (uuid: string) => Promise<void>
) {
  toast.custom(
    (toastID) => (
      <div className="w-sm bg-blue-50 border border-blue-200 dark:bg-blue-900 dark:border-blue-700 shadow-lg rounded-2xl p-4 flex flex-col gap-3">
        <h3 className="text-lg font-bold">Concent Notification</h3>
        <p className="text-sm text-blue-800 dark:text-blue-100 font-bold">
          {notification.title}
        </p>
        {notification.title && (
          <p className="text-sm text-blue-800 dark:text-blue-100">
            {notification.message}
          </p>
        )}
        <div className="flex justify-end gap-4">
          <Button
            onClick={() => {
              toast.dismiss(toastID);
              redirect("/admin/orders/view/" + notification.data?.order_uuid);
              markAsRead(notification.data?.notificationUuid || "");
            }}
          >
            View Order
          </Button>
          <Button
            onClick={() => {
              markAsRead(notification.data?.notificationUuid || "");
              toast.dismiss(toastID);
            }}
            size="sm"
            variant="outline"
          >
            Noted
          </Button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      position: "bottom-right",
    }
  );
}
