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
import { cn } from "@/lib/utils";
import { setValidationErrors } from "@/lib/validations";
import { User } from "@/models/user";
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

interface ChangeDispenserForm {
  isOpen: boolean;
  item: User | null;
  dispensers: User[] | [];
  closeForm: () => void;
  openForm: (user: User | null, dispensers: User[] | []) => void;
}
const ChangeDispenserForm = createContext<ChangeDispenserForm>({
  isOpen: false,
  item: null,
  dispensers: [],
  closeForm: () => Promise.resolve(),
  openForm: () => Promise.resolve(),
});
export const useChangeDispenserForm = () => useContext(ChangeDispenserForm);
export function ChangeDispenserFormProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<User | null>(null);
  const [dispensers, setDispenser] = useState<User[] | []>([]);
  const openForm = (user: User | null, dispensers: User[] | []) => {
    setItem(user);
    setDispenser(dispensers);
    setIsOpen(true);
  };

  const closeForm = () => {
    setItem(null);
    setDispenser([]);
    setIsOpen(false);
  };
  return (
    <ChangeDispenserForm.Provider
      value={{ isOpen, item, dispensers, closeForm, openForm }}
    >
      {children}
      <PasswordForm />
    </ChangeDispenserForm.Provider>
  );
}

const formSchema = z.object({
  dispenser_id: z.string({
    required_error: "Dispenser name is required",
  }),
});

interface FormTemplateProps extends HTMLAttributes<HTMLDivElement> {}
export function FormTemplate({ className }: FormTemplateProps) {
  const { item, closeForm, dispensers } = useChangeDispenserForm();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dispenser_id: item?.dispenser_id ? String(item?.dispenser_id) : undefined,
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { error, validationErrors, message } = await API.Post(
      "user/change-dispenser",
      {
        dispenser_id: Number(values.dispenser_id),
        user_id: Number(item?.id),
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
    } else {
      toast({
        ...toastSuccessMessage,
        description: " Dispenser Assigned Successfully",
      });
      router.refresh();
      closeForm();
    }
  };

  return (
    <div className="max-w-[600px]">
      <div className="flex items-center justify-between space-x-4 my-3 mx-3">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("w-full space-y-4", className)}
          >
            <div className="grid gap-1 relative mt-1.5">
              <FormField
                control={form.control}
                name="dispenser_id"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Dispenser Name" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dispensers?.map((option) => (
                          <SelectItem key={option.id} value={`${option.id}`}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
    </div>
  );
}

export default function PasswordForm() {
  const { isOpen, closeForm } = useChangeDispenserForm();
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
            <DrawerTitle>Assign Dispenser</DrawerTitle>
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
            <DialogTitle>Assign Dispenser</DialogTitle>
          </DialogHeader>
          <FormTemplate />
        </DialogContent>
      </Dialog>
    </>
  );
}
