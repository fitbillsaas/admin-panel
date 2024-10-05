import { Breadcrumb } from "@/components/breadcrumb";
import { API } from "@/lib/fetch";
import { DashboardIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { LuMail } from "react-icons/lu";
import Editor from "../components/editor-form";

export default async function EmailTemplateView({
  params,
}: {
  params: { name: string };
}) {
  const getData = async ({ name }: { name: string }) => {
    const { data } = await API.Find("template", {
      where: { name: name },
    });
    return data;
  };
  const data = await getData({ name: params?.name });

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
            title: "Email Templates",
            link: "/email-template",
            icon: LuMail,
          },
          {
            title: "Edit",
            icon: Pencil1Icon,
            active: true,
          },
        ]}
      />

      <section className="lg:m-10 m-5">
        <div className="lg:flex lg:items-start lg:space-x-4">
          <div className="lg:w-3/4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">
                Email Templates
              </h2>
            </div>
            <div className="mt-2">
              <Editor data={data?.template} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
