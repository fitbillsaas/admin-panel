import { Breadcrumb } from "@/components/breadcrumb";
import Pagination from "@/components/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ListOptions, SearchParams } from "@/lib/definitions";
import { API } from "@/lib/fetch";
import { Template } from "@/models/template";
import { DashboardIcon } from "@radix-ui/react-icons";
import { LuMail } from "react-icons/lu";
import EditAction from "./components/edit-action";
import SearchForm from "./components/search-form";

export interface CustomSearchParams extends SearchParams {}

interface CustomListOptions extends ListOptions {}

async function getListWithCount(
  options: CustomListOptions,
): Promise<{ templates: Template[]; count: number }> {
  try {
    const where: any = {};
    const sort: string[][] = [];
    if (options.sortField && options.sortDir) {
      sort.push([options.sortField, options.sortDir]);
    }

    const { data, error } = await API.GetAll("template", {
      limit: options.limit,
      offset: options.offset,
      search: options.search,
      where,
      sort,
    });

    if (error) throw error;

    return data;
  } catch (error) {
    return { templates: [], count: 0 };
  }
}

export default async function EmailTemplateManagement({
  searchParams,
}: {
  searchParams: CustomSearchParams;
}) {
  const limit = 10;
  const page = +searchParams.page || 1;
  const offset = page * limit - limit;

  const { templates, count } = await getListWithCount({
    offset,
    limit,
    search: searchParams.search,
    sortField: searchParams.sort ?? "created_at",
    sortDir: searchParams.dir ?? "desc",
  });

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
            link: "#",
            icon: LuMail,
            active: true,
          },
        ]}
      />
      <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Email Templates</h2>
        </div>
        <div className="flex sm:flex-1 items-center flex-wrap gap-2">
          <SearchForm />
        </div>
        <div className="flex sm:flex-1 items-center flex-wrap gap-2">
          <Table className="listing-table">
            <TableHeader>
              <TableRow>
                <TableHead>Sl. No</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((item, index) => {
                return (
                  <TableRow key={`list_${index}`}>
                    <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>
                      {!!item.active ? "Active" : "Inactive"}
                    </TableCell>
                    <TableCell>
                      <EditAction item={item} />
                    </TableCell>
                  </TableRow>
                );
              })}
              {!templates.length && (
                <TableRow>
                  <TableCell className="text-center" colSpan={4}>
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Pagination
            currentPage={page}
            totalRecords={count}
            pageSize={limit}
          />
        </div>
      </section>
    </>
  );
}
