import { useCallback, useEffect, useState } from "react";
import SearchableDropdown from "./SearchableDropdown";
import apiEngine from "../../lib/axios";
import { InputWrap } from "./InputWrap";

interface PaymentMethod {
  payment_method_name: string;
  payment_method_slug: string;
  payment_gateway_name: string;
  payment_gateway_slug: string;
  payment_method_label: string;
  payment_method_status: string;
}

export interface PaymentMethodSelectProps {
  value?: { paymentGateway: string; paymentMethod: string };
  onChange?: (
    value: { paymentGateway: string; paymentMethod: string } | null
  ) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  required?: boolean;
}

export default function PaymentMethodSelect({
  value,
  onChange,
  label = "Payment Method",
  placeholder = "Select payment method",
  error,
  disabled = false,
  size = "md",
  className = "",
  required,
}: PaymentMethodSelectProps) {
  const [options, setOptions] = useState<
    {
      value: string;
      label: string;
      payment_gateway_slug: string;
      payment_method_slug: string;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>("");

  // Fetch payment methods from API
  const fetchPaymentMethods = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiEngine.get("admin/payment-methods", {
        params: {
          status: "active",
          backoffice_payment: true,
        },
      });
      const items: PaymentMethod[] = response.data?.data?.items || [];
      setOptions(
        items.map((item) => ({
          value: `${item.payment_gateway_slug}__${item.payment_method_slug}`,
          label: item.payment_method_label,
          payment_gateway_slug: item.payment_gateway_slug,
          payment_method_slug: item.payment_method_slug,
        }))
      );
    } catch (error) {
      console.error(error);
      setOptions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Set selected value from prop
  useEffect(() => {
    if (value && value.paymentGateway && value.paymentMethod) {
      setSelectedValue(`${value.paymentGateway}__${value.paymentMethod}`);
    } else {
      setSelectedValue("");
    }
  }, [value]);

  // Initial fetch
  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  // Handle selection change
  const handleChange = (val: string) => {
    const found = options.find((opt) => opt.value === val);
    if (found && onChange) {
      onChange({
        paymentGateway: found.payment_gateway_slug,
        paymentMethod: found.payment_method_slug,
      });
    } else if (onChange) {
      onChange(null);
    }
    setSelectedValue(val);
  };

  return (
    <InputWrap
      label={label}
      error={error}
      className={className}
      required={required}
    >
      <SearchableDropdown
        options={options}
        api={false}
        value={selectedValue}
        onChange={handleChange}
        placeholder={placeholder}
        isLoading={isLoading}
        disabled={disabled}
        size={size}
      />
    </InputWrap>
  );
}
