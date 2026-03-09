import type React from "react";
import type { FC, Ref } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { InputMessage } from "../InputError";
export type inputSizeType = "sm" | "md" | "lg";
interface InputProps {
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string;
  max?: string;
  step?: string | number;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
  register?: UseFormRegisterReturn;
  onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  size?: inputSizeType;
  onBlur?: React.FocusEventHandler<HTMLInputElement> | undefined;
  ref?: Ref<HTMLInputElement>;
  onFocus?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const Input: FC<InputProps> = ({
  type = "text",
  id,
  name,
  placeholder,
  value,
  onChange,
  className = "",
  min,
  max,
  step,
  disabled = false,
  success = false,
  error = false,
  hint,
  register,
  onInput,
  size = "md",
  onBlur,
  ref,
  onFocus,
  onKeyDown,
}) => {
  let inputClasses = `input-field w-full rounded-lg border appearance-none px-4 py-2.5 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ${className}`;

  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 opacity-40`;
  } else if (error) {
    inputClasses += `  border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`;
  } else if (success) {
    inputClasses += `  border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800`;
  }

  const sizeClasses = {
    sm: "h-8 text-sm",
    md: "h-11 text-md",
    lg: "h-12 text-md",
  };

  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={inputClasses + " " + sizeClasses[size]}
        onInput={onInput}
        onBlur={onBlur}
        ref={ref}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        {...register}
      />

      {hint && <InputMessage error={error} success={success} message={hint} />}
    </div>
  );
};

export default Input;
