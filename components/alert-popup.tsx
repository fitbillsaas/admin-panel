import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useScreenDetector } from "@/hooks/screen-detector";
import { BiLoaderAlt } from "react-icons/bi";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
export interface AlertPopupActionData {
  action: "cancel" | "continue";
  data?: any;
}
export interface AlertPopupProps {
  title: string;
  description: string;
  open: boolean;
  actionClick?: (obj: AlertPopupActionData) => void;
  onOpenChange?: (status: boolean) => void;
}
export default function AlertPopup({
  isLoading,
  open,
  options = {
    message: "Are you sure?",
    description:
      "Are you sure you want to delete this record?. This action cannot be reversed.",
  },
  okButton = "Yes, I'm sure",
  cancelButton = "No, cancel",
  onCancel,
  onConfirm,
}: {
  isLoading?: boolean;
  open: boolean;
  options: {
    message?: string;
    description?: string;
  };
  okButton?: string;
  cancelButton?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}) {
  const { isMobile } = useScreenDetector();

  if (isMobile) {
    return (
      <Drawer
        open={open}
        onClose={() => onCancel}
        onRelease={(e, o) => {
          if (!o && onCancel) onCancel();
        }}
      >
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{options?.message}</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">{options?.description}</div>
          <DrawerFooter>
            <Button onClick={onConfirm} disabled={isLoading}>
              {isLoading && <BiLoaderAlt className="animate-spin" />}
              {okButton}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" onClick={onCancel}>
                {cancelButton}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }
  return (
    <>
      <AlertDialog
        open={open}
        onOpenChange={(status) => {
          if (!status) onCancel;
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{options?.message}</AlertDialogTitle>
            <AlertDialogDescription>
              {options?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancel}>
              {cancelButton}
            </AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
              {isLoading && <BiLoaderAlt className="animate-spin" />}
              {okButton}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
