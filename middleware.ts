export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/((?!auth|api|registration).*)", // Exclude auth, api, and registration paths
  ],
  // matcher: [
  //   "/((?!auth|api|_next/static|_next/images|images|icons|favicon.ico|manifest.json).*)",
  // ],
};
