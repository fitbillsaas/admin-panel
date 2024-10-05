import SignOut from "@/components/sign-out";
import { GoDotFill } from "react-icons/go";

export default function RedirectLoginPage() {
  return (
    <>
      <div className="grid justify-center gap-2">
        <h2 className="my-2 font-heading text-xl font-bold">
          Session expired, redirecting to login page.
        </h2>
        <div className="flex justify-center">
          <GoDotFill className="animate-ping [animation-delay:-0.3s]" />
          <GoDotFill className="animate-ping [animation-delay:-0.15s]" />
          <GoDotFill className="animate-ping" />
        </div>
      </div>
      <SignOut />
    </>
  );
}
