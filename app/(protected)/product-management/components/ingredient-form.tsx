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
import { useScreenDetector } from "@/hooks/screen-detector";
import { cn, uuid } from "@/lib/utils";
import { parseStringWithWhitespace } from "@/lib/validations";
import { Specification } from "@/models/specification";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  HTMLAttributes,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface SpecificationFormType {
  isOpen: boolean;
  item: Specification | null;
  responseItem: { status?: "success" | "cancel"; data?: any };
  closeForm: (response: { status?: "success" | "cancel"; data?: any }) => void;
  openForm: (specification: Specification | null) => void;
}
const SpecificationFormContext = createContext<SpecificationFormType>({
  isOpen: false,
  item: null,
  responseItem: {},
  closeForm: () => Promise.resolve(),
  openForm: () => Promise.resolve(),
});
export const useSpecificationForm = () => useContext(SpecificationFormContext);

export function SpecificationFormProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<Specification | null>(null);
  const [responseItem, setResponseItem] = useState<{
    status?: "success" | "cancel";
    data?: any;
  }>({});
  const openForm = (specification: Specification | null) => {
    setItem(specification);
    setIsOpen(true);
  };

  const closeForm = (response: {
    status?: "success" | "cancel";
    data?: any;
  }) => {
    setItem(null);
    setResponseItem(response);
    setIsOpen(false);
  };
  return (
    <SpecificationFormContext.Provider
      value={{ isOpen, item, closeForm, openForm, responseItem }}
    >
      {children}
    </SpecificationFormContext.Provider>
  );
}

const formSchema = z.object({
  specification: parseStringWithWhitespace(
    z.string().min(1, "Specification must be least 1 characters"),
  ),
  specification_details: parseStringWithWhitespace(
    z
      .string()
      .min(1, "Specification description must be at least 1 characters"),
  ),
});

interface FormTemplateProps extends HTMLAttributes<HTMLDivElement> {}
export function FormTemplate({ className }: FormTemplateProps) {
  const { item, closeForm } = useSpecificationForm();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      specification: item?.specification || "",
      specification_details: item?.specification_details || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    closeForm({
      status: "success",
      data: { ...item, ...values, uid: item?.uid || uuid() },
    });
  };

  useEffect(() => {
    form.setValue("specification", item?.specification || "");
    form.setValue("specification_details", item?.specification_details || "");
  }, [form, item]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("w-full space-y-4", className)}
      >
        <FormField
          control={form.control}
          name="specification"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Specification" {...field} maxLength={50} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specification_details"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Specification description"
                  {...field}
                  maxLength={250}
                />
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
  );
}

export default function SpecificationForm() {
  const { isOpen, item, closeForm } = useSpecificationForm();
  const { isMobile } = useScreenDetector();

  if (isMobile) {
    return (
      <Drawer
        open={isOpen}
        onOpenChange={(s) => {
          if (!s) {
            closeForm({ status: "cancel" });
          }
        }}
      >
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>
              {item?.id || item?.uid ? "Edit" : "Add"} specification
            </DrawerTitle>
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
            closeForm({ status: "cancel" });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {item?.id || item?.uid ? "Edit" : "Add"} specification
            </DialogTitle>
          </DialogHeader>
          <FormTemplate />
        </DialogContent>
      </Dialog>
    </>
  );
}
