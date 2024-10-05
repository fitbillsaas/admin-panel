"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/constant";
import { API } from "@/lib/fetch";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useReviewForm } from "./review-form";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { useContext } from "react";

export function Actions({
  item,
  // totalItems,
}: {
  item: any;
  totalItems: number;
}) {
  // const { deleteFn, setOptions } = useContext(DeleteContext);
  const { toast } = useToast();
  const router = useRouter();
  const { openForm } = useReviewForm();
  // const searchParams = useSearchParams();
  // const pathname = usePathname();

  async function statusUpdate(item: any) {
    const payload = {
      status: item?.status == "Offensive" ? "Approved" : "Offensive",
    };
    const res = await API.UpdateById("product_review", item?.id, payload);
    if (!!res.data) {
      if (res?.data?.product_review?.status == "Approved") {
        toast({
          ...toastSuccessMessage,
          description: "Review Approved Succesfully",
        });
      } else if (res?.data?.product_review?.status == "Offensive") {
        toast({
          ...toastErrorMessage,
          description: "Review marked as offensive Successfully",
        });
      }
    } else {
      toast({
        description: res?.error,
      });
      return;
    }
    // item.status = item?.active == false ? true : false;
    router.refresh();
  }

  // async function deleteCustomer(customer: User) {
  //   const { error, message } = await API.DeleteById("user", customer?.id);
  //   if (!!error) {
  //     toast({
  //       ...toastErrorMessage,
  //       description: message,
  //     });
  //     return;
  //   }

  //   toast({
  //     ...toastSuccessMessage,
  //     description: "Dispenser deleted successfully",
  //   });
  //   if (totalItems > 1) {
  //     router.refresh();
  //   } else {
  //     const params = new URLSearchParams(Array.from(searchParams.entries()));
  //     const page = parseFloat(searchParams.get("page") ?? "0");
  //     params.set("page", page > 1 ? (page - 1).toString() : "1");
  //     router.replace(pathname + "?" + params.toString());
  //   }
  // }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => openForm(item)}>
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => statusUpdate(item)}>
            {item?.status == "Approved" ? "Offensive" : "Approve"}
          </DropdownMenuItem>
          {/* <DropdownMenuItem
            onClick={() => {
              setOptions({
                message: "Are you sure, you want to delete this dispenser?",
                description:
                  "Are you sure you want to delete this dispenser? This action cannot be reversed.",
              });
              deleteFn(() => deleteCustomer(item));
            }}
          >
            Delete
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
