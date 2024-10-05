"use client";
import { Spinner } from "@/components/icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
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
import clearDataCache from "@/lib/reset-data";
import { cn } from "@/lib/utils";
import { parseStringWithWhitespace } from "@/lib/validations";
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
interface StatusFormType {
  isOpen: boolean;
  item: any | null;
  orderId: number | null;
  closeForm: () => void;
  openForm: (status: string, id: number) => void;
}
const OrderStatusOptions = [
  { id: "Payment Pending", name: "Payment Pending" },
  { id: "Payment Failed", name: "Payment Failed" },
  { id: "Ordered", name: "Ordered" },
  { id: "Cancelled", name: "Cancelled" },
  { id: "Shipped", name: "Shipped" },
  { id: "Shipping Failed", name: "Shipping Failed" },
  { id: "Delivered", name: "Delivered" },
];
const StatusFormContext = createContext<StatusFormType>({
  isOpen: false,
  item: null,
  orderId: null,
  closeForm: () => Promise.resolve(),
  openForm: () => Promise.resolve(),
});

export const useStatusForm = () => useContext(StatusFormContext);

export function StatusFormProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);

  const openForm = (status: string | null, id: number) => {
    setItem(status);
    setOrderId(id);
    setIsOpen(true);
  };

  const closeForm = () => {
    setItem(null);
    setIsOpen(false);
  };
  return (
    <StatusFormContext.Provider
      value={{ isOpen, item, orderId, closeForm, openForm }}
    >
      {children}
    </StatusFormContext.Provider>
  );
}

const formSchema = z.object({
  status: parseStringWithWhitespace(
    z.string().min(1, "Status title must be least 1 characters"),
  ),
});

interface FormTemplateProps extends HTMLAttributes<HTMLDivElement> {}
export function FormTemplate({ className }: FormTemplateProps) {
  const { item, closeForm, orderId } = useStatusForm();
  // const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: item ? item : "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { error } = await API.UpdateById(
      `order/change-order-status`,
      Number(orderId),
      { status: values?.status },
    );
    if (!!error) {
      toast({ ...toastErrorMessage, description: error.message || error });
      return;
    }
    toast({
      ...toastSuccessMessage,
      description: "Order status updated successfully",
    });
    await clearDataCache("paymentStatus");
    closeForm();
  };
  return (
    <>
      <div className="max-w-[600px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("w-full space-y-4", className)}
          >
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <Select
                    {...field}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="lg:min-w-[180px] 2xl:min-w-[200px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {OrderStatusOptions.map((option) => (
                        <SelectItem
                          key={`status_${option.id}`}
                          value={option.id}
                        >
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
    </>
  );
}

export default function StatusForm() {
  const { isOpen, item, closeForm } = useStatusForm();
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
            <DrawerTitle>{item?.id ? "Edit" : "Add"} Status</DrawerTitle>
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
          <DialogHeader>Status Update</DialogHeader>
          <FormTemplate />
        </DialogContent>
      </Dialog>
    </>
  );
}
