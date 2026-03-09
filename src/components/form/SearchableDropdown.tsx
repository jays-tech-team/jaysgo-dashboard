/**
 * A dropdown component with search functionality, supporting both local and API-driven options.
 *
 * @component
 * @param {Option[]} options - The list of selectable options.
 * @param {string | number} [value] - The currently selected value.
 * @param {(value: string) => void} [onChange] - Callback fired when the selected value changes.
 * @param {string} [placeholder="Select an option"] - Placeholder text displayed when no option is selected.
 * @param {string} [label] - Optional label displayed above the dropdown.
 * @param {string} [className] - Additional CSS classes for the root element.
 * @param {(query: string) => void} [onSearch] - Callback fired when the search query changes (for API-driven search).
 * @param {boolean} [isLoading=false] - Whether the dropdown is in a loading state.
 * @param {string} [error] - Error message to display below the dropdown.
 * @param {boolean} [api=true] - If true, search is handled via API (calls `onSearch`); if false, filters options locally.
 * @param {boolean} [disabled=false] - Whether the dropdown is disabled.
 * @param {"sm" | "md" | "lg"} [size="md"] - Size of the dropdown input.
 *
 * @example
 * <SearchableDropdown
 *   options={[{ value: '1', label: 'Option 1' }]}
 *   value="1"
 *   onChange={handleChange}
 *   onSearch={handleSearch}
 *   isLoading={loading}
 *   error="This field is required"
 *   label="Select an option"
 *   api={true}
 * />
 *
 * @remarks
 * - Supports both controlled and uncontrolled usage.
 * - When `api` is true, search queries are debounced and passed to `onSearch`.
 * - When `api` is false, options are filtered locally based on the search query.
 * - Displays a loading indicator and skeletons when `isLoading` is true.
 */

import { LoaderCircle, Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { debounce } from "../../unities/debounce";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import Skelton from "../ui/Skeleton";
import InputIcon from "./input/InputFieldIcon";

export interface Option {
  value: string;
  label: string;
  display?: string;
}

interface SearchableDropdownProps {
  options: Option[];
  value?: string | number;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  onSearch?: (query: string) => void;
  isLoading?: boolean;
  error?: string;
  api?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  allowClear?: boolean;
}

export default function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  className = "",
  onSearch,
  isLoading = false,
  error,
  api = true,
  disabled = false,
  size = "md",
  allowClear = true,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  // eslint-disable-next-line prefer-const
  let [_options, setOptions] = useState<Option[]>(options);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  // Update selected option when value changes
  useEffect(() => {
    if (value) {
      const option = options.find((opt) => opt.value === value);

      if (!option) {
        setSelectedOption({
          value: String(value),
          label: String(value),
        });
      } else {
        setSelectedOption(option);
      }
    } else {
      setSelectedOption(null);
    }
  }, [value, options]);

  // Create debounced search handler
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (onSearch) {
        onSearch(query);
      }
    }, 300),
    [onSearch]
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (api) {
      debouncedSearch(query);
    } else {
      setOptions(
        options.filter((opt) =>
          opt.label.toLocaleLowerCase().includes(query.toLocaleLowerCase())
        )
      );
    }
  };

  const handleSelect = useCallback(
    (option: Option) => {
      setSelectedOption(option);
      if (onChange) onChange(option.value);
      setIsOpen(false);
      setSearchQuery(""); // Clear search query after selection
    },
    [onChange]
  );

  useEffect(() => {
    if (!api) {
      handleSearchChange({
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [isOpen, api]);

  const handleDropdownToggle = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      if (onSearch && searchQuery) onSearch("");
      setSearchQuery(""); // Clear search query when opening dropdown
    }
  }, [isOpen, disabled]);

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      e.stopPropagation();
      setSelectedOption(null);
      if (onChange) onChange("");
      if (onSearch) onSearch("");
      setSearchQuery("");
    },
    [onChange]
  );

  if (api) {
    _options = options;
  }

  const sizeClasses = {
    sm: "h-8",
    md: "h-11",
    lg: "h-12",
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}
      <div className="relative">
        <div
          onClick={handleDropdownToggle}
          className={`input-field w-full px-4 py-2 rounded-lg border bg-transparent text-gray-800 border-gray-300  text-start flex items-center justify-between ${
            sizeClasses[size]
          } ${error ? "border-red-500" : "border-gray-300"} ${
            disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : ""
          }`}
        >
          <span
            className={cn(
              " text-sm truncate capitalize",
              selectedOption ? "" : "text-gray-400 "
            )}
          >
            {selectedOption
              ? selectedOption.display || selectedOption.label
              : placeholder}
          </span>
          <div className="flex items-center gap-2 !capitalize">
            {selectedOption && allowClear && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <svg
              className={`w-4 h-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="p-2">
            <div className="relative mb-2">
              <InputIcon
                icon={
                  isLoading ? (
                    <LoaderCircle className="absolute animate-spin left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  ) : (
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  )
                }
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search..."
                size="sm"
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="flex flex-col gap-1 items-center justify-center py-4">
                  <Skelton />
                  <Skelton />
                </div>
              ) : _options.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No options found
                </div>
              ) : (
                _options.map((option, i) => (
                  <DropdownItem
                    key={(label || i) + option.label + option.value}
                    onItemClick={() => handleSelect(option)}
                    className={`px-2 py-1 hover:bg-gray-100 rounded-md capitalize ${
                      selectedOption?.value === option.value
                        ? "bg-gray-100"
                        : ""
                    }`}
                  >
                    {option.label}
                  </DropdownItem>
                ))
              )}
            </div>
          </div>
        </Dropdown>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
