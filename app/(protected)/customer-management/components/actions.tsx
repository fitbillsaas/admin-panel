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
import { User } from "@/models/user";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useChangeDispenserForm } from "./change-dispenser";
import { usePasswordForm } from "./change-password";

export function Actions({
  item,
  // totalItems,
  dispensers,
}: {
  item: any;
  // totalItems: number;
  dispensers: User[];
}) {
  // const { deleteFn, setOptions } = useContext(DeleteContext);
  const { toast } = useToast();
  const router = useRouter();
  // const searchParams = useSearchParams();
  // const pathname = usePathname();
  const { openForm } = usePasswordForm();
  const { openForm: openDispenserForm } = useChangeDispenserForm();

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
  //     description: "Customer successfully deleted",
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
          <DropdownMenuItem asChild>
            <Link href={`/customer-management/update/${item.id}`}>Edit</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              openForm(item);
            }}
          >
            Change Password
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => statusUpdate(item)}>
            {item?.active == false ? "Activate" : "Inactivate"}
          </DropdownMenuItem>
          {/* <DropdownMenuItem
            onClick={() => {
              setOptions({
                message: "Are you sure, you want to delete this customer?",
                description:
                  "Are you sure you want to delete this customer? This action cannot be reversed.",
              });
              deleteFn(() => deleteCustomer(item));
            }}
          >
            Delete
          </DropdownMenuItem> */}
          <DropdownMenuItem
            onClick={() => {
              openDispenserForm(item, dispensers);
            }}
          >
            Assign a Dispenser
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
