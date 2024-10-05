"use client";

import Uploader, {
  UploaderRef,
} from "@/app/(protected)/product-management/components/uploader";
import { DeleteContext } from "@/components/delete-provider";
import { Spinner } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/constant";
import { API } from "@/lib/fetch";
import { truncateToTwoDecimalPlaces, uuid } from "@/lib/utils";
import {
  parseNumber,
  parseString,
  setValidationErrors,
} from "@/lib/validations";
import { Category } from "@/models/category";
import { Product } from "@/models/product";
import { ProductGallery } from "@/models/product-gallery";
import { Specification } from "@/models/specification";
import { zodResolver } from "@hookform/resolvers/zod";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { BiPlus } from "react-icons/bi";
// import { IoIosStarOutline, IoMdStar } from "react-icons/io";
// import { MdClear } from "react-icons/md";
import { Textarea } from "@/components/ui/textarea";
import "react-quill/dist/quill.snow.css";
import { z } from "zod";
import { useSpecificationForm } from "./ingredient-form";

const formSchema = z.object({
  product_name: parseString(z.string().min(1, "Product name is required")),
  product_description: parseString(
    z.string().min(1, "Product short description is required"),
  ),
  product_description_html: parseString(
    z.string().min(1, "Product long description is required"),
  ),
  product_price: z
    .string()
    .nonempty({
      message: "Product price is required",
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
        message: "Product price must be a number greater than or equal to 1",
      },
    ),

  category_id: z.string({
    required_error: "Category is required",
  }),
  // product_rating: z.number({
  //   required_error: "Product rating is required",
  // }),
  weight_lbs: z
    .string()
    .nonempty({
      message: "Product weight is required",
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
        message: "Product weight must be a number greater than or equal to 1",
      },
    ),
  weight_ounce: parseNumber(
    z.number({
      // required_error: 'Product ounce is required',
    }),
  ),
  wholesale_price: z
    .string()
    .nonempty({
      message: "Product wholesale price is required",
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
        message:
          "Product wholesale price must be a number greater than or equal to 1",
      },
    ),
  product_length: z
    .string()
    .nonempty({
      message: "Product length is required",
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
        message: "Product length must be a number greater than or equal to 1",
      },
    ),
  product_width: z
    .string()
    .nonempty({
      message: "Product width is required",
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
        message: "Product width must be a number greater than or equal to 1",
      },
    ),
  product_height: z
    .string()
    .nonempty({
      message: "Product height is required",
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
        message: "Product height must be a number greater than or equal to 1",
      },
    ),
  images: z.array(z.any()).min(1, "At least one image is required"),
  ingredients: z.array(z.any()).min(1, "At least one ingredient is required"),
});

