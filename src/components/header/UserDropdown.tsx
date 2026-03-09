import { LogOut, UserCheck } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { publicPath } from "../../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, userInfo } = useAuth();

  const navigate = useNavigate();

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            onClick={toggleDropdown}
            className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
          >
            <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
              <img src={publicPath("images/user/owner.jpeg")} alt="User" />
            </span>

            <span className="block mr-1 font-medium text-theme-sm  max-w-32 overflow-hidden text-ellipsis whitespace-nowrap">
              {userInfo?.first_name} {userInfo?.last_name}
            </span>
            <svg
              className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              width="18"
              height="20"
              viewBox="0 0 18 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel className="min-w-[200px]">
            <div>
              <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
                {userInfo?.first_name} {userInfo?.last_name}
              </span>
              <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
                {userInfo?.email}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="py-3">
            <Link to="/profile">
              <UserCheck />
              Edit profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleLogout} asChild className="py-3">
            <span>
              <LogOut />
              Sign out
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
