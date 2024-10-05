"use client";

import { cn } from "@/lib/utils";
import JsFileDownloader, { OptionalParams } from "js-file-downloader";
import { HTMLAttributes, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { FaDownload } from "react-icons/fa";

interface DownloadProps extends HTMLAttributes<HTMLButtonElement> {
  url: string;
  filename?: string;
}

export const downloadFile = (props: OptionalParams & { url: string }) =>
  new JsFileDownloader(props);

export default function Download({
  url,
  filename,
  className,
  ...props
}: DownloadProps) {
  const [isLoading, setIsLoading] = useState(false);
  function onDownloadClickHandler() {
    setIsLoading(true);
    downloadFile({ url, filename })
      .then(function () {
        setIsLoading(false);
      })
      .catch(function () {
        setIsLoading(false);
      });
  }

  return (
    <button
      className={cn("flex gap-1 items-center", className)}
      onClick={onDownloadClickHandler}
      disabled={isLoading}
      {...props}
    >
      <span>{filename}</span>{" "}
      {isLoading ? <BiLoaderAlt className="animate-spin" /> : <FaDownload />}
    </button>
  );
}
