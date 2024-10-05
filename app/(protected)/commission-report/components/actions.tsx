"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { toastSuccessMessage } from "@/lib/constant";
import { API } from "@/lib/fetch";
import { Commission } from "@/models/commission";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Actions({ item }: { item: Commission }) {
  const { toast } = useToast();
  const router = useRouter();
  async function statusUpdate(item: Commission, status: string) {
    const payload = {
      status: status,
    };
    const res = await API.UpdateById("commission", item?.id, payload);
    if (!!res.data) {
      toast({
        ...toastSuccessMessage,
        description: "Status Updated Successfully",
      });
    } else {
      toast({
        description: res?.error,
      });
      return;
    }
    item.active = item?.active == false ? true : false;
    router.refresh();
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
            <Link href={`/commission-report/details/${item.uid}`}>View</Link>
          </DropdownMenuItem>
          {item?.status == "Pending" && (
            <>
              <DropdownMenuItem onClick={() => statusUpdate(item, "Paid")}>
                Pay
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => statusUpdate(item, "Cancelled")}>
                Cancel
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
