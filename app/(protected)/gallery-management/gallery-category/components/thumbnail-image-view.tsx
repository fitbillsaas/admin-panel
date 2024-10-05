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
import { Youtube } from "@/models/youtube-link";
import Image from "next/image";
import {
  HTMLAttributes,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";
interface ThumbnailFormType {
  isOpen: boolean;
  item: Youtube | null;
  closeForm: () => void;
  openForm: (thumb: Youtube | null) => void;
}
const ThumbnailFormContext = createContext<ThumbnailFormType>({
  isOpen: false,
  item: null,
  closeForm: () => Promise.resolve(),
  openForm: () => Promise.resolve(),
});
export const useThumbnailForm = () => useContext(ThumbnailFormContext);

export function ThumbnailFormProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<Youtube | null>(null);
  const openForm = (thumb: Youtube | null) => {
    setItem(thumb);
    setIsOpen(true);
  };

  const closeForm = () => {
    setItem(null);
    setIsOpen(false);
  };
  return (
    <ThumbnailFormContext.Provider
      value={{ isOpen, item, closeForm, openForm }}
    >
      {children}
    </ThumbnailFormContext.Provider>
  );
}
interface FormTemplateProps extends HTMLAttributes<HTMLDivElement> {}
export function FormTemplate({ className }: FormTemplateProps) {
  const { item } = useThumbnailForm();

  return (
    <>
      <div className={cn("rounded-sm", className)}>
        <Image
          src={item?.thumb || "/images/placeholder-image.png"}
          width={200}
          height={200}
          alt="Thumbnail"
          className="w-full h-full"
          loading="lazy"
        />
      </div>
    </>
  );
}

export default function ThumbnailForm() {
  const { isOpen, closeForm } = useThumbnailForm();
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
            <DrawerTitle>Thumbnail Image</DrawerTitle>
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
            <DialogTitle>Thumbnail Image</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <FormTemplate />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
