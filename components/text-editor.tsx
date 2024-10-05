"use client";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    [{ color: [] }, { background: [] }, { align: [] }],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "color",
  "image",
  "background",
  "align",
];

import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { ReactQuillProps } from "react-quill";

const TextEditor = forwardRef<typeof ReactQuill, ReactQuillProps>(
  ({ className, ...props }) => {
    return (
      <ReactQuill
        className={cn(className)}
        theme="snow"
        modules={modules}
        formats={formats}
        {...props}
      />
    );
  },
);

TextEditor.displayName = "TextEditor";

export default TextEditor;
