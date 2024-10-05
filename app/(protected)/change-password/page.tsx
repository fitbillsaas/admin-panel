import { Card, CardContent } from "@/components/ui/card";
import { Metadata } from "next";
import { ChangePasswordForm } from "./components/change-password-form";

export const metadata: Metadata = {
  title: "Authentication",
  description:
    "Securely access your account with our user-friendly login page. Enter your credentials to enjoy personalized services and exclusive features. Experience hassle-free and protected login process.",
};

export default async function ChangePassword() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="lg:p-8">
          <div className="mx-auto flex flex-col w-2/4 space-y-6">
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight xs:hidden">
                Change Password
              </h1>
            </div>
            <div className="grid gap-6">
              <ChangePasswordForm />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
