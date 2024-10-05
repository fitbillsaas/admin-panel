import { Metadata } from "next";

import { ForgotPasswordForm } from "@/app/auth/(recover-account)/forgot-password/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Password recovery",
};

export default async function ForgotPasswordPage({
  params: {},
}: {
  params: any;
}) {
  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Forgot password?
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a code to reset your
            password.
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
