import { Breadcrumb } from "@/components/breadcrumb";
import { ELearnExamIcon } from "@/components/icon";
import { ListOptions, SearchParams } from "@/lib/definitions";
import { API } from "@/lib/fetch";
import { LearningModule } from "@/models/learning-module";
import { LearningVideos } from "@/models/learning-videos";
import { DashboardIcon } from "@radix-ui/react-icons";
import { addDays, formatISO } from "date-fns";
import { Suspense } from "react";
import AddButton from "./components/add-button";
import { Draggable } from "./components/draggable";
import ImageForm, { ImageFormProvider } from "./components/exam-form";
import SearchForm from "./components/search-form";
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
): Promise<{ learning_modules: LearningModule[]; count: number }> {
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
      populate: ["video", "question_set"],
      sort,
    };
    const { data, error } = await API.GetAll("learning_module", queryParams);
    if (error) throw error;
    return data;
  } catch (error) {
    return { learning_modules: [], count: 0 };
  }
}

async function getVideoList(): Promise<{
  learning_videos: LearningVideos[];
}> {
  try {
    const where: any = {
      active: true,
    };
    const sort: string[][] = [];
    const { data, error } = await API.GetAll("learning_video", {
      where,
      sort,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    return { learning_videos: [] };
  }
}

async function getQuestionsList(): Promise<{
  learning_question_sets: LearningVideos[];
}> {
  try {
    const where: any = {
      active: true,
    };
    const sort: string[][] = [];
    const { data, error } = await API.GetAll("learning_question_set", {
      where,
      sort,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    return { learning_question_sets: [] };
  }
}

export default async function ExamManagement({
  searchParams,
}: {
  searchParams: CustomSearchParams;
}) {
  const limit = -1;
  const page = +searchParams.page || 1;
  const offset = page * limit - limit;
  const { learning_modules } = await getListWithCount({
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
  const { learning_videos } = await getVideoList();
  const { learning_question_sets } = await getQuestionsList();

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
            title: "Exam Management",
            icon: ELearnExamIcon,
            active: true,
          },
        ]}
      />
      <ImageFormProvider>
        <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Exam Management
            </h2>
          </div>
          <div className="flex sm:flex-1 items-center justify-between flex-wrap gap-2">
            <Suspense fallback={<div>Loading</div>}>
              <SearchForm />
            </Suspense>
            <AddButton
              videos={learning_videos}
              questions={learning_question_sets}
            />
          </div>

          <div className="flex sm:flex-1 items-center flex-wrap gap-2">
            <Draggable
              learning_modules={learning_modules}
              videos={learning_videos}
              questions={learning_question_sets}
              page={page}
              limit={limit}
              searchParams={{
                status: searchParams.status,
                search: searchParams.search,
              }}
            />
            <ImageForm />
          </div>
        </section>
      </ImageFormProvider>
    </>
  );
}
