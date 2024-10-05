"use client";
import MapWithAutocomplete from "@/components/google-place-autocomplete";
import { Spinner } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "@/components/ui/use-toast";
import { UpdateContext } from "@/components/update-provider";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/constant";
import { API } from "@/lib/fetch";
import { isValidPhone, isValidZipCode } from "@/lib/utils";
import { setValidationErrors } from "@/lib/validations";
import { State } from "@/models/state";
import { User } from "@/models/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useContext, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import StateSelection from "./sate-provider";
import Uploader, { UploaderRef } from "./uploader";

const formSchema = z.object({
  first_name: z
    .string()
    .nonempty("Please enter your first name.")
    .min(1)
    .max(
      30,
      "Your last name exceeds the character limit. Please enter a shorter first name.",
    )
    .refine((value) => !/^\s|\s$/.test(value), {
      message: "Leading or trailing white spaces are not allowed",
    })
    .refine((value) => /[a-zA-Z]/.test(value), {
      message:
        "Please enter a valid first name. It should contain at least one alphabet character.",
    }),
  last_name: z
    .string()
    .nonempty("Please enter your last name.")
    .min(1)
    .max(
      30,
      "Your last name exceeds the character limit. Please enter a shorter first name.",
    )
    .refine((value) => !/^\s|\s$/.test(value), {
      message: "Leading or trailing white spaces are not allowed",
    })
    .refine((value) => /[a-zA-Z]/.test(value), {
      message:
        "Please enter a valid last name. It should contain at least one alphabet character.",
    }),
  business_name: z
    .string()
    // .nonempty("Please enter your business name.")
    // .min(1)
    .max(
      100,
      "Your last name exceeds the character limit. Please enter a shorter business name.",
    )
    .refine((value) => !/^\s|\s$/.test(value), {
      message: "Leading or trailing white spaces are not allowed",
    }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid email address!"),
  phone: z
    .string()
    .nonempty({
      message: "Phone is required",
    })
    .refine((value) => /^\d*\.?\d+$/.test(value), {
      message: "Invalid number format",
    })
    .refine(
      (value) => !value || isValidPhone(value),
      "Phone number should be valid",
    ),
  address: z
    .string()
    .min(1, "Address is required")
    .refine((value) => !/^\s|\s$/.test(value), {
      message: "Leading or trailing white spaces are not allowed",
    })
    .refine(
      (value) => {
        // Check if the string is not empty and contains at least one letter
        return value === "" || /[a-zA-Z]/.test(value);
      },
      {
        message: "Address should contain at least one letter",
      },
    ),
  city: z
    .string()
    .min(1, "City is required")
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
  state: z
    .string()
    .min(1, "State is required")
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
  zip_code: z
    .string()
    .nonempty({
      message: "Zip code is required",
    })
    .refine((value) => /^\d*\.?\d+$/.test(value), {
      message: "Invalid number format",
    })
    .refine(
      (value) => !value || isValidZipCode(value),
      "Zip code should be valid",
    ),
  image: z.array(z.any()),
});

export default function DispenserForm({
  customer,
  states,
}: {
  customer?: User;
  states: State[];
}) {
  const router = useRouter();
  const { updateFn, setOptions } = useContext(UpdateContext);
  const [loader, setLoader] = useState(false);

  const [location, setLocation] = useState({
    lat: "",
    lng: "",
  });
  const handleLocationChange = async (locationData: any) => {
    setLocation(locationData);
    form.setValue("city", locationData?.city);
    form.setValue("address", locationData?.address);
    form.setValue("state", locationData?.state);
    form.setValue("zip_code", locationData?.zipCode);

    // form.setValue("state", locationData?.state);
    const validationResults = await Promise.all([
      // form.trigger("city"),
      // form.trigger("address"),
      form.trigger("state"),
      form.trigger("zip_code"),
    ]);
    const hasErrors = validationResults.some((result) => !!result);
    if (!hasErrors) {
      form.clearErrors(["city", "address", "zip_code"]);
    }
  };
  const handleStateChange = async (locationData: any) => {
    console.log("🚀 ~ handleStateChange ~ locationData:", locationData);
    form.setValue("state", locationData?.code);
    const validationResults = await Promise.all([]);
    const hasErrors = validationResults.some((result) => !!result);
    if (!hasErrors) {
      form.clearErrors(["state"]);
    }
  };
  const uploaderRef = useRef<UploaderRef>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: customer?.first_name || "",
      last_name: customer?.last_name || "",
      business_name: customer?.business_name || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
      address: customer?.address || "",
      city: customer?.city || "",
      state: customer?.state || "",
      zip_code: customer?.zip_code || "",
      image: customer?.avatar
        ? [{ uploaded: true, data: { file: customer.avatar } }]
        : [],
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const isValid = form.formState.errors;
    if (Object.keys(isValid).length === 0 && customer) {
      setOptions({
        message: "Are you sure, you want to update this dispenser?",
        description:
          "Are you sure you want to update this dispenser? This action cannot be reversed.",
      });
      updateFn(() => submitForm(values));
    } else if (Object.keys(isValid).length === 0 && !customer) {
      setLoader(true);
      submitForm(values);
    } else {
      return;
    }
  }
  async function submitForm(values: z.infer<typeof formSchema>) {
    const formData = {
      first_name: values.first_name,
      last_name: values.last_name,
      business_name: values.business_name,
      email: values.email,
      phone: values.phone,
      address: values.address,
      city: values.city,
      state: values.state,
      zip_code: values.zip_code,
      latitude: location.lat,
      longitude: location.lng,
    };
    if (customer) {
      let resultImage;
      if (values?.image?.length) {
        await Promise.all(
          values?.image.map(async (x) => {
            if (x?.uploaded === false) {
              resultImage = await updateGallery(values.image);
            } else {
              resultImage = customer?.avatar;
            }
          }),
        );
      } else {
        resultImage = "";
      }

      const { error, message, validationErrors } = await API.UpdateById(
        "user",
        customer.id,
        {
          ...formData,
          avatar: resultImage,
        },
      );
      if (!!error) {
        if (validationErrors) {
          setValidationErrors(validationErrors, form);
          setLoader(false);
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
        description: "Dispenser Updated Successfully",
      });
      router.replace("/dispenser-management");
      router.refresh();
    } else {
      const resultImage = await updateGallery(values.image);
      const { error, message, validationErrors } = await API.Create(
        "user/dispenser",
        {
          ...formData,
          avatar: resultImage,
        },
      );
      if (!!error) {
        if (validationErrors) {
          setValidationErrors(validationErrors, form);
          setLoader(false);
        } else {
          setLoader(false);
          toast({
            ...toastErrorMessage,
            description: message,
          });
        }
        return;
      }
      setLoader(false);
      toast({
        ...toastSuccessMessage,
        description: "Dispenser Added Successfully",
      });
      router.replace("/dispenser-management");
      router.refresh();
    }
  }

  async function updateGallery(image: any[]) {
    const newItems = image.filter((i) => !i?.data?.file?.id);
    for (let index = 0; index < newItems.length; index++) {
      const element = newItems[index];

      // get presigned url
      const ext = element.data?.file.name.split(".").pop();
      const Key = Date.now() + `.${ext}`;
      const { data, error } = await API.Post("common/presigned-url", {
        key: Key,
      });
      if (!error) {
        await fetch(data.signed_url, {
          method: "PUT",
          body: element?.data?.file,
        });
        return Key;
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Card className="m-0">
          <CardHeader>
            {/* <CardTitle>Customer Details</CardTitle> */}
          </CardHeader>
          <CardContent>
            <div className="p-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Uploader
                        id="images"
                        className="min-h-[80px]"
                        extensions={[".png", ".jpg", ".jpeg"]}
                        field={field}
                        ref={uploaderRef}
                        type="customer_image"
                        multiple={false}
                        fileLength={1}
                        attachments={customer?.avatar ? [customer?.avatar] : []}
                      />
                    </FormControl>
                    <div className="flex justify-center p-3">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Row 1 */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-grow mb-4">
                <Label>First Name</Label>
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="First name"
                          {...field}
                          maxLength={30}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-grow mb-4">
                <Label>Last Name</Label>
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Last name"
                          {...field}
                          maxLength={30}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-grow mb-4">
                <Label>Business Name</Label>
                <FormField
                  control={form.control}
                  name="business_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Business name"
                          {...field}
                          maxLength={100}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-grow mb-4">
                <Label>Email</Label>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Email" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-grow mb-4">
                <Label>Phone</Label>
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Phone"
                          type="text"
                          {...field}
                          maxLength={10}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-grow mb-4">
                <Label>Address</Label>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MapWithAutocomplete
                          {...field}
                          addressLineOne={false}
                          addressLineTwo={false}
                          onLocationChange={handleLocationChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-grow mb-4">
                <Label>City</Label>
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="City"
                          type="text"
                          {...field}
                          maxLength={30}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-grow mb-4">
                <Label>State</Label>
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <StateSelection
                          states={states}
                          onStateChange={(selectedState) => {
                            field.onChange(selectedState.code);
                            handleStateChange(selectedState);
                          }}
                          initialState={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-grow mb-4">
                <Label>Zip Code</Label>
                <FormField
                  control={form.control}
                  name="zip_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Zip code"
                          type="text"
                          {...field}
                          maxLength={5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex sm:flex-1 items-center flex-wrap gap-2 mt-3">
          <Button
            type="button"
            variant="outline"
            className="w-full lg:w-auto"
            onClick={() => {
              router.replace("/dispenser-management");
            }}
          >
            Cancel
          </Button>
          <Button disabled={loader} type="submit" className="w-full lg:w-auto">
            {loader && <Spinner className="mr-2 h-4 w-4 animate-spin" />} Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
