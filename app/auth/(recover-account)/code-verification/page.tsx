import { Metadata } from "next";

import { CodeVerificationForm } from "@/app/auth/(recover-account)/code-verification/CodeVerificationForm";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Code Verification",
  description: "Password recovery code verification",
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
            Email Verification
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the code received on your email address
          </p>
        </div>
        <Suspense fallback={<div>Loading</div>}>
          <CodeVerificationForm />
        </Suspense>
      </div>
    </div>
  );
}
