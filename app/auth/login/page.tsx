import { Metadata } from "next";
// import Image from "next/image";
import Link from "next/link"; // Import Link for navigation
import { Suspense } from "react";
// import Logo from "../../../public/images/logos/opus-logo.png";
import { LoginForm } from "../login/LoginForm";

export const metadata: Metadata = {
  title: "Authentication",
  description:
    "Securely access your account with our user-friendly login page. Enter your credentials to enjoy personalized services and exclusive features. Experience hassle-free and protected login process.",
};

export default async function LoginPage() {
  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col gap-2 text-center">
          <div className="block lg:hidden m-auto">
            {/* <Image width={112} height={112} src={Logo} alt="Logo" priority /> */}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight xs:hidden">
            Login
          </h1>
          <p className="text-sm text-muted-foreground">
            Please enter the details below to continue
          </p>
        </div>
        <Suspense fallback={<div>Loading</div>}>
          <LoginForm />
        </Suspense>
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            {`Don't have an account`}
          </p>
          <Link href="/auth/registration" className="w-full">
            <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
