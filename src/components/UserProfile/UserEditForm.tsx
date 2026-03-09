import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import type { UserType } from "../../types/CurrentUser.types";
import { USER_ROLES } from "../../unities/permissions";
import Form from "../form/Form";
import Checkbox from "../form/input/Checkbox";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";

const userStatusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
  { value: "pending", label: "Pending" },
];

const rolesOptions = Object.values(USER_ROLES).map((role) => ({
  value: role,
  label: role.charAt(0).toUpperCase() + role.slice(1).replace(/-/g, " "),
}));

const schema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().nullable().optional(),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().nullable().optional(),
  user_status: z.enum(["active", "inactive", "suspended", "pending"]),
  roles: z.array(z.nativeEnum(USER_ROLES)).min(1, "Select at least one role"),
  shops: z.array(z.string()).min(1, "Select at least one shop"),
});
type FormValues = z.infer<typeof schema>;

export default function UserEditForm({
  defaultValues,
  onSubmit: onSubmitProp,
}: {
  defaultValues?: Partial<UserType>;
  onSubmit?: (data: FormValues) => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: defaultValues?.first_name || "",
      last_name: defaultValues?.last_name || "",
      email: defaultValues?.email || "",
      phone_number: defaultValues?.phone_number || "",
      user_status: defaultValues?.user_status || "active",
      roles: defaultValues?.roles || [],
   
    },
  });

  // For multi-select checkboxes (roles)
  const selectedRoles = watch("roles");
  const handleRoleChange = (role: USER_ROLES) => {
    if (selectedRoles.includes(role)) {
      setValue(
        "roles",
        selectedRoles.filter((r: USER_ROLES) => r !== role)
      );
    } else {
      setValue("roles", [...selectedRoles, role]);
    }
  };




  // Submit handler
  const onSubmit = (data: FormValues) => {
    if (onSubmitProp) onSubmitProp(data);
    // else, do API call here
    // console.log(data);
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-lg mx-auto"
    >
      <div>
        <Label htmlFor="first_name">First Name</Label>
        <Input
          id="first_name"
          type="text"
          {...register("first_name")}
          error={!!errors.first_name}
          hint={errors.first_name?.message}
          min={undefined}
          max={undefined}
          step={undefined}
        />
      </div>
      <div>
        <Label htmlFor="last_name">Last Name</Label>
        <Input
          id="last_name"
          type="text"
          {...register("last_name")}
          error={!!errors.last_name}
          hint={errors.last_name?.message}
          min={undefined}
          max={undefined}
          step={undefined}
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          error={!!errors.email}
          hint={errors.email?.message}
          min={undefined}
          max={undefined}
          step={undefined}
        />
      </div>
      <div>
        <Label htmlFor="phone_number">Phone Number</Label>
        <Input
          id="phone_number"
          type="text"
          {...register("phone_number")}
          error={!!errors.phone_number}
          hint={errors.phone_number?.message}
          min={undefined}
          max={undefined}
          step={undefined}
        />
      </div>
      <div>
        <Label htmlFor="user_status">User Status</Label>
        <Controller
          control={control}
          name="user_status"
          render={({ field }) => (
            <select
              {...field}
              id="user_status"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
            >
              {userStatusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        />
        {errors.user_status && (
          <div className="text-error-500 text-xs mt-1">
            {errors.user_status.message}
          </div>
        )}
      </div>
      <div>
        <Label>Roles</Label>
        <div className="flex flex-wrap gap-4">
          {rolesOptions.map((role) => (
            <Checkbox
              key={role.value}
              label={role.label}
              checked={selectedRoles.includes(role.value as USER_ROLES)}
              onChange={() => handleRoleChange(role.value as USER_ROLES)}
            />
          ))}
        </div>
        {errors.roles && (
          <div className="text-error-500 text-xs mt-1">
            {errors.roles.message}
          </div>
        )}
      </div>
      <div>

        {errors.shops && (
          <div className="text-error-500 text-xs mt-1">
            {errors.shops.message}
          </div>
        )}
      </div>
      <div className="pt-4">
        <Button type="submit">Save Changes</Button>
      </div>
    </Form>
  );
}
