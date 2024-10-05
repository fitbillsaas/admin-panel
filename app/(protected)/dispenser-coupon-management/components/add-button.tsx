"use client";
import Tooltip from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import { User } from "@/models/user";
import { BiPlus } from "react-icons/bi";
import { useCouponForm } from "./coupon-create-form";
export default function AddButton({ dispensers }: { dispensers: User[] }) {
  const { openForm } = useCouponForm();
  return (
    <Tooltip content="Add Coupon">
      <Button
        variant="outline"
        size="icon"
        onClick={() => openForm(dispensers)}
      >
        <BiPlus className="h-4 w-4" />
      </Button>
    </Tooltip>
  );
}
