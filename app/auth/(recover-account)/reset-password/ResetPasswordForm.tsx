"use client";

import { Spinner } from "@/components/icon";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { API } from "@/lib/fetch";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircledIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface ResetPasswordFormProps extends HTMLAttributes<HTMLDivElement> {}

interface ResetPasswordFormError {
  message: string;
}

const formSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: "New password is required" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "New Password must contain at least an uppercase letter, a lowercase letter, a number, and a special character",
      )
      .min(8, "New password must be at least 8 characters")
      .max(10, "New password must must not exceeds 10 characters"),
    confirm_password: z
      .string()
      .min(1, { message: "Confirm password is required" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Confirm Password must contain at least an uppercase letter, a lowercase letter, a number, and a special character",
      )
      .min(8, "Confirm password must be at least 8 characters")
      .max(10, "Confirm password must must not exceeds 10 characters"),
  })
  .refine(({ password, confirm_password }) => password === confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export function ResetPasswordForm({
  className,
  ...props
}: ResetPasswordFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");
  const [resetPasswordFormError, setResetPasswordFormError] = useState<
    ResetPasswordFormError | undefined
  >(undefined);
  const [resetPasswordFormSuccess, setResetPasswordFormSuccess] =
    useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setResetPasswordFormError(undefined);
    setResetPasswordFormSuccess(false);
    const { error, message } = await API.Post(
      "auth/password/reset",
      { ...values, session_id },
      undefined,
      { auth: false },
    );

    if (!!error) {
      setResetPasswordFormError({ message });
      return false;
    }
    setResetPasswordFormSuccess(true);
    setTimeout(() => {
      router.push(`/auth/login`);
    }, 2000);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div>
              {resetPasswordFormError && (
                <Alert variant="destructive">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {resetPasswordFormError.message}
                  </AlertDescription>
                </Alert>
              )}
              {resetPasswordFormSuccess && (
                <Alert variant="success">
                  <CheckCircledIcon className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Your password has been changed successfully
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <div>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === " " || e.code === "Space")
                            e.preventDefault();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === " " || e.code === "Space")
                            e.preventDefault();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-2">
              <ul className="text-sm">
                <li>
                  * Your password length must be greater than or equal to 8
                </li>
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
            <Button disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit
            </Button>

            <div className="p-2">
              <div className="text-center text-xs text-muted-foreground">
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
