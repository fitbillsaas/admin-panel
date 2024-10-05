"use client";

import MapWithAutocomplete from "@/components/google-place-autocomplete";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/constant";
import { API } from "@/lib/fetch";
import { phoneRegex } from "@/lib/utils";
import { setValidationErrors } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  xps_return_address_name: z
    .string()
    .nonempty("Please enter your name")
    .min(1)
    .max(
      255,
      "Your last name exceeds the character limit. Please enter a shorter first name",
    )
    .refine((value) => !/^\s|\s$/.test(value), {
      message: "Leading or trailing white spaces are not allowed",
    })
    .refine((value) => /[a-zA-Z]/.test(value), {
      message: "Please enter a valid name",
    }),
  xps_return_company_name: z
    .string()
    .nonempty("Please enter your company name")
    .min(1)
    .max(
      255,
      "Your company name exceeds the character limit. Please enter a shorter company name",
    )
    .refine((value) => !/^\s|\s$/.test(value), {
      message: "Leading or trailing white spaces are not allowed",
    })
    .refine((value) => /[a-zA-Z]/.test(value), {
      message: "Please enter a valid company name",
    }),

  xps_return_address_email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email("Please enter a valid email address"),

  xps_return_address_address1: z
    .string()
    .nonempty("Please enter your address line 1")
    .min(1)
    .max(
      100,
      "Your address exceeds the character limit. Please enter a shorter address line 1",
    )
    .refine((value) => !/^\s|\s$/.test(value), {
      message: "Leading or trailing white spaces are not allowed",
    })
    .refine(
      (value) => {
        // Check if the string is not empty and contains at least one letter
        return value === "" || /[a-zA-Z]/.test(value);
      },
      {
        message: "Address line 1 should contain at least one letter",
      },
    ),
  xps_return_address_address2: z
    .string()
    .nonempty("Please enter your address line 2")
    .min(1)
    .max(
      100,
      "Your address exceeds the character limit. Please enter a shorter address lin2 2",
    )
    .refine((value) => !/^\s|\s$/.test(value), {
      message: "Leading or trailing white spaces are not allowed",
    })
    .refine(
      (value) => {
        // Check if the string is not empty and contains at least one letter
        return value === "" || /[a-zA-Z]/.test(value);
      },
      {
        message: "Address line 2 should contain at least one letter",
      },
    ),
  xps_return_address_city: z
    .string()
    .nonempty("Please enter your city")
    .min(1)
    .max(
      30,
      "Your city exceeds the character limit. Please enter a shorter city",
    )
    .refine((value) => !/^\s|\s$/.test(value), {
      message: "Leading or trailing white spaces are not allowed",
    })
    .refine(
      (value) => {
        // Check if the string is not empty and contains at least one letter
        return value === "" || /[a-zA-Z]/.test(value);
      },
      {
        message: "City should contain at least one letter",
      },
    ),
  xps_return_address_state: z
    .string()
    .nonempty("Please enter your state")
    .min(1)
    .max(
      30,
      "Your state exceeds the character limit. Please enter a shorter state",
    )
    .refine((value) => !/^\s|\s$/.test(value), {
      message: "Leading or trailing white spaces are not allowed",
    })
    .refine(
      (value) => {
        // Check if the string is not empty and contains only alphabets
        return value === "" || /^[a-zA-Z\s]+$/.test(value);
      },
      {
        message: "State should contain only alphabets and spaces within words",
      },
    ),
  xps_return_address_zip: z
    .string()
    .nonempty("Please enter your zipcode")
    .min(1)
    .max(
      5,
      "Your Zip exceeds the character limit. Please enter a shorter zipcode",
    )
    .refine((value) => !/^\s|\s$/.test(value), {
      message: "Leading or trailing white spaces are not allowed",
    })
    .refine((value) => /^\d*\.?\d+$/.test(value), {
      message: "Invalid number format",
    }),
  xps_return_address_country: z
    .string()
    .min(1, "Country is required")
    .refine((value) => !/^\s|\s$/.test(value), {
      message: "Leading or trailing white spaces are not allowed",
    })
    .refine(
      (value) => {
        // Check if the string is not empty and contains only alphabets
        return value === "" || /^[a-zA-Z\s]+$/.test(value);
      },
      {
        message:
          "Country should contain only alphabets and spaces within words",
      },
    ),
  xps_return_address_phone: z
    .string()
    .nonempty("Please enter your phone")
    .regex(phoneRegex, "Please enter a valid phone number"),
});

