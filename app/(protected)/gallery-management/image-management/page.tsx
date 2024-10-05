import { Breadcrumb } from "@/components/breadcrumb";
import { ListOptions, SearchParams } from "@/lib/definitions";
import { API } from "@/lib/fetch";
import { Cat } from "@/models/cat";
import { Image } from "@/models/image";
import { DashboardIcon } from "@radix-ui/react-icons";
import { Suspense } from "react";
import { CiImageOn } from "react-icons/ci";
import AddAction from "./components/add-button";
import { Draggable } from "./components/draggable";
import ImageForm, { ImageFormProvider } from "./components/image-form";
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
): Promise<{ galleries: Image[]; count: number }> {
  try {
    const where: any = {
      type: "Image",
    };
    const sort: string[][] = [];

    if (options.status) {
      where.status = options.status;
    }

    if (options.sortField && options.sortDir) {
      sort.push([options.sortField, options.sortDir]);
    }
    const { data, error } = await API.GetAll("gallery", {
      limit: options.limit,
      offset: options.offset,
      search: options.search,
      where,
      populate: ["category"],
      sort,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    return { galleries: [], count: 0 };
  }
}

async function getCategoryList(): Promise<{
  gallery_categories: Cat[];
}> {
  try {
    const where: any = {
      active: true,
    };
    const sort: string[][] = [];
    const { data, error } = await API.GetAll("gallery_category", {
      where,
      limit: -1,
      sort,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    return { gallery_categories: [] };
  }
}

export default async function ImageManagement({
  searchParams,
}: {
  searchParams: CustomSearchParams;
}) {
  const limit = -1;
  const page = +searchParams.page || 1;
  const { galleries } = await getListWithCount({
    offset: 0,
    limit,
    search: searchParams.search,
    status: searchParams.status,
    sortField: searchParams.sort ?? "sort",
    sortDir: searchParams.dir ?? "asc",
  });
  const { gallery_categories } = await getCategoryList();
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
            title: "Image Gallery Management",
            icon: CiImageOn,
            active: true,
          },
        ]}
      />
      <ImageFormProvider>
        <ThumbnailFormProvider>
          <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                Image Gallery Management
              </h2>
            </div>
            <div className="flex sm:flex-1 items-center justify-between flex-wrap gap-2">
              <Suspense fallback={<div>Loading</div>}>
                <SearchForm />
              </Suspense>
              <AddAction categories={gallery_categories} />
            </div>

            <div className="flex sm:flex-1 items-center flex-wrap gap-2">
              <Draggable
                categories={gallery_categories}
                gallery={galleries}
                page={page}
                limit={limit}
                searchParams={{
                  status: searchParams.status,
                  search: searchParams.search,
                }}
              />
              <ThumbnailForm />
              <ImageForm />
            </div>
          </section>
        </ThumbnailFormProvider>
      </ImageFormProvider>
    </>
  );
}
