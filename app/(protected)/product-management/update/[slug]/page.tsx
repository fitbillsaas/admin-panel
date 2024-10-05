import { Breadcrumb } from "@/components/breadcrumb";
import { getProductCategories } from "@/lib/data";
import { API, ApiResponse } from "@/lib/fetch";
import { DashboardIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { notFound } from "next/navigation";
import { LuArchive } from "react-icons/lu";
import SpecificationForm, {
  SpecificationFormProvider,
} from "../../components/ingredient-form";
import ProductForm from "../../components/product-form";

const getDetailsBySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<ApiResponse> => {
  const res = await API.Find("products", {
    where: { slug },
    populate: ["productCategory", "productGallery", "productSpecifications"],
  });

  return res;
};

export default async function UpdateProduct({
  params,
}: {
  params: { slug: string };
}) {
  const { product_categories } = await getProductCategories();
  const { error, data, statusCode } = await getDetailsBySlug({
    slug: params.slug,
  });
  if (error && statusCode === 404) {
    return notFound();
  }
  return (
    <>
      <Breadcrumb
        breadcrumbs={[
          {
            title: "Dashboard",
            link: "/",
            icon: DashboardIcon,
          },
          {
            title: "Product management",
            link: "/product-management",
            icon: LuArchive,
          },
          {
            title: "Update product",
            icon: Pencil1Icon,
            active: true,
          },
        ]}
      />
      <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Update product</h2>
        </div>
        <div className="flex sm:flex-1 items-center flex-wrap gap-2">
          <SpecificationFormProvider>
            <ProductForm
              product_categories={product_categories}
              product={data?.products}
            />
            <SpecificationForm />
          </SpecificationFormProvider>
        </div>
      </section>
    </>
  );
}
