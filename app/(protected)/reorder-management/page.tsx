import { Breadcrumb } from "@/components/breadcrumb";
import Pagination from "@/components/pagination";
import SortableCell from "@/components/sortable-cell";
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
import { DateFormat } from "@/lib/utils";
import { Orders } from "@/models/orders";
import { DashboardIcon } from "@radix-ui/react-icons";
import { addDays, formatISO } from "date-fns";
import { Metadata } from "next";
import { LuArchive } from "react-icons/lu";
// import { Actions } from "./components/actions";
import ExportExcel from "./components/export-excel";
import SearchForm from "./components/search-form";
export const metadata: Metadata = {
  title: "Reorder Management",
  description: "Orders",
};

export interface CustomSearchParams extends SearchParams {
  status: string;
  from: string;
  to: string;
}

interface CustomListOptions extends ListOptions {
  status: string | null;
  from: string | null;
  to: string | null;
}

async function getListWithCount(
  options: CustomListOptions,
): Promise<{ orders: Orders[]; count: number; queryParams: QueryParams }> {
  try {
    const where: any = {
      is_a_reorder: "Y",
    };

    if (options.status) {
      where.status = options.status;
    }

    if (options.from || options.to) {
      where.created_at = {};
      if (options.from) where.created_at.$gte = options.from;
      if (options.to) where.created_at.$lt = options.to;
    }

    const sort: string[][] = [];

    if (options.sortField && options.sortDir) {
      sort.push([options.sortField, options.sortDir]);
    }

    const queryParams = {
      limit: options.limit,
      offset: options.offset,
      search: options.search,
      populate: ["user", "previous_order"],
      where,
      sort,
    };
    // order/reorder
    const { data, error } = await API.GetAll("order", queryParams);

    if (error) throw error;
    return { ...data, queryParams };
  } catch (error) {
    return { orders: [], count: 0, queryParams: {} };
  }
}

export default async function ProductManagement({
  searchParams,
}: {
  searchParams: CustomSearchParams;
}) {
  const limit = 10;
  const page = +searchParams.page || 1;
  const offset = page * limit - limit;

  const { orders, count, queryParams } = await getListWithCount({
    offset,
    limit,
    status: searchParams.status,
    search: searchParams.search,
    from: searchParams.from ? formatISO(new Date(searchParams.from)) : null,
    to: searchParams.to
      ? formatISO(addDays(new Date(searchParams.to), 1))
      : null,
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
            title: "Reorder Management",
            icon: LuArchive,
            active: true,
          },
        ]}
      />
      <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Reorder Management
          </h2>
        </div>
        <div className="flex sm:flex-1 items-center justify-between flex-wrap gap-2">
          <SearchForm />
          <div className="flex gap-2">
            <ExportExcel queryParams={queryParams} />
          </div>
        </div>

        <div className="flex sm:flex-1 items-center flex-wrap gap-2">
          <Table className="listing-table">
            <TableHeader>
              <TableRow>
                <TableHead>Sl. No</TableHead>
                <TableHead>
                  <SortableCell title="Order ID " field="uid" />
                </TableHead>
                <TableHead>User Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Repeat Interval (in days) </TableHead>
                <TableHead>Next Order Date </TableHead>
                <TableHead>Previous Order Date </TableHead>
                {/* <TableHead>Action</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((item, index) => {
                return (
                  <TableRow key={`list_${index}`}>
                    <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                    <TableCell>{item?.uid}</TableCell>
                    <TableCell>{item?.user.name}</TableCell>
                    <TableCell>${item?.total}</TableCell>
                    <TableCell>{item?.repeating_days}</TableCell>
                    <TableCell>{DateFormat(item?.updated_at)}</TableCell>
                    <TableCell className="max-w-[200px] break-words">
                      {DateFormat(item?.previous_order?.created_at)}
                    </TableCell>
                    {/* <TableCell><Actions item={item} /></TableCell> */}
                  </TableRow>
                );
              })}
              {!orders.length && (
                <TableRow>
                  <TableCell className="text-center" colSpan={9}>
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
