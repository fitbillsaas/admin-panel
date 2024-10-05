"use client";

import { Spinner } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { toastErrorMessage, toastSuccessMessage } from "@/lib/constant";
import { API } from "@/lib/fetch";
import { setValidationErrors } from "@/lib/validations";
import UserImage from "@/public/images/logos/prof.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Uploader, { UploaderRef } from "./components/uploader";

const profileFormSchema = z.object({
  first_name: z
    .string()
    .min(1, { message: "First name is required" })
    .min(2, {
      message: "First name must be at least 2 characters.",
    })
    .max(30, {
      message: "First name must not be longer than 30 characters.",
    }),
  last_name: z
    .string()
    .min(1, { message: "Last name is required" })
    .min(2, {
      message: "Last must be at least 2 characters.",
    })
    .max(30, {
      message: "Last must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  image: z.array(z.any()),
});

export function ProfileForm({ user }: { user?: any }) {
  const uploaderRef = useRef<UploaderRef>();
  const router = useRouter();
  const { update } = useSession();
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      image: user?.avatar
        ? [{ uploaded: true, data: { file: user.avatar } }]
        : [{ uploaded: true, data: { file: UserImage } }],
    },
  });
  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    let resultImage;
    await Promise.all(
      values?.image.map(async (x) => {
        if (x?.uploaded === false) {
          resultImage = await updateGallery(values.image);
        } else {
          resultImage = user?.avatar;
        }
      }),
    );
    const formData = {
      first_name: values.first_name,
      last_name: values.last_name,
      avatar: resultImage,
    };
    const { error, message, validationErrors, data } = await API.UpdateMe({
      ...formData,
    });
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
      description: "Super Admin Details Updated Successfully",
    });
    await update({ ...data.user });
    router.replace("/");
    router.refresh();
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
          <CardContent className="p-4">
            <div className="p-2.5">
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
                        customer_image={user?.avatar ? user?.avatar : UserImage}
                      />
                    </FormControl>
                    {!user?.avatar && <FormMessage />}
                  </FormItem>
                )}
              />
            </div>
            <div className="p-3.5">
              <div className="flex flex-wrap gap-4">
                <div className="flex-grow mb-4">
                  <div className="mb-1 block">
                    <Label>First Name </Label>
                  </div>
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="First Name"
                            type="text"
                            min={0}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex-grow mb-4">
                  <div className="mb-1 block">
                    <Label>Last Name </Label>
                  </div>
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Last Name"
                            type="text"
                            min={0}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex-grow mb-4">
                  <div className="mb-1 block">
                    <Label>Email </Label>
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Email"
                            type="text"
                            min={0}
                            {...field}
                            readOnly
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="flex sm:flex-1 items-center flex-wrap gap-2 mt-3">
              {/* <Button
                type="button"
                variant="outline"
                className="w-full lg:w-auto"
              >
                Cancel
              </Button> */}
              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
                className="w-full lg:w-auto"
              >
                {form.formState.isSubmitting && (
                  <Spinner className="mr-2 h-4 w-4 animate-spin" />
                )}{" "}
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
