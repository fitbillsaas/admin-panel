import { Breadcrumb } from "@/components/breadcrumb";
import { DateTimePipe } from "@/components/date-pipe";
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
import { API, QueryParams } from "@/lib/fetch";
import { Contact } from "@/models/contact";
import { DashboardIcon } from "@radix-ui/react-icons";
import { Suspense } from "react";
import { RiContactsBookLine } from "react-icons/ri";
import BulkDeleteSelectionProvider, {
  BulkDeleteAction,
  Check,
  CheckAll,
  CheckedStat,
} from "./components/bulk-delete";
import ExportExcel from "./components/export-excel";
import SearchForm from "./components/search-form";

export interface CustomSearchParams extends SearchParams {}
interface CustomListOptions extends ListOptions {}
async function getListWithCount(options: CustomListOptions): Promise<{
  contact_uses: Contact[];
  count: number;
  queryParams: QueryParams;
}> {
  try {
    const where: any = {};
    const sort: string[][] = [];
    if (options.sortField && options.sortDir) {
      sort.push([options.sortField, options.sortDir]);
    }
    const queryParams = {
      limit: options.limit,
      offset: options.offset,
      search: options.search,
      where,
      sort,
    };
    const { data, error } = await API.GetAll("contact_us", queryParams);

    if (error) throw error;
    return { ...data, queryParams };
  } catch (error) {
    return { contact_uses: [], count: 0, queryParams: {} };
  }
}

export default async function ContactUsManagement({
  searchParams,
}: {
  searchParams: CustomSearchParams & { max: string };
}) {
  const limit = 10;
  const page = +searchParams.page || 1;
  const offset = page * limit - limit;

  const { contact_uses, count, queryParams } = await getListWithCount({
    offset,
    limit,
    search: searchParams.search,
    sortField: searchParams.sort ?? "created_at",
    sortDir: searchParams.dir ?? "desc",
  });

  const uniqueIds = () =>
    contact_uses
      .map((contact_us) => contact_us.id)
      .filter((id, index, ids) => id && ids.indexOf(id) === index);

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
            title: "Contact Us",
            icon: RiContactsBookLine,
            active: true,
          },
        ]}
      />
      <BulkDeleteSelectionProvider
        pageIds={uniqueIds()}
        defaultChecked={!!searchParams.max}
        maxLimit={count}
      >
        <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Contact Management
            </h2>
          </div>
          <div className="flex sm:flex-1 items-center justify-between flex-wrap gap-2">
            <Suspense fallback={<div>Loading</div>}>
              <SearchForm />
            </Suspense>

            <div className="flex gap-2">
              <Suspense fallback={<div>Loading</div>}>
                <BulkDeleteAction
                  url="contact_us/bulk-delete"
                  queryParams={queryParams}
                  count={count}
                />

                <ExportExcel queryParams={queryParams} />
              </Suspense>
            </div>
          </div>
          <div className="flex justify-between text-xs mt-4 px-2 text-primary-900 dark:text-primary-300 font-medium">
            <span className="flex gap-4">
              <CheckedStat />
            </span>
          </div>
          <div className="flex sm:flex-1 items-center flex-wrap gap-2">
            <Table className="listing-table">
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <CheckAll />
                  </TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contact_uses?.map((item, index) => {
                  return (
                    <TableRow key={`list_${index}`}>
                      <TableCell>
                        <Check id={item.id} />
                      </TableCell>
                      <TableCell className="w-1/4">{item.first_name}</TableCell>
                      <TableCell className="w-1/4">{item.last_name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell className="max-w-[200px] break-words">
                        {item.message}
                      </TableCell>
                      <TableCell>
                        {" "}
                        <DateTimePipe date={item.created_at} />
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!contact_uses.length && (
                  <TableRow>
                    <TableCell className="text-center" colSpan={6}>
                      No data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Pagination currentPage={page} totalRecords={count} />
          </div>
        </section>
      </BulkDeleteSelectionProvider>
    </>
  );
}
