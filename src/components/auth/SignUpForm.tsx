import { useState } from "react";
import { Link } from "react-router";

import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import apiEngine from "../../lib/axios";
import { Toaster } from "sonner";
import { Eye, EyeClosed } from "lucide-react";

// Define the form schema using Zod
const signUpSchema = z
  .object({
    username: z
      .string()
      .nonempty("Please enter a valid phone number or email address"),
    password: z
      .string({
        message: "Please enter a valid password",
      })
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Infer the type from the schema
type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const response = await apiEngine.post("users/auth/register", {
        username: data.username,
        password: data.password,
      });

      const { token } = response.data;
      localStorage.setItem("authToken", token);

      // No need to manually navigate as the hook will handle it
    } catch (error) {
      // Error handling is managed by axios interceptor
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <Toaster position="top-right" />
      <div className="w-full max-w-md pt-10 mx-auto"></div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create your account to get started!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Phone number Or Email address
                    <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="info@gmail.com"
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
                      className="absolute z-30 cursor-pointer right-4 top-[14px]"
                    >
                      {showPassword ? (
                        <Eye className=" size-5" />
                      ) : (
                        <EyeClosed className=" size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <Label>
                    Confirm Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      register={register("confirmPassword")}
                      error={!!errors.confirmPassword}
                      hint={errors.confirmPassword?.message || ""}
                    />
                    <span
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute z-30 cursor-pointer right-4 top-[14px]"
                    >
                      {showConfirmPassword ? (
                        <Eye className=" size-5" />
                      ) : (
                        <EyeClosed className=" size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <Button className="w-full" size="sm" disabled={isSubmitting}>
                    {isSubmitting ? "Signing up..." : "Sign up"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account? {""}
                <Link
                  to="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
