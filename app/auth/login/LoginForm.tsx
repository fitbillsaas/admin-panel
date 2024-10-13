/* eslint-disable prettier/prettier */

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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircledIcon,
  ExclamationTriangleIcon,
  EyeClosedIcon,
  EyeOpenIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface LoginFormProps extends HTMLAttributes<HTMLDivElement> {}

interface LoginError {
  message: string;
}

const formSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid email address!"),
  password: z.string().min(1, { message: "Password is required" }),
});

export function LoginForm({ className, ...props }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loginError, setLoginError] = useState<LoginError | undefined>(
    undefined,
  );
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoginError(undefined);
    setLoginSuccess(false);
  
    console.log(values, "Submitted values");
  
    const email = values.username;
    const password = values.password;
  
    // Make API call to log in
    const response = await fetch(`${API_ENDPOINT}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  
    const responseData = await response.json();

    console.log("Response Data",responseData);
  
    if (!response.ok) {
      setLoginError({ message: responseData.message || "Invalid Credentials!" });
      return;
    }
  
    const { user, access } = responseData.data;

    setLoginSuccess(true);
    sessionStorage.setItem("accessToken", access["x-access-token"]);
    sessionStorage.setItem("refreshToken", access["refresh-token"]);
    sessionStorage.setItem("tokenExpiry", access.token_expiry);
    sessionStorage.setItem("user", JSON.stringify(user));

    console.log("User logged in successfully:", user);

    
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    console.log("Redirecting to:", callbackUrl); 
    
    setTimeout(() => {
      router.push(callbackUrl); // Use router.push for redirection
    }, 1000);
  }
  
  
  

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              {loginError && (
                <Alert variant="destructive">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{loginError.message}</AlertDescription>
                </Alert>
              )}
              {loginSuccess && (
                <Alert variant="success">
                  <CheckCircledIcon className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Login Success!. Redirecting...
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <div className="grid gap-1">
              <FormField
                control={form.control}
                name="username"
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
            <div className="grid gap-1 relative">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          {...field}
                          onKeyDown={(e) => {
                            if (e.key === " " || e.code === "Space")
                              e.preventDefault();
                          }}
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
            <div className="grid gap-1">
              <div className="text-right text-sm text-muted-foreground">
                <Link
                  href="/auth/forgot-password"
                  className="hover:text-primary"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
            <Button disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
