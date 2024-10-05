"use client";
import { UploaderRef } from "@/app/(protected)/gallery-management/image-management/components/uploader";
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
import { setValidationErrors } from "@/lib/validations";
import { LearningVideos } from "@/models/learning-videos";
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
import Uploader from "./uploader";
import VideoUploader from "./video-uploader";
interface ImageFormType {
  isOpen: boolean;
  item: any | null;
  closeForm: () => void;
  openForm: (item: LearningVideos | null) => void;
}

const ImageFormContext = createContext<ImageFormType>({
  isOpen: false,
  item: null,
  closeForm: () => Promise.resolve(),
  openForm: () => Promise.resolve(),
});
export const useImageForm = () => useContext(ImageFormContext);

export function ImageFormProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<LearningVideos | null>(null);
  const openForm = async (imageData: LearningVideos | null) => {
    setItem(imageData);
    setIsOpen(true);
  };
  const closeForm = () => {
    setItem(null);
    setIsOpen(false);
  };
  return (
    <ImageFormContext.Provider value={{ isOpen, item, closeForm, openForm }}>
      {children}
    </ImageFormContext.Provider>
  );
}
const titleSchema = z
  .string()
  .min(3, "Title must be between 3 and 100 characters.")
  .max(100, "Title must be between 3 and 100 characters.")
  .refine((value) => value.trim() !== "", "Please enter a title for the video.")
  .refine(
    (value) => !/^[^a-zA-Z0-9]+$/.test(value),
    "Title cannot consist solely of special characters. Please enter a valid title.",
  )
  .refine(
    (value) => value === value.trim(),
    "Title should not contain leading or trailing spaces.",
  );
const formSchema = z.object({
  title: titleSchema,
  thumbnail: z.array(z.any()).min(1, "Please upload a thumbnail"),
  video: z.array(z.any()).min(1, "Please upload a video"),
});

interface FormTemplateProps extends HTMLAttributes<HTMLDivElement> {}
export function FormTemplate({ className }: FormTemplateProps) {
  const { item, closeForm } = useImageForm();
  const router = useRouter();
  const ImageuploaderRef = useRef<UploaderRef>();
  const VideouploaderRef = useRef<UploaderRef>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: item?.title || "",
      thumbnail: item?.thumbnail
        ? [
            {
              uploaded: true,
              file: item?.thumbnail,
            },
          ]
        : [],
      video: item?.video
        ? [
            {
              uploaded: true,
              file: item?.video,
            },
          ]
        : [],
    },
  });
  const { watch } = form;
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = {
      title: values?.title,
    };
    if (item) {
      let thumb;
      let video;

      await Promise.all(
        values?.thumbnail.map(async (x) => {
          if (x?.uploaded === false) {
            thumb = await updateGallery(values.thumbnail);
          } else {
            thumb = item?.thumb;
          }
        }),
      );
      await Promise.all(
        values?.video.map(async (x: any) => {
          if (x?.uploaded === false) {
            video = await updateGallery(values.video);
          } else {
            video = item?.video;
          }
        }),
      );
      const { error, message, validationErrors } = await API.UpdateById(
        "learning_video",
        item.id,
        {
          ...formData,
          thumbnail: thumb,
          video: video,
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
        description: "Video details updated Successfully",
      });
      closeForm();
      router.refresh();
    } else {
      const resultImage = await updateGallery(values.thumbnail);
      const resultImage2 = await updateGallery(values.video);
      const { error, message, validationErrors } = await API.Create(
        "learning_video",
        {
          ...formData,
          thumbnail: resultImage,
          video: resultImage2,
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
        description: "Video added successfully",
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
                  <Input placeholder="Video title" {...field} maxLength={100} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Uploader
                    id="images"
                    className="min-h-[80px]"
                    extensions={[".png", ".jpg", ".jpeg"]}
                    field={field}
                    ref={ImageuploaderRef}
                    type="examVideoThumb"
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
              images={watch("thumbnail")}
            />
          </div>

          <FormField
            control={form.control}
            name="video"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <VideoUploader
                    id="video"
                    className="min-h-[80px]"
                    extensions={[".mp4", ".mkv", ".mov", ".webm"]}
                    field={field}
                    ref={VideouploaderRef}
                    type="gal_video"
                    multiple={false}
                    fileLength={1}
                    videoItem={item?.video}
                  />
                </FormControl>
                {!item?.thumbnail && <FormMessage />}
              </FormItem>
            )}
          />
          <div className="border shadow-lg rounded flex justify-center">
            {/* {item && (
              // <video controls src={item?.thumbnail} className="w-full h-auto" />
            )} */}
          </div>
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
            <DrawerTitle>{item?.id ? "Edit" : "Add"} Video</DrawerTitle>
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
            <DialogTitle>{item?.id ? "Edit" : "Add"} Video</DialogTitle>
          </DialogHeader>
          <FormTemplate />
        </DialogContent>
      </Dialog>
    </>
  );
}
