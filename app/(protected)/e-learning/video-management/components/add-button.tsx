"use client";
import Tooltip from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import { BiPlus } from "react-icons/bi";
import { useImageForm } from "./video-form";
export default function AddButton() {
  const { openForm } = useImageForm();

  return (
    <Tooltip content="Add Video">
      <Button variant="outline" size="icon" onClick={() => openForm(null)}>
        <BiPlus className="h-4 w-4" />
      </Button>
    </Tooltip>
  );
}
