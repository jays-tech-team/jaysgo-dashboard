import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Lock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useModal } from "../../hooks/useModal";
import apiEngine from "../../lib/axios";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";

/**
 * UserChangePassword Component
 *
 * A modal-based form component that allows users to change their password.
 * Supports both regular users and admin users (who can bypass current password requirement).
 *
 * Features:
 * - Form validation using Zod schema
 * - Handles both regular user and admin password change flows
 * - Displays error messages from API responses
 * - Success feedback using toast notifications
 * - Loading states during form submission
 *
 * Props:
 * @param {function} isAdmin - Optional function that returns boolean to determine if user is admin
 *
 * Behavior:
 * - For regular users: Requires current password and new password
 * - For admin users: Only requires new password (can bypass current password)
 * - On successful submission: Shows success toast, resets form, and closes modal
 * - On error: Displays error message from API or default error message
 *
 *
 * Usage:
 * <UserChangePassword />
 * OR for admin:
 * <UserChangePassword isAdmin={() => true} />
 */
export default function UserChangePassword({
  isAdmin = false,
  userUUID,
  buttonText = "Change Password",
  button = "default",
}: {
  isAdmin?: boolean;
  buttonText?: string;
  userUUID?: string;
  button?: "default" | React.ReactNode;
}) {
  const { isOpen, openModal, closeModal } = useModal();

  // Zod schema
  const schema = z.object({
    currentPassword: !isAdmin
      ? z.string().min(6, "Current password required")
      : z.string().optional(),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
  });
  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: "", newPassword: "" },
  });

  const [error, setError] = useState<string | null>(null);

  // Handle submit
  const onSubmit = async (data: FormValues) => {
    setError(null);
    try {
      if (isAdmin) {
        await apiEngine.put(`/admin/users/${userUUID}/update-password`, {
          newPassword: data.newPassword,
        });
      } else {
        await apiEngine.put("/admin/profile/update-password", {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        });
      }
      toast.success("Password saved success");
      reset();
      closeModal();
    } catch (err) {
      let msg = "Failed to update password.";
      if (err instanceof AxiosError && err.response?.data?.message) {
        msg = err.response.data.message;
      }
      setError(msg);
    }
  };

  return (
    <>
      <span onClick={openModal} className="cursor-pointer" title="">
        {button == "default" ? (
          <Button variant="outline">
            <Lock size={16} /> {buttonText}
          </Button>
        ) : (
          button
        )}
      </span>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] m-4"
        title={"Change Password"}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-4"
        >
          {!isAdmin && (
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              {(() => {
                return (
                  <Input
                    id="currentPassword"
                    type="password"
                    disabled={isSubmitting}
                    register={register("currentPassword")}
                  />
                );
              })()}
              {errors.currentPassword && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.currentPassword.message}
                </div>
              )}
            </div>
          )}
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            {(() => {
              return (
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  disabled={isSubmitting}
                  register={register("newPassword")}
                />
              );
            })()}
            {errors.newPassword && (
              <div className="text-red-500 text-xs mt-1">
                {errors.newPassword.message}
              </div>
            )}
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex gap-2 mt-2">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
