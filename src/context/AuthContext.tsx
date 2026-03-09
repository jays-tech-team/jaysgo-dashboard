import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { API_ENDPOINTS } from "../types/ApiEndpoints.enum";
import { PERMISSIONS, USER_ROLES } from "../unities/permissions";
import apiEngine from "../lib/axios";
import { UserData } from "../types/CurrentUser.types";
import { toast } from "sonner";

interface AuthContextType {
  isAuthenticated: boolean;
  permissions: PERMISSIONS[];
  login: (data: UserData) => void;
  logout: () => void;
  hasPermission: (permission: PERMISSIONS[]) => boolean;
  hasRole: (roles: USER_ROLES[]) => boolean;
  isAdmin: () => boolean;
  userInfo: UserData;
  loading: boolean;
  refreshUserData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if token exists in localStorage
    return !!localStorage.getItem("authToken");
  });
  const [userInfo, setUserInfo] = useState<UserData>();

  const [permissions, setPermissions] = useState<PERMISSIONS[]>(() => {
    const storedPermissions = localStorage.getItem("permissions");
    return storedPermissions ? JSON.parse(storedPermissions) : [];
  });

  const [roles, setRoles] = useState<USER_ROLES[]>(() => {
    const storedPermissions = localStorage.getItem("roles");
    return storedPermissions ? JSON.parse(storedPermissions) : [];
  });

  const [loading, setLoading] = useState(true);

  const login = (data: UserData) => {
    localStorage.setItem("authToken", data.access_token || "");
    localStorage.setItem("permissions", JSON.stringify(data.permissions));
    localStorage.setItem("roles", JSON.stringify(data.roles));
    setIsAuthenticated(true);
    setPermissions(data.permissions);
    setRoles(data.roles);
    setUserInfo(data);
  };

  const logout = () => {
    // Call the logout API endpoint. So we can remove the token/cached user info from the server
    apiEngine.get(API_ENDPOINTS.LOG_OUT).then(() => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("permissions");
      sessionStorage.clear();
      setIsAuthenticated(false);
      setPermissions([]);
    });
  };

  const hasPermission = (permission: PERMISSIONS[]) => {
    return permissions.some((perm) => permission.includes(perm));
  };
  const hasRole = (role: USER_ROLES[]) => {
    return roles.some((perm) => role.includes(perm));
  };
  const isAdmin = () => {
    return roles.includes(USER_ROLES.ADMIN);
  };

  const fetchUserInfo = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const response = await apiEngine.get(API_ENDPOINTS.CURRENT_USER);

      localStorage.setItem(
        "authToken",
        response.data?.data?.access_token || ""
      );
      setUserInfo(response.data.data);
    } catch (err) {
      toast.error("Error fetching user");
      console.error("Error fetching user info:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const refreshUserData = async () => {
    await fetchUserInfo();
  };

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        permissions,
        login,
        logout,
        hasPermission,
        hasRole,
        isAdmin,
        userInfo: userInfo as UserData,
        loading,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom React hook to access the authentication context.
 *
 * @returns {AuthContextType} The current authentication context value.
 * @throws {Error} If used outside of an `AuthProvider`.
 *
 * @example
 * const { user, login, logout } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
