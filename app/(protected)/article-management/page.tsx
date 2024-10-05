import { Breadcrumb } from "@/components/breadcrumb";
import { ListOptions, SearchParams } from "@/lib/definitions";
import { API } from "@/lib/fetch";
import { Article } from "@/models/article";
import { DashboardIcon } from "@radix-ui/react-icons";
import { Suspense } from "react";
import { GrArticle } from "react-icons/gr";
import AddAction from "./components/add-button";
import ArticleForm, { ArticleFormProvider } from "./components/article-form";
import { Draggable } from "./components/draggable";
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
): Promise<{ learn_articles: Article[]; count: number }> {
  try {
    const where: any = {};
    const sort: string[][] = [];

    if (options.status) {
      where.status = options.status;
    }

    if (options.sortField && options.sortDir) {
      sort.push([options.sortField, options.sortDir]);
    }
    const { data, error } = await API.GetAll("learn_article", {
      limit: options.limit,
      offset: options.offset,
      search: options.search,
      where,
      sort,
    });
    if (error) throw error;

    return data;
  } catch (error) {
    return { learn_articles: [], count: 0 };
  }
}

export default async function ArticleManagement({
  searchParams,
}: {
  searchParams: CustomSearchParams;
}) {
  const limit = -1;
  const page = +searchParams.page || 1;
  const { learn_articles } = await getListWithCount({
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
            title: "Article Management",
            icon: GrArticle,
            active: true,
          },
        ]}
      />
      <ArticleFormProvider>
        <ThumbnailFormProvider>
          <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                Article Management
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
                learn_articles={learn_articles}
                page={page}
                limit={limit}
                searchParams={{
                  status: searchParams.status,
                  search: searchParams.search,
                }}
              />
              <ThumbnailForm />
              <ArticleForm />
            </div>
          </section>
        </ThumbnailFormProvider>
      </ArticleFormProvider>
    </>
  );
}
