import { useEffect, useState } from "react";
import SearchableDropdown from "./SearchableDropdown";
import apiEngine from "../../lib/axios";
import { InputWrap } from "./InputWrap";
import { API_ENDPOINTS } from "../../types/ApiEndpoints.enum";
import MultiSelect from "../ui/multiselect";

export interface PaymentStatusSelectProps {
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

export default function PaymentStatusSelect({
  value,
  onChange,
  label = "Payment Status",
  placeholder = "Select payment status",
  error,
  disabled = false,
  size = "md",
  className = "",
  required,
  multiple = false,
}: PaymentStatusSelectProps) {
  const [options, setOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query?: string) => {
    setIsLoading(true);
    try {
      const response = await apiEngine.get(API_ENDPOINTS.PAYMENT_STATUS_LIST, {
        params: {
          "filters[status]": "active",
          "filters[search]": query,
          limit: 1000,
        },
      });

      const items = response.data?.data?.items || [];
      setOptions(
        items.map((item: Record<string, string>) => ({
          value: item["payment_status_slug"],
          label: item["payment_status_name"],
        }))
      );
    } catch (error) {
      console.error("Error fetching payment statuses:", error);
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
          onChange={(val) => onChange?.(val)}
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
