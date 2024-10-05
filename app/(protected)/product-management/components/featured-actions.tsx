"use client";
import Tooltip from "@/components/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/constant";
import { API } from "@/lib/fetch";
import { Product } from "@/models/product";
import { CheckCircledIcon, CircleBackslashIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export function FeaturedActions({ item }: { item: Product }) {
  const { toast } = useToast();
  const router = useRouter();

  async function featureStatusUpdate(item: Product) {
    const payload = {
      is_featured: item?.is_featured == "Y" ? "N" : "Y",
    };
    const res = await API.UpdateById("products", item?.id, payload);
    if (!!res.data) {
      if (res?.data?.products?.is_featured == "Y") {
        toast({
          ...toastSuccessMessage,
          description: "Product added to featured list",
        });
      } else {
        toast({
          ...toastErrorMessage,
          description: "Product removed from featured list",
        });
      }
    } else {
      toast({
        description: res?.error,
      });
      return;
    }
    item.is_featured = res?.data?.products?.is_featured;
    router.refresh();
  }

  return (
    <>
      {item.is_featured === "Y" ? (
        <Tooltip content="Featured">
          <CheckCircledIcon
            className="w-6 h-6 cursor-pointer text-green-500"
            onClick={() => {
              featureStatusUpdate(item);
            }}
          />
        </Tooltip>
      ) : (
        <Tooltip content="Non Featured">
          <CircleBackslashIcon
            className="w-6 h-6 cursor-pointer text-red-500"
            onClick={() => {
              featureStatusUpdate(item);
            }}
          />
        </Tooltip>
      )}
    </>
  );
}
