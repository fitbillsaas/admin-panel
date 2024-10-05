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
import { API, QueryParams } from "@/lib/fetch";
import { Testimonial } from "@/models/testimonial";
import { DashboardIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Metadata } from "next";
import { MdOutlineSpeakerNotes } from "react-icons/md";
import { Actions } from "./components/actions";
import AddButton from "./components/add-button";
import TestimonialForm, {
  TestimonialFormProvider,
} from "./components/testimonial-form";
export const metadata: Metadata = {
  title: "Testimonials",
  description: "Testimonials",
};
export interface CustomSearchParams extends SearchParams {}
interface CustomListOptions extends ListOptions {}
async function getListWithCount(options: CustomListOptions): Promise<{
  testimonials: Testimonial[];
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
      where,
      sort,
    };
    const { data, error } = await API.GetAll("testimonials", queryParams);
    if (error) throw error;
    return { ...data, queryParams };
  } catch (error) {
    return { testimonials: [], count: 0, queryParams: {} };
  }
}

export default async function TestimonialManagement({
  searchParams,
}: {
  searchParams: CustomSearchParams;
}) {
  const limit = 10;
  const page = +searchParams.page || 1;
  const offset = page * limit - limit;
  const { testimonials, count } = await getListWithCount({
    offset,
    limit,
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
            title: "Testimonials",
            icon: MdOutlineSpeakerNotes,
            active: true,
          },
        ]}
      />
      <TestimonialFormProvider>
        <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Testimonials</h2>
            <div className="flex sm:flex-1 items-center justify-end flex-wrap">
              <AddButton />
            </div>
          </div>

          <div className="flex sm:flex-1 items-center flex-wrap ">
            <Table className="listing-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Sl. No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Quotes</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((item, index) => {
                  return (
                    <TableRow key={`list_${1}`}>
                      <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell>{item?.name}</TableCell>
                      <TableCell>{item?.speciality}</TableCell>
                      <TableCell className="max-w-[200px] break-words">
                        {item?.quote}
                      </TableCell>
                      <TableCell>
                        {format(item?.created_at, "MM-dd-yyyy")}
                      </TableCell>
                      <TableCell>
                        {" "}
                        {item.active == true ? "Active" : "Inactive"}
                      </TableCell>
                      <TableCell>
                        <Actions
                          item={item}
                          totalItems={testimonials?.length}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!testimonials.length && (
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
            <TestimonialForm />
          </div>
        </section>
      </TestimonialFormProvider>
    </>
  );
}
