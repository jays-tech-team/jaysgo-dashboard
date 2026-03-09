import { Ref, useMemo } from "react";
import { cn } from "../../../lib/utils";
import { CountriesCodes, CountryCode } from "../../common/CountryCodes";
import { ChangeHandler } from "react-hook-form";
import SearchableDropdown from "../SearchableDropdown";

interface PhoneInputProps {
  placeholder?: string;
  /**
   * When the country code or number change.
   * @param phoneNumber the full phone number, e.g: +97150500500
   * @returns void
   */
  onChange?: (phoneNumber: string) => void;
  selectPosition?: "start" | "end"; // New prop for dropdown position
  size?: "sm" | "md" | "lg";
  value?: string;
  disabled?: boolean;
  defaultCountry?: string; // Optional prop to set a default country code
  allowedCountries?: CountryCode["code"][]; // Optional prop to filter allowed countries
  excludedCountries?: CountryCode["code"][]; // Optional prop to exclude certain countries
  ref?: Ref<HTMLInputElement>;
  onFocus?: () => void;
  onBlur?: ChangeHandler;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * PhoneInput component for entering phone numbers with country code selection.
 * @remarks
 * This component provides an input field for phone numbers, allowing users to select a country code from a dropdown.
 * It supports filtering allowed or excluded countries, setting a default country, and customizing the dropdown position and input size.
 */
const PhoneInput: React.FC<PhoneInputProps> = ({
  placeholder = "505000500",
  onChange,
  selectPosition = "start", // Default position is 'start'
  size = "md",
  value = "",
  disabled = false,
  allowedCountries = [],
  excludedCountries = [],
  defaultCountry = "AE",
  ref,
  onFocus,
  onKeyDown,
  onBlur,
}) => {
  /**
   *  Filter countries based on allowedCountries and excludedCountries
   *  Use useMemo to optimize performance by memoizing the filtered countries
   */
  const CountriesCodesFiltered = useMemo(() => {
    return CountriesCodes.filter((country) => {
      if (allowedCountries.length > 0) {
        return allowedCountries.includes(country.code);
      }
      if (excludedCountries.length > 0) {
        return !excludedCountries.includes(country.code);
      }
      return true;
    });
  }, [allowedCountries, excludedCountries]);

  const valueExtracted = extractPhoneNumberParts(value, CountriesCodes);
  const selectedCountry =
    valueExtracted.countryCode ||
    CountriesCodesFiltered.find((country) => country.code == defaultCountry)
      ?.dial_code ||
    CountriesCodesFiltered[0]?.dial_code;

  // Prepare options for SearchableDropdown
  const countryOptions = CountriesCodesFiltered.map((country) => ({
    value: country.dial_code,
    label: `${country.name} (${country.dial_code})`,
    display: country.code,
  }));

  const handleCountryChange = (newCountry: string) => {
    if (onChange) {
      onChange(newCountry + valueExtracted.number);
    }
  };
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e.target.value.replace(/[^0-9]+/, "");

    // setPhoneNumber(newPhoneNumber);
    if (onChange) {
      onChange(selectedCountry + newPhoneNumber);
    }
  };
  const sizeClasses = {
    sm: "h-8",
    md: "h-11",
    lg: "h-12",
  };

  return (
    <div className={cn(disabled ? "opacity-50" : "", "relative flex")}>
      <div className="absolute">
        <SearchableDropdown
          options={countryOptions}
          value={selectedCountry}
          onChange={handleCountryChange}
          disabled={disabled}
          size={size}
          placeholder="+"
          api={false}
          allowClear={false}
        />
      </div>
      <div className="absolute left-20 top-1/2 -translate-y-1/2 text-sm">
        {selectedCountry}
      </div>
      {/* Input field */}
      <input
        type="tel"
        disabled={disabled}
        value={valueExtracted.number}
        onChange={handlePhoneNumberChange}
        placeholder={placeholder}
        ref={ref}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        className={`dark:bg-dark-900 ${sizeClasses[size]} w-full ${
          selectPosition === "start" ? "pl-[110px]" : "pr-[84px]"
        } rounded-lg border border-gray-300 bg-transparent py-3 px-4 ps-10 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
      />
    </div>
  );
};

function extractPhoneNumberParts(phone: string, countries: CountryCode[]) {
  for (const country of countries) {
    if (phone.startsWith(country.dial_code)) {
      return {
        countryCode: country.dial_code,
        number: phone.slice(country.dial_code.length),
      };
    }
  }
  return { countryCode: "", number: phone };
}

export default PhoneInput;
