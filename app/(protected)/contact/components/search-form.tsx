"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  BulkDeleteActionType,
  BulkDeleteSelectionContext,
} from "./bulk-delete";
const formSchema = z.object({
  search: z.string().optional(),
});

export default function SearchForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const { dispatch } = useContext(BulkDeleteSelectionContext);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  });
  const { setValue } = form;

  useEffect(() => {
    setValue("search", searchParams.get("search") ?? "");
  }, [searchParams, setValue]);

  const createQueryString = useCallback(
    (queries: [string, any][]) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      for (let index = 0; index < queries.length; index++) {
        const query = queries[index];
        if (!query[1]) params.delete(query[0]);
        else params.set(query[0], String(query[1]));
      }
      params.delete("page");
      return params.toString();
    },
    [searchParams],
  );

  function applyFiltersHandler(values: z.infer<typeof formSchema>) {
    dispatch({
      type: BulkDeleteActionType.REPLACE,
      payload: [],
    });
    router.push(
      pathname + "?" + createQueryString([["search", values.search]]),
    );
  }

  return (
    <Form {...form}>
      <form
        className="w-full lg:w-auto"
        onSubmit={form.handleSubmit(applyFiltersHandler)}
      >
        <div className="grid lg:flex flex-wrap gap-2">
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Search"
                    className="lg:min-w-[200px] 2xl:min-w-[320px]"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit">Apply</Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              dispatch({
                type: BulkDeleteActionType.REPLACE,
                payload: [],
              });
              form.reset({
                search: "",
              });
              router.replace(pathname);
            }}
          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}
