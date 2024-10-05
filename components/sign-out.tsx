"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignOut() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      signOut({
        redirect: false,
      })
        .then(() => {
          router.replace(`/auth/login`);
          router.refresh();
        })
        .catch((error) => console.error(error));
    }, 1000);
  });

  return null;
}
