import { redirect } from "next/navigation";

export default function RedirectPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  if (!searchParams.pathname) throw new Error("Pathname missing");
  let url = searchParams.pathname + "?";
  for (const key in searchParams) {
    if (Object.prototype.hasOwnProperty.call(searchParams, key)) {
      if (key !== "pathname") {
        const value = searchParams[key];
        url += `${key}=${value}&`;
      }
    }
  }
  redirect(url);
}
