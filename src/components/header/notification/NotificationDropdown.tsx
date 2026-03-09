import { Bell, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNotification } from "../../../context/NotificationContext";
import apiEngine from "../../../lib/axios";
import { API_ENDPOINTS } from "../../../types/ApiEndpoints.enum";
import {
  AdminNotification,
  NotificationApiResponse,
} from "../../../types/Notifications.types";
import AnimationPing from "../../ui/animationPing";
import { Dropdown } from "../../ui/dropdown/Dropdown";
import NotificationDropdownItem from "./NotificationDropdownItem";
import Button from "../../ui/button/Button";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleClick = () => {
    toggleDropdown();
  };
  const { userInfo } = useAuth();
  const { newNotificationCount, SetNewNotificationCount, markAllAsRead } =
    useNotification();

  useEffect(() => {
    SetNewNotificationCount(Number(userInfo?.unreadNotificationsCount) || 0);
  }, [SetNewNotificationCount, userInfo]);

  return (
    <>
      <div className="relative">
        <button
          className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          onClick={handleClick}
        >
          <AnimationPing
            hidden={!newNotificationCount || newNotificationCount == 0}
            count={newNotificationCount > 99 ? "99+" : newNotificationCount}
            className="absolute right-0 top-0.5 z-10"
          />

          <Bell size={20} />
        </button>
        <Dropdown
          isOpen={isOpen}
          onClose={closeDropdown}
          className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
        >
          <>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
              <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Notification
              </h5>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="xs"
                  hidden={!newNotificationCount}
                  onClick={() => {
                    markAllAsRead();
                  }}
                >
                  Mark as read All
                </Button>
                <Button
                  onClick={toggleDropdown}
                  variant="ghost"
                  size="xs"
                  className="!px-0"
                >
                  <X size={22} />
                </Button>
              </div>
            </div>
            <NotificationDropdownContent closeDropdown={closeDropdown} />
          </>
        </Dropdown>
      </div>
    </>
  );
}

function NotificationDropdownContent({
  closeDropdown,
}: {
  closeDropdown: () => void;
}) {
  // Notification list from server
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const { isMarkingAllAsRead } = useNotification();

  const fetchNotifications = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await apiEngine.get<NotificationApiResponse>(
        API_ENDPOINTS.NOTIFICATION_GET + `?page=${pageNum}&limit=10`
      );

      if (pageNum === 1) {
        setNotifications(response.data?.data?.items);
      } else {
        setNotifications((prev) => [...prev, ...response.data.data.items]);
      }

      setHasMore((response.data?.data?.meta?.totalPages || 0) > pageNum);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastNotificationRef = useCallback(
    (node: HTMLLIElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    fetchNotifications(page);
  }, [page]);

  useEffect(() => {
    if (isMarkingAllAsRead) {
      setNotifications((prev) => {
        const readMarked = prev.map((notification) => {
          notification.read = true;
          return notification;
        });
        return readMarked;
      });
    }
  }, [isMarkingAllAsRead]);

  return (
    <>
      <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
        {notifications.map((notification, index) => (
          <li
            key={notification.admin_notification_uuid + index.toString()}
            ref={
              index === notifications.length - 1 ? lastNotificationRef : null
            }
          >
            <NotificationDropdownItem
              notification={notification}
              onClick={closeDropdown}
            />
          </li>
        ))}
        {loading && (
          <li className="py-2 text-center text-gray-500 dark:text-gray-400">
            Loading...
          </li>
        )}
      </ul>
    </>
  );
}
