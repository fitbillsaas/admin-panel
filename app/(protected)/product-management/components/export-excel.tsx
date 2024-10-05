"use client";

import { downloadFile } from "@/components/download";
import Tooltip from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { toastErrorMessage } from "@/lib/constant";
import { API, QueryParams } from "@/lib/fetch";
import { useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { FaDownload } from "react-icons/fa";
export default function ExportExcel({
  queryParams,
}: {
  queryParams: QueryParams;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // set browser timezone
  queryParams.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  async function onExportHandler() {
    setIsLoading(true);
    const { data, error, message } = await API.GetAll(
      "products/export-xls",
      queryParams,
    );
    if (error) {
      toast({
        ...toastErrorMessage,
        description: message,
      });
      setIsLoading(false);
      return;
    }
    if (!data.isData) {
      toast({
        ...toastErrorMessage,
        description: "No data found",
      });
      setIsLoading(false);
      return;
    }
    downloadFile({ url: data.url, filename: data.filename })
      .then(function () {
        setIsLoading(false);
      })
      .catch(function () {
        setIsLoading(false);
      });
  }

  return (
    <Tooltip content="Export">
      <Button variant="outline" size="icon" onClick={onExportHandler}>
        {isLoading ? <BiLoaderAlt className="animate-spin" /> : <FaDownload />}
      </Button>
    </Tooltip>
  );
}
