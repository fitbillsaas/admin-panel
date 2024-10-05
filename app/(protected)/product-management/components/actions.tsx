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
import { toastSuccessMessage, toastErrorMessage } from "@/lib/constant";
import { API } from "@/lib/fetch";
import { Product } from "@/models/product";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useContext } from "react";

export function Actions({
  item,
  totalItems,
}: {
  item: Product;
  totalItems: number;
}) {
  const { deleteFn, setOptions } = useContext(DeleteContext);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  async function statusUpdate(item: Product) {
    const payload = {
      status: item?.status == "N" ? "Y" : "N",
    };
    const res = await API.UpdateById("products", item?.id, payload);
    if (!!res.data) {
      if (res?.data?.products?.status == "N") {
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
    item.status = item?.status == "N" ? "Y" : "N";
    router.refresh();
  }

  async function deleteProduct(product: Product) {
    const { error, message } = await API.DeleteById("products", product?.id);
    if (!!error) {
      toast({
        ...toastErrorMessage,
        description: message,
      });
      return;
    }

    toast({
      ...toastSuccessMessage,
      description: "Product successfully deleted",
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
          <DropdownMenuItem asChild>
            <Link href={`/product-management/update/${item.slug}`}>Edit</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => statusUpdate(item)}>
            {item?.status == "N" ? "Activate" : "Inactivate"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setOptions({
                message: "Are you sure, you want to delete this product?",
                description:
                  "Are you sure you want to delete this product? This action cannot be reversed.",
              });
              deleteFn(() => deleteProduct(item));
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
