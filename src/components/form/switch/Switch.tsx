import { useEffect, useState } from "react";
import { cn } from "../../../lib/utils";

interface SwitchProps {
  label: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => boolean | void;
  color?: "brand" | "gray" | "danger";
  size?: "xs" | "sm" | "md" | "lg";
}

const Switch: React.FC<SwitchProps> = ({
  label,
  defaultChecked = false,
  disabled = false,
  onChange,
  color = "brand",
  size = "md",
}) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleToggle = () => {
    if (disabled) return;
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    if (onChange) {
      onChange(newCheckedState);
    }
  };

  useEffect(() => {
    setIsChecked(defaultChecked);
  }, [defaultChecked, setIsChecked]);

  const switchColors = (() => {
    switch (color) {
      case "brand":
        return {
          background: isChecked
            ? "bg-brand-500"
            : "bg-gray-200 dark:bg-white/10",
          knob: isChecked
            ? "translate-x-full bg-white"
            : "translate-x-0 bg-white",
        };
      case "danger":
        return {
          background: isChecked
            ? "bg-red-500 dark:bg-red-600"
            : "bg-gray-200 dark:bg-white/10",
          knob: isChecked
            ? "translate-x-full bg-white"
            : "translate-x-0 bg-white",
        };
      default:
        return {
          background: isChecked
            ? "bg-gray-800 dark:bg-white/10"
            : "bg-gray-200 dark:bg-white/10",
          knob: isChecked
            ? "translate-x-full bg-white"
            : "translate-x-0 bg-white",
        };
    }
  })();

  const switchSizes = (() => {
    switch (size) {
      case "xs":
        return {
          container: "h-3 w-6",
          knob: "h-2 w-2 left-0.5 top-0.5",
          gap: "gap-2",
          text: "text-xs",
        };
      case "sm":
        return {
          container: "h-4 w-7",
          knob: "h-3 w-3 left-0.5 top-0.5",
          gap: "gap-2",
          text: "text-sm",
        };
      case "lg":
        return {
          container: "h-8 w-14",
          knob: "h-7 w-7 left-0.5 top-0.5",
          gap: "gap-4",
          text: "text-base",
        };
      default: // md
        return {
          container: "h-6 w-11",
          knob: "h-5 w-5 left-0.5 top-0.5",
          gap: "gap-3",
          text: "text-sm",
        };
    }
  })();

  return (
    <label
      className={cn(
        "flex cursor-pointer select-none items-center font-medium",
        switchSizes.gap,
        switchSizes.text,
        disabled ? "text-gray-400" : "text-gray-700 dark:text-gray-400"
      )}
      onClick={handleToggle}
    >
      <div className="relative">
        <div
          className={cn(
            "block transition duration-150 ease-linear rounded-full",
            switchSizes.container,
            disabled
              ? "bg-gray-100 pointer-events-none dark:bg-gray-800"
              : switchColors.background
          )}
        ></div>
        <div
          className={cn(
            "absolute rounded-full shadow-theme-sm duration-150 ease-linear transform",
            switchSizes.knob,
            switchColors.knob
          )}
        ></div>
      </div>
      {label}
    </label>
  );
};

export default Switch;
