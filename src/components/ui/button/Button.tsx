import { ReactNode } from "react";
import { useAuth } from "../../../context/AuthContext";
import { PERMISSIONS, USER_ROLES } from "../../../unities/permissions";

export type ButtonVariants =
  | "primary"
  | "outline"
  | "danger"
  | "ghost"
  | "outline-danger"
  | "outline-primary"
  | "warning"
  | "info"
  | "success";

interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: "sm" | "md" | "xs"; // Button size
  variant?: ButtonVariants; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Disabled state

  /**
   * If permission is empty. we will skip permission check and will show the button.
   */
  permissions?: PERMISSIONS[];
  type?: "button" | "submit" | "reset";

  hidden?: boolean;

  style?: React.CSSProperties;

  form?: string;

  ref?: React.Ref<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  permissions = [],
  type,
  hidden = false,
  style,
  form,
  ref,
}) => {
  const { hasPermission, hasRole } = useAuth();
  // Size Classes
  const sizeClasses = {
    xs: "px-2 py-2 text-xs",
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  // Variant Classes
  const variantClasses = {
    success:
      "bg-green-500 text-white shadow-theme-xs hover:bg-green-600 disabled:bg-green-300",
    warning:
      "bg-yellow-400 text-yellow-900 shadow-theme-xs hover:bg-yellow-500 disabled:bg-yellow-200 ",
    info: "bg-blue-500 text-white shadow-theme-xs hover:bg-blue-600 disabled:bg-blue-300",
    danger:
      "bg-red-500 text-white shadow-theme-xs hover:bg-red-600 disabled:bg-red-300",
    primary:
      "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ",
    ghost: "",
    "outline-danger":
      "bg-white text-red-600 ring-1 ring-inset ring-red-300 hover:bg-red-50 ",
    "outline-primary":
      "bg-white text-brand-500 ring-1 ring-inset ring-brand-300 hover:bg-brand-50 ",
  };

  if (
    (permissions.length &&
      !hasRole([USER_ROLES.ADMIN]) &&
      !hasPermission(permissions)) ||
    hidden
  ) {
    return null;
  }

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition active:scale-95  ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
      style={style}
      form={form}
      ref={ref}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
