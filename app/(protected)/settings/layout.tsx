import { Breadcrumb } from "@/components/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { DashboardIcon } from "@radix-ui/react-icons";
import { Metadata } from "next";
import { LuSettings } from "react-icons/lu";
import { SidebarNav } from "./components/sidebar";

export const metadata: Metadata = {
  title: "Settings",
  description: "Advanced form example using react-hook-form and Zod.",
};

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/settings",
  },
  {
    title: "Change Password",
    href: "/settings/change-password",
  },
  {
    title: "General Config",
    href: "/settings/general-config",
  },
  {
    title: "Manage Address",
    href: "/settings/address",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <Breadcrumb
        breadcrumbs={[
          {
            title: "Dashboard",
            link: "/",
            icon: DashboardIcon,
            active: false,
          },
          {
            title: "Settings",
            icon: LuSettings,
            active: true,
          },
        ]}
      />
      <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
        <div className="space-y-6  pb-16 md:block">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">
              Manage your account settings and set config preferences.
            </p>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="lg:w-1/5 border-r border-gray-200 pr-4">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="flex-1 lg:max-w-2xl">{children}</div>
          </div>
        </div>
      </section>
    </>
  );
}
