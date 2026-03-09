/**
 * A customizable select dropdown component.
 *
 * @remarks
 * This component renders a styled `<select>` element with support for custom options, placeholder, sizing, and disabled state.
 * It manages its own selected value state and triggers an optional `onChange` callback when the selection changes.
 *
 * @param options - Array of option objects to display in the dropdown.
 * @param placeholder - Placeholder text shown as the first disabled option.
 * @param onChange - Optional callback fired when the selected value changes.
 * @param className - Additional CSS classes to apply to the select element.
 * @param defaultValue - The initial selected value.
 * @param size - Controls the size of the select (`"sm"`, `"md"`, or `"lg"`).
 * @param disabled - If true, disables the select input.
 *
 * @example
 * ```tsx
 * <Select
 *   options={[
 *     { value: "apple", label: "Apple" },
 *     { value: "banana", label: "Banana" }
 *   ]}
 *   placeholder="Choose a fruit"
 *   onChange={handleSelectChange}
 *   size="md"
 * />
 * ```
 */
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { UseFormRegisterReturn } from "react-hook-form";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  value?: string;
  name?: string;
  id?: string;
  register?: UseFormRegisterReturn;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  value = "",
  size = "md",
  disabled = false,
  name = "",
  id = "",
  register = {},
}) => {
  // Manage the selected value
  const [selectedValue, setSelectedValue] = useState<string>(value);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const _value = e.target.value;
    setSelectedValue(_value);
    if (onChange) onChange(e); // Trigger parent handler
  };

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const sizeClasses = {
    sm: "h-8 text-xs py-2",
    md: "h-11 text-base py-2.5",
    lg: "h-12 text-base py-2",
  };

  return (
    <select
      {...register}
      name={name}
      id={id}
      disabled={disabled}
      className={cn(
        disabled ? "cursor-not-allowed opacity-50" : "",
        sizeClasses[size],
        "input-field w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 pr-11 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800",
        selectedValue
          ? "text-gray-800 dark:text-white/90"
          : "text-gray-400 dark:text-gray-400",
        className,
      )}
      value={selectedValue}
      onChange={handleChange}
    >
      {/* Placeholder option */}
      <option
        value=""
        disabled
        className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
      >
        {placeholder}
      </option>
      {/* Map over options */}
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
