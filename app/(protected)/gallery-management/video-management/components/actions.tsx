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
import clearDataCache from "@/lib/reset-data";
import { Cat } from "@/models/cat";
import { Image } from "@/models/image";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useContext } from "react";
import { useImageForm } from "./video-form";

export function Actions({
  item,
  totalItems,
  categories,
}: {
  item: Image;
  totalItems: number;
  categories: Cat[];
}) {
  const { deleteFn, setOptions } = useContext(DeleteContext);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { openForm } = useImageForm();

  async function statusUpdate(item: Image) {
    const payload = {
      active: item?.active == false ? true : false,
    };
    const { error, message, data } = await API.UpdateById(
      "gallery",
      item?.id,
      payload,
    );
    if (error) {
      toast({
        ...toastErrorMessage,
        description: message,
      });
      return;
    }

    if (!!data) {
      if (data?.gallery?.active == false) {
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

      item.active = data?.product_category?.status;
    }
    await clearDataCache("galleries");
    router.refresh();
  }

  async function deleteCategory(image: Image) {
    const { error, message } = await API.DeleteById("gallery", image?.id);
    if (!!error) {
      toast({
        ...toastErrorMessage,
        description: message,
      });
      return;
    }

    toast({
      ...toastSuccessMessage,
      description: "Video Deleted Successfully",
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
        <DropdownMenuItem
          onClick={() => {
            openForm(categories, item);
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => statusUpdate(item)}>
          {item?.active == false ? "Activate" : "Inactivate"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setOptions({
              message: "Are you sure, you want to delete this video?",
              description:
                "Are you sure you want to delete this video? This action cannot be reversed.",
            });
            deleteFn(() => deleteCategory(item));
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
