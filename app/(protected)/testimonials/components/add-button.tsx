"use client";
import Tooltip from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import { BiPlus } from "react-icons/bi";
import { useTestimonialForm } from "./testimonial-form";
export default function AddButton() {
  const { openForm } = useTestimonialForm();
  return (
    <Tooltip content="Add Testimonial">
      <Button variant="outline" size="icon" onClick={() => openForm(null)}>
        <BiPlus className="h-4 w-4" />
      </Button>
    </Tooltip>
  );
}
