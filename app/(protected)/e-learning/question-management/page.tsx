import { Breadcrumb } from "@/components/breadcrumb";
import { DateTimePipe } from "@/components/date-pipe";
import { ELearnQuestionIcon } from "@/components/icon";
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
import { API } from "@/lib/fetch";
import { LearningQuestionSet } from "@/models/learning-question-set";
import { DashboardIcon } from "@radix-ui/react-icons";
import { addDays, formatISO } from "date-fns";
import { Suspense } from "react";
import { Actions } from "./components/actions";
import AddButton from "./components/add-button";
import QuestionForm, {
  QuestionFormProvider,
} from "./components/question-set-form";
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
): Promise<{ learning_question_sets: LearningQuestionSet[]; count: number }> {
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
    const { data, error } = await API.GetAll(
      "learning_question_set",
      queryParams,
    );
    if (error) throw error;
    return data;
  } catch (error) {
    return { learning_question_sets: [], count: 0 };
  }
}

export default async function QuestionManagement({
  searchParams,
}: {
  searchParams: CustomSearchParams;
}) {
  const limit = 10;
  const page = +searchParams.page || 1;
  const offset = page * limit - limit;
  const { learning_question_sets, count } = await getListWithCount({
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
            title: "Question Management",
            icon: ELearnQuestionIcon,
            active: true,
          },
        ]}
      />
      <QuestionFormProvider>
        <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Question management
            </h2>
          </div>
          <div className="flex sm:flex-1 items-center justify-between flex-wrap gap-2">
            <Suspense fallback={<div>Loading</div>}>
              <SearchForm />
            </Suspense>
            <AddButton />
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
                {learning_question_sets.map((item, index) => {
                  return (
                    <TableRow key={`list_${index}`}>
                      <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell>{item?.title}</TableCell>
                      <TableCell>
                        {" "}
                        <DateTimePipe date={item.created_at} />
                      </TableCell>
                      <TableCell>
                        {!!item.active ? "Active" : "Inactive"}
                      </TableCell>
                      <TableCell>
                        {" "}
                        <Actions
                          item={item}
                          // totalItems={learning_question_sets?.length}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!learning_question_sets.length && (
                  <TableRow>
                    <TableCell className="text-center" colSpan={9}>
                      No question set found
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
          <QuestionForm />
        </section>
      </QuestionFormProvider>
    </>
  );
}
