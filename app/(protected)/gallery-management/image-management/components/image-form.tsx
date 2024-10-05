"use client";
import Uploader, {
  UploaderRef,
} from "@/app/(protected)/gallery-management/image-management/components/uploader";
import { Spinner } from "@/components/icon";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useScreenDetector } from "@/hooks/screen-detector";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/constant";
import { API } from "@/lib/fetch";
import { cn } from "@/lib/utils";
import {
  parseStringWithWhitespace,
  setValidationErrors,
} from "@/lib/validations";
import { Cat } from "@/models/cat";
import { Image } from "@/models/image";
import { zodResolver } from "@hookform/resolvers/zod";
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

interface ImageFormType {
  isOpen: boolean;
  item: any | null;
  categories: any | null;
  closeForm: () => void;
  openForm: (categories: Cat[] | null, item: Image | null) => void;
}

const ImageFormContext = createContext<ImageFormType>({
  isOpen: false,
  item: null,
  categories: null,
  closeForm: () => Promise.resolve(),
  openForm: () => Promise.resolve(),
});
export const useImageForm = () => useContext(ImageFormContext);

export function ImageFormProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<Image | null>(null);
  const [category, setCategories] = useState<Cat[] | null>(null);
  const openForm = async (
    categories: Cat[] | null,
    imageData: Image | null,
  ) => {
    setCategories(categories);
    setItem(imageData);
    setIsOpen(true);
  };
  const closeForm = () => {
    setItem(null);
    setIsOpen(false);
  };
  const categories = category;
  return (
    <ImageFormContext.Provider
      value={{ isOpen, item, categories, closeForm, openForm }}
    >
      {children}
    </ImageFormContext.Provider>
  );
}
const formSchema = z.object({
  name: parseStringWithWhitespace(
    z.string().min(1, "Name must be least 1 characters"),
  ),
  category_id: parseStringWithWhitespace(
    z.string().min(1, "Category is required"),
  ),
  // thumbnail: z.array(z.any()).min(1, "At least one image is required"),
  file_url: z.array(z.any()).min(1, "At least one image is required"),
});

interface FormTemplateProps extends HTMLAttributes<HTMLDivElement> {}
export function FormTemplate({ className }: FormTemplateProps) {
  const { item, closeForm, categories } = useImageForm();
  const router = useRouter();
  const uploaderRef = useRef<UploaderRef>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item?.name || "",
      category_id: item?.category_id ? String(item?.category_id) : "",
      // thumbnail: item?.thumbnail
      //   ? [
      //       {
      //         uploaded: true,
      //         file: item?.thumbnail,
      //       },
      //     ]
      //   : [],
      file_url: item?.file_url
        ? [
            {
              uploaded: true,
              file: item?.file_url,
            },
          ]
        : [],
    },
  });
  const { watch } = form;
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = {
      name: values?.name,
      category_id: values?.category_id,
      type: "Image",
    };
    if (item) {
      // let thumb;
      let file_url;

      // await Promise.all(
      //   values?.thumbnail.map(async (x) => {
      //     if (x?.uploaded === false) {
      //       thumb = await updateGallery(values.thumbnail);
      //     } else {
      //       thumb = item?.thumb;
      //     }
      //   }),
      // );
      await Promise.all(
        values?.file_url.map(async (x) => {
          if (x?.uploaded === false) {
            file_url = await updateGallery(values.file_url);
          } else {
            file_url = item?.file_url;
          }
        }),
      );
      const { error, message, validationErrors } = await API.UpdateById(
        "gallery",
        item.id,
        {
          ...formData,
          // thumbnail: thumb,
          file_url: file_url,
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
        description: "Details Updated Successfully",
      });
      closeForm();
      router.refresh();
    } else {
      // const resultImage = await updateGallery(values.thumbnail);
      const resultImage2 = await updateGallery(values.file_url);
      const { error, message, validationErrors } = await API.Create("gallery", {
        ...formData,
        // thumbnail: resultImage,
        file_url: resultImage2,
      });
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
        description: "Image Added Successfully",
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Image title" {...field} maxLength={60} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="lg:min-w-[180px] 2xl:min-w-[200px]">
                      <SelectValue placeholder="Categories" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((category: any) => (
                      <SelectItem key={category.id} value={`${category.id}`}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name="thumbnail"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ThumbnailUpload
                    id="thumb"
                    className="min-h-[80px]"
                    extensions={[".png", ".jpg", ".jpeg"]}
                    field={field}
                    ref={uploaderRef}
                    type="product_image"
                    multiple={false}
                    fileLength={1}
                  />
                </FormControl>
                {!item?.thumb && <FormMessage />}
              </FormItem>
            )}
          />
          <div className="border shadow-lg rounded flex justify-center">
            <ImagePreviewThumb
              className="object-center w-100 h-100 max-w-full rounded-lg p-1"
              images={watch("thumbnail")}
            />
          </div> */}
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
          <FormField
            control={form.control}
            name="file_url"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Uploader
                    id="images"
                    className="min-h-[80px]"
                    extensions={[".png", ".jpg", ".jpeg"]}
                    field={field}
                    ref={uploaderRef}
                    type="product_image"
                    multiple={false}
                    fileLength={1}
                  />
                </FormControl>
                {!item?.thumb && <FormMessage />}
              </FormItem>
            )}
          />

          <div className="border shadow-lg rounded flex justify-center">
            <ImagePreview
              className="object-center w-100 h-100 max-w-full rounded-lg p-1"
              images={watch("file_url")}
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

export default function ImageForm() {
  const { isOpen, item, closeForm } = useImageForm();
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
            <DrawerTitle>{item?.id ? "Edit" : "Add"} Image</DrawerTitle>
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
            <DialogTitle>{item?.id ? "Edit" : "Add"} Image</DialogTitle>
          </DialogHeader>
          <FormTemplate />
        </DialogContent>
      </Dialog>
    </>
  );
}
