import { useEffect, useState } from "react";
import SearchableDropdown from "./SearchableDropdown";
import apiEngine from "../../lib/axios";
import { InputWrap } from "./InputWrap";
import { API_ENDPOINTS } from "../../types/ApiEndpoints.enum";
import MultiSelect from "../ui/multiselect";

export interface OrderStatusSelectProps {
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  required?: boolean;
  multiple?: boolean;
}

/**
 * A dropdown component for selecting order statuses.
 *
 * A reusable select input component for selecting order status(es). Supports both single and multiple selection modes.
 * Fetches status options asynchronously from an API endpoint and provides search functionality.
 *
 * if multiple is true, a MultiSelect component is rendered, otherwise a SearchableDropdown is used.
 *
 * The value should be array
 * on onchange value will be array
 * if single select value will be string as array
 *
 * @component OrderStatusSelect
 */
export default function OrderStatusSelect({
  value,
  onChange,
  label = "Status",
  placeholder = "Select order status",
  error,
  disabled = false,
  size = "md",
  className = "",
  required,
  multiple = false,
}: OrderStatusSelectProps) {
  const [options, setOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query?: string) => {
    setIsLoading(true);
    try {
      const response = await apiEngine.get(API_ENDPOINTS.ORDER_STATUS, {
        params: {
          "filters[status]": "active",
          "filters[search]": query,
          limit: 1000,
        },
      });

      const items = response.data?.data?.items || [];
      setOptions(
        items.map((item: Record<string, string>) => ({
          value: item["order_status_slug"],
          label: item["order_status_name"],
        }))
      );
    } catch (error) {
      console.error("Error fetching order statuses:", error);
      setOptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <InputWrap
      label={label}
      error={error}
      className={className}
      required={required}
    >
      {multiple ? (
        <MultiSelect
          options={options}
          selectedValues={Array.isArray(value) ? value : []}
          onSelectionChange={onChange}
        />
      ) : (
        <SearchableDropdown
          options={options}
          value={value?.toString() || ""}
          onChange={(val) => onChange?.([val])}
          placeholder={placeholder}
          isLoading={isLoading}
          disabled={disabled}
          size={size}
          api={false}
        />
      )}
    </InputWrap>
  );
}
