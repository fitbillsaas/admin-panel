"use client";
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
import { toast } from "@/components/ui/use-toast";
import { useScreenDetector } from "@/hooks/screen-detector";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/constant";
import { API } from "@/lib/fetch";
import { cn } from "@/lib/utils";
import {
  parseStringWithWhitespace,
  setValidationErrors,
} from "@/lib/validations";
import { Youtube } from "@/models/youtube-link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  HTMLAttributes,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface YoutubeFormType {
  isOpen: boolean;
  item: any | null;
  closeForm: () => void;
  openForm: (youtube_video: any | null) => void;
}
const YoutubeFormContext = createContext<YoutubeFormType>({
  isOpen: false,
  item: null,
  closeForm: () => Promise.resolve(),
  openForm: () => Promise.resolve(),
});
export const useYoutubeForm = () => useContext(YoutubeFormContext);

export function YoutubeFormProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<Youtube | null>(null);
  const openForm = (youtube_video: Youtube | null) => {
    setItem(youtube_video);
    setIsOpen(true);
  };

  const closeForm = () => {
    setItem(null);
    setIsOpen(false);
  };
  return (
    <YoutubeFormContext.Provider value={{ isOpen, item, closeForm, openForm }}>
      {children}
    </YoutubeFormContext.Provider>
  );
}

const formSchema = z.object({
  name: parseStringWithWhitespace(
    z.string().min(1, "Title must be least 1 characters"),
  ),
  // url: parseStringWithWhitespace(
  //   z.string().min(1, "Url must be least 1 characters").url(),
  // ),
  // image: z.array(z.any()).min(1, "At least one image is required"),
});

interface FormTemplateProps extends HTMLAttributes<HTMLDivElement> {}
export function FormTemplate({ className }: FormTemplateProps) {
  const { item, closeForm } = useYoutubeForm();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item?.name || "",
      // url: item?.url || "",
      // image: item?.thumb
      //   ? [
      //       {
      //         uploaded: true,
      //         file: item?.thumb,
      //       },
      //     ]
      //   : [],
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = {
      name: values?.name,
    };
    if (item) {
      let resultImage;
      // await Promise.all(
      //   values?.image.map(async (x) => {
      //     if (x?.uploaded === false) {
      //       resultImage = await updateGallery(values.image);
      //     } else {
      //       resultImage = item?.thumb;
      //     }
      //   }),
      // );
      const { error, message, validationErrors } = await API.UpdateById(
        "gallery_category",
        item.id,
        {
          ...formData,
          thumb: resultImage,
          type: "image",
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
        description: "Gallery Category Updated Successfully",
      });
      closeForm();
      router.refresh();
    } else {
      // const resultImage = await updateGallery(values.image);
      const { error, message, validationErrors } = await API.Create(
        "gallery_category",
        {
          ...formData,
          // thumb: resultImage,
          // sort: 1,
          // status: "Y",
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
        description: "Gallery Category Added Successfully",
      });
      closeForm();
      router.refresh();
    }
  }
  // async function updateGallery(image: any[]) {
  //   const newItems = image.filter((i) => !i?.data?.file?.id);
  //   for (let index = 0; index < newItems.length; index++) {
  //     const element = newItems[index];

  //     // get presigned url
  //     const ext = element.data?.file.name.split(".").pop();
  //     const Key = Date.now() + `.${ext}`;
  //     const { data, error } = await API.Post("common/presigned-url", {
  //       key: Key,
  //     });
  //     if (!error) {
  //       await fetch(data.signed_url, {
  //         method: "PUT",
  //         body: element?.data?.file,
  //       });
  //       return Key;
  //     }
  //   }
  // }
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
                  <Input
                    placeholder="Category name"
                    {...field}
                    maxLength={60}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Video url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* <FormField
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
                    type="product_image"
                    multiple={false}
                    fileLength={1}
                  />
                </FormControl>
                {!item?.thumb && <FormMessage />}
              </FormItem>
            )}
          /> */}
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

          {/* <div className="border shadow-lg rounded flex justify-center">
            <ImagePreview
              className="object-center w-100 h-100 max-w-full rounded-lg p-1"
              images={watch("image")}
            />
          </div> */}

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

export default function VideoForm() {
  const { isOpen, item, closeForm } = useYoutubeForm();
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
