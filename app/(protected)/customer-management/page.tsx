import { Breadcrumb } from "@/components/breadcrumb";
import { DateTimePipe } from "@/components/date-pipe";
import Pagination from "@/components/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { nameShort } from "@/lib/utils";
import { User } from "@/models/user";
import Connection from "@/public/connection.png";
import { DashboardIcon, PersonIcon } from "@radix-ui/react-icons";
import { addDays, formatISO } from "date-fns";
import { Metadata } from "next";
import Image from "next/image";
import { Actions } from "./components/actions";
import { ChangeDispenserFormProvider } from "./components/change-dispenser";
import { PasswordFormProvider } from "./components/change-password";
import ExportExcel from "./components/export-excel";
import ImportExcel from "./components/import-excel";
import { ImportStatusSheetProvider } from "./components/import-status-sheet";
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
  active: string | null;
  from: string | null;
  to: string | null;
}

interface CustomWhere {
  active?: boolean | null;
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
    if (options.active == "true") {
      where.active = true;
    } else if (options.active == "false") {
      where.active = false;
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
      populate: ["dispenser"],
      where,
      sort,
    };
    const { data, error } = await API.GetAll("user/customer", queryParams);

    if (error) throw error;

    return { ...data, queryParams };
  } catch (error) {
    return { users: [], count: 0, queryParams: {} };
  }
}
async function getDispensers(
  options: any,
): Promise<{ users: User[]; count: number; queryParams: QueryParams }> {
  try {
    const where: any = {
      active: true,
    };

    const sort: string[][] = [];
    if (options.sortField && options.sortDir) {
      sort.push([options.sortField, options.sortDir]);
    }
    sort.push(["name", "asc"]);
    const queryParams = {
      limit: -1,
      offset: options.offset,
      where,
      sort,
    };
    const { data, error } = await API.GetAll("user/dispenser", queryParams);
    if (error) throw error;
    return { ...data, queryParams };
  } catch (error) {
    return { users: [], count: 0, queryParams: {} };
  }
}

export default async function CustomerManagement({
  searchParams,
}: {
  searchParams: CustomSearchParams;
}) {
  const limit = 10;
  const page = +searchParams.page || 1;
  const offset = page * limit - limit;
  const { users, count, queryParams } = await getListWithCount({
    offset,
    limit,
    active: searchParams.status,
    search: searchParams.search,
    from: searchParams.from ? formatISO(new Date(searchParams.from)) : null,
    to: searchParams.to
      ? formatISO(addDays(new Date(searchParams.to), 1))
      : null,
    sortField: searchParams.sort ?? "created_at",
    sortDir: searchParams.dir ?? "desc",
  });

  const { users: dispenserData } = await getDispensers({
    offset,
    limit,
    active: true,
    sortField: "created_at",
    sortDir: "desc",
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
            title: "Customer Management",
            icon: PersonIcon,
            active: true,
          },
        ]}
      />
      <PasswordFormProvider>
        <ChangeDispenserFormProvider>
          <ImportStatusSheetProvider>
            <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
              <div className="flex items-center justify-between space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  Customer Management
                </h2>
              </div>
              <div className="flex sm:flex-1 items-center justify-between flex-wrap gap-2">
                <SearchForm />
                <div className="flex gap-3">
                  <ExportExcel queryParams={queryParams} />
                  <ImportExcel />
                </div>
              </div>

              <div className="flex sm:flex-1 items-center flex-wrap gap-2">
                <Table className="listing-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sl. No</TableHead>
                      <TableHead>Image</TableHead>
                      <TableHead>First Name</TableHead>
                      <TableHead>Last Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Zip Code</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((item, index) => {
                      return (
                        <TableRow key={`list_${index}`}>
                          <TableCell>
                            {(page - 1) * limit + index + 1}
                          </TableCell>
                          <TableCell>
                            <Avatar>
                              <AvatarImage src={item.avatar} alt={item.name} />
                              <AvatarFallback>
                                {nameShort(item.name)}
                              </AvatarFallback>
                            </Avatar>
                            {item?.connection_via == "Referral" ||
                              item?.connection_via == "Connect"}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {["Referral", "Connect"]?.includes(
                                item?.connection_via,
                              ) && (
                                <Image
                                  src={Connection}
                                  width={20}
                                  height={20}
                                  alt="connection"
                                />
                              )}
                              {item.first_name}
                            </div>
                          </TableCell>
                          <TableCell>{item.last_name}</TableCell>
                          <TableCell> {item?.email}</TableCell>
                          <TableCell> {item?.dispenser?.name}</TableCell>
                          <TableCell>{item?.phone}</TableCell>
                          <TableCell>{item?.address}</TableCell>
                          <TableCell>{item?.city}</TableCell>
                          <TableCell>{item?.state}</TableCell>
                          <TableCell>{item?.zip_code}</TableCell>

                          <TableCell>
                            <DateTimePipe date={item.created_at} />
                          </TableCell>
                          <TableCell>
                            {item.active == true ? "Active" : "Inactive"}
                          </TableCell>
                          <TableCell>
                            <Actions
                              item={item}
                              // totalItems={users?.length}
                              dispensers={dispenserData}
                            />
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
          </ImportStatusSheetProvider>
        </ChangeDispenserFormProvider>
      </PasswordFormProvider>
    </>
  );
}
