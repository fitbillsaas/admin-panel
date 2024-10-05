"use client";

import { Spinner } from "@/components/icon";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/constant";
import { API } from "@/lib/fetch";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface ChangePasswordFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" })
      // .regex(
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      //   'Current Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      // )
      .min(8, "Current password must be at least 6 characters")
      .max(10, "Current password must must not exceeds 10 characters"),
    newPassword: z
      .string()
      .min(1, { message: "New password is required" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "New Password must contain at least an uppercase letter, a lowercase letter, a number, and a special character",
      )
      .min(8, "New password must be at least 8 characters")
      .max(10, "New password must must not exceeds 10 characters"),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Confirm Password must contain at least an uppercase letter, a lowercase letter, a number, and a special character",
      )
      .min(8, "Confirm password must be at least 8 characters")
      .max(10, "Confirm password must must not exceeds 10 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export function ChangePasswordForm({ className }: ChangePasswordFormProps) {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prevState) => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await API.Post("user/password", {
        password: values.newPassword,
        old_password: values.currentPassword,
      });
      if (!!response?.error) {
        toast({
          ...toastErrorMessage,
          description: response?.error,
        });
        return;
      } else {
        toast({
          ...toastSuccessMessage,
          description: "Password changed successfully",
        });
      }
    } catch (error) {}
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn(className)}>
        <div className="grid gap-2">
          <div className="grid gap-1 relative">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Current Password"
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === " " || e.code === "Space")
                            e.preventDefault();
                        }}
                        className="pr-8"
                      />
                      <span
                        className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOpenIcon className="h-4 w-4" />
                        ) : (
                          <EyeClosedIcon className="h-4 w-4" />
                        )}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-1 relative mt-1.5">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="New Password"
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === " " || e.code === "Space")
                            e.preventDefault();
                        }}
                      />
                      <span
                        className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
                        onClick={toggleNewPasswordVisibility}
                      >
                        {showNewPassword ? (
                          <EyeOpenIcon className="h-4 w-4" />
                        ) : (
                          <EyeClosedIcon className="h-4 w-4" />
                        )}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-1 relative mt-1.5">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === " " || e.code === "Space")
                            e.preventDefault();
                        }}
                      />
                      <span
                        className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? (
                          <EyeOpenIcon className="h-4 w-4" />
                        ) : (
                          <EyeClosedIcon className="h-4 w-4" />
                        )}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-2">
            <ul className="text-sm">
              <li>* Your password length must be greater than or equal to 8</li>
              <li>
                * Your password must contain one or more uppercase characters
              </li>
              <li>
                * Your password must contain one or more lowercase characters
              </li>
              <li>* Your password must contain one or more numeric values</li>
              <li>
                * Your password must contain one or more special characters
              </li>
            </ul>
          </div>
          <Button disabled={form.formState.isSubmitting} className="mt-1.5">
            {form.formState.isSubmitting && (
              <Spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