function getDefaultValuesFromSettings(returnAddress: any) {
  const defaultValues: any = {};
  returnAddress?.settings?.forEach((setting: any) => {
    if (setting.active && setting.name) {
      defaultValues[setting.name] = setting.value || "";
    }
  });
  return defaultValues;
}

export function ReturnAddressForm({ returnAddress }: { returnAddress: any }) {
  const router = useRouter();
  const defaultValues = getDefaultValuesFromSettings(returnAddress);
  const handleLocationChange = async (locationData: any) => {
    form.setValue("xps_return_address_city", locationData?.city);
    form.setValue("xps_return_address_address1", locationData?.address);
    form.setValue("xps_return_address_state", locationData?.state);
    const validationResults = await Promise.all([
      // form.trigger("city"),
      // form.trigger("address"),
      // form.trigger("state"),
    ]);
    const hasErrors = validationResults.some((result) => !!result);
    if (!hasErrors) {
      form.clearErrors([
        "xps_return_address_city",
        "xps_return_address_address1",
        "xps_return_address_state",
      ]);
    }
  };
  const handleLocationChange2 = async (locationData: any) => {
    form.setValue("xps_return_address_address2", locationData?.address);
    const validationResults = await Promise.all([
      // form.trigger("city"),
      // form.trigger("address"),
      // form.trigger("state"),
    ]);
    const hasErrors = validationResults.some((result) => !!result);
    if (!hasErrors) {
      form.clearErrors(["xps_return_address_address2"]);
    }
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      xps_return_address_name: defaultValues.xps_return_address_name || "",
      xps_return_company_name: defaultValues.xps_return_company_name || "",
      xps_return_address_email: defaultValues.xps_return_address_email || "",
      xps_return_address_address1:
        defaultValues.xps_return_address_address1 || "",
      xps_return_address_address2:
        defaultValues.xps_return_address_address2 || "",
      xps_return_address_city: defaultValues.xps_return_address_city || "",
      xps_return_address_state: defaultValues.xps_return_address_state || "",
      xps_return_address_zip: defaultValues.xps_return_address_zip || "",
      xps_return_address_country:
        defaultValues.xps_return_address_country || "",
      xps_return_address_phone: defaultValues.xps_return_address_phone || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    type AdditionalObject = {
      xps_return_address_name: string;
      xps_return_company_name: string;
      xps_return_address_email: string;
      xps_return_address_address1: string;
      xps_return_address_address2: string;
      xps_return_address_city: string;
      xps_return_address_state: string;
      xps_return_address_zip: string;
      xps_return_address_country: string;
      xps_return_address_phone: string;
    };

    type ResultItem = {
      value: string;
      id: number;
    };

    const nameToIdMap = returnAddress?.settings?.reduce(
      (map: { [x: string]: any }, item: { name: string | number; id: any }) => {
        map[item.name] = item.id;
        return map;
      },
      {} as Record<string, number>,
    );

    const result: ResultItem[] = Object.keys(values).map((key) => ({
      value: values[key as keyof AdditionalObject],
      id: nameToIdMap[key],
    }));

    const { error, message, validationErrors } = await API.Create(
      "setting/bulk",
      result,
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
      description: "Return address saved Successfully",
    });
    router.replace("/settings");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
            <CardDescription>Return address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="xps_return_address_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Name" {...field} maxLength={30} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="xps_return_company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Company Name"
                        {...field}
                        maxLength={30}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="xps_return_address_email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Email" {...field} maxLength={100} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="xps_return_address_address1"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MapWithAutocomplete
                        addressLineOne={true}
                        addressLineTwo={false}
                        {...field}
                        onLocationChange={handleLocationChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-1">
              <FormField
                control={form.control}
                name="xps_return_address_address2"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MapWithAutocomplete
                        {...field}
                        addressLineOne={false}
                        addressLineTwo={true}
                        onLocationChange={handleLocationChange2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-1">
              <FormField
                control={form.control}
                name="xps_return_address_city"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="City" {...field} maxLength={30} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-1">
              <FormField
                control={form.control}
                name="xps_return_address_state"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="State" {...field} maxLength={30} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="xps_return_address_zip"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Zipcode" {...field} maxLength={5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="xps_return_address_country"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Country" {...field} maxLength={30} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="xps_return_address_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div style={{ display: "flex" }}>
                        <span
                          style={{
                            marginRight: "5px",
                            border: "1px solid #ccc",
                            borderRadius: "6px",
                            padding: "5px",
                          }}
                        >
                          +1
                        </span>
                        <Input {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Save changes</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
