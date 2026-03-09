import flatpickr from "flatpickr";
import { Instance } from "flatpickr/dist/types/instance";
import { Calendar, SquareX, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import { cn } from "../../lib/utils";
import Label from "./Label";
import RequiredStar from "./RequiredStar";

type DateOption = Date | string | number;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: (
    selectedDates: Date[] | [],
    dateString: string | "",
    instance: Instance,
  ) => void;
  onClose?: (selectedDates: Date[], dateString: string) => void;
  onClear?: (selectedDates: Date[], dateString: string) => void;
  value?: DateOption | DateOption[];
  label?: string;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  enableTime?: boolean;
  time_24hr?: boolean;
  disabled?: boolean;
  noCalendar?: boolean;
  dateFormat?: string;
  allowInput?: boolean;
  /**
   * Minimum date that can be selected.
   * Can be a Date object, a string in the format 'YYYY-MM-DD', or 'today'.
   * Defaults to 'today'.
   * use function getTomorrowDate(true) to get set next day date
   */
  minDate?: DateOption;
  maxDate?: DateOption;
  required?: boolean;

  clearButton?: boolean;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  onClose,
  onClear,
  label,
  value,
  placeholder,
  size = "md",
  enableTime = false,
  disabled,
  noCalendar = false,
  time_24hr = false,
  dateFormat = "d-m-Y",
  allowInput = false,
  minDate = "today",
  maxDate,
  required = false,
  clearButton = false,
}: PropsType) {
  const [internalValue, setInternalValue] = useState<DateOption | DateOption[]>(
    value ?? "",
  );

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (
    selectedDates: Date[],
    dateString: string,
    instance: Instance,
  ) => {
    onChange?.(selectedDates, dateString, instance);
  };

  const handOnClose = (selectedDates: Date[], dateString: string) => {
    setInternalValue(selectedDates);
    onClose?.(selectedDates, dateString);
  };

  const options = {
    mode: mode || "single",
    static: true,
    monthSelectorType: "static" as const,
    dateFormat,
    enableTime,
    minDate,
    maxDate,
    noCalendar,
    time_24hr,
    allowInput,
    placeholder,
  };

  const sizeClasses = {
    sm: "h-8",
    md: "h-11",
    lg: "h-12",
  };

  return (
    <div>
      {label && (
        <Label htmlFor={id}>
          {label} <RequiredStar required={required} />
        </Label>
      )}

      <div className={cn("relative", disabled && "opacity-50")}>
        <div
          className={cn(
            "absolute text-gray-500 -translate-y-1/2 cursor-pointer  right-3 top-1/2 dark:text-gray-400 z-10 ",
            internalValue ?? "pointer-events-none",
          )}
        >
          {internalValue && internalValue.toString() && clearButton && (
            <SquareX
              className="not-allow hover:text-red-400"
              onClick={() => {
                setInternalValue("");
                const fp = flatpickr(id, {});
                const instance = Array.isArray(fp) ? fp[0] : fp;
                onChange?.([], "", instance);
                onClear?.([], "");
              }}
            />
          )}
          {(!internalValue || !clearButton || !internalValue.toString()) &&
            (noCalendar ? (
              <Timer className="size-6 " />
            ) : (
              <Calendar className="size-6  bg-white" />
            ))}
        </div>
        <Flatpickr
          id={id}
          draggable={true}
          options={options}
          onChange={handleChange}
          onClose={handOnClose}
          disabled={disabled}
          placeholder={placeholder}
          value={internalValue}
          className={cn(
            "input-field w-full rounded-lg border appearance-none px-4 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800",
            sizeClasses[size],
          )}
        />
      </div>
    </div>
  );
}
