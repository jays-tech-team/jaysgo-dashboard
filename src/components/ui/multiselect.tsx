import { Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import Input from "../form/input/InputField";
import Badge from "../ui/badge/Badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

// Types
interface Item {
  label: string;
  value: string;
  altLabel?: string;
}

interface ItemSelectProps {
  options?: Item[];
  selectedValues?: string[];
  onSelectionChange?: (
    tags: string[],
    altLabel: Record<string, Item["altLabel"] | undefined>
  ) => void;
  placeholder?: string;
  maxHeight?: string;
  /**
   * a special feature that allow to edit the alt text of the selected tags
   */
  enableAltText?: boolean;
}

const MultiSelect: React.FC<ItemSelectProps> = ({
  options = [],
  selectedValues: initialSelectedValues = [],
  onSelectionChange,
  placeholder = "Search and select tags...",
  maxHeight = "max-h-70",
  enableAltText = false,
}) => {
  const [selectedState, setSelectedValuesState] = useState<string[]>(
    initialSelectedValues
  );
  const [altLabels, setAltLabels] = useState<Record<string, string>>(
    options.reduce(
      (red, item) => ({
        ...red,
        [item.value]: item.altLabel || undefined,
      }),
      {}
    )
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const selected = onSelectionChange ? initialSelectedValues : selectedState;

  const setTimeoutIdRef = useRef(0);

  const filteredTags = options.filter(
    (tag: Item) =>
      tag.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selected.includes(tag.value)
  );

  const handleValueSelect = (tag: Item): void => {
    const newSelectedValue = [...selected, tag.value];

    if (onSelectionChange) {
      onSelectionChange(newSelectedValue, altLabels);
    } else {
      setSelectedValuesState(newSelectedValue);
    }

    setSearchTerm("");
  };

  const handleValueRemove = (valueToRemove: string): void => {
    const newSelectedValues = selected.filter(
      (tagValue: string) => tagValue !== valueToRemove
    );

    if (onSelectionChange) {
      onSelectionChange(newSelectedValues, altLabels);
    } else {
      setSelectedValuesState(newSelectedValues);
    }
  };

  const handleClearAll = (): void => {
    if (onSelectionChange) {
      onSelectionChange([], {});
    } else {
      setSelectedValuesState([]);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = (): void => {
    setIsOpen(true);
  };

  const handleOpenChange = (open: boolean): void => {
    setIsOpen(open);
    if (!open) {
      setSearchTerm("");
    }
  };

  const handleAltInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAltLabels((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });

    clearTimeout(setTimeoutIdRef.current);
    setTimeoutIdRef.current = window.setTimeout(() => {
      if (onSelectionChange) {
        const altLabelsUpdated = {
          ...altLabels,
          [name]: value,
        };
        const filtered = selected.reduce(
          (prev, curr) => ({
            ...prev,
            [curr]: altLabelsUpdated[curr],
          }),
          {} as Record<string, string>
        );
        onSelectionChange(selected, filtered);
      }
    }, 1000);
  };

  // Helper function to get Values text from value
  const getItemText = (value: string): string => {
    const item = options.find((_item) => _item.value === value);
    return item ? item.label : value;
  };

  return (
    <>
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <div className="min-h-10 w-full rounded-lg border appearance-none px-4 py-2.5 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 relative">
            {/* Selected Tags */}
            <div className="flex flex-wrap gap-2">
              {(selected.length > 0 &&
                selected.map((tagValue: string) => (
                  <Badge key={tagValue}>
                    <span>{getItemText(tagValue)}</span>
                    {enableAltText == true && (
                      <input
                        value={altLabels[tagValue]}
                        name={tagValue}
                        onChange={handleAltInputChange}
                        style={{
                          width: (altLabels[tagValue]?.length || 1) * 9 + "px",
                          minWidth: "24px",
                        }}
                        placeholder="Alt"
                        className="bg-brand-100 h-4 rounded-sm px-1 placeholder:text-[10px]"
                      />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleValueRemove(tagValue);
                      }}
                      type="button"
                      className="hover:bg-black hover:bg-opacity-20 rounded-full p-0.5 transition-colors opacity-70 hover:opacity-100"
                      aria-label={`Remove ${getItemText(tagValue)}`}
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))) || <span>{placeholder}</span>}
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent sideOffset={4}>
          <div className="">
            <div className="font-medium pb-4 text-gray-500 uppercase tracking-wide border-b border-gray-100">
              <Input
                type="text"
                size="sm"
                placeholder={
                  selected.length === 0 ? placeholder : "Search tags..."
                }
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={handleInputFocus}
                aria-label="Search tags"
              />
            </div>
            <div className={`${maxHeight} overflow-y-auto`}>
              {(filteredTags.length > 0 &&
                filteredTags.map((tag: Item) => (
                  <button
                    key={tag.value}
                    onClick={() => handleValueSelect(tag)}
                    className="w-full text-left px-4 py-1 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center gap-3 transition-colors border-b border-gray-50"
                    role="option"
                    aria-selected="false"
                    type="button"
                  >
                    <span className="text-gray-700 ">{tag.label}</span>
                    <Plus size={14} className="text-gray-400 ml-auto" />
                  </button>
                ))) || (
                <div className="px-4 py-8 text-center text-gray-500">
                  <div className="text-sm">
                    {searchTerm ? (
                      <>
                        No tags found for <strong>"{searchTerm}"</strong>
                      </>
                    ) : (
                      "All available tags have been selected"
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Selection Summary */}
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {selected.length} {selected.length === 1 ? "tag" : "tags"} selected
        </div>
        {selected.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
            type="button"
          >
            Clear all
          </button>
        )}
      </div>
    </>
  );
};

export default MultiSelect;
