import { Breadcrumb } from "@/components/breadcrumb";
import { ReportIcon } from "@/components/icon";
import Pagination from "@/components/pagination";
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
import { DateFormatCustom, truncateToTwoDecimalPlaces } from "@/lib/utils";
import { Commission } from "@/models/commission";
import dollar from "@/public/dollar.png";
import { DashboardIcon } from "@radix-ui/react-icons";
import { addDays, formatISO } from "date-fns";
import { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { Actions } from "./components/actions";
import BulkDeleteSelectionProvider, {
  BulkCanelAction,
  BulkPaidAction,
  Check,
  CheckAll,
  CheckedStat,
} from "./components/bulk-action";
import ExportExcel from "./components/export-excel";
import SearchForm from "./components/search-form";
export const metadata: Metadata = {
  title: "Commission Report Management",
  description: "Commission Reports",
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

interface CustomWhere {
  status?: string | null;
  created_at?: {
    $gte?: string | null;
    $lt?: string | null;
  };
}

async function getListWithCount(options: CustomListOptions): Promise<{
  commissions: Commission[];
  count: number;
  queryParams: QueryParams;
  quick_stats: any;
}> {
  try {
    const where: CustomWhere = {};
    if (options.status == "Pending") {
      where.status = "Pending";
    } else if (options.status == "Paid") {
      where.status = "Paid";
    } else if (options.status == "Cancel") {
      where.status = "Cancelled";
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
      where,
      populate: ["order", "user", "order.user"],
      sort,
    };
    const { data, error } = await API.GetAll("commission", queryParams);
    if (error) throw error;
    return { ...data, queryParams };
  } catch (error) {
    return { commissions: [], quick_stats: {}, count: 0, queryParams: {} };
  }
}

export default async function CommissionReportManagement({
  searchParams,
}: {
  searchParams: CustomSearchParams & { max: string };
}) {
  const limit = 25;
  const page = +searchParams.page || 1;
  const offset = page * limit - limit;
  const { commissions, count, queryParams, quick_stats } =
    await getListWithCount({
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
  const uniqueIds = () =>
    commissions
      .filter((commission) => commission.status === "Pending") // Filter by status === 'Pending'
      .map((commission) => commission.id) // Map to get only the id
      .filter((id, index, ids) => id && ids.indexOf(id) === index); // Filter to keep unique ids

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
            title: "Commission Report",
            icon: ReportIcon,
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
              Commission Report
            </h2>
          </div>
          <div className="flex sm:flex-1 items-center justify-between flex-wrap gap-2">
            <SearchForm />
            <div className="flex gap-3">
              <Suspense fallback={<div>Loading</div>}>
                {quick_stats.any_pending == true && (
                  <>
                    <BulkPaidAction
                      url="commission/bulk-update/paid"
                      queryParams={queryParams}
                      count={count}
                    />
                    <BulkCanelAction
                      url="commission/bulk-update/cancel"
                      queryParams={queryParams}
                      count={count}
                    />
                  </>
                )}

                <ExportExcel queryParams={queryParams} />
              </Suspense>
            </div>
          </div>
          <div className="re_prices">
            <div className="containers ">
              <div className="flex flex-wrap">
                <div className="item min-[768px]:w-1/2 min-[992px]:w-1/4 p-[10px] flex-1 w-full pl-[0px]">
                  <div className="bg-gradient-to-br from-[#F0F0F0] via-[#F0F0F0] to-[#D9FFF8] p-[10px] relative rounded-[10px] min-[1024px]:min-h-[150px] flex items-center h-full">
                    <div className="pt-[50px] min-[1024px]:pt-[50px]">
                      <span className="text-[16px] min-[1024px]:text-[24px]  font-semibold block">
                        Gross Earnings
                      </span>
                      <span className="text-[35px] min-[1024px]:text-[50px] font-bold block">
                        {quick_stats?.total_earnings
                          ? "$" +
                            truncateToTwoDecimalPlaces(
                              quick_stats?.total_earnings,
                            )
                          : "$" + 0.0}
                      </span>
                      <div className="dollar_icon absolute right-[15px] top-[15px]">
                        <Image
                          src={dollar}
                          height={40}
                          width={40}
                          alt=""
                          className="w-[40px] h-[40px] object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="item min-[768px]:w-1/2 min-[992px]:w-1/4 p-[15px] flex-1 w-full">
                  <div className="bg-gradient-to-br from-[#F0F0F0] via-[#F0F0F0] to-[#D9FFF8] p-[15px] relative rounded-[10px] min-[1024px]:min-h-[150px] flex items-center h-full">
                    <div className="pt-[50px] min-[1024px]:pt-[50px]">
                      <span className="text-[16px] min-[1024px]:text-[24px]  font-semibold block">
                        Amount Paid
                      </span>
                      <span className="text-[35px] min-[1024px]:text-[50px] font-bold block">
                        {quick_stats?.total_paid
                          ? "$" +
                            truncateToTwoDecimalPlaces(quick_stats?.total_paid)
                          : "$" + 0.0}
                      </span>
                      <div className="dollar_icon absolute right-[15px] top-[15px]">
                        <Image
                          src={dollar}
                          height={40}
                          width={40}
                          alt=""
                          className="w-[40px] h-[40px] object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="item min-[768px]:w-1/2 min-[992px]:w-1/4 p-[15px] flex-1 w-full">
                  <div className="bg-gradient-to-br from-[#F0F0F0] via-[#F0F0F0] to-[#D9FFF8] p-[15px] relative rounded-[10px] min-[1024px]:min-h-[150px] flex items-center h-full">
                    <div className="pt-[50px] min-[1024px]:pt-[50px]">
                      <span className="text-[16px] min-[1024px]:text-[24px]  font-semibold block">
                        Balance Due
                      </span>
                      <span className="text-[35px] min-[1024px]:text-[50px] font-bold block">
                        {quick_stats?.total_balance
                          ? "$" +
                            truncateToTwoDecimalPlaces(
                              quick_stats?.total_balance,
                            )
                          : "$" + 0.0}
                      </span>
                      <div className="dollar_icon absolute right-[15px] top-[15px]">
                        <Image
                          src={dollar}
                          height={40}
                          width={40}
                          alt=""
                          className="w-[40px] h-[40px] object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="containers ">
            <div className="order_list">
              <div className="relative overflow-x-auto">
                <div className="overflow-hidden overflow-x-auto w-full">
                  <div className="flex justify-between text-xs mt-4 px-2 text-primary-900 dark:text-primary-300 font-medium">
                    <span className="flex gap-4">
                      <CheckedStat />
                    </span>
                  </div>
                  <Table className="listing-table">
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <CheckAll />
                        </TableHead>
                        <TableHead>Sl No.</TableHead>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Dispenser Name</TableHead>
                        <TableHead>Ordered By</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Order Amount</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead>Commission Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {commissions.map((item, index) => {
                        return (
                          <TableRow key={`list_${index}`}>
                            <TableCell>
                              {/* {item?.status == "Pending" && ( */}
                              <Check id={item.id} status={item?.status} />
                              {/* )} */}
                            </TableCell>
                            <TableCell>
                              {(page - 1) * limit + index + 1}
                            </TableCell>
                            <TableCell>{item?.order?.uid}</TableCell>
                            <TableCell>{item?.user?.name}</TableCell>
                            <TableCell>{item?.order?.user?.name}</TableCell>
                            <TableCell>
                              {DateFormatCustom(item?.created_at)}
                            </TableCell>
                            <TableCell>
                              ${truncateToTwoDecimalPlaces(item?.order_amount)}
                            </TableCell>
                            <TableCell>
                              ${truncateToTwoDecimalPlaces(item?.commission)}
                            </TableCell>
                            <TableCell>
                              {item?.status == "Pending" && (
                                <Button
                                  variant="outline"
                                  className="px-[30px] py-[10px] bg-[#FFE8C9] rounded-[45px] text-[#F59414]"
                                  size="default"
                                >
                                  {item?.status}
                                </Button>
                              )}
                              {item?.status == "Paid" && (
                                <Button
                                  variant="outline"
                                  className="px-[30px] py-[10px] bg-[#CEFCF3] rounded-[45px] text-[#30D1B3]"
                                  size="default"
                                >
                                  {item?.status}
                                </Button>
                              )}
                              {item?.status == "Cancelled" && (
                                <Button
                                  variant="outline"
                                  className="px-[30px] py-[10px] bg-[#CCCCCC] rounded-[45px] text-[#FFFFFF]"
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

                      {!commissions.length && (
                        <TableRow>
                          <TableCell className="text-center" colSpan={9}>
                            No data found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
          <Pagination
            currentPage={page}
            totalRecords={count}
            pageSize={limit}
          />
        </section>
      </BulkDeleteSelectionProvider>
    </>
  );
}
