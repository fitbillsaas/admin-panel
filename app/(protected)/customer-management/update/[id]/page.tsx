import { Breadcrumb } from "@/components/breadcrumb";
import UpdateProvider from "@/components/update-provider";
import { API, ApiResponse } from "@/lib/fetch";
import { DashboardIcon, Pencil1Icon, PersonIcon } from "@radix-ui/react-icons";
import { notFound } from "next/navigation";
import CustomerForm from "../../components/customer-form";
const getDetailsBySlug = async ({
  id,
}: {
  id: string;
}): Promise<ApiResponse> => {
  const res = await API.Find("user", {
    where: { id },
  });
  return res;
};
async function getStates() {
  try {
    const sort: string[][] = [];
    sort.push(["name", "asc"]);
    const queryParams = {
      limit: -1,
      sort,
    };
    const { data, error } = await API.GetAll("state", queryParams);
    if (error) throw error;
    return { ...data, queryParams };
  } catch (error) {
    return { users: [], count: 0, queryParams: {} };
  }
}
export default async function UpdateCustomer({
  params,
}: {
  params: { id: string };
}) {
  const { error, data, statusCode } = await getDetailsBySlug({
    id: params.id,
  });
  if (error && statusCode === 404) {
    return notFound();
  }
  const { states } = await getStates();

  return (
    <>
      <Breadcrumb
        breadcrumbs={[
          {
            title: "Dashboard",
            link: "/",
            icon: DashboardIcon,
          },
          {
            title: "Customer Management",
            link: "/customer-management",
            icon: PersonIcon,
          },
          {
            title: "Update Customer",
            icon: Pencil1Icon,
            active: true,
          },
        ]}
      />
      <UpdateProvider>
        <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Update customer
            </h2>
          </div>
          <div className="flex sm:flex-1 items-center flex-wrap gap-2">
            <CustomerForm customer={data?.user} states={states} />
          </div>
        </section>
      </UpdateProvider>
    </>
  );
}
