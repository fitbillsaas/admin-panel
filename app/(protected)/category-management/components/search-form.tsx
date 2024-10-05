"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statusOptions } from "@/lib/options";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { undefined, z } from "zod";

const formSchema = z.object({
  search: z.string().optional(),
  status: z.any().optional(),
});

export default function SearchForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
      status: undefined,
    },
  });
  const { setValue } = form;
  useEffect(() => {
    setValue("search", searchParams.get("search") ?? "");
    setValue("status", searchParams.get("status") ?? undefined);
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
    router.replace(
      pathname +
        "?" +
        createQueryString([
          ["search", values.search],
          ["status", values.status],
        ]),
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
                  <Input placeholder="Search" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

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
                    {statusOptions.map((option) => (
                      <SelectItem key={`status_${option.id}`} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <Button type="submit">Apply</Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              form.reset({
                search: "",
                status: undefined,
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
