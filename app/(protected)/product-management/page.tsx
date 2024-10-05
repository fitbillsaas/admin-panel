import { Breadcrumb } from "@/components/breadcrumb";
import Pagination from "@/components/pagination";
import SortableCell from "@/components/sortable-cell";
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
import {
  formatDate,
  truncateString,
  truncateToTwoDecimalPlaces,
} from "@/lib/utils";
import { Category } from "@/models/category";
import { Product } from "@/models/product";
import { DashboardIcon } from "@radix-ui/react-icons";
import { addDays, formatISO } from "date-fns";
import { Metadata } from "next";
import Link from "next/link";
import { BiPlus } from "react-icons/bi";
import { LuArchive } from "react-icons/lu";
import { Actions } from "./components/actions";
import ExportExcel from "./components/export-excel";
import { FeaturedActions } from "./components/featured-actions";
import SearchForm from "./components/search-form";
export const metadata: Metadata = {
  title: "Product Management",
  description: "Products",
};

export interface CustomSearchParams extends SearchParams {
  product_category: string;
  status: string;
  from: string;
  to: string;
}

interface CustomListOptions extends ListOptions {
  product_category: string | null;
  status: string | null;
  from: string | null;
  to: string | null;
}

async function getListWithCount(
  options: CustomListOptions,
): Promise<{ products: Product[]; count: number; queryParams: QueryParams }> {
  try {
    const where: any = {};

    if (options.product_category) {
      where.product_category = options.product_category;
    }

    if (options.status) {
      where.status = options.status;
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
      populate: ["productCategory"],
      where,
      sort,
    };
    const { data, error } = await API.GetAll("products", queryParams);

    if (error) throw error;

    return { ...data, queryParams };
  } catch (error) {
    return { products: [], count: 0, queryParams: {} };
  }
}

async function getProductCategories(): Promise<{
  product_categories: Category[];
}> {
  const { data, error } = await API.GetAll("product_category", {
    limit: -1,
    where: {
      active: true,
      status: "Y",
    },
    select: ["id", "category_name"],
    sort: [["category_name", "asc"]],
  });
  if (error) return { product_categories: [] };
  return data;
}
export default async function ProductManagement({
  searchParams,
}: {
  searchParams: CustomSearchParams;
}) {
  const limit = 10;
  const page = +searchParams.page || 1;
  const offset = page * limit - limit;

  const [{ product_categories }] = await Promise.all([getProductCategories()]);
  const { products, count, queryParams } = await getListWithCount({
    offset,
    limit,
    product_category: searchParams.product_category,
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
            title: "Product Management",
            icon: LuArchive,
            active: true,
          },
        ]}
      />
      <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Product Management
          </h2>
        </div>
        <div className="flex sm:flex-1 items-center justify-between flex-wrap gap-2">
          <SearchForm product_categories={product_categories} />
          <div className="flex gap-2">
            <ExportExcel queryParams={queryParams} />
            <Link href="/product-management/create" passHref>
              <Tooltip content="Add Product">
                <Button variant="outline" size="icon">
                  <BiPlus className="h-4 w-4" />
                </Button>
              </Tooltip>
            </Link>
          </div>
        </div>

        <div className="flex sm:flex-1 items-center flex-wrap gap-2">
          <Table className="listing-table">
            <TableHeader>
              <TableRow>
                <TableHead>Sl. No</TableHead>
                <TableHead>
                  <SortableCell title="Product Name" field="product_name" />
                </TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Wholesale Price</TableHead>

                <TableHead>Category Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Featured</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((item, index) => {
                return (
                  <TableRow key={`list_${index}`}>
                    <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                    <TableCell>{item.product_name}</TableCell>
                    <TableCell>
                      ${truncateToTwoDecimalPlaces(item.product_price)}
                    </TableCell>
                    <TableCell>
                      ${truncateToTwoDecimalPlaces(item.wholesale_price)}
                    </TableCell>

                    <TableCell>
                      {item?.productCategory?.category_name}
                    </TableCell>
                    <TableCell className="max-w-[200px] break-words">
                      {truncateString(item.product_description)}
                    </TableCell>
                    <TableCell>{formatDate(item.created_at)}</TableCell>
                    <TableCell>
                      {item.status == "Y" ? "Active" : "Inactive"}
                    </TableCell>
                    <TableCell className="flex justify-center">
                      <FeaturedActions item={item} />
                    </TableCell>
                    <TableCell>
                      <Actions item={item} totalItems={products?.length} />
                    </TableCell>
                  </TableRow>
                );
              })}
              {!products.length && (
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
        </div>
      </section>
    </>
  );
}
