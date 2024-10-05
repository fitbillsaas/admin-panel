"use client";
import { DeleteContext } from "@/components/delete-provider";
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
import { User } from "@/models/user";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useContext } from "react";

export function Actions({
  item,
  totalItems,
}: {
  item: any;
  totalItems: number;
}) {
  const { deleteFn, setOptions } = useContext(DeleteContext);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  async function statusUpdate(item: any, status: string) {
    const payload = {
      status: status == "Approve" ? "Approve" : "Deny",
    };
    const res = await API.UpdateById("user", item?.id, payload);
    if (!!res.data) {
      if (res?.data?.user?.status == "Deny") {
        toast({
          ...toastErrorMessage,
          description: "Candidate Denied Successfully",
        });
      } else {
        toast({
          ...toastSuccessMessage,
          description: "Candidate Approved Successfully",
        });
      }
    } else {
      toast({
        description: res?.error,
      });
      return;
    }
    item.status = item?.status == "pending" ? "Approve" : "pending";
    router.refresh();
  }

  async function deleteCustomer(customer: User) {
    const { error, message } = await API.DeleteById("user", customer?.id);
    if (!!error) {
      toast({
        ...toastErrorMessage,
        description: message,
      });
      return;
    }

    toast({
      ...toastSuccessMessage,
      description: "Candidate Deleted Successfully",
    });
    if (totalItems > 1) {
      router.refresh();
    } else {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      const page = parseFloat(searchParams.get("page") ?? "0");
      params.set("page", page > 1 ? (page - 1).toString() : "1");
      router.replace(pathname + "?" + params.toString());
    }
  }

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
          {item?.status == "Pending" && (
            <>
              <DropdownMenuItem onClick={() => statusUpdate(item, "Approve")}>
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => statusUpdate(item, "Deny")}>
                Deny
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuItem
            onClick={() => {
              setOptions({
                message: "Are you sure, you want to delete this applicant?",
                description:
                  "Are you sure you want to delete this applicant? This action cannot be reversed.",
              });
              deleteFn(() => deleteCustomer(item));
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
