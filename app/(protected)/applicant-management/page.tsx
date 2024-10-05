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
import { User } from "@/models/user";
import { DashboardIcon, PersonIcon } from "@radix-ui/react-icons";
import { addDays, formatISO } from "date-fns";
import { Metadata } from "next";
import { Actions } from "./components/actions";
import SearchForm from "./components/search-form";
export const metadata: Metadata = {
  title: "Customer Management",
  description: "Customers",
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

async function getListWithCount(
  options: CustomListOptions,
): Promise<{ users: User[]; count: number; queryParams: QueryParams }> {
  try {
    const where: CustomWhere = {};
    if (options.status == "Approve") {
      where.status = "Approve";
    } else if (options.status == "Deny") {
      where.status = "Deny";
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
      sort,
    };
    const { data, error } = await API.GetAll("user/applicant", queryParams);
    if (error) throw error;
    return { ...data, queryParams };
  } catch (error) {
    return { users: [], count: 0, queryParams: {} };
  }
}

export default async function ApplicantManagement({
  searchParams,
}: {
  searchParams: CustomSearchParams;
}) {
  const limit = 10;
  const page = +searchParams.page || 1;
  const offset = page * limit - limit;
  const { users, count } = await getListWithCount({
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
            title: "Applicant Management",
            icon: PersonIcon,
            active: true,
          },
        ]}
      />
      <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Applicant Management
          </h2>
        </div>
        <div className="flex sm:flex-1 items-center justify-between flex-wrap gap-2">
          <SearchForm />
        </div>

        <div className="flex sm:flex-1 items-center flex-wrap gap-2">
          <Table className="listing-table">
            <TableHeader>
              <TableRow>
                <TableHead>Sl. No</TableHead>
                <TableHead> Name</TableHead>
                <TableHead> Business Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>City</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Zip</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((item, index) => {
                return (
                  <TableRow key={`list_${index}`}>
                    <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                    <TableCell>{item?.name}</TableCell>
                    <TableCell>
                      {item?.business_name
                        ? item?.business_name
                        : "Not Applicable"}
                    </TableCell>
                    <TableCell> {item?.email}</TableCell>
                    <TableCell>{item?.phone}</TableCell>
                    <TableCell>{item?.address}</TableCell>
                    <TableCell>{item?.city}</TableCell>
                    <TableCell>{item?.state}</TableCell>
                    <TableCell>{item?.zip_code}</TableCell>

                    <TableCell>
                      <DateTimePipe date={item.created_at} />
                    </TableCell>
                    <TableCell>
                      {" "}
                      {item.status === "Pending"
                        ? "Pending"
                        : item.status === "Deny"
                          ? "Denied"
                          : "Approved"}
                    </TableCell>
                    <TableCell>
                      <Actions item={item} totalItems={users?.length} />
                    </TableCell>
                  </TableRow>
                );
              })}
              {!users.length && (
                <TableRow>
                  <TableCell className="text-center" colSpan={12}>
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
