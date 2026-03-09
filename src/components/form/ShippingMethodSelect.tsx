import { useEffect, useState } from "react";
import SearchableDropdown from "./SearchableDropdown";
import apiEngine from "../../lib/axios";
import { InputWrap } from "./InputWrap";
import { API_ENDPOINTS } from "../../types/ApiEndpoints.enum";

export interface ShippingMethodSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  required?: boolean;
}

export default function ShippingMethodSelect({
  value,
  onChange,
  label = "Shipping Method",
  placeholder = "Select shipping method",
  error,
  disabled = false,
  size = "md",
  className = "",
  required,
}: ShippingMethodSelectProps) {
  const [options, setOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query?: string) => {
    setIsLoading(true);
    try {
      const response = await apiEngine.get(
        API_ENDPOINTS.SETTINGS_SHIPPING_METHODS,
        {
          params: {
            "filters[status]": "active",
            "filters[search]": query,
            limit: 1000,
          },
        }
      );

      const items = response.data?.data?.items || [];
      setOptions(
        items.map((item: Record<string, string>) => ({
          value: item["shipping_method_slug"],
          label: item["shipping_method_name"],
        }))
      );
    } catch (error) {
      console.error("Error fetching shipping methods:", error);
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
      <SearchableDropdown
        options={options}
        value={value || ""}
        onChange={(val) => onChange?.(val)}
        placeholder={placeholder}
        isLoading={isLoading}
        disabled={disabled}
        size={size}
        api={false}
      />
    </InputWrap>
  );
}
