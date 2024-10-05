"use client";
import { Spinner } from "@/components/icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { cn, nameShort } from "@/lib/utils";
import { setValidationErrors } from "@/lib/validations";
import { User } from "@/models/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import {
  HTMLAttributes,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface PasswordFormType {
  isOpen: boolean;
  item: User | null;
  closeForm: () => void;
  openForm: (user: User | null) => void;
}
const PasswordFormContext = createContext<PasswordFormType>({
  isOpen: false,
  item: null,
  closeForm: () => Promise.resolve(),
  openForm: () => Promise.resolve(),
});
export const usePasswordForm = () => useContext(PasswordFormContext);
export function PasswordFormProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<User | null>(null);
  const openForm = (user: User | null) => {
    setItem(user);
    setIsOpen(true);
  };

  const closeForm = () => {
    setItem(null);
    setIsOpen(false);
  };
  return (
    <PasswordFormContext.Provider value={{ isOpen, item, closeForm, openForm }}>
      {children}
      <PasswordForm />
    </PasswordFormContext.Provider>
  );
}

const formSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, { message: "New password is required" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "New Password must contain at least an uppercase letter, a lowercase letter, a number, and a special character",
      )
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Confirm Password must contain at least an uppercase letter, a lowercase letter, a number, and a special character",
      )
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

interface FormTemplateProps extends HTMLAttributes<HTMLDivElement> {}
export function FormTemplate({ className }: FormTemplateProps) {
  const { item, closeForm } = usePasswordForm();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prevState) => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { error, validationErrors, message } = await API.Post(
      "user/password-by-admin",
      {
        password: values.newPassword,
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
        description: "Password changed successfully",
      });
      closeForm();
    }
  };

  return (
    <div className="max-w-[600px]">
      <div className="flex items-center justify-between space-x-4 my-3 mx-3">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={item?.avatar} />
            <AvatarFallback>{nameShort(item?.name || "")}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">{item?.name}</p>
            <p className="text-sm text-muted-foreground">{item?.email}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between space-x-4 my-3 mx-3">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("w-full space-y-4", className)}
          >
            <div className="grid gap-1 relative mt-1.5">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="New Password"
                          {...field}
                          onKeyDown={(e) => {
                            if (e.key === " " || e.code === "Space")
                              e.preventDefault();
                          }}
                        />
                        <span
                          className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
                          onClick={toggleNewPasswordVisibility}
                        >
                          {showNewPassword ? (
                            <EyeOpenIcon className="h-4 w-4" />
                          ) : (
                            <EyeClosedIcon className="h-4 w-4" />
                          )}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-1 relative mt-1.5">
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          {...field}
                          onKeyDown={(e) => {
                            if (e.key === " " || e.code === "Space")
                              e.preventDefault();
                          }}
                        />
                        <span
                          className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
                          onClick={toggleConfirmPasswordVisibility}
                        >
                          {showConfirmPassword ? (
                            <EyeOpenIcon className="h-4 w-4" />
                          ) : (
                            <EyeClosedIcon className="h-4 w-4" />
                          )}
                        </span>
                      </div>
                    </FormControl>
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
  const { isOpen, closeForm } = usePasswordForm();
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
            <DrawerTitle>Change Password</DrawerTitle>
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
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <FormTemplate />
        </DialogContent>
      </Dialog>
    </>
  );
}
