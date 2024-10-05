"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { toastSuccessMessage, toastErrorMessage } from "@/lib/constant";
import { API } from "@/lib/fetch";
import { Template } from "@/models/template";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function EditAction({ item }: { item: Template }) {
  const { toast } = useToast();
  const router = useRouter();
  async function statusUpdate(item: Template) {
    const payload = {
      active: !!item?.active ? false : true,
    };
    const res = await API.UpdateById("template", item?.id, payload);
    if (!!res.data) {
      if (res?.data?.template?.active == false) {
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
            <Link href={`/email-template/${item.name}`}>Edit</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => statusUpdate(item)}>
            {item?.active ? "Inactivate" : "Activate"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
