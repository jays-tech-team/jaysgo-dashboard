import { cn } from "../../lib/utils";

interface ComponentCardProps {
  title?: string | React.ReactNode;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  wrapperClassName?: string; // Additional custom classes for styling
  desc?: string; // Description text
  actions?: React.ReactNode;
  id?: string;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  wrapperClassName = "",
  actions,
  id,
}) => {
  return (
    <div
      id={id}
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      <div
        className={cn(
          title ? "px-6 py-5" : "",
          actions ? " items-center grid  grid-cols-3" : ""
        )}
      >
        {/* Card Header */}
        {title && (
          <div className="">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              {title}
            </h3>
            {desc && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {desc}
              </p>
            )}
          </div>
        )}
        <div className="col-span-2">{actions && actions}</div>
      </div>

      {/* Card Body */}
      <div
        className={cn(
          title || desc ? "border-t border-gray-100 dark:border-gray-800" : "",
          "p-4 sm:p-6",
          wrapperClassName
        )}
      >
        <div className="">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
