import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
import { InputWrap } from "../../components/form/InputWrap";
import Select from "../../components/form/Select";
import Button from "../../components/ui/button/Button";
import { SettingsService } from "../../services/settings.service";
import { Setting, SettingDataType } from "../../types/Settings.types";

// Helper function to validate value based on data type
const validateValueByDataType = (
  value: string,
  dataType: SettingDataType
): { isValid: boolean; error?: string } => {
  if (!value || value.trim() === "") {
    return { isValid: false, error: "Value is required" };
  }

  switch (dataType) {
    case SettingDataType.STRING:
      // String type - always valid (already a string)
      return { isValid: true };

    case SettingDataType.NUMBER: {
      // Number type - validate it's a valid number
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return { isValid: false, error: "Value must be a valid number" };
      }
      return { isValid: true };
    }

    case SettingDataType.BOOLEAN: {
      // Boolean type - validate it's "true" or "false"
      const lowerValue = value.toLowerCase().trim();
      if (lowerValue !== "true" && lowerValue !== "false") {
        return {
          isValid: false,
          error: 'Value must be "true" or "false"',
        };
      }
      return { isValid: true };
    }

    case SettingDataType.JSON:
      // JSON type - validate it's valid JSON
      try {
        JSON.parse(value);
        return { isValid: true };
      } catch {
        return {
          isValid: false,
          error: "Value must be valid JSON format",
        };
      }

    case SettingDataType.ARRAY:
      // Array type - validate it's a valid JSON array
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
          return {
            isValid: false,
            error: "Value must be a valid JSON array",
          };
        }
        return { isValid: true };
      } catch {
        return {
          isValid: false,
          error: "Value must be a valid JSON array format (e.g., [1, 2, 3])",
        };
      }

    case SettingDataType.OBJECT:
      // Object type - validate it's a valid JSON object (not array)
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return {
            isValid: false,
            error: "Value must be a valid JSON object, not an array",
          };
        }
        if (typeof parsed !== "object" || parsed === null) {
          return {
            isValid: false,
            error: "Value must be a valid JSON object",
          };
        }
        return { isValid: true };
      } catch {
        return {
          isValid: false,
          error:
            'Value must be a valid JSON object format (e.g., {"key": "value"})',
        };
      }

    default:
      return { isValid: true };
  }
};

// Schema for creating a new setting
const createSettingSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .regex(
        /^[A-Za-z0-9_-]{1,100}$/,
        "Name can only contain letters, numbers, underscores, and hyphens (1-100 characters)"
      ),
    value: z.string().min(1, "Value is required"),
    data_type: z.nativeEnum(SettingDataType, {
      errorMap: () => ({ message: "Please select a valid data type" }),
    }),
  })
  .superRefine((data, ctx) => {
    const validation = validateValueByDataType(data.value, data.data_type);
    if (!validation.isValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: validation.error || "Invalid value for selected data type",
        path: ["value"],
      });
    }
  });

// Schema for updating a setting (only value can be edited)
// We'll create this dynamically based on the setting's data_type
const createUpdateSettingSchema = (dataType: SettingDataType) =>
  z
    .object({
      value: z.string().min(1, "Value is required"),
    })
    .superRefine((data, ctx) => {
      const validation = validateValueByDataType(data.value, dataType);
      if (!validation.isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: validation.error || "Invalid value for selected data type",
          path: ["value"],
        });
      }
    });

type CreateSettingFormData = z.infer<typeof createSettingSchema>;
type UpdateSettingFormData = {
  value: string;
};

const dataTypeOptions = [
  { value: SettingDataType.STRING, label: "String" },
  { value: SettingDataType.NUMBER, label: "Number" },
  { value: SettingDataType.BOOLEAN, label: "Boolean" },
  { value: SettingDataType.JSON, label: "JSON" },
  { value: SettingDataType.ARRAY, label: "Array" },
  { value: SettingDataType.OBJECT, label: "Object" },
];

// Helper function to get placeholder/hint text based on data type
const getValuePlaceholder = (dataType: SettingDataType): string => {
  switch (dataType) {
    case SettingDataType.STRING:
      return 'Enter a string value (e.g., "Hello World")';
    case SettingDataType.NUMBER:
      return "Enter a number (e.g., 123 or 45.67)";
    case SettingDataType.BOOLEAN:
      return 'Enter "true" or "false"';
    case SettingDataType.JSON:
      return 'Enter valid JSON (e.g., {"key": "value"})';
    case SettingDataType.ARRAY:
      return 'Enter a JSON array (e.g., [1, 2, 3] or ["a", "b"])';
    case SettingDataType.OBJECT:
      return 'Enter a JSON object (e.g., {"name": "John", "age": 30})';
    default:
      return "Enter setting value";
  }
};

