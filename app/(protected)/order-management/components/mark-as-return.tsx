"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { toastSuccessMessage } from "@/lib/constant";
import { API } from "@/lib/fetch";
import { is15Days } from "@/lib/utils";
import { Orders } from "@/models/orders";
import { useRouter } from "next/navigation";

function MarkasReturn({
  order,
  item,
}: {
  order: Orders | undefined;
  item: any;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const isAfter15Days = is15Days(order?.current_status?.created_at, "P");
  async function markasReturned(item: any) {
    const res = await API.UpdateById("order_item", item?.id, {
      status: "Returned",
    });
    if (!!res.data) {
      toast({
        ...toastSuccessMessage,
        description: "Order marked Returned",
      });
    } else {
      toast({
        description: res?.error,
      });
      return;
    }
    router.refresh();
  }
  return (
    !isAfter15Days &&
    order?.current_status?.status === "Delivered" &&
    item?.status !== "Returned" && (
      <Button
        variant="return"
        size="default"
        onClick={() => {
          markasReturned(item);
        }}
      >
        Mark as Returned
      </Button>
    )
  );
}

export default MarkasReturn;
