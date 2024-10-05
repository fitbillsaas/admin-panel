"use client";

import { Spinner } from "@/components/icon";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PopoverContent } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/constant";
import { API } from "@/lib/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
const formSchema = z.object({
  value: z.string().min(1, { message: "Value is required" }),
});
export function EditConfig(data: any) {
  const [valueType, setValueType] = useState("");
  const [nameType, setNameType] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: data?.data?.value || "",
    },
  });
  useEffect(() => {
    setValueType(data?.data?.options?.type);
    setNameType(data?.data?.name);
  }, [data?.data?.name, data?.data?.options?.type, valueType]);
  console.log(nameType, "nameType");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(valueType, nameType);

      if (
        valueType === "number" &&
        nameType !== "hours_for_cancellation" &&
        nameType !== "timer_for_final_reminder"
      ) {
        const valueRegex =
          /^(?:1(?:\.0*)?|1000(?:\.0*)?|0*(?:\d{1,3}))(?:\.\d+)?$/;

        if (!valueRegex.test(values.value)) {
          form.setError("value", {
            type: "valueAsNumber",
            message:
              "Value must be a valid number from 0 to 1000 or a number with a decimal greater than  zero",
          });
          return;
        }
        if (Number(values.value) > 1000) {
          form.setError("value", {
            type: "valueAsNumber",
            message:
              "Value must be a valid number from 1 to 1000 or a number with a decimal greater than  zero",
          });
          return;
        }
        if (Number(values.value) == 0) {
          form.setError("value", {
            type: "valueAsNumber",
            message:
              "Value must be a valid number from 1 to 1000 or a number with a decimal greater than  zero",
          });
          return;
        }
      } else if (
        valueType === "number" &&
        (nameType == "hours_for_cancellation" ||
          nameType == "timer_for_final_reminder")
      ) {
        const regex = /^(?:[1-9][0-9]{0,2}|[1-9][0-9]?)$/;
        if (!regex.test(values.value)) {
          form.setError("value", {
            type: "valueAsNumber",
            message: "Value must be a whole number from 1 to 999",
          });
          return;
        }
      }
      const response = await API.UpdateById("setting", data?.data?.id, {
        value: values.value,
      });
      if (!!response?.error) {
        toast({
          ...toastErrorMessage,
          description: response?.error,
        });
        return;
      } else {
        toast({
          ...toastSuccessMessage,
          description: "Updated successfully",
        });
      }
      setIsPopoverOpen(false);
      router.refresh();
    } catch (error) {}
  }

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <span onClick={() => setIsPopoverOpen(true)}>
            <Pencil1Icon className="h-4 w-4" />
          </span>
        </PopoverTrigger>
        {isPopoverOpen && ( // Render Popover content only if isPopoverOpen is true
          <PopoverContent className="fixed-popover">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground"></p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid 1001 items-center gap-4">
                      <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Value"
                                {...field}
                                className="col-span-2 h-8"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid  items-center gap-4">
                      <Button
                        disabled={form.formState.isSubmitting}
                        className="mt-1.5"
                        type="submit"
                      >
                        {form.formState.isSubmitting && (
                          <Spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </PopoverContent>
        )}
      </Popover>
    </>
  );
}
