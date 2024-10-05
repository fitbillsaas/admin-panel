/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { toastErrorMessage } from "@/lib/constant";
import { cn, toBase64 } from "@/lib/utils";
import { forwardRef, useRef, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { MdDeleteOutline } from "react-icons/md";

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
  isDeleted: boolean;
  isPrimary: boolean;
  data: {
    file: any;
    dataUrl: string;
  };
}

const Uploader = forwardRef(
  ({
    id,
    multiple,
    extensions,
    className,
    placeholder,
    field,
    attachments,
    fileLength = 1,
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
  }) => {
    const { toast } = useToast();
    const [dragActive, setDragActive] = useState<boolean>(false);
    const inputRef = useRef<any>(null);
    const [files, setFiles] = useState<UploadFile[]>(
      (attachments ?? []).map((attachment) => ({
        uploaded: true,
        isDeleted: false,
        isPrimary: attachment.is_primary === "Y",
        data: {
          file: attachment,
          dataUrl: `${attachment.product_image}`,
        },
      })),
    );

    async function handleChange(e: any) {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        for (let index = 0; index < e.target.files.length; index++) {
          const file = e.target.files[index];
          const ext = file.name.split(".").pop();
          if (extensions && (!ext || !extensions.includes(`.${ext}`))) {
            toast({
              ...toastErrorMessage,
              description: "Invalid file extension",
            });
            return false;
          }
        }
        if (multiple) {
          const f = [...files];
          for (let index = 0; index < e.target.files.length; index++) {
            const isPrimary = !f.length;
            if (fileLength <= f.length) {
              toast({
                ...toastErrorMessage,
                description: `You can only upload a maximum of ${fileLength} files`,
              });
              return false;
            }
            const element = e.target.files[index];
            const dataUrl = await toBase64(element);
            f.push({
              uploaded: false,
              isDeleted: false,
              isPrimary,
              data: {
                file: element,
                dataUrl,
              },
            });
          }
          setFiles(f);
          if (field) {
            field.onChange(f);
          }
        } else {
          const dataUrl = await toBase64(e.target.files[0]);
          const f = [
            {
              uploaded: false,
              isDeleted: false,
              isPrimary: true,
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
        }
        inputRef.current.value = null;
      }
    }

    async function handleDrop(e: any) {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        for (let index = 0; index < e.dataTransfer.files.length; index++) {
          const file = e.dataTransfer.files[index];
          const ext = file.name.split(".").pop();
          if (extensions && (!ext || !extensions.includes(`.${ext}`))) {
            toast({
              ...toastErrorMessage,
              description: "Invalid file extension",
            });
            return false;
          }
        }
        if (multiple) {
          const f = [...files];
          for (let index = 0; index < e.dataTransfer.files.length; index++) {
            const isPrimary = !f.length;
            if (fileLength <= f.length) {
              toast({
                ...toastErrorMessage,
                description: `You can only upload a maximum of ${fileLength} files`,
              });
              return false;
            }
            const element = e.dataTransfer.files[index];
            const dataUrl = await toBase64(element);
            f.push({
              uploaded: false,
              isDeleted: false,
              isPrimary,
              data: {
                file: element,
                dataUrl,
              },
            });
          }
          setFiles(f);
          if (field) {
            field.onChange(f);
          }
        } else {
          const dataUrl = await toBase64(e.dataTransfer.files[0]);
          const f = [
            {
              uploaded: false,
              isDeleted: false,
              isPrimary: true,
              data: {
                file: e.dataTransfer.files[0],
                dataUrl,
              },
            },
          ];
          setFiles(f);
          if (field) {
            field.onChange(f);
          }
        }
      }
    }

    function handleDragLeave(e: any) {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
    }

    function handleDragOver(e: any) {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(true);
    }

    function handleDragEnter(e: any) {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(true);
    }

    function removeFile(idx: any) {
      const newArr = [...files];
      const file = newArr[idx];
      if (file.uploaded) {
        newArr[idx].isDeleted = true;
      } else {
        newArr.splice(idx, 1);
        setFiles([]);
        setFiles(newArr);
      }
      if (field) {
        if (multiple) field.onChange(newArr);
        else field.onChange(null);
      }
    }

    return (
      <>
        <div
          className={cn(
            dragActive ? "border-primary-300" : "border-slate-300",
            "p-4 w-full border rounded-lg text-center flex flex-col items-center justify-center  text-xs",
            className,
          )}
          onDragEnter={handleDragEnter}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
        >
          <input
            className="hidden"
            ref={inputRef}
            type="file"
            multiple={multiple}
            onChange={handleChange}
            id={id}
            accept={extensions ? extensions.join(",") : undefined}
          />

          <label htmlFor={id} className="cursor-pointer text-sm">
            <div>
              {placeholder || "Drop files here or click here to select files"}
            </div>
            {!!extensions && (
              <div className="text-xs italic text-gray-500 mt-1">
                (Allowed file extensions: {extensions.join(", ")})
              </div>
            )}
          </label>
        </div>
        {files.length > 0 && (
          <RadioGroup
            onValueChange={(value) => {
              const idx = Number(value.replace("img_", ""));
              if (idx >= 0) {
                const newArr = [...files].map((file) => ({
                  ...file,
                  isPrimary: false,
                }));

                newArr[idx].isPrimary = true;
                setFiles(newArr);
                if (field) {
                  field.onChange(newArr);
                }
              }
            }}
            defaultValue={`img_${files.findIndex((i) => i.isPrimary)}`}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5 mt-3">
              {files
                .filter((i) => !i.isDeleted)
                .map((file, idx) => {
                  return (
                    <div key={idx}>
                      <div className="border shadow-lg rounded">
                        <img
                          className="object-center w-full h-40 max-w-full rounded-lg p-1 "
                          src={file.data.dataUrl}
                          alt="gallery-photo"
                          width={40}
                          height={40}
                        />
                        <div className="border p-2 flex justify-between items-center gap-2">
                          <RadioGroupItem
                            value={`img_${idx}`}
                            id={`radio_${idx}`}
                          />
                          <Button
                            size="icon"
                            variant="outline"
                            type="button"
                            onClick={() => removeFile(idx)}
                            disabled={file.isPrimary}
                          >
                            <MdDeleteOutline />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </RadioGroup>
        )}
      </>
    );
  },
);

Uploader.displayName = "Uploader";
export default Uploader;
