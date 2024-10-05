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
import { Form } from "@/components/ui/form";
import { useScreenDetector } from "@/hooks/screen-detector";
import { cn } from "@/lib/utils";
import { ProductReviews } from "@/models/product-review";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  HTMLAttributes,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
interface ReviewFormType {
  isOpen: boolean;
  item: any | null;
  closeForm: () => void;
  openForm: (item: ProductReviews | null) => void;
}

const ReviewFormContext = createContext<ReviewFormType>({
  isOpen: false,
  item: null,
  closeForm: () => Promise.resolve(),
  openForm: () => Promise.resolve(),
});
export const useReviewForm = () => useContext(ReviewFormContext);

export function ReviewFormProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<ProductReviews | null>(null);
  const openForm = async (questionData: ProductReviews | null) => {
    setItem(questionData);
    setIsOpen(true);
  };
  const closeForm = () => {
    setItem(null);
    setIsOpen(false);
  };
  return (
    <ReviewFormContext.Provider value={{ isOpen, item, closeForm, openForm }}>
      {children}
    </ReviewFormContext.Provider>
  );
}
const formSchema = z.object({
  review: z.string(),
});

interface FormTemplateProps extends HTMLAttributes<HTMLDivElement> {}
export function FormTemplate({ className }: FormTemplateProps) {
  const { item } = useReviewForm();
  // const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      review: item?.review || "",
    },
  });

  return (
    <div className="max-w-[600px]">
      <Form {...form}>
        <form className={cn("w-full space-y-4", className)}>
          <span>{item?.review}</span>
        </form>
      </Form>
    </div>
  );
}

export default function ReviewForm() {
  const { isOpen, closeForm } = useReviewForm();
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
            <DrawerTitle>Review</DrawerTitle>
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
            <DialogTitle>Review</DialogTitle>
          </DialogHeader>
          <FormTemplate />
        </DialogContent>
      </Dialog>
    </>
  );
}
