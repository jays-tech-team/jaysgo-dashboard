import { CheckCircle, Info, TriangleAlert } from "lucide-react";
import { Link } from "react-router";

interface AlertProps {
  variant: "success" | "error" | "warning" | "info"; // Alert type
  title?: string; // Title of the alert
  message: string; // Message of the alert
  showLink?: boolean; // Whether to show the "Learn More" link
  linkHref?: string; // Link URL
  linkText?: string; // Link text
  hidden?: boolean;
  onLinkClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const Alert: React.FC<AlertProps> = ({
  variant,
  title,
  message,
  showLink = false,
  linkHref = "#",
  linkText = "Learn more",
  hidden = false,
  onLinkClick,
}) => {
  // Tailwind classes for each variant
  const variantClasses = {
    success: {
      container:
        "border-success-500 bg-success-50 dark:border-success-500/30 dark:bg-success-500/15",
      icon: "text-success-500",
    },
    error: {
      container:
        "border-error-500 bg-error-50 dark:border-error-500/30 dark:bg-error-500/15",
      icon: "text-error-500",
    },
    warning: {
      container:
        "border-warning-500 bg-warning-50 dark:border-warning-500/30 dark:bg-warning-500/15",
      icon: "text-warning-500",
    },
    info: {
      container:
        "border-blue-light-500 bg-blue-light-50 dark:border-blue-light-500/30 dark:bg-blue-light-500/15",
      icon: "text-blue-light-500",
    },
  };

  // Icon for each variant
  const icons = {
    success: <CheckCircle size={22} />,
    error: <Info size={22} />,
    warning: <TriangleAlert size={22} />,
    info: <Info size={22} />,
  };

  if (hidden) return null;

  return (
    <div
      className={`rounded-xl border p-4 ${variantClasses[variant].container}`}
    >
      <div className="flex items-start gap-3">
        <div className={`-mt-0.5 ${variantClasses[variant].icon}`}>
          {icons[variant]}
        </div>

        <div>
          {title && (
            <h4 className="mb-1 text-sm font-semibold text-gray-800 dark:text-white/90">
              {title}
            </h4>
          )}

          <p className="text-sm text-gray-500 dark:text-gray-400 break-all">
            {message}
          </p>

          {showLink && (
            <Link
              onClick={onLinkClick}
              to={linkHref}
              className="inline-block mt-3 text-sm font-medium text-gray-500 underline dark:text-gray-400"
            >
              {linkText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alert;
