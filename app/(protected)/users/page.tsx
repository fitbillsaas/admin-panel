import { Breadcrumb } from "@/components/breadcrumb";
import { DashboardIcon, PersonIcon } from "@radix-ui/react-icons";

export default function User() {
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
            title: "Users",
            icon: PersonIcon,
            active: true,
          },
        ]}
      />
      <div className="m-5">Users</div>
    </>
  );
}
