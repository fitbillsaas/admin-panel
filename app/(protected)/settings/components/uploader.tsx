/* eslint-disable @next/next/no-img-element */
"use client";

import Tooltip from "@/components/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { toastErrorMessage } from "@/lib/constant";
import { toBase64 } from "@/lib/utils";
import { forwardRef, useRef, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { LuFileEdit } from "react-icons/lu";
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
    customer_image,
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
          // if (image.width !== 512 || image.height !== 512) {
          //   toast({
          //     ...toastErrorMessage,
          //     description: "File dimensions must be 512x512.",
          //   });
          //   return false;
          // }
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

    return (
      <>
        <div className="rounded flex justify-center">
          <div style={{ position: "relative", borderRadius: "50%" }}>
            <input
              type="file"
              title=""
              ref={inputRef}
              onChange={handleChange}
              accept={extensions ? extensions.join(",") : undefined}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                opacity: 0,
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            />
            <div style={{ position: "relative" }}>
              <img
                src={
                  files?.length > 0
                    ? files[0]?.data?.dataUrl
                    : customer_image?.src
                      ? customer_image.src
                      : customer_image
                }
                alt="gallery-photo"
                className="object-center border rounded-full mb-3  h-[100px] w-[100px]"
              />
              <div
                onClick={() => inputRef.current.click()}
                style={{
                  cursor: "pointer",
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "black",
                }}
              >
                <Tooltip content="Edit image">
                  <LuFileEdit className="h-6 w-6" />
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
);

Uploader.displayName = "Uploader";
export default Uploader;
