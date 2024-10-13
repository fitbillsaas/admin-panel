import { Metadata } from "next";
// import Image from "next/image";
import { Suspense } from "react";
// import Logo from "../../../public/images/logos/opus-logo.png";
import { RegisterForm } from "./RegisterForm"; // Import the RegisterForm component

export const metadata: Metadata = {
  title: "Register",
  description:
    "Create a new account with our user-friendly registration page. Fill in your details to join our community and access exclusive features.",
};

export default async function RegisterPage() {
  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col gap-2 text-center">
          <div className="block lg:hidden m-auto">
            {/* <Image width={112} height={112} src={Logo} alt="Logo" priority /> */}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight xs:hidden">
            Register
          </h1>
          <p className="text-sm text-muted-foreground">
            Please fill in the details below to create an account
          </p>
        </div>
        <Suspense fallback={<div>Loading</div>}>
          <RegisterForm /> {/* Use the RegisterForm component here */}
        </Suspense>
      </div>
    </div>
  );
}
