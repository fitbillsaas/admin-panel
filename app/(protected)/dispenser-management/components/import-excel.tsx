"use client";
import Tooltip from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { toastErrorMessage } from "@/lib/constant";
import { API } from "@/lib/fetch";
import { useRef, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { FaFileUpload } from "react-icons/fa";
import { useImportStatusSheet } from "./import-status-sheet";
export default function ImportExcel() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const inputFile = useRef<HTMLInputElement | null>(null);
  const { openSheet } = useImportStatusSheet();
  async function onImportHandler(event: any) {
    event.preventDefault();
    setIsLoading(true);
    const file = event.target.files[0];
    if (inputFile?.current) {
      inputFile.current.value = "";
    }
    const allowedExtensions = /(\.csv)$/i;
    if (file) {
      if (!allowedExtensions.exec(file?.name)) {
        toast({
          ...toastErrorMessage,
          description: "Only CSV files are allowed.",
        });
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("csv_file", file);
      const { error, data, message } = await API.Post(
        "user/import/dispenser",
        formData,
        undefined,
        {
          isMultipart: true,
        },
      );
      setIsLoading(false);

      if (!!error) {
        toast({
          ...toastErrorMessage,
          description: message,
        });

        return;
      }
      openSheet(data);
    }
  }

  return (
    <Tooltip content="Import">
      <div className="relative inline-block cursor-pointer">
        <Button variant="outline" size="icon" className="cursor-pointer">
          {isLoading ? (
            <BiLoaderAlt className="animate-spin" />
          ) : (
            <FaFileUpload />
          )}
          <input
            ref={inputFile}
            type="file"
            id="fileInput"
            title=""
            className="absolute right-0 left-0 opacity-0 cursor-pointer"
            onChange={onImportHandler}
          />
        </Button>
      </div>
    </Tooltip>
  );
}
