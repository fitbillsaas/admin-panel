import { Breadcrumb } from "@/components/breadcrumb";
import { ELearnVideoIcon } from "@/components/icon";
import { ListOptions, SearchParams } from "@/lib/definitions";
import { API } from "@/lib/fetch";
import { LearningVideos } from "@/models/learning-videos";
import { DashboardIcon } from "@radix-ui/react-icons";
import { addDays, formatISO } from "date-fns";
import { Suspense } from "react";
import AddButton from "./components/add-button";
import { Draggable } from "./components/draggable";
import SearchForm from "./components/search-form";
import VideoThumbnailForm, {
  ThumbnailFormProvider,
} from "./components/thumbnail-video-view";
import ImageForm, { ImageFormProvider } from "./components/video-form";
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
): Promise<{ learning_videos: LearningVideos[]; count: number }> {
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
      where,
      sort,
    };
    const { data, error } = await API.GetAll("learning_video", queryParams);
    if (error) throw error;
    return data;
  } catch (error) {
    return { learning_videos: [], count: 0 };
  }
}

export default async function VideoManagement({
  searchParams,
}: {
  searchParams: CustomSearchParams;
}) {
  const limit = -1;
  const page = +searchParams.page || 1;
  const offset = page * limit - limit;
  const { learning_videos } = await getListWithCount({
    offset,
    limit,
    active: searchParams.status,
    search: searchParams.search,
    from: searchParams.from ? formatISO(new Date(searchParams.from)) : null,
    to: searchParams.to
      ? formatISO(addDays(new Date(searchParams.to), 1))
      : null,
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
            title: "Video Management",
            icon: ELearnVideoIcon,
            active: true,
          },
        ]}
      />
      <ImageFormProvider>
        <ThumbnailFormProvider>
          <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                Video Management
              </h2>
            </div>
            <div className="flex sm:flex-1 items-center justify-between flex-wrap gap-2">
              <Suspense fallback={<div>Loading</div>}>
                <SearchForm />
              </Suspense>
              <AddButton />
            </div>

            <div className="flex sm:flex-1 items-center flex-wrap gap-2">
              <Draggable
                learning_videos={learning_videos}
                page={page}
                limit={limit}
                searchParams={{
                  status: searchParams.status,
                  search: searchParams.search,
                }}
              />
              <VideoThumbnailForm />
              <ImageForm />
            </div>
          </section>
        </ThumbnailFormProvider>
      </ImageFormProvider>
    </>
  );
}
