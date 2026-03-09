import React, { ChangeEvent, useEffect, useState } from "react";
import Input, { inputSizeType } from "./InputField";

const formatToTwoDecimals = (value: string | number): number => {
  const num = parseFloat(value.toString());
  if (isNaN(num)) return 0.0;
  return num;
};

interface PriceInputProps {
  value: string | number;
  onChange?: (value: number) => void;
  placeholder?: string;
  className?: string;
  max?: number;
  name?: string;
  size?: inputSizeType;
  hidden?: boolean;
  disabled?: boolean;
  /**
   * Allow null value. default false. if false value will be 0.00 on null
   */
  allowNull?: boolean;
}

/**
 * A controlled input component for entering and formatting price values.
 *
 * This component ensures that the input only allows numeric values and a single decimal point.
 * On blur, it automatically formats the value to two decimal places.
 * */
const PriceInput: React.FC<PriceInputProps> = ({
  value,
  onChange,
  placeholder = "0.00",
  className = "",
  max,
  name,
  size,
  hidden = false,
  disabled = false,
  allowNull = false,
}) => {
  const [price, setPrice] = useState<string | number>(value);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;

    // Allow only digits and a single decimal point
    let sanitized = input.replace(/[^0-9.]/g, "");
    // Prevent multiple decimals
    const parts = sanitized.split(".");
    if (parts.length > 2) {
      sanitized = parts[0] + "." + parts.slice(1).join("");
    }
    setPrice(sanitized);
  };

  const handleBlur = () => {
    if ((price == "" || price == null || price == undefined) && allowNull)
      return null;
    const formatted = formatToTwoDecimals(price);
    const maxPrice = max ? Math.min(formatted, max) : formatted;
    setPrice(maxPrice.toFixed(2));
    if (onChange) onChange(maxPrice); // Format on blur
  };

  useEffect(() => {
    setPrice(formatToTwoDecimals(value).toFixed(2));
  }, [value]);

  if (hidden) return null;
  return (
    <Input
      type="text"
      className={`${className} w-24`}
      placeholder={placeholder}
      value={price}
      onChange={handleChange}
      onBlur={handleBlur}
      name={name}
      size={size}
      disabled={disabled}
    />
  );
};

export default PriceInput;