export default function SettingsEdit() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settingData, setSettingData] = useState<Setting | null>(null);

  const isEditMode = Boolean(uuid);
  const [currentDataType, setCurrentDataType] = useState<SettingDataType>(
    SettingDataType.STRING
  );

  // Use different schemas based on edit mode
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<CreateSettingFormData | UpdateSettingFormData>({
    resolver: zodResolver(
      isEditMode
        ? createUpdateSettingSchema(currentDataType)
        : createSettingSchema
    ),
    mode: "onChange", // Enable real-time validation
  });

  // Watch data_type in create mode to trigger revalidation
  const watchedDataType = watch("data_type") as SettingDataType | undefined;

  // Load setting data for edit mode
  useEffect(() => {
    if (uuid) {
      setIsLoading(true);
      SettingsService.getSettings()
        .then((response) => {
          const setting = response.data.items.find(
            (item) => item.setting_uuid === uuid
          );
          if (setting) {
            setSettingData(setting);
            setCurrentDataType(setting.data_type);
            setValue("value", setting.value || "");
          } else {
            toast.error("Setting not found");
            navigate("/admin/settings");
          }
        })
        .catch((error) => {
          toast.error("Failed to load setting data");
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [uuid, setValue, navigate]);

  // Watch value for real-time validation
  const watchedValue = watch("value");

  // Re-validate when value changes in edit mode
  useEffect(() => {
    if (isEditMode && currentDataType && watchedValue) {
      // Validate value based on setting's data type in edit mode
      const validation = validateValueByDataType(
        watchedValue as string,
        currentDataType
      );
      if (!validation.isValid) {
        setError("value", {
          type: "manual",
          message: validation.error || "Invalid value for data type",
        });
      }
    }
  }, [watchedValue, currentDataType, isEditMode, setError, clearErrors]);

  const onSubmit = handleSubmit(async (data) => {
    // Additional validation based on data type
    let validationError: string | null = null;

    if (isEditMode && settingData) {
      const validation = validateValueByDataType(
        data.value as string,
        settingData.data_type
      );
      if (!validation.isValid) {
        setError("value", {
          type: "manual",
          message: validation.error || "Invalid value for data type",
        });
        validationError = validation.error || "Invalid value";
      }
    } else {
      const createData = data as CreateSettingFormData;
      const validation = validateValueByDataType(
        createData.value,
        createData.data_type
      );
      if (!validation.isValid) {
        setError("value", {
          type: "manual",
          message: validation.error || "Invalid value for data type",
        });
        validationError = validation.error || "Invalid value";
      }
    }

    if (validationError) {
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode && uuid) {
        // Update: only send value
        await SettingsService.updateSetting(uuid, {
          value: data.value as string,
        });
        toast.success("Setting updated successfully");
        navigate("/admin/settings");
      } else {
        // Create: send name, value, and data_type
        const createData = data as CreateSettingFormData;
        await SettingsService.createSetting({
          name: createData.name,
          value: createData.value,
          data_type: createData.data_type,
        });
        toast.success("Setting created successfully");
        navigate("/admin/settings");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (
          error?.response?.status === 422 ||
          error?.response?.status === 400
        ) {
          const errors = error?.response?.data?.errors;
          if (errors) {
            Object.keys(errors).forEach((field) => {
              setError(
                field as keyof (CreateSettingFormData | UpdateSettingFormData),
                {
                  type: "manual",
                  message: Array.isArray(errors[field])
                    ? errors[field][0]
                    : errors[field],
                }
              );
            });
          }
        }
      }
      toast.error(
        isEditMode ? "Failed to update setting" : "Failed to create setting"
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoaderCircle className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={isEditMode ? "Edit Setting" : "Add Setting"}
        description="Manage setting details"
      />

      <ComponentCard
        title={isEditMode ? "Edit Setting" : "Create New Setting"}
        desc={isEditMode ? "Update the setting value" : ""}
      >
        <form onSubmit={onSubmit} className="space-y-4 max-w-2xl">
          {/* Name field - only editable when creating */}
          {!isEditMode ? (
            <InputWrap
              label="Name"
              error={
                "name" in errors ? (errors.name?.message as string) : undefined
              }
            >
              <Input
                type="text"
                register={register("name")}
                className="w-full"
                placeholder="Enter setting name (e.g., app_name)"
              />
            </InputWrap>
          ) : (
            <InputWrap label="Name">
              <Input
                type="text"
                value={settingData?.name || ""}
                disabled
                className="w-full opacity-60"
              />
            </InputWrap>
          )}

          {/* Data Type field - only editable when creating */}
          {!isEditMode ? (
            <InputWrap
              label="Data Type"
              error={
                "data_type" in errors
                  ? (errors.data_type?.message as string)
                  : undefined
              }
            >
              <Select
                options={dataTypeOptions}
                placeholder="Select data type"
                register={register("data_type")}
                className="w-full"
                onChange={(e) =>
                  setValue("data_type", e.target.value as SettingDataType)
                }
              />
            </InputWrap>
          ) : (
            <InputWrap label="Data Type">
              <Input
                type="text"
                value={settingData?.data_type || ""}
                disabled
                className="w-full opacity-60"
              />
            </InputWrap>
          )}

          {/* Value field - always editable */}
          <InputWrap
            label="Value"
            error={errors.value?.message}
            tooltip={
              !isEditMode && watchedDataType
                ? getValuePlaceholder(watchedDataType)
                : isEditMode && settingData
                ? getValuePlaceholder(settingData.data_type)
                : "Enter the setting value according to the selected data type"
            }
          >
            <Input
              type="text"
              register={register("value")}
              className="w-full"
              placeholder={
                !isEditMode && watchedDataType
                  ? getValuePlaceholder(watchedDataType)
                  : isEditMode && settingData
                  ? getValuePlaceholder(settingData.data_type)
                  : "Enter setting value"
              }
            />
          </InputWrap>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/settings")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update Setting"
                : "Create Setting"}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </>
  );
}
