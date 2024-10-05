import { Breadcrumb } from "@/components/breadcrumb";
import { getProductCategories } from "@/lib/data";
import { DashboardIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { LuArchive } from "react-icons/lu";
import SpecificationForm, {
  SpecificationFormProvider,
} from "../components/ingredient-form";
import ProductForm from "../components/product-form";

export default async function AddProduct() {
  const { product_categories } = await getProductCategories();
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
            title: "Create a new product",
            icon: PlusCircledIcon,
            active: true,
          },
        ]}
      />
      <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Create a new product
          </h2>
        </div>
        <div className="flex sm:flex-1 items-center flex-wrap gap-2">
          <SpecificationFormProvider>
            <ProductForm product_categories={product_categories} />
            <SpecificationForm />
          </SpecificationFormProvider>
        </div>
      </section>
    </>
  );
}
