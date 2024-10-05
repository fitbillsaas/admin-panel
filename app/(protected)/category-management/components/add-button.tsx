"use client";
import Tooltip from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import { BiPlus } from "react-icons/bi";
import { useCategoryForm } from "./category-form";
export default function AddButton() {
  const { openForm } = useCategoryForm();

  return (
    <Tooltip content="Add Category">
      <Button variant="outline" size="icon" onClick={() => openForm(null)}>
        <BiPlus className="h-4 w-4" />
      </Button>
    </Tooltip>
  );
}
