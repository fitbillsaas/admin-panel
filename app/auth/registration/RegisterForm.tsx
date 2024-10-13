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
  ArrowRightIcon, // Add the Arrow icon
} from "@radix-ui/react-icons";
import { useRouter } from "next/navigation"; // Ensure correct import
import { HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface RegisterFormProps extends HTMLAttributes<HTMLDivElement> {}

interface RegisterError {
  message: string;
}

const formSchema = z.object({
  first_name: z
    .string()
    .min(1, { message: "First Name is required" })
    .trim() // Removes leading and trailing spaces
    .refine(value => value.length > 0, {
      message: "First Name cannot be empty or whitespace",
    }),
  last_name: z
    .string()
    .min(1, { message: "Last Name is required" })
    .trim()
    .refine(value => value.length > 0, {
      message: "Last Name cannot be empty or whitespace",
    }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid email address!"),
  phone: z
    .string()
    .length(10, { message: "Phone Number must be exactly 10 digits" })
    .regex(/^\d{10}$/, { message: "Phone Number must be numeric" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }), // Changed to 8 characters
  confirm_password: z.string().min(8, { message: "Confirm Password is required" }),
  address: z
    .string()
    .min(1, { message: "Address is required" })
    .trim()
    .refine(value => value.length > 0, {
      message: "Address cannot be empty or whitespace",
    }),
  gym_name: z
    .string()
    .min(1, { message: "Gym Center Name is required" })
    .trim()
    .refine(value => value.length > 0, {
      message: "Gym Center Name cannot be empty or whitespace",
    }),
}).refine(data => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"], // path of the error
});

export function RegisterForm({ className, ...props }: RegisterFormProps) {
  const router = useRouter();
  const [registerError, setRegisterError] = useState<RegisterError | undefined>(undefined);
  const [registerSuccess, setRegisterSuccess] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prevState => !prevState);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      confirm_password: "",
      address: "",
      gym_name: "",
    },
  });

  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setRegisterError(undefined);
    setRegisterSuccess(false);

    console.log(values, "Submitted values");

    // Make API call to register
    const response = await fetch(`${API_ENDPOINT}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const responseData = await response.json();
    console.log("Response Data", responseData);

    if (!response.ok) {
      setRegisterError({ message: responseData.message || "Registration failed!" });
      return;
    }

    setRegisterSuccess(true);
    console.log("User registered successfully:", responseData.data);

    // Redirect or any other action after successful registration
    setTimeout(() => {
      router.push("/"); // Redirect to home or another page
    }, 1000);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              {registerError && (
                <Alert variant="destructive">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{registerError.message}</AlertDescription>
                </Alert>
              )}
              {registerSuccess && (
                <Alert variant="success">
                  <CheckCircledIcon className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Registration Success! Redirecting...
                  </AlertDescription>
                </Alert>
              )}
            </div>
            {/* First Name */}
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Last Name */}
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Email */}
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
            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Phone Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password */}
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
                          if (e.key === " " || e.code === "Space") e.preventDefault();
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
            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === " " || e.code === "Space") e.preventDefault();
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
            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Gym Center Name */}
            <FormField
              control={form.control}
              name="gym_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Gym Center Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Register
            </Button>
          </div>
        </form>
      </Form>
      {/* Already have an account? Login link */}
      <div className="mt-4 text-center">
        <p className="text-gray-700">
          Already have an account?{" "}
          <Button
            variant="link"
            className="text-blue-500 font-semibold hover:text-blue-700"
            onClick={() => router.push("/")}
          >
            <ArrowRightIcon className="inline-block mr-1" />
            Login
          </Button>
        </p>
      </div>
    </div>
  );
}
