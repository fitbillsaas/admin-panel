"use client";

import Tooltip from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import { useStatusForm } from "./status-modal";
function ActionStatus({
  orderStatus,
  orderId,
}: {
  orderStatus: string;
  orderId: number;
}) {
  const { openForm } = useStatusForm();
  return (
    <div>
      <Tooltip content="Change Status">
        <Button
          variant="outline"
          className="px-[30px] py-[10px] bg-[#E2F2ED] rounded-[45px] text-[#28D0B0]"
          size="default"
          onClick={() => openForm(orderStatus, orderId)}
        >
          {orderStatus}
        </Button>
      </Tooltip>
    </div>
  );
}

export default ActionStatus;
