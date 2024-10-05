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
import { HTMLAttributes, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface CodeVerificationFormProps extends HTMLAttributes<HTMLDivElement> {}

interface CodeVerificationFormError {
  message: string;
}

const formSchema = z.object({
  otp: z
    .string()
    .refine(
      (value: string) => /^[0-9]{4,4}$/.test(value),
      "Invalid code format!. Code must be 4 digit number",
    ),
});

export function CodeVerificationForm({
  className,
  ...props
}: CodeVerificationFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");
  const [timer, setTimer] = useState<number>(59);
  const [viewTimer, setViewTimer] = useState<boolean>(true);
  const [codeVerificationFormError, setCodeVerificationFormError] = useState<
    CodeVerificationFormError | undefined
  >(undefined);
  const [codeVerificationFormSuccess, setCodeVerificationFormSuccess] =
    useState<boolean>(false);
  const [
    codeVerificationFormResendCodeSuccess,
    setCodeVerificationFormResendCodeSuccess,
  ] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setCodeVerificationFormError(undefined);
    setCodeVerificationFormSuccess(false);
    setCodeVerificationFormResendCodeSuccess(false);
    const { error, message } = await API.Post(
      "auth/otp/verify",
      { ...values, session_id, type: "FORGOT" },
      undefined,
      { auth: false },
    );

    if (!!error) {
      setCodeVerificationFormError({ message });
      return false;
    }
    setCodeVerificationFormSuccess(true);
    setTimeout(() => {
      router.push(`/auth/reset-password?session_id=${session_id}`);
    }, 2000);
  }

  async function resendOTP() {
    const { error, message } = await API.Post(
      "auth/otp/send",
      { session_id },
      undefined,
      { auth: false },
    );
    if (!!error) {
      setCodeVerificationFormError({ message });
      return false;
    }
    setCodeVerificationFormResendCodeSuccess(true);
  }

  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => setTimer(timer - 1), 1000);
    } else {
      setViewTimer(false);
    }
  }, [timer]);

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              {codeVerificationFormError && (
                <Alert variant="destructive">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {codeVerificationFormError.message}
                  </AlertDescription>
                </Alert>
              )}
              {codeVerificationFormSuccess && (
                <Alert variant="success">
                  <CheckCircledIcon className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Code verified successfully
                  </AlertDescription>
                </Alert>
              )}
              {codeVerificationFormResendCodeSuccess && (
                <Alert variant="success">
                  <CheckCircledIcon className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>Code sent successfully</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="grid gap-1">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Verification Code"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-1">
              <div className="text-right text-sm text-muted-foreground">
                {viewTimer && (
                  <span>
                    Resend Code in 00:{timer < 10 ? `0${timer}` : timer}
                  </span>
                )}
                {!viewTimer && (
                  <span
                    onClick={resendOTP}
                    className="cursor-pointer underline"
                  >
                    Resend Code
                  </span>
                )}
              </div>
            </div>
            <Button disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Verify
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
