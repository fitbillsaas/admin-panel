import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRightIcon } from "@radix-ui/react-icons";

export default function Loading() {
  return (
    <>
      <Separator />
      <div className="flex items-center px-4 py-2 shadow-lg">
        <ol
          className="flex items-center whitespace-nowrap"
          aria-label="Breadcrumb"
        >
          <li className="inline-flex items-center ">
            <Skeleton className="w-20 mx-2 px-2 h-5" />
            <ChevronRightIcon className="flex-shrink-0 mx-2 overflow-visible h-4 w-4 text-gray-400 dark:text-neutral-600" />
          </li>
          <li className="inline-flex items-center ">
            <Skeleton className="w-20 mx-2 px-2 h-5" />
          </li>
        </ol>
      </div>
      <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            <Skeleton className="w-60 h-8" />
          </h2>
        </div>
        <div className="flex sm:flex-1 items-center justify-between flex-wrap gap-2">
          <div className="grid lg:flex flex-wrap gap-2">
            <Skeleton className="w-48 h-8" />
            <Skeleton className="w-48 h-8" />
            <Skeleton className="w-48 h-8" />
            <Skeleton className="w-20 h-8 rounded-md" />
            <Skeleton className="w-20 h-8 rounded-md" />
          </div>
        </div>
        <div className="flex sm:flex-1 items-center flex-wrap gap-2">
          <Skeleton className="w-full h-96" />
        </div>
      </section>
    </>
  );
}
