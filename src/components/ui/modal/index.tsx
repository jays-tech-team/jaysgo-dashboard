import { useRef, useEffect } from "react";
import { cn } from "../../../lib/utils";
import { X } from "lucide-react";

interface ModalProps {
  size?: "sm" | "md" | "lg";
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
  showCloseButton?: boolean; // New prop to control close button visibility
  isFullscreen?: boolean; // Default to false for backwards compatibility
  closeOnOutOfBoxClick?: boolean; // if it true. modal will close will, default true
  title?: string | React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  size = "sm",
  onClose,
  children,
  className,
  showCloseButton = true, // Default to true for backwards compatibility
  isFullscreen = false,
  closeOnOutOfBoxClick = true,
  title,
  footer,
  bodyClassName,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const contentClasses = isFullscreen
    ? "relative   dark:bg-gray-900 w-full"
    : "relative w-full rounded-3xl bg-white   dark:bg-gray-900    ";

  const sizeClasses = {
    sm: "max-w-[600px]",
    md: "max-w-[800px]",
    lg: "max-w-[1100px]",
  };
  return (
    <div className="modal fixed inset-0 flex items-center justify-center modal z-99999 mx-2">
      <div
        className="fixed inset-0  w-full bg-gray-400/50 backdrop-blur-[12px]"
        onClick={() => {
          if (closeOnOutOfBoxClick) onClose();
        }}
      ></div>
      <div
        ref={modalRef}
        className={`${contentClasses} ${sizeClasses[size]} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{ height: isFullscreen ? "" : "80px" }}
          className=" relative flex items-center justify-center "
        >
          {title && <h2 className="text-center text-lg ">{title}</h2>}
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-50 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-3  sm:h-8 sm:w-8"
            >
              <X />
            </button>
          )}
        </div>
        <div
          style={{
            [isFullscreen || size == "lg"
              ? "height"
              : "maxHeight"]: `calc(100vh - ${footer ? 250 : 165}px)`,
          }}
          className={cn(
            " p-4 md:p-8 !pt-0",
            bodyClassName,
            isFullscreen ? "" : "overflow-scroll"
          )}
        >
          {children}
        </div>
        {footer && (
          <div
            style={{ height: "64px" }}
            className="px-4 md:px-8 overflow-hidden border-t border-solid border-accent"
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
