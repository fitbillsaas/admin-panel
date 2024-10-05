"use client";
import { Calendar } from "@/components/custom-calender";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useScreenDetector } from "@/hooks/screen-detector";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/constant";
import { API } from "@/lib/fetch";
import { cn } from "@/lib/utils";
import {
  parseString,
  parseStringWithWhitespace,
  setValidationErrors,
} from "@/lib/validations";
import { Coupon } from "@/models/coupon";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
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
const couponTypeOptions = [
  { id: "percentage", name: "PERCENTAGE" },
  { id: "price", name: "PRICE" },
];
interface CouponFormType {
  isOpen: boolean;
  item: Coupon | null;
  closeForm: () => void;
  openForm: (coupon: Coupon | null) => void;
}
const CouponFormContext = createContext<CouponFormType>({
  isOpen: false,
  item: null,
  closeForm: () => Promise.resolve(),
  openForm: () => Promise.resolve(),
});
export const useCouponForm = () => useContext(CouponFormContext);
export function CouponFormProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<Coupon | null>(null);
  const openForm = (coupon: Coupon | null) => {
    setItem(coupon);
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
  name: parseStringWithWhitespace(z.string().min(1, "Coupon name is required")),
  code: parseStringWithWhitespace(z.string().min(1, "Coupon code is required")),
  coupon_type: parseString(z.string().min(1, "Discount type is required")),
  description: parseStringWithWhitespace(
    z.string().min(1, "Discount description is required"),
  ),
  discount: z
    .string()
    .nonempty({
      message: "Discount is required",
    })
    .refine((value) => /^\d*\.?\d+$/.test(value), {
      message: "Invalid number format",
    })
    .refine(
      (value) => {
        const parsedValue = parseFloat(value);
        return !isNaN(parsedValue) && parsedValue >= 1;
      },
      {
        message: "Discount must be a number greater than or equal to 1",
      },
    ),
  discount_usage: z
    .string()
    .nonempty({
      message: "Use per person is required",
    })
    .refine((value) => /^\d*\.?\d+$/.test(value), {
      message: "Invalid number format",
    })
    .refine(
      (value) => {
        const parsedValue = parseFloat(value);
        return !isNaN(parsedValue) && parsedValue >= 1;
      },
      {
        message: "Use per person must be a number greater than or equal to 1",
      },
    ),
  validity_from: z.date({
    required_error: "Start date is required",
  }),
  validity_to: z.date({
    required_error: "End date is required",
  }),
});

interface FormTemplateProps extends HTMLAttributes<HTMLDivElement> {}
export function FormTemplate({ className }: FormTemplateProps) {
  const { closeForm } = useCouponForm();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      coupon_type: "",
      description: "",
      discount: "",
      discount_usage: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values?.coupon_type == "percentage" && Number(values?.discount) > 100) {
      form.setError("discount", {
        type: "manual",
        message: "Percentage cannot be greater than 100",
      });
      return;
    }
    if (values?.coupon_type == "price" && Number(values?.discount) > 1000) {
      form.setError("discount", {
        type: "manual",
        message: "Price cannot be greater than 1000",
      });
      return;
    }
    const isDatesValid = await compareDates(
      values?.validity_from,
      values?.validity_to,
    );
    if (!isDatesValid) {
      form.setError("validity_to", {
        type: "manual",
        message: "End date cannot be before start date",
      });
      return;
    }
    const payload = {
      ...values,
      owner: "Admin",
      discount: Number(values.discount),
      discount_usage: Number(values.discount_usage),
      valid_from: String(format(new Date(values.validity_from), "yyyy-MM-dd")),
      valid_to: String(format(new Date(values.validity_to), "yyyy-MM-dd")),
    };
    const { error, message, validationErrors } = await API.Create(
      "coupon",
      payload,
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
      description: "Coupon Added Successfully",
    });
    closeForm();
    router.refresh();
  };
  async function compareDates(fromDate: Date, toDate: Date) {
    return new Promise((resolve) => {
      const validityFrom = new Date(fromDate);
      const validityTo = new Date(toDate);

      if (validityTo < validityFrom) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Coupon Name" {...field} maxLength={20} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Coupon Code" {...field} maxLength={10} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coupon_type"
            render={({ field }) => (
              <FormItem>
                <div className="select-wrapper">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Discount Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {couponTypeOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("coupon_type") === "percentage" ? (
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      min={0}
                      {...field}
                      placeholder="Discount (%)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      min={0}
                      {...field}
                      placeholder="Discount ($)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Discount Description"
                    {...field}
                    maxLength={250}
                    rows={5}
                  ></Textarea>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discount_usage"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    maxLength={2}
                    {...field}
                    placeholder="Use per Person"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full">
            <FormField
              control={form.control}
              name="validity_from"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "MM-dd-yyyy")
                          ) : (
                            <span>Start date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date <
                          new Date(new Date().setDate(new Date().getDate() - 1))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full">
            <FormField
              control={form.control}
              name="validity_to"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "MM-dd-yyyy")
                          ) : (
                            <span>End date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date <
                          new Date(new Date().setDate(new Date().getDate() - 1))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
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
    </div>
  );
}
export default function CouponForm() {
  const { isOpen, closeForm } = useCouponForm();
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
            <DrawerTitle>Add Coupon</DrawerTitle>
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
            <DialogTitle>Add Coupon</DialogTitle>
          </DialogHeader>
          <FormTemplate />
        </DialogContent>
      </Dialog>
    </>
  );
}
