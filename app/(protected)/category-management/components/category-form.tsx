"use client";
import { useCropperForm } from "@/components/cropper";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useScreenDetector } from "@/hooks/screen-detector";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/constant";
import { API } from "@/lib/fetch";
import clearDataCache from "@/lib/reset-data";
import { cn } from "@/lib/utils";
import { parseStringWithWhitespace } from "@/lib/validations";
import { Category } from "@/models/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  HTMLAttributes,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ImagePreview from "./image-preview";
interface CategoryFormType {
  isOpen: boolean;
  item: Category | null;
  closeForm: () => void;
  openForm: (category: Category | null) => void;
}
const CategoryFormContext = createContext<CategoryFormType>({
  isOpen: false,
  item: null,
  closeForm: () => Promise.resolve(),
  openForm: () => Promise.resolve(),
});
export const useCategoryForm = () => useContext(CategoryFormContext);

export function CategoryFormProvider({ children }: { children: ReactNode }) {
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
    <CategoryFormContext.Provider value={{ isOpen, item, closeForm, openForm }}>
      {children}
    </CategoryFormContext.Provider>
  );
}

const formSchema = z.object({
  category_name: parseStringWithWhitespace(
    z.string().min(1, "Category name must be least 1 characters"),
  ),
  category_description: parseStringWithWhitespace(
    z.string().min(1, "Category description must be at least 1 characters"),
  ),
  image: z.array(z.any()).min(1, "Category image is required"),
});

interface FormTemplateProps extends HTMLAttributes<HTMLDivElement> {}
export function FormTemplate({ className }: FormTemplateProps) {
  const { item, closeForm } = useCategoryForm();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    openForm: openCropperForm,
    responseItem,
    setResponseItem,
  } = useCropperForm();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category_name: item?.category_name || "",
      category_description: item?.category_description || "",
      image: item?.category_image
        ? [
            {
              uploaded: true,
              file: item?.category_image,
            },
          ]
        : [],
    },
  });
  const { setValue, watch } = form;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!!item?.id) {
      const payload: any = {
        category_name: values?.category_name,
        category_description: values?.category_description,
      };
      const image = values?.image[0];
      if (values?.image.length && !image.uploaded) {
        const croppedFile = await dataURLtoFile(image?.file);
        payload["category_image"] = await updateGallery(croppedFile);
      }
      const { error } = await API.UpdateById(
        "product_category",
        item.id,
        payload,
      );
      if (!!error) {
        toast({ ...toastErrorMessage, description: error.message || error });
        return;
      }
      toast({
        ...toastSuccessMessage,
        description: "Category updated successfully",
      });
    } else {
      const payload: any = {
        category_name: values?.category_name,
        category_description: values?.category_description,
      };
      const image = values?.image[0];
      if (values?.image.length && !image.uploaded) {
        const croppedFile = await dataURLtoFile(image?.file);
        payload["category_image"] = await updateGallery(croppedFile);
      }
      const { error } = await API.Create("product_category", payload);
      if (!!error) {
        toast({ ...toastErrorMessage, description: error.message || error });
        return;
      }
      toast({
        ...toastSuccessMessage,
        description: "Category added successfully",
      });
    }
    clearDataCache("product_category");
    setResponseItem({ status: "cancel" });
    closeForm();
    router.refresh();
  };

  useEffect(() => {
    if (responseItem.status === "success") {
      setValue("image", [
        {
          uploaded: false,
          file: responseItem.data.item,
        },
      ]);
    }
  }, [setValue, responseItem]);

  async function updateGallery(image: any) {
    // get presigned url
    const ext = image.name.split(".").pop();
    const Key = Date.now() + `.${ext}`;
    const { data, error } = await API.Post("common/presigned-url", {
      key: Key,
    });
    if (!error) {
      await fetch(data.signed_url, {
        method: "PUT",
        body: image,
      });
      return Key;
    } else return null;
  }

  const dataURLtoFile = async (base64Image: any): Promise<File> => {
    const split = base64Image.split(",");
    const type = split[0].replace("data:", "").replace(";base64", "");
    const byteString = window.atob(split[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i += 1) {
      ia[i] = byteString.charCodeAt(i);
    }
    const Key = Date.now() + `.${type.split("/")[1]}`;
    const file = new File([ab], `${Key}`, { type });
    return file;
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    const maxSize = 5 * 1024 * 1024;
    if (file) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (
        fileExtension !== "jpg" &&
        fileExtension !== "jpeg" &&
        fileExtension !== "png"
      ) {
        toast({
          ...toastErrorMessage,
          description:
            "Invalid file format. Please select JPG, JPEG, or PNG file.",
        });
        return;
      }
      if (file && file.size > maxSize) {
        toast({
          ...toastErrorMessage,
          description: "File size exceeds 5MB. Please select a smaller file.",
        });
        return;
      }
      e.preventDefault();
      let files;
      if (e.dataTransfer) {
        files = e.dataTransfer.files;
      } else if (e.target) {
        files = e.target.files;
      }
      const reader = new FileReader();
      reader.onload = () => {
        openCropperForm(reader.result as any);
      };
      reader.readAsDataURL(files[0]);
    }
    e.target.value = null;
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("w-full space-y-4", className)}
      >
        <FormField
          control={form.control}
          name="category_name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Category name" {...field} maxLength={50} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category_description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Category description"
                  {...field}
                  maxLength={250}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({}) => (
            <FormItem>
              <FormControl>
                <div
                  className={cn(
                    "p-4 w-full border rounded-lg text-center flex flex-col items-center justify-center  text-xs",
                    className,
                  )}
                >
                  <Input
                    className="hidden"
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    id="file1"
                    accept="image/jpeg, image/png, image/jpg"
                  />

                  <label htmlFor="file1" className="cursor-pointer text-sm">
                    <div>Click here to select file</div>
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
  );
}

export default function CategoryForm() {
  const { isOpen, item, closeForm } = useCategoryForm();
  const { isMobile } = useScreenDetector();
  const { setResponseItem } = useCropperForm();
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
            <DrawerTitle>{item?.id ? "Edit" : "Add"} Category</DrawerTitle>
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
            setResponseItem({ status: "cancel" });
            closeForm();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{item?.id ? "Edit" : "Add"} Category</DialogTitle>
          </DialogHeader>
          <FormTemplate />
        </DialogContent>
      </Dialog>
    </>
  );
}
