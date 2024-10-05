import { Breadcrumb } from "@/components/breadcrumb";
import Pagination from "@/components/pagination";
import SortableCell from "@/components/sortable-cell";
import { Button } from "@/components/ui/button";
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
import { TiClipboard } from "react-icons/ti";
import { Actions } from "./components/actions";
import ExportExcel from "./components/export-excel";
import SearchForm from "./components/search-form";
export const metadata: Metadata = {
  title: "Order Management",
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
    const where: any = {};

    if (options.status && options.status !== "All") {
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
      populate: ["user"],
      where,
      sort,
    };
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
            title: "Order Management",
            icon: TiClipboard,
            active: true,
          },
        ]}
      />
      <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Order Management
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
                <TableHead>Customer Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Repeated Days </TableHead>
                <TableHead>Order Date </TableHead>
                <TableHead>Delivery Status </TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((item, index) => {
                return (
                  <TableRow key={`list_${index}`}>
                    <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                    <TableCell>{item?.uid}</TableCell>
                    <TableCell>{item?.user?.name}</TableCell>
                    <TableCell>${item?.total}</TableCell>
                    <TableCell>{item.repeating_days}</TableCell>
                    <TableCell>{DateFormat(item.created_at)}</TableCell>
                    <TableCell className="max-w-[200px] break-words">
                      {item?.status == "Payment Pending" && (
                        <Button
                          variant="outline"
                          className="px-[30px] py-[10px] bg-[#FFE8C9] rounded-[45px] text-[#F59414] cursor-default"
                          size="default"
                        >
                          {item?.status}
                        </Button>
                      )}
                      {item?.status == "Delivered" && (
                        <Button
                          variant="outline"
                          className="px-[30px] py-[10px] bg-[#CEFCF3] rounded-[45px] text-[#30D1B3] cursor-default"
                          size="default"
                        >
                          {item?.status}
                        </Button>
                      )}
                      {item?.status == "Payment Failed" && (
                        <Button
                          variant="outline"
                          className="px-[30px] py-[10px] bg-[#FFD2D2] rounded-[45px] text-[#C64848] cursor-default"
                          size="default"
                        >
                          {item?.status}
                        </Button>
                      )}
                      {item?.status == "Ordered" && (
                        <Button
                          variant="outline"
                          className="px-[30px] py-[10px] bg-[#CCCCCC] rounded-[45px] text-[#FFFFFF] cursor-default"
                          size="default"
                        >
                          {item?.status}
                        </Button>
                      )}
                      {item?.status == "Cancelled" && (
                        <Button
                          variant="outline"
                          className="px-[30px] py-[10px] bg-[#FFD2D2] rounded-[45px] text-[#C64848] cursor-default"
                          size="default"
                        >
                          {item?.status}
                        </Button>
                      )}
                      {item?.status == "Shipping Failed" && (
                        <Button
                          variant="outline"
                          className="px-[30px] py-[10px] bg-[#FFD2D2] rounded-[45px] text-[#C64848] cursor-default"
                          size="default"
                        >
                          {item?.status}
                        </Button>
                      )}
                      {item?.status == "Shipped" && (
                        <Button
                          variant="outline"
                          className="px-[30px] py-[10px] bg-[#D3EDFF] rounded-[45px] text-[#0566A6] cursor-default"
                          size="default"
                        >
                          {item?.status}
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Actions item={item} />
                    </TableCell>
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
