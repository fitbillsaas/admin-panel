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
import { formatDate } from "@/lib/utils";
import { Coupon } from "@/models/coupon";
import { User } from "@/models/user";
import { DashboardIcon } from "@radix-ui/react-icons";
import { Metadata } from "next";
import { RiCoupon3Line } from "react-icons/ri";
import { Actions } from "./components/actions";
import AddButton from "./components/add-button";
import CouponForm, {
  CouponFormProvider,
} from "./components/coupon-create-form";
import ExportExcel from "./components/export-excel";
import SearchForm from "./components/search-form";
export const metadata: Metadata = {
  title: "Dispenser Coupon Management",
  description: "Coupons",
};

export interface CustomSearchParams extends SearchParams {
  from: string;
  to: string;
}

interface CustomListOptions extends ListOptions {
  from: string | null;
  to: string | null;
}

async function getListWithCount(
  options: CustomListOptions,
): Promise<{ coupons: Coupon[]; count: number; queryParams: QueryParams }> {
  try {
    // const where: any = {
    //   owner: "Dispenser",
    // };
    // if (options.from || options.to) {
    //   where.valid_from = {};
    //   where.valid_to = {};
    //   if (options.from) where.valid_from.$gte = options.from;
    //   if (options.to) where.valid_to.$lte = options.to;
    // }

    const where: any = { owner: "Dispenser" };
    if (options.from || options.to) {
      where.valid_from = {};
      where.valid_to = {};
      if (options.to) where.valid_from.$lte = options.to;
      if (options.from) where.valid_to.$gte = options.from;
    }

    const sort: string[][] = [];

    if (options.sortField && options.sortDir) {
      sort.push([options.sortField, options.sortDir]);
    }

    const queryParams = {
      limit: options.limit,
      offset: options.offset,
      search: options.search,
      populate: ["user", "coupon_used"],
      where,
      sort,
    };
    const { data, error } = await API.GetAll("coupon", queryParams);

    if (error) throw error;
    return { ...data, queryParams };
  } catch (error) {
    return { coupons: [], count: 0, queryParams: {} };
  }
}

async function getProductCategories(): Promise<{
  users: User[];
}> {
  const { data, error } = await API.GetAll("user/dispenser", {
    limit: -1,
    sort: [["created_at", "asc"]],
  });
  if (error) return { users: [] };
  return data;
}

export default async function DispenserCouponManagement({
  searchParams,
}: {
  searchParams: CustomSearchParams;
}) {
  const limit = 10;
  const page = +searchParams.page || 1;
  const offset = page * limit - limit;
  const [{ users }] = await Promise.all([getProductCategories()]);

  const { coupons, count, queryParams } = await getListWithCount({
    offset,
    limit,
    search: searchParams.search,
    from: searchParams.from
      ? formatDate(new Date(searchParams.from), "yyyy-MM-dd")
      : null,
    to: searchParams.to
      ? formatDate(new Date(searchParams.to), "yyyy-MM-dd")
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
            title: "Dispenser Coupon Management",
            icon: RiCoupon3Line,
            active: true,
          },
        ]}
      />
      <CouponFormProvider>
        <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Dispenser Coupon Management
            </h2>
          </div>
          <div className="flex sm:flex-1 items-center justify-between flex-wrap gap-2">
            <SearchForm />
            <div className="flex gap-2">
              <ExportExcel queryParams={queryParams} />
              <AddButton dispensers={users} />
            </div>
          </div>

          <div className="flex sm:flex-1 items-center flex-wrap gap-2">
            <Table className="listing-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Sl. No</TableHead>
                  <TableHead>
                    <SortableCell title="Coupon Name" field="name" />
                  </TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Dispenser</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Price/Percentage</TableHead>
                  <TableHead>Redemption limit per person</TableHead>
                  <TableHead>Redemption Status</TableHead>
                  <TableHead>Activation Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((item, index) => {
                  return (
                    <TableRow key={`list_${index}`}>
                      <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell>{item?.name}</TableCell>
                      <TableCell>{item?.code}</TableCell>
                      <TableCell>{item?.user?.name}</TableCell>
                      <TableCell>{formatDate(item.valid_from, "P")}</TableCell>
                      <TableCell>{formatDate(item.valid_to, "P")}</TableCell>
                      <TableCell>
                        {item?.coupon_type == "percentage"
                          ? item?.discount + "%"
                          : "$" + item?.discount}
                      </TableCell>
                      <TableCell>{item?.discount_usage}</TableCell>
                      <TableCell>
                        {item?.coupon_used?.length > 0
                          ? "Redeemed"
                          : "Not Redeeemed"}
                      </TableCell>
                      <TableCell>
                        {!!item.active ? "Active" : "Inactive"}
                      </TableCell>
                      <TableCell>
                        <Actions item={item} totalItems={coupons?.length} />
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!coupons.length && (
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
            <CouponForm />
          </div>
        </section>
      </CouponFormProvider>
    </>
  );
}
