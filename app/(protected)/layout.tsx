import CheatListProvider from "@/components/cheat-list";
import DeleteProvider from "@/components/delete-provider";
import KeyboardShortcuts from "@/components/keyboard-shortcuts";
import LogoutProvider from "@/components/logout-provider";
import { TopNav } from "@/components/menu/top-nav";
import { getCurrentUser } from "@/lib/session";
import { notFound } from "next/navigation";

export default async function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <LogoutProvider>
          <DeleteProvider>
            <CheatListProvider>
              <TopNav />
              <div>{children}</div>
              <KeyboardShortcuts />
              {/* <VersionNumber /> */}
            </CheatListProvider>
          </DeleteProvider>
        </LogoutProvider>
      </div>
    </>
  );
}
