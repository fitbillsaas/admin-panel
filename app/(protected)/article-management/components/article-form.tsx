"use client";
import Uploader, {
  UploaderRef,
} from "@/app/(protected)/youtube-video-management/components/uploader";
import { Spinner } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useScreenDetector } from "@/hooks/screen-detector";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/constant";
import { API } from "@/lib/fetch";
import { cn } from "@/lib/utils";
import {
  parseDate,
  parseStringWithWhitespace,
  setValidationErrors,
} from "@/lib/validations";
import { Category } from "@/models/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  HTMLAttributes,
  ReactNode,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ImagePreview from "./image-preview";

interface ArticleFormType {
  isOpen: boolean;
  item: any | null;
  closeForm: () => void;
  openForm: (category: any | null) => void;
}
const ArticleFormContext = createContext<ArticleFormType>({
  isOpen: false,
  item: null,
  closeForm: () => Promise.resolve(),
  openForm: () => Promise.resolve(),
});
export const useArticleForm = () => useContext(ArticleFormContext);

export function ArticleFormProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<Category | null>(null);
  const openForm = (category: Category | null) => {
    setItem(category);
    setIsOpen(true);
  };

  const closeForm = () => {
    setItem(null);
    setIsOpen(false);
  };
  return (
    <ArticleFormContext.Provider value={{ isOpen, item, closeForm, openForm }}>
      {children}
    </ArticleFormContext.Provider>
  );
}

const formSchema = z.object({
  title: parseStringWithWhitespace(
    z.string().min(1, "Article title must be least 1 characters"),
  ),
  description: parseStringWithWhitespace(
    z.string().min(1, "Article description must be least 1 characters"),
  ),
  url: parseStringWithWhitespace(
    z.string().min(1, "Article url must be least 1 characters").url(),
  ),
  date: parseDate(z.date({ required_error: "Date is required" })),
  image: z.array(z.any()).min(1, "At least one image is required"),
});

interface FormTemplateProps extends HTMLAttributes<HTMLDivElement> {}
export function FormTemplate({ className }: FormTemplateProps) {
  const { item, closeForm } = useArticleForm();
  const router = useRouter();
  const uploaderRef = useRef<UploaderRef>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: item?.title || "",
      description: item?.description || "",
      url: item?.url || "",
      // image: item?.thumb
      //   ? [{ uploaded: true, data: { file: item.thumb } }]
      //   : [],

      image: item?.thumb
        ? [
            {
              uploaded: true,
              file: item?.thumb,
            },
          ]
        : [],

      date: item?.date ? new Date(item.date) : undefined,
    },
  });
  const { watch } = form;
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = {
      title: values?.title,
      url: values?.url,
      description: values?.description,
      date: String(values?.date),
    };
    if (item) {
      let resultImage;
      await Promise.all(
        values?.image.map(async (x) => {
          if (x?.uploaded === false) {
            resultImage = await updateGallery(values.image);
          } else {
            resultImage = item?.thumb;
          }
        }),
      );
      const { error, message, validationErrors } = await API.UpdateById(
        "learn_article",
        item.id,
        {
          ...formData,
          thumb: resultImage,
        },
      );
      if (!!error) {
        if (validationErrors) {
          setValidationErrors(validationErrors, form);
        } else {
          toast({
            ...toastErrorMessage,
            description: message,
          });
        }
        return;
      }
      toast({
        ...toastSuccessMessage,
        description: "Article Updated Successfully",
      });
      closeForm();
      router.refresh();
    } else {
      const resultImage = await updateGallery(values.image);
      const { error, message, validationErrors } = await API.Create(
        "learn_article",
        {
          ...formData,
          thumb: resultImage,
        },
      );
      if (!!error) {
        if (validationErrors) {
          setValidationErrors(validationErrors, form);
        } else {
          toast({
            ...toastErrorMessage,
            description: message,
          });
        }
        return;
      }

      toast({
        ...toastSuccessMessage,
        description: "Article Added Successfully",
      });
      closeForm();
      router.refresh();
    }
  }
  async function updateGallery(image: any[]) {
    const newItems = image.filter((i) => !i?.data?.file?.id);
    for (let index = 0; index < newItems.length; index++) {
      const element = newItems[index];

      // get presigned url
      const ext = element.data?.file.name.split(".").pop();
      const Key = Date.now() + `.${ext}`;
      const { data, error } = await API.Post("common/presigned-url", {
        key: Key,
      });
      if (!error) {
        await fetch(data.signed_url, {
          method: "PUT",
          body: element?.data?.file,
        });
        return Key;
      }
    }
  }

  return (
    <div className="max-w-[600px]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("w-full space-y-4", className)}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Article title"
                    {...field}
                    maxLength={60}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Article  description"
                    {...field}
                    maxLength={255}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="Article  url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "MM-dd-yyyy")
                        ) : (
                          <span>Date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date <
                        new Date(new Date().setDate(new Date().getDate() - 1))
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Uploader
                    id="images"
                    className="min-h-[80px]"
                    extensions={[".png", ".jpg", ".jpeg"]}
                    field={field}
                    ref={uploaderRef}
                    type="article_image"
                    multiple={false}
                    //   attachments={product?.productGallery || []}
                    fileLength={1}
                  />
                </FormControl>
                {!item?.thumb && <FormMessage />}
              </FormItem>
            )}
          />
          {/* {item?.thumb && (
            <div className="border shadow-lg rounded">
              <img
                className="object-center w-full h-40 max-w-full rounded-lg p-1 "
                src={item?.thumb}
                alt="gallery-photo"
                width={40}
                height={40}
              />
            </div>
          )} */}
          <div className="border shadow-lg rounded flex justify-center">
            <ImagePreview
              className="object-center w-100 h-100 max-w-full rounded-lg p-1"
              images={watch("image")}
            />
          </div>
          <DialogFooter>
            <Button
              className="w-full"
              disabled={form.formState.isSubmitting}
              type="submit"
              variant="default"
            >
              {form.formState.isSubmitting && (
                <Spinner className="mr-2 h-4 w-4 animate-spin" />
              )}{" "}
              Save
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}

export default function ArticleForm() {
  const { isOpen, item, closeForm } = useArticleForm();
  const { isMobile } = useScreenDetector();
  if (isMobile) {
    return (
      <Drawer
        open={isOpen}
        onOpenChange={(s) => {
          if (!s) {
            closeForm();
          }
        }}
      >
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{item?.id ? "Edit" : "Add"} Article</DrawerTitle>
          </DrawerHeader>
          <FormTemplate className="p-3" />
        </DrawerContent>
      </Drawer>
    );
  }
  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(s) => {
          if (!s) {
            closeForm();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{item?.id ? "Edit" : "Add"} Article</DialogTitle>
          </DialogHeader>
          <FormTemplate />
        </DialogContent>
      </Dialog>
    </>
  );
}
