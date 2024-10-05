import { Breadcrumb } from "@/components/breadcrumb";
import { DateTimePipe } from "@/components/date-pipe";
import { DispenserIcon } from "@/components/icon";
import Pagination from "@/components/pagination";
import Tooltip from "@/components/tooltip";
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
import { User } from "@/models/user";
import { DashboardIcon } from "@radix-ui/react-icons";
import { addDays, formatISO } from "date-fns";
import { Metadata } from "next";
import Link from "next/link";
import { BiPlus } from "react-icons/bi";
import { Actions } from "./components/actions";
import { PasswordFormProvider } from "./components/change-password";
import CopyQR from "./components/copy-qr";
import CopyUrl from "./components/copy-url";
import ExportExcel from "./components/export-excel";
import GeoTagBtn from "./components/geotag-btn";
import ImportExcel from "./components/import-excel";
import { ImportStatusSheetProvider } from "./components/import-status-sheet";
import SearchForm from "./components/search-form";
export const metadata: Metadata = {
  title: "Dispenser Management",
  description: "Dispensers",
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
  deleted_at?: any | null;
  created_at?: {
    $gte?: string | null;
    $lt?: string | null;
  };
  learning_completed?: string | null;
}

async function getListWithCount(
  options: CustomListOptions,
): Promise<{ users: User[]; count: number; queryParams: QueryParams }> {
  try {
    const where: CustomWhere = { learning_completed: "Y" };
    if (options.active == "true") {
      where.active = true;
    } else if (options.active == "false") {
      where.active = false;
    } else if (options.active == "Deleted") {
      where.deleted_at = { $not: null };
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
    sort.push(["name", "asc"]);
    const queryParams = {
      limit: options.limit,
      offset: options.offset,
      search: options.search,
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

export default async function DispenserManagement({
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
    sortField: searchParams.sort ?? "geotag",
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
            title: "Dispenser Management",
            icon: DispenserIcon,
            active: true,
          },
        ]}
      />
      <PasswordFormProvider>
        <ImportStatusSheetProvider>
          <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                Dispenser Management
              </h2>
            </div>
            <div className="flex sm:flex-1 items-center justify-between flex-wrap gap-2">
              <SearchForm />
              <div className="flex gap-3">
                <Link href="/dispenser-management/create">
                  <Tooltip content="Add Dispenser">
                    <Button variant="outline" size="icon">
                      <BiPlus className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                </Link>
                <ExportExcel queryParams={queryParams} />
                <ImportExcel />
              </div>
            </div>

            <div className="flex sm:flex-1 items-center flex-wrap gap-2">
              <Table className="listing-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Sl. No</TableHead>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Geotag</TableHead>
                    <TableHead>Unique URL</TableHead>
                    <TableHead>QR Code</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((item, index) => {
                    return (
                      <TableRow key={`list_${index}`}>
                        <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                        <TableCell>{item.first_name}</TableCell>
                        <TableCell>{item.last_name}</TableCell>
                        <TableCell>
                          {item?.business_name
                            ? item?.business_name
                            : "Not Applicable"}
                        </TableCell>
                        <TableCell> {item?.email}</TableCell>
                        <TableCell>
                          <GeoTagBtn item={item} />
                        </TableCell>
                        <TableCell>
                          {" "}
                          <CopyUrl item={item} />
                        </TableCell>
                        <TableCell>
                          {/* <Image
                            src={item?.qr_code ? item?.qr_code : ""}
                            height={50}
                            width={50}
                            alt="QR CODE"
                          /> */}
                          <CopyQR item={item} />
                        </TableCell>

                        <TableCell>
                          <DateTimePipe date={item.created_at} />
                        </TableCell>
                        <TableCell>
                          {item?.created_by == 1 ? "Admin" : "Applicant"}
                        </TableCell>
                        <TableCell>
                          {item.active == true ? "Active" : "Inactive"}
                        </TableCell>
                        <TableCell>
                          <Actions
                            item={item}
                            // totalItems={users?.length}
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
      </PasswordFormProvider>
    </>
  );
}
