import { io, Socket } from "socket.io-client";
import { __clog } from "../lib/utils";
import { WCNotification } from "../types/Notifications.types";

class SocketService {
  private socket: Socket | null = null;

  connect(
    instance: string = "notifications",
    queryArgs?: Record<string, string>
  ) {
    if (!this.socket) {
      const token = localStorage.getItem("authToken");
      this.socket = io(import.meta.env.VITE_SOCKET_URL + "/" + instance, {
        extraHeaders: {
          authorization: token ? `Bearer ${token}` : "undefined",
        },
        query: {
          ...queryArgs,
        },
        // sometime queries are not passing properly through query params. so passing through the auth
        auth: {
          query: queryArgs,
        },
      });

      this.socket.on("connect", () => {
        __clog("Connected to WebSocket server", instance);
      });

      this.socket.on("disconnect", () => {
        __clog("Disconnected from WebSocket server", instance);
      });

      this.socket.on("error", (error) => {
        console.error("Socket error:", error);
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onNotification(callback: (data: WCNotification) => void) {
    if (this.socket) {
      this.socket.on("notification", callback);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }
  off(event: string) {
    if (this.socket) {
      this.socket.off(event);
    }
  }

  offNotification(callback: (data: WCNotification) => void) {
    if (this.socket) {
      this.socket.off("notification", callback);
    }
  }
}

export const socketService = SocketService;