export default function ProductForm({
  product,
  product_categories,
}: {
  product?: Product;
  product_categories: Category[];
}) {
  const router = useRouter();
  const { deleteFn } = useContext(DeleteContext);
  const { openForm, responseItem } = useSpecificationForm();
  const [ingredients, setIngredients] = useState<Specification[]>(
    product?.productSpecifications
      ? product?.productSpecifications.map((i) => ({ ...i, uid: uuid() }))
      : [],
  );
  const uploaderRef = useRef<UploaderRef>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_name: product?.product_name || "",
      product_description: product?.product_description || "",
      product_description_html: product?.product_description_html || "",
      product_price: product?.product_price
        ? String(product?.product_price)
        : "",
      category_id: product?.product_category
        ? String(product?.product_category)
        : undefined,
      // product_rating: product?.product_rating || 0,
      weight_lbs: product?.weight_lbs ? String(product?.weight_lbs) : "",
      weight_ounce: product?.weight_ounce || undefined,
      wholesale_price: product?.wholesale_price
        ? String(product?.wholesale_price)
        : "",
      product_length: product?.length ? String(product?.length) : "",
      product_width: product?.width ? String(product?.width) : "",
      product_height: product?.height ? String(product?.height) : "",
      ingredients: product?.productSpecifications || [],
      images: product?.productGallery
        ? product?.productGallery.map((attachment) => ({
            uploaded: true,
            isDeleted: false,
            isPrimary: attachment.is_primary === "Y",
            data: {
              file: attachment,
              dataUrl: `${attachment.product_image}`,
            },
          }))
        : [],
    },
  });

  const { watch } = form;

  function weightOnchange(val: any) {
    const weightOunce = val * 16;
    form.setValue("weight_ounce", weightOunce);
  }

  async function deleteSpecification({
    specification,
    idx,
  }: {
    specification: Specification;
    idx: number;
  }) {
    if (specification.id) {
      specification.isDeleted = true;
    } else {
      const newArr = [...ingredients];
      newArr.splice(idx, 1);
      setIngredients(newArr);
    }
    form.setError("ingredients", {
      type: "custom",
      message: "At least one ingredient is required",
    });
  }
  useEffect(() => {
    if (responseItem.status === "success") {
      const newArr = [...ingredients];
      const idx = newArr.findIndex(
        (item) => item.uid === responseItem.data?.uid,
      );
      if (idx !== -1) {
        newArr[idx] = responseItem.data;
        setIngredients(newArr);
        form.setValue("ingredients", newArr);
      } else {
        setIngredients((prevState) => [...prevState, responseItem.data]);
        form.setValue("ingredients", [...ingredients, responseItem.data]);
      }
      form.clearErrors("ingredients");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseItem]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = {
      product_name: values.product_name,
      product_description: values.product_description,
      product_description_html: values.product_description_html,
      product_price: Number(truncateToTwoDecimalPlaces(values.product_price)),
      product_category: values.category_id,
      weight_lbs: Number(values.weight_lbs),
      weight_ounce: values.weight_ounce,
      wholesale_price: Number(
        truncateToTwoDecimalPlaces(values.wholesale_price),
      ),
      length: Number(values.product_length),
      width: Number(values.product_width),
      height: Number(values.product_height),
      // product_rating: values.product_rating,
    };
    if (product) {
      const { error, message, validationErrors, data } = await API.UpdateById(
        "products",
        product.id,
        {
          ...formData,
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
      }

      await updateSpecifications(values.ingredients, data.products);
      await updateGallery(values.images, data.products);

      toast({
        ...toastSuccessMessage,
        description: "Product updated successfully",
      });
      router.replace("/product-management");
      router.refresh();
    } else {
      const { error, message, validationErrors, data } = await API.Create(
        "products",
        {
          ...formData,
          status: "Y",
          is_featured: "N",
          is_veg: "N",
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
      }

      await updateSpecifications(values.ingredients, data.products);
      await updateGallery(values.images, data.products);

      toast({
        ...toastSuccessMessage,
        description: "Product created successfully",
      });
      router.replace("/product-management");
      router.refresh();
    }
  }

  async function updateSpecifications(
    specifications: Specification[],
    item: Product,
  ) {
    const deletedItems = specifications.filter((i) => i.isDeleted);
    for (let index = 0; index < deletedItems.length; index++) {
      const element = deletedItems[index];
      await API.DeleteById("product_specifications", element.id);
    }

    const updatedItems = specifications.filter((i) => i.id && !i.isDeleted);
    for (let index = 0; index < updatedItems.length; index++) {
      const element = updatedItems[index];
      await API.UpdateById("product_specifications", element.id, {
        specification: element.specification,
        specification_details: element.specification_details,
      });
    }

    const newItems = specifications.filter((i) => !i.id && !i.isDeleted);
    for (let index = 0; index < newItems.length; index++) {
      const element = newItems[index];
      await API.Create("product_specifications", {
        product_id: String(item.id),
        specification: element.specification,
        specification_details: element.specification_details,
      });
    }
  }

  async function updateGallery(images: ProductGallery[], item: Product) {
    const deletedItems = images.filter((i) => i.isDeleted);
    for (let index = 0; index < deletedItems.length; index++) {
      const element = deletedItems[index];
      await API.DeleteById("product_gallery", element.data.file.id);
    }

    const newItems = images.filter((i) => !i?.data?.file?.id && !i.isDeleted);
    for (let index = 0; index < newItems.length; index++) {
      const element = newItems[index];

      // get presigned url
      const ext = element.data?.file.name.split(".").pop();
      const Key = Date.now() + `.${ext}`;
      const { data, error } = await API.Post("product_gallery/presigned-url", {
        key: Key,
      });

      if (!error) {
        await fetch(data.signed_url, {
          method: "PUT",
          body: element?.data?.file,
        });
        await API.Create("product_gallery", {
          product_id: String(item.id),
          product_image: Key,
          is_primary: element.isPrimary ? "Y" : "N",
        });
      }
    }

    const updatedItems = images.filter((i) => i.data.file.id && !i.isDeleted);
    for (let index = 0; index < updatedItems.length; index++) {
      const element = updatedItems[index];
      await API.UpdateById("product_gallery", element.data.file.id, {
        is_primary: element.isPrimary ? "Y" : "N",
      });
    }
  }

  useEffect(() => {
    const subscription = watch((values, { name }) => {
      if (name === "weight_lbs") {
        weightOnchange(parseFloat(values?.weight_lbs || "0"));
      }
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Card className="m-0">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-grow">
                <div className="mb-1 block">
                  <Label>Product name</Label>
                </div>
                <FormField
                  control={form.control}
                  name="product_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Product name"
                          {...field}
                          maxLength={50}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-grow">
                <div className="mb-1 block">
                  <Label>Product short description</Label>
                </div>
                <FormField
                  control={form.control}
                  name="product_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          maxLength={250}
                          placeholder="Product short description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-grow">
                <div className="mb-1 block">
                  <Label>Product price ($) </Label>
                </div>
                <FormField
                  control={form.control}
                  name="product_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Product price"
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
              <div className="flex-grow">
                <div className="mb-1 block">
                  <Label>Product wholesale price ($) </Label>
                </div>
                <FormField
                  control={form.control}
                  name="wholesale_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Product wholesale price"
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
              <div className="flex-grow">
                <div className="mb-1 block">
                  <Label>Category</Label>
                </div>
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {product_categories.map((option) => (
                            <SelectItem key={option.id} value={`${option.id}`}>
                              {option.category_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        {/* <Card className="m-0 mt-2">
          <CardHeader>
            <CardTitle>Product Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap ">
              <div className="flex-grow">
                <div className="mb-1 block">
                  <Label>Choose rating</Label>
                </div>
                <FormField
                  control={form.control}
                  name="product_rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Rating
                          {...field}
                          cancelIcon={<MdClear className="h-4 w-4" />}
                          onIcon={<IoMdStar className="h-4 w-4" />}
                          offIcon={<IoIosStarOutline className="h-4 w-4" />}
                          value={field.value}
                          onChange={(e) =>
                            form.setValue("product_rating", e.value || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card> */}
        <Card className="m-0 mt-2">
          <CardHeader>
            <CardTitle>Image Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Uploader
                      id="images"
                      className="min-h-[80px]"
                      extensions={[".png", ".jpg", ".jpeg"]}
                      field={field}
                      ref={uploaderRef}
                      type="product_image"
                      multiple={true}
                      attachments={product?.productGallery || []}
                      fileLength={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="m-0 mt-2">
          <CardHeader>
            <CardTitle>Product Dimensions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-grow">
                <div className="mb-1 block">
                  <Label>Product weight (LBS)</Label>
                </div>
                <FormField
                  control={form.control}
                  name="weight_lbs"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Product weight"
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
              <div className="flex-grow">
                <div className="mb-1 block">
                  <Label>Product weight (Ounce)</Label>
                </div>
                <FormField
                  control={form.control}
                  name="weight_ounce"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Product ounce"
                          type="text"
                          min={0}
                          readOnly
                          {...field}
                        />
                      </FormControl>
                      {/* <FormMessage /> */}
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-grow">
                <div className="mb-1 block">
                  <Label>Product length (cm)</Label>
                </div>
                <FormField
                  control={form.control}
                  name="product_length"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Product length"
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
              <div className="flex-grow">
                <div className="mb-1 block">
                  <Label>Product width (cm)</Label>
                </div>
                <FormField
                  control={form.control}
                  name="product_width"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Product width"
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
              <div className="flex-grow">
                <div className="mb-1 block">
                  <Label>Product height (cm)</Label>
                </div>
                <FormField
                  control={form.control}
                  name="product_height"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Product height"
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
          </CardContent>
        </Card>

        <Card className="m-0 mt-2">
          <CardHeader>
            <CardTitle className="flex justify-between">
              Ingredients
              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={() => {
                  openForm(null);
                }}
              >
                <BiPlus className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="listing-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Sl. No</TableHead>
                  <TableHead>Specification</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead colSpan={2}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ingredients
                  .filter((i) => !i.isDeleted)
                  .map((item, idx) => {
                    return (
                      <TableRow key={`list_${idx}`}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{item.specification}</TableCell>
                        <TableCell>{item.specification_details}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                              >
                                <DotsHorizontalIcon className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-[160px]"
                            >
                              <DropdownMenuItem
                                onClick={() => {
                                  openForm(item);
                                }}
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  deleteFn(() =>
                                    deleteSpecification({
                                      specification: item,
                                      idx,
                                    }),
                                  )
                                }
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {!ingredients.length && (
                  <TableRow>
                    <TableCell className="text-center" colSpan={4}>
                      No data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <FormField
              control={form.control}
              name="ingredients"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="m-0 mt-2">
          <CardHeader>
            <CardTitle>Product Long Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap ">
              <div className="flex-grow">
                <FormField
                  control={form.control}
                  name="product_description_html"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea {...field} maxLength={250} />
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
              router.replace("/product-management");
            }}
          >
            Cancel
          </Button>
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
      </form>
    </Form>
  );
}
