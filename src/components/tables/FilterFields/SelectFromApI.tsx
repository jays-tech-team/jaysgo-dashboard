import { useEffect, useState } from "react";
import SearchableDropdown from "../../form/SearchableDropdown";
import apiEngine from "../../../lib/axios";
import { toast } from "sonner";

interface SelectFromApiProps {
  api: string;
  valueKey: string;
  labelKey: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function SelectFromApi({
  api,
  valueKey,
  labelKey,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  className = "",
  error,
  disabled = false,
  size = "md",
}: SelectFromApiProps) {
  const [options, setOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOptions = async (searchQuery?: string) => {
    setIsLoading(true);
    try {
      const response = await apiEngine.get(api, {
        params: {
          "filters[search]": searchQuery,
        },
      });

      if (response.data?.data?.items) {
        const formattedOptions = response.data.data.items.map(
          (item: Record<string, string>) => {
            return {
              value: item[valueKey],
              label: item[labelKey],
            };
          }
        );

        setOptions(formattedOptions);
      } else {
        toast.error("Failed to fetch options");
      }
    } catch (error) {
      console.error("Error fetching options:", error);
      toast.error("Failed to fetch options");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, [api]);

  return (
    <SearchableDropdown
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      label={label}
      className={className}
      onSearch={fetchOptions}
      isLoading={isLoading}
      error={error}
      disabled={disabled}
      size={size}
    />
  );
}
