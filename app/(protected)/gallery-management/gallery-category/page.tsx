import { Breadcrumb } from "@/components/breadcrumb";
import { DateTimePipe } from "@/components/date-pipe";
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
import { Cat } from "@/models/cat";
import { DashboardIcon } from "@radix-ui/react-icons";
import { Suspense } from "react";
import { TbCategory } from "react-icons/tb";
import { Actions } from "./components/actions";
import AddAction from "./components/add-button";
import YoutubeForm, { YoutubeFormProvider } from "./components/category-form";
import SearchForm from "./components/search-form";
import ThumbnailForm, {
  ThumbnailFormProvider,
} from "./components/thumbnail-image-view";

export interface CustomSearchParams extends SearchParams {
  status: string;
}
interface CustomListOptions extends ListOptions {
  status: string | null;
}

async function getListWithCount(
  options: CustomListOptions,
): Promise<{ gallery_categories: Cat[]; count: number }> {
  try {
    const where: any = {};
    const sort: string[][] = [];

    if (options.status) {
      where.status = options.status;
    }

    if (options.sortField && options.sortDir) {
      sort.push([options.sortField, options.sortDir]);
    }
    const { data, error } = await API.GetAll("gallery_category", {
      limit: options.limit,
      offset: options.offset,
      search: options.search,
      where,
      sort,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    return { gallery_categories: [], count: 0 };
  }
}

export default async function ImageManagement({
  searchParams,
}: {
  searchParams: CustomSearchParams;
}) {
  const limit = -1;
  const page = +searchParams.page || 1;
  const { gallery_categories } = await getListWithCount({
    offset: 0,
    limit,
    search: searchParams.search,
    status: searchParams.status,
    sortField: searchParams.sort ?? "name",
    sortDir: searchParams.dir ?? "asc",
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
            title: "Gallery Category Management",
            icon: TbCategory,
            active: true,
          },
        ]}
      />
      <YoutubeFormProvider>
        <ThumbnailFormProvider>
          <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                Gallery Category Management
              </h2>
            </div>
            <div className="flex sm:flex-1 items-center justify-between flex-wrap gap-2">
              <Suspense fallback={<div>Loading</div>}>
                <SearchForm />
              </Suspense>
              <AddAction />
            </div>

            <div className="flex sm:flex-1 items-center flex-wrap gap-2">
              <Table className="listing-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Sl. No</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gallery_categories.map((item, index) => {
                    return (
                      <TableRow key={`list_${index}`}>
                        <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          <DateTimePipe date={item.created_at} />
                        </TableCell>

                        <TableCell>
                          {item.active == true ? "Active" : "Inactive"}
                        </TableCell>
                        <TableCell>
                          <Actions
                            item={item}
                            totalItems={gallery_categories?.length}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {!gallery_categories.length && (
                    <TableRow>
                      <TableCell className="text-center" colSpan={12}>
                        No data found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <ThumbnailForm />
              <YoutubeForm />
            </div>
          </section>
        </ThumbnailFormProvider>
      </YoutubeFormProvider>
    </>
  );
}
