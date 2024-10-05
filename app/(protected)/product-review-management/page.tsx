import { Breadcrumb } from "@/components/breadcrumb";
import { DateTimePipe } from "@/components/date-pipe";
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
import { truncateString } from "@/lib/utils";
import { ProductReviews } from "@/models/product-review";
import { DashboardIcon } from "@radix-ui/react-icons";
import { addDays, formatISO } from "date-fns";
import { Metadata } from "next";
import { MdOutlineRateReview } from "react-icons/md";
import { Actions } from "./components/actions";
import ReviewForm, { ReviewFormProvider } from "./components/review-form";
import SearchForm from "./components/search-form";
export const metadata: Metadata = {
  title: "Ratings & Reviews",
  description: "Ratings & Reviews of products",
};

export interface CustomSearchParams extends SearchParams {
  status: string;
  from: string;
  to: string;
}

interface CustomListOptions extends ListOptions {
  status: string | null;
  from: string | null;
  to: string | null;
}

interface CustomWhere {
  status?: string | null;
  deleted_at?: any | null;
  created_at?: {
    $gte?: string | null;
    $lt?: string | null;
  };
}

async function getListWithCount(options: CustomListOptions): Promise<{
  product_reviews: ProductReviews[];
  count: number;
  queryParams: QueryParams;
}> {
  try {
    const where: CustomWhere = {};
    if (options.status == "Approved") {
      where.status = "Approved";
    } else if (options.status == "Offensive") {
      where.status = "Offensive";
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
      populate: ["product", "user"],
      sort,
    };
    const { data, error } = await API.GetAll("product_review", queryParams);
    if (error) throw error;
    return { ...data, queryParams };
  } catch (error) {
    return { product_reviews: [], count: 0, queryParams: {} };
  }
}

export default async function ProductReviewManagement({
  searchParams,
}: {
  searchParams: CustomSearchParams;
}) {
  const limit = 10;
  const page = +searchParams.page || 1;
  const offset = page * limit - limit;
  const { product_reviews, count } = await getListWithCount({
    offset,
    limit,
    status: searchParams.status,
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
            title: "Ratings and Reviews",
            icon: MdOutlineRateReview,
            active: true,
          },
        ]}
      />
      <ReviewFormProvider>
        <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Ratings and Reviews
            </h2>
          </div>
          <div className="flex sm:flex-1 items-center justify-between flex-wrap gap-2">
            <SearchForm />
          </div>

          <div className="flex sm:flex-1 items-center flex-wrap gap-2">
            <Table className="listing-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Sl. No</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Rating </TableHead>
                  <TableHead>Review </TableHead>
                  <TableHead>Posted On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product_reviews.map((item, index) => {
                  return (
                    <TableRow key={`list_${index}`}>
                      <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell>{item?.product?.product_name}</TableCell>
                      <TableCell>{item?.user?.name}</TableCell>
                      <TableCell>{item?.rating}</TableCell>
                      <TableCell className="max-w-[200px] break-words">
                        {truncateString(item.review)}
                      </TableCell>
                      <TableCell>
                        <DateTimePipe date={item.created_at} />
                      </TableCell>
                      <TableCell>
                        {item.status == "Approved" ? "Approved" : "Offensive"}
                      </TableCell>
                      <TableCell>
                        <Actions
                          item={item}
                          totalItems={product_reviews?.length}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!product_reviews.length && (
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
        <ReviewForm />
      </ReviewFormProvider>
    </>
  );
}
