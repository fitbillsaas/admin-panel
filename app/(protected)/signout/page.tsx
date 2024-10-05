import SignOut from "@/components/sign-out";

export default function SignOutPage() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mb-16 items-center justify-center text-center">
      <h2 className="my-2 font-heading text-2xl font-bold">
        You have been logged out.
      </h2>
      <p>Redirecting to login page...</p>
      <div className="mt-8 flex justify-center gap-2">
        <span className="animate-ping h-4 w-4 rounded-full bg-sky-400 opacity-75"></span>
        <span className="animate-ping h-4 w-4 rounded-full bg-sky-400 opacity-75"></span>
        <span className="animate-ping h-4 w-4 rounded-full bg-sky-400 opacity-75"></span>
      </div>
      <SignOut />
    </div>
  );
}
