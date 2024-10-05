import { Breadcrumb } from "@/components/breadcrumb";
import { CropperFormProvider } from "@/components/cropper";
import { ListOptions, SearchParams } from "@/lib/definitions";
import { API } from "@/lib/fetch";
import { Category } from "@/models/category";
import { DashboardIcon } from "@radix-ui/react-icons";
import { Suspense } from "react";
import { MdOutlineCategory } from "react-icons/md";
import AddAction from "./components/add-button";
import CategoryForm, { CategoryFormProvider } from "./components/category-form";
import ThumbnailForm, {
  ThumbnailFormProvider,
} from "./components/category-image-view";
import { Draggable } from "./components/draggable";
import SearchForm from "./components/search-form";

export interface CustomSearchParams extends SearchParams {
  status: string;
}
interface CustomListOptions extends ListOptions {
  status: string | null;
}

async function getListWithCount(
  options: CustomListOptions,
): Promise<{ product_categories: Category[]; count: number }> {
  try {
    const where: any = {
      active: true,
      status: "Y",
    };
    const sort: string[][] = [];

    if (options.status) {
      where.status = options.status;
    }

    if (options.sortField && options.sortDir) {
      sort.push([options.sortField, options.sortDir]);
    }
    const { data, error } = await API.GetAll("product_category", {
      limit: options.limit,
      offset: options.offset,
      search: options.search,
      where,
      sort,
    });
    if (error) throw error;

    return data;
  } catch (error) {
    return { product_categories: [], count: 0 };
  }
}

export default async function CategoryManagement({
  searchParams,
}: {
  searchParams: CustomSearchParams;
}) {
  const limit = -1;
  const page = +searchParams.page || 1;
  const { product_categories } = await getListWithCount({
    offset: 0,
    limit,
    search: searchParams.search,
    status: searchParams.status,
    sortField: searchParams.sort ?? "sort",
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
            title: "Category Management",
            icon: MdOutlineCategory,
            active: true,
          },
        ]}
      />
      <CategoryFormProvider>
        <CropperFormProvider>
          <ThumbnailFormProvider>
            <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
              <div className="flex items-center justify-between space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  Category Management
                </h2>
              </div>
              <div className="flex sm:flex-1 items-center justify-between flex-wrap gap-2">
                <Suspense fallback={<div>Loading</div>}>
                  <SearchForm />
                </Suspense>
                <AddAction />
              </div>

              <div className="flex sm:flex-1 items-center flex-wrap gap-2">
                <Draggable
                  product_categories={product_categories}
                  page={page}
                  limit={limit}
                  searchParams={{
                    status: searchParams.status,
                    search: searchParams.search,
                  }}
                />
                <ThumbnailForm />
                <CategoryForm />
              </div>
            </section>
          </ThumbnailFormProvider>
        </CropperFormProvider>
      </CategoryFormProvider>
    </>
  );
}
