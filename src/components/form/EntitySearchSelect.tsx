import { useMemo } from "react";
import SearchableDropdown from "./SearchableDropdown";

export default function EntitySearchSelect({
  options,
  value,
  onChange,
  placeholder = "Search…",
  disabled = false,
  size = "md",
}: {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const safeOptions = useMemo(() => options || [], [options]);

  return (
    <SearchableDropdown
      options={safeOptions}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      size={size}
      api={false}
    />
  );
}

