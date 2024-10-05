"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "../styles/loader.css";
import { FullLoader } from "./full-loader";
import { useLoader } from "./use-loader";

export function Loader() {
  const { loading } = useLoader();
  const [routeLoading, setRouteLoading] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setTimeout(() => {
      setRouteLoading(false);
    }, 1000);
    return () => {
      setRouteLoading(true);
    };
  }, [pathname, searchParams]);

  if (loading) {
    return loading && <FullLoader />;
  }

  return routeLoading && <div className="loader" />;
}
