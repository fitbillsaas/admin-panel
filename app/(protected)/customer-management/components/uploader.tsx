/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { toastErrorMessage } from "@/lib/constant";
import { toBase64 } from "@/lib/utils";
import UserImage from "@/public/images/logos/prof.svg";
import { forwardRef, useRef, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { MdDeleteOutline } from "react-icons/md";
import { RiImageEditLine } from "react-icons/ri";
export interface UploaderRef {
  upload: () => Promise<{
    error: any;
    message?: string;
    validationErrors?: any[];
    files?: any[];
  }>;
}
export interface UploadFile {
  uploaded: boolean;
  data: {
    file: any;
    dataUrl: string;
  };
}

const Uploader = forwardRef(
  ({
    extensions,
    field,
    attachments,
  }: {
    id: string;
    multiple?: boolean;
    extensions?: string[];
    className?: string;
    placeholder?: string;
    field?: ControllerRenderProps<any, any>;
    attachments?: any[];
    type?: string;
    fileLength?: number;
    customer_image?: any;
  }) => {
    const { toast } = useToast();

    const inputRef = useRef<any>(null);
    const [files, setFiles] = useState<UploadFile[]>(
      (attachments ?? []).map((attachment) => ({
        uploaded: true,
        isDeleted: false,
        data: {
          file: attachment,
          dataUrl: `${attachment}`,
        },
      })),
    );

    async function handleChange(e: any) {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        for (let index = 0; index < e.target.files.length; index++) {
          const file = e.target.files[index];
          const maxSize = 5 * 1024 * 1024;
          const ext = file.name.split(".").pop();
          if (extensions && (!ext || !extensions.includes(`.${ext}`))) {
            toast({
              ...toastErrorMessage,
              description: "Invalid file extension",
            });
            return false;
          }
          if (file && file.size > maxSize) {
            toast({
              ...toastErrorMessage,
              description:
                "File size exceeds 5MB. Please select a smaller file.",
            });
            return false;
          }
          const image = new Image();
          image.src = URL.createObjectURL(file);
          await new Promise((resolve) => {
            image.onload = resolve;
          });
          if (image.width !== 512 || image.height !== 512) {
            toast({
              ...toastErrorMessage,
              description: "File dimensions must be 512x512.",
            });
            return false;
          }
        }
        const dataUrl = await toBase64(e.target.files[0]);
        const f = [
          {
            uploaded: false,
            data: {
              file: e.target.files[0],
              dataUrl,
            },
          },
        ];
        setFiles(f);
        if (field) {
          field.onChange(f);
        }

        inputRef.current.value = null;
      }
    }

    function removeFile() {
      setFiles([]);
      if (field) {
        field.onChange([]);
      }
    }
    return (
      <div className="rounded flex justify-center">
        <div className="relative">
          <img
            src={files?.length > 0 ? files[0]?.data?.dataUrl : UserImage.src}
            alt="gallery-photo"
            className="object-center border rounded-full mb-3 p-1 mt-3 h-[200px] w-[200px]"
          />

          <div className="absolute inset-0 flex items-center justify-center z-20 gap-2 opacity-0 hover:opacity-100">
            <div>
              <input
                type="file"
                title=""
                ref={inputRef}
                onChange={handleChange}
                accept={extensions ? extensions.join(",") : undefined}
                className="absolute h-0 w-0 opacity-0 invisible pointer-events-none"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer hover:bg-hover"
                onClick={() => inputRef.current.click()}
              >
                <RiImageEditLine className="h-6 w-6" />
              </Button>
            </div>
            {!!files?.length && (
              <div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer hover:bg-hover"
                  onClick={() => removeFile()}
                >
                  <MdDeleteOutline className="h-6 w-6" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

Uploader.displayName = "Uploader";
export default Uploader;
