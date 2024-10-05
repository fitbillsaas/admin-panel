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
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { usePasswordForm } from "./change-password";

export function Actions({
  item,
  // totalItems,
}: {
  item: any;
  // totalItems: number;
}) {
  const { deleteFn, setOptions } = useContext(DeleteContext);
  const { toast } = useToast();
  const router = useRouter();
  // const searchParams = useSearchParams();
  // const pathname = usePathname();
  const { openForm } = usePasswordForm();

  async function statusUpdate(item: any) {
    const payload = {
      active: item?.active == false ? true : false,
    };
    const res = await API.UpdateById("user", item?.id, payload);
    if (!!res.data) {
      if (res?.data?.user?.active == false) {
        toast({
          ...toastErrorMessage,
          description: "Deactivated Successfully",
        });
      } else {
        toast({
          ...toastSuccessMessage,
          description: "Activated Successfully",
        });
      }
    } else {
      toast({
        description: res?.error,
      });
      return;
    }
    item.active = item?.active == false ? true : false;
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

  async function handleInactivate() {
    if (item?.active === false) {
      // If item is already inactive, just update it
      await statusUpdate(item);
    } else {
      // Fetch the customer count and use it directly
      const res = await API.GetAll("user/assigned-customers-count", {
        where: { dispenser_id: item?.id },
      });

      if (res?.data) {
        const count = res.data.count;
        if (count > 0) {
          // Set options with the fetched customer count
          setOptions({
            message: "Are you sure you want to inactivate this dispenser?",
            description: `${count} Customers are associated with this dispenser. Are you sure you want to make the dispenser inactive?`,
          });
          deleteFn(() => statusUpdate(item));
        } else {
          // No customers associated, can safely inactivate
          await statusUpdate(item);
        }
      } else {
        toast({
          description: res?.error,
        });
      }
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
          <DropdownMenuItem asChild>
            <Link href={`/dispenser-management/update/${item.id}`}>Edit</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              openForm(item);
            }}
          >
            Change Password
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleInactivate}>
            {item?.active === false ? "Activate" : "Inactivate"}
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
