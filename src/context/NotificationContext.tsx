import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

interface NotificationContextType {
  /**
   * New order count
   */
  newOrderCount: number;

  clearOrderCount: () => void;

  newNotificationCount: number;

  clearNotificationCount: () => void;

  lastNotification: WCNotification | undefined;

  lastOrderNotification: WCNotification | null | undefined;

  clearLastOrderNotification: () => void;

  /**
   * The count of unread notifications
   */
  SetNewNotificationCount: React.Dispatch<React.SetStateAction<number>>;

  /**
   * Mark all notifications as read
   */
  markAllAsRead: () => Promise<void>;

  /**
   * Mark all notifications as read
   */
  markAsRead: (uuid: string) => Promise<void>;

  /**
   * Loading state for mark all as read operation
   */
  isMarkingAllAsRead: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

import { useState } from "react";
import { toast } from "sonner";
import { socketService } from "../services/socket";
import {
  WCNotification,
  WcNotificationTypes,
} from "../types/Notifications.types";
import apiEngine from "../lib/axios";
import { buildUrl } from "../unities/urlBuilder";
import { API_ENDPOINTS } from "../types/ApiEndpoints.enum";

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [newNotificationCount, SetNewNotificationCount] = useState(0);
  const [lastNotification, setLastNotification] = useState<WCNotification>();
  const [lastOrderNotification, setLastOrderNotification] =
    useState<WCNotification | null>();
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false);

  const socketServiceRef = useRef(new socketService());

  // Audio management
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPlayTimeRef = useRef<number>(0);

  // Initialize audio once
  useEffect(() => {
    audioRef.current = new Audio("/audio/notification.wav");
    audioRef.current.preload = "auto";
    audioRef.current.volume = 1;

    return () => {
      if (audioTimeoutRef.current) {
        clearTimeout(audioTimeoutRef.current);
      }
      audioRef.current = null;
    };
  }, []);

  const playNotificationSound = () => {
    if (!audioRef.current) return;

    const now = Date.now();
    const timeSinceLastPlay = now - lastPlayTimeRef.current;

    // Clear any existing timeout
    if (audioTimeoutRef.current) {
      clearTimeout(audioTimeoutRef.current);
    }

    // If less than 1 second since last play, debounce it
    if (timeSinceLastPlay < 1000) {
      audioTimeoutRef.current = setTimeout(() => {
        lastPlayTimeRef.current = Date.now();
        audioRef.current!.currentTime = 0;
        audioRef.current!.play().catch((err) => {
          console.error("Audio play failed:", err);
        });
      }, 1000 - timeSinceLastPlay);
    } else {
      // Play immediately
      lastPlayTimeRef.current = now;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        console.error("Audio play failed:", err);
      });
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      setIsMarkingAllAsRead(true);

      // Call your API endpoint here
      await apiEngine.put("/admin/notifications/read-all");
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    } finally {
      setIsMarkingAllAsRead(false);
    }
    // Hoping the API will success all time and we are immediately clear all notifications without wait the API response
    // Update local state - clear all notification counts
    SetNewNotificationCount(0);
    setNewOrderCount(0);
    setLastOrderNotification(null);
  };

  // Mark a notifications as read
  const markAsRead = useCallback(async (notificationUUID: string) => {
    SetNewNotificationCount((prev) => Math.max(0, prev - 1));
    try {
      setIsMarkingAllAsRead(true);

      // Call your API endpoint here
      await apiEngine.put(
        buildUrl(API_ENDPOINTS.NOTIFICATION_MARK_READ, { notificationUUID })
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    } finally {
      setIsMarkingAllAsRead(false);
    }
  }, []);

  // Socket connection setup
  useEffect(() => {
    socketServiceRef.current.connect();

    // Listen for new notifications
    const handleNewNotification = (data: WCNotification) => {
      setLastNotification(data);
    };

    // Add socket event listener
    socketServiceRef.current.onNotification((notification) => {
      handleNewNotification(notification);

      // if the notification is silent, we won't inc the count
      if (!notification?.data?.silent) {
        SetNewNotificationCount((prev) => prev + 1);
      }
      // Order Notification handle
      if (notification.type === WcNotificationTypes.ORDER_CREATED) {
        setNewOrderCount((prev) => prev + 1);
      } else {
        // if the notification is silent we wont make sound
        if (!notification?.data?.silent) {
          // Play notification sound with debouncing
          playNotificationSound();
        }

        if (notification.data?.severity == "warning") {
          toast.warning(notification.title || "", {
            description: notification.message,
            duration: 10000,
            closeButton: true,
          });
        } else {
          toast(notification.title || "New notification", {
            description: notification.message,
            duration: 5000,
            closeButton: true,
          });
        }
      }

      if (notification.data?.category == "orders") {
        setLastOrderNotification(notification);
      }
    });

    // Cleanup on unmount
    const currentSocketService = socketServiceRef.current;
    return () => {
      currentSocketService.disconnect();
      if (audioTimeoutRef.current) {
        clearTimeout(audioTimeoutRef.current);
      }
    };
  }, []);

  function clearOrderCount() {
    setNewOrderCount(0);
  }
  function clearNotificationCount() {
    SetNewNotificationCount(0); // Fixed: was clearing order count instead
  }
  function clearLastOrderNotification() {
    setLastOrderNotification(null);
  }

  return (
    <NotificationContext.Provider
      value={{
        newOrderCount,
        clearOrderCount,
        newNotificationCount,
        clearNotificationCount,
        lastNotification,
        SetNewNotificationCount,
        lastOrderNotification,
        clearLastOrderNotification,
        markAllAsRead,
        markAsRead,
        isMarkingAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}
