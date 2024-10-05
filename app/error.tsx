"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [params, setParams] = useState("");

  useEffect(() => {
    // Log the error to an error reporting service
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("pathname", pathname);
    setParams(params.toString());
  }, [error, pathname, searchParams]);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mb-16 items-center justify-center text-center">
      <span className="bg-gradient-to-b from-foreground to-transparent bg-clip-text text-[10rem] font-extrabold leading-none text-transparent">
        500
      </span>
      <h2 className="my-2 font-heading text-2xl font-bold">We&apos;re sorry</h2>
      <p>Something went wrong from our end. Please try after sometime.</p>
      <div className="mt-8 flex justify-center gap-2">
        <Button
          onClick={() => router.replace("/redirect?" + params)}
          variant="default"
          size="lg"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
