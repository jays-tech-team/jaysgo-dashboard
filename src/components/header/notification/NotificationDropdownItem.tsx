import {
  Dot,
  FileChartPie,
  Megaphone,
  Monitor,
  ShoppingBag,
  ShoppingBasket,
  User,
} from "lucide-react";
import { useNavigate } from "react-router";

import { useNotification } from "../../../context/NotificationContext";
import { cn, formatDate } from "../../../lib/utils";
import { AdminNotification } from "../../../types/Notifications.types";
import { DropdownItem } from "../../ui/dropdown/DropdownItem";

interface NotificationDropdownItemProps {
  onClick?: () => void;
  notification: AdminNotification;
}

const NotificationDropdownItem: React.FC<NotificationDropdownItemProps> = ({
  onClick,
  notification,
}) => {
  const redirect = useNavigate();
  const { markAsRead } = useNotification();
  function onNotificationClick() {
    if (notification.requires_action) {
      if (notification.category == "orders") {
        redirect("/admin/orders/view/" + notification.data.order_uuid);
      }

      if (notification.category == "reports") {
        redirect("admin/reports#generated-reports");
      }
    }

    if (notification.read != true)
      markAsRead(notification.admin_notification_uuid);

    onClick?.();
  }

  const icon: Record<AdminNotification["category"], React.JSX.Element> = {
    orders: <ShoppingBasket size={22} />,
    users: <User size={22} />,
    general: <Megaphone size={22} />,
    system: <Monitor size={22} />,
    reports: <FileChartPie />,
  };
  // Define icon background colors for each notification category
  const iconBg: Record<AdminNotification["severity"], string> = {
    info: "bg-cyan-100 text-cyan-600",
    warning: "bg-orange-100 text-orange-600",
    error: "bg-red-100 text-red-600",
    success: "bg-green-100 text-green-600",
    consent: "bg-purple-100 text-purple-600",
  };
  return (
    <DropdownItem
      onItemClick={onNotificationClick}
      className={cn(
        "relative flex gap-1 items-center rounded-lg border-b border-gray-100  px-4.5 py-1 mb-1 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5",
        notification.read ? null : "bg-blue-50"
      )}
    >
      {!notification.read && (
        <span className="absolute top-1/2 -translate-1/2 left-2.5">
          <Dot className="text-blue-500 animate-pulse " size={40} />
        </span>
      )}
      <span
        className={cn(
          "bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center",
          iconBg[notification.severity]
        )}
      >
        {icon[notification.category] ? (
          icon[notification.category]
        ) : (
          <ShoppingBag size={22} className="" />
        )}
      </span>

      <span className="block" style={{ width: "calc(100% - 40px)" }}>
        <span className="mb-1.5 block text-theme-sm text-gray-500 dark:text-gray-400 space-x-1">
          <span className="font-medium text-gray-800 dark:text-white/90 block">
            {notification.title}
          </span>
          <span className="text-xs block">{notification.message}</span>
        </span>

        <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          <span className="block">
            {notification.created_at ? formatDate(notification.created_at) : ""}
          </span>
        </span>
      </span>
    </DropdownItem>
  );
};
export default NotificationDropdownItem;
