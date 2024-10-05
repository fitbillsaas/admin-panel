"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { toastSuccessMessage } from "@/lib/constant";
import { API } from "@/lib/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import { z } from "zod";
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});
const formSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must not exceed 50 characters")
    .refine((value) => value.trim() === value, {
      message: "Title cannot start or end with empty spaces",
    }),
  content: z.string(),
  content_text: z.string(),
});

export default function EditForm(data: any) {
  const { toast } = useToast();
  const router = useRouter();
  const [content, setContent] = useState<string>("");
  const [quill, setEditor] = useState<any>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data?.data?.title || "",
      content: data?.data?.email_body || "",
      content_text: "",
    },
  });
  useEffect(() => {
    setContent(data?.data?.email_body);
  }, [data]);
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
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
  async function contentChange(editor: any, value: any) {
    setEditor(editor);
    setContent(value);
    if (quill && content) {
      if (quill.getText().length - 1 == 0) {
        form.setError("content_text", {
          type: "minLength",
          message: "Content is required",
        });
        return;
      } else if (quill.getText().length - 1 > 250) {
        form.setError("content_text", {
          type: "maxLength",
          message: "Content must not exceed 250 characters",
        });
        return;
      } else {
        form.clearErrors("content_text");
      }
    }
  }
  async function updateContent(values: z.infer<typeof formSchema>) {
    if (quill && content) {
      if (quill.getText().length - 1 == 0) {
        form.setError("content_text", {
          type: "minLength",
          message: "Content is required",
        });
        return;
      } else if (quill.getText().length - 1 > 250) {
        form.setError("content_text", {
          type: "maxLength",
          message: "Content must not exceed 250 characters",
        });
        return;
      } else {
        form.clearErrors("content_text");
      }
    }
    const payload = {
      title: values?.title,
      email_body: values?.content,
    };
    const res = await API.UpdateById("template", data?.data?.id, payload);
    if (!!res.data) {
      if (res?.data?.template) {
        toast({
          ...toastSuccessMessage,
          description: "Email Details Updated Successfully",
        });
      }
      router.replace("/email-template");
      router.refresh();
    } else {
      toast({
        description: res?.error,
      });
      return;
    }
  }
  return (
    <>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(updateContent)}>
            <div className="flex flex-wrap gap-2">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="mt-3">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ReactQuill
                        theme="snow"
                        modules={modules}
                        formats={formats}
                        {...field}
                        value={content}
                        onChange={(value, delta, source, editor) => {
                          contentChange(editor, value);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-3">
              <FormField
                control={form.control}
                name="content_text"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="hidden" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="py-4 flex  items-center">
              <Button
                type="button"
                onClick={() => {
                  router.replace("/email-template");
                }}
              >
                Cancel
              </Button>
              <div className="w-2"></div>{" "}
              <Button disabled={form.formState.isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
