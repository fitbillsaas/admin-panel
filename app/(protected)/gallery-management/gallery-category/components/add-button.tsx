"use client";
import Tooltip from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import { BiPlus } from "react-icons/bi";
import { useYoutubeForm } from "./category-form";
export default function AddButton() {
  const { openForm } = useYoutubeForm();

  return (
    <Tooltip content="Add Gallery Category">
      <Button variant="outline" size="icon" onClick={() => openForm(null)}>
        <BiPlus className="h-4 w-4" />
      </Button>
    </Tooltip>
  );
}
