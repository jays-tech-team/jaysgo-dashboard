import { CircleAlert, Delete, LoaderCircle, Trash2 } from "lucide-react";
import { Fragment, JSX, useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import apiEngine from "../../lib/axios";
import { PERMISSIONS } from "../../unities/permissions";
import ComponentCard from "../common/ComponentCard";
import DatePicker from "../form/date-picker";
import { Modal } from "../ui/modal";
import Skelton from "../ui/Skeleton";
import Table, { TableColumns } from "../ui/table/Table";

import { toast } from "sonner";
import { cn } from "../../lib/utils";
import { debounce } from "../../unities/debounce";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import SelectFromApi from "./FilterFields/SelectFromApI";

type TableParams = {
  page: number;
  /**
   * Per Page limit
   */
  limit: number;
  sortBy: string | null;
  sortOrder: "asc" | "desc" | null;
  [key: string]: string | number | Record<string, string> | null;
};

type FilterInputTypes = "date" | "text" | "select" | "search";

export type DataTableTypes = {
  title?: string;
  description?: string;
  /**
   * @deprecated
   */
  name?: string;
  /**
   * To add Actions on the CardContainer
   */
  action?: React.ReactNode;
  api: string;
  columns?: TableColumns;
  refresh?: number;
  /**
   * If provide the path with placeholder (:actionId). on click TD on each Table TR. will redirect to this URL.
   * If You want to exclude any TD. like actions column. add preventClickViewClick on column
   */
  viewPath?: string;
  filters?: {
    key: string;
    label: string;
    type: FilterInputTypes;
    /**
     * for Select
     */
    api?: string;
    valueKey?: string;
    labelKey?: string;
    defaultValue?: string;
    options?: { value: string; label: string }[];
  }[];

  className?: string;
  defaultQueryStringParams?: Record<string, string>;
};

const defaultFilterParams: TableParams = {
  page: 1,
  limit: 10,
  sortBy: null,
  sortOrder: null,
};

export default function DataTable({
  filters = [],
  title = "",
  description = "",
  api = "string",
  columns = [],
  action,
  refresh,
  viewPath,
  className,
  defaultQueryStringParams,
}: DataTableTypes) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hasInputChange, setHasInputChange] = useState(false);

  const updateDefaultValuesFromQuery = useCallback(() => {
    const initialParams = { ...defaultFilterParams };

    searchParams.forEach((value, key) => {
      if (value !== null) {
        if (key === "page" || key === "limit") {
          initialParams[key] = parseInt(value) || (key === "page" ? 1 : 10);
        } else {
          initialParams[key] = value;
        }
      }
    });
    filters.forEach((field) => {
      if (!initialParams[field.key]) {
        const value = field.defaultValue || "";
        if (value) {
          initialParams[field.key] = field.defaultValue || "";
        }
      }
    });
    return initialParams;
  }, [searchParams, filters]);

  const [tableData, setTableData] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [_columns, _setColumns] = useState<TableColumns>(columns);
  const [params, setParams] = useState<TableParams>(() =>
    updateDefaultValuesFromQuery(),
  );

  const isColumnDefined = !!columns.length;

  const updateURLParams = (newParams: Partial<TableParams>) => {
    const updatedParams = { ...params, ...newParams };
    const urlParams = new URLSearchParams();

    Object.entries(updatedParams).forEach(([key, value]) => {
      if (
        value !== null &&
        value !== undefined &&
        value !== "" &&
        !(key === "limit" && value === 10) &&
        !(key === "page" && value === 1)
      ) {
        if (typeof value === "object" && !Array.isArray(value)) {
          // For filter object, flatten keys
          Object.entries(value as Record<string, string>).forEach(
            ([filterKey, filterValue]) => {
              if (
                filterValue !== "" &&
                filterValue !== null &&
                filterValue !== undefined
              ) {
                urlParams.set(`filter[${filterKey}]`, filterValue);
              }
            },
          );
        } else {
          urlParams.set(key, value.toString().trim());
        }
      }
    });

    setSearchParams(urlParams);
  };

  const fetchData = useCallback(
    debounce(async (searchParams) => {
      try {
        setLoading(true);
        const response = await apiEngine.get(api, {
          params: searchParams,
        });
        if (!isColumnDefined) {
          if (response.data?.data?.items) {
            const cols =
              response.data?.data?.meta.fields ||
              Object.keys(response.data?.data?.items[0]);
            cols.push("actions");
            _setColumns(
              cols.map((col: string) => {
                if (col == "actions") {
                  return {
                    header: "Actions",
                    accessor: "action",
                    cell: () => (
                      <div className="flex gap-2">
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 />
                        </button>
                      </div>
                    ),
                  };
                }
                return {
                  header: col.replace("_", " "),
                  accessor: col,
                  sortable: true,
                };
              }),
            );
          }
        }

        setTableData(response.data.data.items);
        setTotalItems(response.data.data.meta.total);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }, 400),
    [],
  );

  useEffect(() => {
    setLoading(true);
    fetchData(params);
  }, [params, fetchData, refresh]);

  useEffect(() => {
    if (filters.length > 0) {
      setParams(updateDefaultValuesFromQuery());
    }
  }, [filters, updateDefaultValuesFromQuery]);

  function onRefresh() {
    fetchData(params);
  }

  const defaultCols: TableColumns = [
    {
      header: <Skelton />,
      accessor: "",
      sortable: true,
    },
    {
      header: <Skelton />,
      accessor: "",
      sortable: true,
    },
    {
      header: <Skelton />,
      accessor: "",
      sortable: true,
    },
  ];

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    updateURLParams({ page });
  };

  const handlePerPageChange = (limit: number) => {
    setParams((prev) => ({ ...prev, limit, page: 1 }));
    updateURLParams({ limit, page: 1 });
  };

  const handleSort = (sortBy: string, sortOrder: "asc" | "desc") => {
    setParams((prev) => ({ ...prev, sortBy, sortOrder }));
    updateURLParams({ sortBy, sortOrder });
  };

  const handleFilterInputChange = (key: string, value: string) => {
    setHasInputChange(true);
    setParams((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
    updateURLParams({ ...params, [key]: value, page: 1 });
  };

  const handleClearFilter = () => {
    setHasInputChange(false);
    setParams(defaultFilterParams);
    setSearchParams(defaultQueryStringParams);
  };

  return (
    <ComponentCard
      title={title}
      desc={description}
      actions={action}
      className={className}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
        {filters.map((filter) => {
          switch (filter.type) {
            case "date":
              return (
                <DatePicker
                  key={filter.key}
                  value={(params[filter.key] as string) || ""}
                  id={filter.key}
                  label={filter.label}
                  minDate={""} // Make no min date
                  dateFormat="Y-m-d"
                  placeholder="Select the date"
                  clearButton={true}
                  onChange={(_dates, dateStr) =>
                    handleFilterInputChange(filter.key, dateStr)
                  }
                />
              );
            case "select":
              return (
                <div key={filter.label}>
                  {<Label>{filter.label}</Label>}

                  {filter.api && (
                    <SelectFromApi
                      key={filter.key}
                      value={(params[filter.key] || "") as string}
                      onChange={(value) =>
                        handleFilterInputChange(filter.key, value)
                      }
                      api={filter.api || ""}
                      valueKey={filter.valueKey || ""}
                      labelKey={filter.labelKey || ""}
                    />
                  )}
                  {filter.options && (
                    <Select
                      key={filter.key}
                      value={(params[filter.key] || "") as string}
                      onChange={(event) =>
                        handleFilterInputChange(filter.key, event.target.value)
                      }
                      options={filter.options}
                    />
                  )}
                </div>
              );
            case "search":
            case "text":
              return (
                <div key={filter.label}>
                  <Label>{filter.label}</Label>
                  <Input
                    key={filter.key}
                    value={(params[filter.key] as string) || ""}
                    type={filter.type}
                    placeholder={filter.label}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    onChange={(e) =>
                      handleFilterInputChange(filter.key, e.target.value)
                    }
                  />
                </div>
              );
            default:
              return null;
          }
        })}

        {filters.length > 0 &&
          hasInputChange &&
          Object.values(params).filter((v) => !!v).length > 2 && ( // params will have 4 default filters. if has more than 4 keys, that mean it added other filters
            <div>
              <Label className="opacity-0">Clear filter</Label>
              <Button
                size="sm"
                variant="outline-danger"
                onClick={handleClearFilter}
              >
                Clear All
                <Delete size={20} />
              </Button>
            </div>
          )}
      </div>
      <Table
        columns={_columns.length ? _columns : defaultCols}
        data={tableData}
        loading={loading}
        viewPath={viewPath}
        pagination={{
          currentPage: params.page,
          totalPages: Math.ceil(totalItems / params.limit),
          totalItems,
          onPageChange: handlePageChange,
          onPerPageChange: handlePerPageChange,
        }}
        sorting={{
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
          onSort: handleSort,
        }}
        onRefresh={onRefresh}
      />
    </ComponentCard>
  );
}

export function TableActions({
  className,
  buttons,
  onRefresh,
}: {
  className?: string;
  buttons: {
    icon: JSX.Element;
    path?: string;
    className?: string;
    permissions?: PERMISSIONS[];
    deleteAPI?: string;
    deleteMessage?: string;
    onClick?: () => void;
    disabled?: boolean;
  }[];
  onRefresh?: () => void;
}) {
  const { hasPermission, isAdmin } = useAuth();
  const [isModalActive, setIsModalActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  function onDeleteAction(url: string) {
    setIsLoading(true);

    apiEngine
      .delete(url)
      .then(() => {
        setIsModalActive(false);
        toast.success("Deleted successfully");
        if (onRefresh) onRefresh();
      })
      .catch(() => {
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  return (
    <div className={cn("flex gap-2 ", className)}>
      {buttons.map((actionButton, index) => {
        if (
          !isAdmin() &&
          actionButton.permissions &&
          !hasPermission(actionButton.permissions)
        )
          return null;

        if (actionButton.deleteAPI) {
          return (
            <div key={actionButton.deleteAPI}>
              <Modal
                isOpen={isModalActive}
                isFullscreen={false}
                onClose={() => {
                  setIsModalActive(false);
                }}
              >
                <div className="text-center">
                  <div className="inline-block bg-red-50 rounded-full p-3">
                    <CircleAlert
                      className="mx-auto text-red-400"
                      strokeWidth={1.4}
                      size={50}
                    />
                  </div>
                  <h3 className="text-2xl">Are You sure?</h3>
                  <p>
                    {actionButton.deleteMessage || "Do you want to delete?"}
                  </p>
                  <div>
                    <div className="flex items-center justify-center w-full gap-3 mt-8">
                      <button
                        disabled={isLoading}
                        onClick={() => {
                          setIsModalActive(false);
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 "
                      >
                        Close
                      </button>
                      <button
                        disabled={isLoading}
                        onClick={() => {
                          onDeleteAction(actionButton.deleteAPI || "");
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm bg-red-400 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 "
                      >
                        Save Changes
                        {isLoading && (
                          <LoaderCircle size={20} className="animate-spin" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </Modal>
              <button
                className="text-red-500"
                onClick={() => {
                  setIsModalActive(true);
                }}
              >
                {actionButton.icon}
              </button>
            </div>
          );
        }

        return (
          <Fragment key={actionButton.path || "" + index}>
            {!actionButton.disabled && (
              <Link
                to={actionButton.path || "#"}
                className={actionButton.className}
                onClick={actionButton.onClick}
              >
                {actionButton.icon}
              </Link>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
