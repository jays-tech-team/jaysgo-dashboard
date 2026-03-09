import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { LogOut, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";

export default function UserInfo() {
  const { userInfo: user, loading } = useAuth();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  if (loading) {
    return (
      <>loading</>
      // <div className="flex items-center gap-4">
      //   <Skeleton className="h-10 w-10 rounded-full" />
      //   <div className="space-y-2">
      //     <Skeleton className="h-4 w-[100px]" />
      //     <Skeleton className="h-3 w-[80px]" />
      //   </div>
      // </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={user.image || "/images/user/agent-placeholder-Image.jpg"}
            alt={`${user.first_name} ${user.last_name}`}
          />
          <AvatarFallback>
            {user.first_name.charAt(0)}
            {user.last_name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="hidden md:block">
          <p className="text-sm font-medium">
            {user.first_name} {user.last_name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user.email}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/profile")}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <User className="h-5 w-5" />
        </button>
        <button
          onClick={handleLogout}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
