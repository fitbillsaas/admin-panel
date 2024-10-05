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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useScreenDetector } from "@/hooks/screen-detector";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/constant";
import { API } from "@/lib/fetch";
import clearDataCache from "@/lib/reset-data";
import { cn } from "@/lib/utils";
import { parseStringWithWhitespace } from "@/lib/validations";
import { Testimonial } from "@/models/testimonial";
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
interface CouponFormType {
  isOpen: boolean;
  item: Testimonial | null;
  closeForm: () => void;
  openForm: (testimonial: Testimonial | null) => void;
}
const CouponFormContext = createContext<CouponFormType>({
  isOpen: false,
  item: null,
  closeForm: () => Promise.resolve(),
  openForm: () => Promise.resolve(),
});
export const useTestimonialForm = () => useContext(CouponFormContext);
export function TestimonialFormProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<Testimonial | null>(null);
  const openForm = (testimonial: Testimonial | null) => {
    setItem(testimonial);
    setIsOpen(true);
  };

  const closeForm = () => {
    setItem(null);
    setIsOpen(false);
  };
  return (
    <CouponFormContext.Provider value={{ isOpen, item, closeForm, openForm }}>
      {children}
    </CouponFormContext.Provider>
  );
}
const formSchema = z.object({
  name: parseStringWithWhitespace(
    z.string().min(1, "Testimonial name is required"),
  ),
  speciality: parseStringWithWhitespace(
    z.string().min(1, "Testimonial reference is required"),
  ),
  quote: parseStringWithWhitespace(
    z.string().min(1, "Testimonial quotes is required"),
  ),
});

interface FormTemplateProps extends HTMLAttributes<HTMLDivElement> {}
export function FormTemplate({ className }: FormTemplateProps) {
  const { item, closeForm } = useTestimonialForm();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item?.name || "",
      speciality: item?.speciality || "",
      quote: item?.quote || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!!item?.id) {
      const { error } = await API.UpdateById("testimonials", item.id, values);
      if (!!error) {
        toast({ ...toastErrorMessage, description: error.message || error });
        return;
      }
      toast({
        ...toastSuccessMessage,
        description: "Testimonial Updated successfully",
      });
    } else {
      const { error, message } = await API.Create("testimonials", values);
      if (!!error) {
        toast({ ...toastErrorMessage, description: message });
        return;
      }
      toast({
        ...toastSuccessMessage,
        description: "Testimonial Added successfully",
      });
    }
    await clearDataCache("testimonials");
    closeForm();
    router.refresh();
  };
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
                    placeholder="Testimonial name"
                    {...field}
                    maxLength={30}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="speciality"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Testimonial reference"
                    {...field}
                    maxLength={30}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quote"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Testimonial quotes"
                    {...field}
                    maxLength={250}
                    rows={5}
                  ></Textarea>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
export default function TestimonialForm() {
  const { isOpen, closeForm, item } = useTestimonialForm();
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
            <DrawerTitle>{item?.id ? "Edit" : "Add"} Testimonial</DrawerTitle>
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
            <DialogTitle>{item?.id ? "Edit" : "Add"} Testimonial</DialogTitle>
          </DialogHeader>
          <FormTemplate />
        </DialogContent>
      </Dialog>
    </>
  );
}
