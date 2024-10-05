import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import Link from "next/link";
import { IconType } from "react-icons/lib";
import { Separator } from "./ui/separator";

interface BreadcrumbProps {
  title: string;
  link?: string;
  active?: boolean;
  icon?:
    | React.ForwardRefExoticComponent<
        IconProps & React.RefAttributes<SVGSVGElement>
      >
    | IconType
    | any;
}
interface BreadcrumbComponentProps {
  breadcrumbs: BreadcrumbProps[];
}
export function Breadcrumb({ breadcrumbs }: BreadcrumbComponentProps) {
  return (
    <>
      <Separator />
      <div className="flex items-center px-4 py-2 shadow-lg">
        <ScrollArea>
          {breadcrumbs.length && (
            <ol
              className="flex items-center whitespace-nowrap"
              aria-label="Breadcrumb"
            >
              {breadcrumbs?.map((breadcrumb, index) => {
                return breadcrumb.active ? (
                  <li
                    className="inline-flex items-center text-sm font-semibold text-gray-800 truncate dark:text-gray-200"
                    aria-current="page"
                    key={`breadcrumb-${index}`}
                  >
                    {breadcrumb.icon && (
                      <breadcrumb.icon className="flex-shrink-0 me-3 h-4 w-4" />
                    )}
                    {breadcrumb.title}
                  </li>
                ) : (
                  <li
                    className="inline-flex items-center"
                    key={`breadcrumb-${index}`}
                  >
                    <Link
                      className="flex items-center text-sm text-gray-500 hover:text-primary focus:outline-none focus:text-primary dark:focus:text-primary"
                      href={breadcrumb.link || "#"}
                    >
                      {breadcrumb.icon && (
                        <breadcrumb.icon className="flex-shrink-0 me-3 h-4 w-4" />
                      )}
                      {breadcrumb.title}
                      <ChevronRightIcon className="flex-shrink-0 mx-2 overflow-visible h-4 w-4 text-gray-400 dark:text-neutral-600" />
                    </Link>
                  </li>
                );
              })}
            </ol>
          )}

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
}
