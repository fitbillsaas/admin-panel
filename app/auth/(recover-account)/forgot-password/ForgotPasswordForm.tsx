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
import { useRouter } from "next/navigation";
import { HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface ForgotPasswordFormProps extends HTMLAttributes<HTMLDivElement> {}

interface ForgotPasswordFormError {
  message: string;
}

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid email address!"),
});

export function ForgotPasswordForm({
  className,
  ...props
}: ForgotPasswordFormProps) {
  const router = useRouter();
  const [forgotPasswordFormError, setForgotPasswordFormError] = useState<
    ForgotPasswordFormError | undefined
  >(undefined);
  const [forgotPasswordFormSuccess, setForgotPasswordFormSuccess] =
    useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setForgotPasswordFormError(undefined);
    setForgotPasswordFormSuccess(false);
    const { error, data, message } = await API.Post(
      "auth/password/forgot",
      { ...values, role: "Admin" },
      undefined,
      { auth: false },
    );

    if (!!error) {
      setForgotPasswordFormError({ message });
      return false;
    }
    setForgotPasswordFormSuccess(true);
    setTimeout(() => {
      router.push(`/auth/code-verification?session_id=${data.session_id}`);
    }, 2000);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              {forgotPasswordFormError && (
                <Alert variant="destructive">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {forgotPasswordFormError.message}
                  </AlertDescription>
                </Alert>
              )}
              {forgotPasswordFormSuccess && (
                <Alert variant="success">
                  <CheckCircledIcon className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    A code has been sent to your email address
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <div className="grid gap-1">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Send Code
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
