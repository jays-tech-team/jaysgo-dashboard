import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { Toaster } from "sonner";
import { z } from "zod";
import { useAuth } from "../../context/AuthContext";
import apiEngine from "../../lib/axios";
import { API_ENDPOINTS } from "../../types/ApiEndpoints.enum";
import { UserData } from "../../types/CurrentUser.types";
import { ApiResponse } from "../../types/General.api.types";
import Label from "../form/Label";
import Checkbox from "../form/input/Checkbox";
import Input from "../form/input/InputField";
import Alert from "../ui/alert/Alert";
import Button from "../ui/button/Button";

// Define the form schema using Zod
const signInSchema = z.object({
  username: z
    .string({
      message: "Please enter a valid email address",
    })
    .nonempty("Please enter a valid email address"),
  password: z
    .string({
      message: "Please enter a valid password",
    })
    .nonempty("Please enter a valid password"),
  rememberMe: z.boolean(),
});

// Infer the type from the schema
type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<string | false>(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const response = await apiEngine.post<ApiResponse<UserData>>(
        API_ENDPOINTS.USER_LOGIN,
        { ...data, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }
      );
      const { data: resData } = response.data;

      login(resData);

      /** We will store last page url in session if they logged out from the server. Its handled on axios interceptors */
      const lastPage = window.sessionStorage.getItem("redirectPath");
      window.sessionStorage.removeItem("redirectPath");

      navigate(lastPage || resData.home_page || "/");

      return;
    } catch (error) {
      // Error handling is managed by axios interceptor

      if (error instanceof AxiosError) {
        if (
          error?.response?.status === 422 ||
          error?.response?.status === 400
        ) {
          const errors = error?.response?.data?.errors;
          if (errors) {
            Object.keys(errors).forEach((field) => {
              setError(field as keyof SignInFormData, {
                type: "manual",
                message: Array.isArray(errors[field])
                  ? errors[field][0]
                  : errors[field],
              });
            });
          }
        }

        setFormErrors(
          error?.response?.data?.message ||
            "Login failed. Please try again later or get the tech support."
        );
      }
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <Toaster position="top-right" />
      <div className="w-full max-w-md pt-10 mx-auto"></div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className=" sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm mb-5 text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
            {formErrors && (
              <Alert variant="error" title="Error" message={formErrors} />
            )}
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email address
                    <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="help@jays.ae"
                    type="text"
                    register={register("username")}
                    error={!!errors.username}
                    hint={errors.username?.message || ""}
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      register={register("password")}
                      error={!!errors.password}
                      hint={errors.password?.message || ""}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30  cursor-pointer right-4 top-[14px]"
                    >
                      {showPassword ? (
                        <Eye className="text-gray-400 size-5" />
                      ) : (
                        <EyeOff className="text-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3">
                    <Checkbox
                      checked={watch("rememberMe")}
                      register={register("rememberMe")}
                    />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </label>
                  <Link
                    hidden={true}
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm" disabled={isSubmitting}>
                    {isSubmitting ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
