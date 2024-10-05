import { Metadata } from "next";

import { ResetPasswordForm } from "@/app/auth/(recover-account)/reset-password/ResetPasswordForm";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Password recovery reset password",
};

export default async function CodeVerificationPage({
  params: {},
}: {
  params: any;
}) {
  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset Your Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Create a new password for your account
          </p>
        </div>
        <Suspense fallback={<div>Loading</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
