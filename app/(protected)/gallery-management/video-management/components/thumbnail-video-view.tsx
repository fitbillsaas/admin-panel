"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useScreenDetector } from "@/hooks/screen-detector";
import { cn } from "@/lib/utils";
import { Image as imageModal } from "@/models/image";
import {
  HTMLAttributes,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";
interface ThumbnailFormType {
  isOpen: boolean;
  item: imageModal | null;
  closeForm: () => void;
  openForm: (thumb: imageModal | null) => void;
}
const VideoThumbnailFormContext = createContext<ThumbnailFormType>({
  isOpen: false,
  item: null,
  closeForm: () => Promise.resolve(),
  openForm: () => Promise.resolve(),
});
export const useThumbnailForm = () => useContext(VideoThumbnailFormContext);

export function ThumbnailFormProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<imageModal | null>(null);
  const openForm = (thumb: imageModal | null) => {
    setItem(thumb);
    setIsOpen(true);
  };

  const closeForm = () => {
    setItem(null);
    setIsOpen(false);
  };
  return (
    <VideoThumbnailFormContext.Provider
      value={{ isOpen, item, closeForm, openForm }}
    >
      {children}
    </VideoThumbnailFormContext.Provider>
  );
}
interface FormTemplateProps extends HTMLAttributes<HTMLDivElement> {}
export function FormTemplate({ className }: FormTemplateProps) {
  const { item } = useThumbnailForm();

  return (
    <>
      <div className={cn("rounded-sm", className)}>
        <video controls src={item?.file_url} className="w-full h-auto" />
      </div>
    </>
  );
}

export default function VideoThumbnailForm() {
  const { isOpen, closeForm, item } = useThumbnailForm();
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
            <DrawerTitle>{item?.name}</DrawerTitle>
          </DrawerHeader>
          <div className="flex justify-center p-3">
            <FormTemplate />
          </div>
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
            <DialogTitle>{item?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <FormTemplate />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
