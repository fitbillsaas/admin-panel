"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
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
import { UserStatusOptions } from "@/lib/options";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { undefined, z } from "zod";
const formSchema = z.object({
  search: z.string().optional(),
  status: z.any().optional(),
  dates: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .optional(),
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

  const { setValue, formState } = form;

  useEffect(() => {
    setValue("search", searchParams.get("search") ?? "");
    setValue("status", searchParams.get("status") ?? undefined);
    if (searchParams.get("from") && searchParams.get("to")) {
      setValue("dates", {
        from: new Date(searchParams.get("from")!),
        to: new Date(searchParams.get("to")!),
      });
    }
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
    router.push(
      pathname +
        "?" +
        createQueryString([
          ["search", values.search],
          ["status", values.status],
          [
            "from",
            values.dates && values.dates?.from
              ? format(values.dates?.from, "MM/dd/yyyy")
              : null,
          ],
          [
            "to",
            values.dates && values.dates?.to
              ? format(values.dates?.to, "MM/dd/yyyy")
              : null,
          ],
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

          <FormField
            control={form.control}
            name="dates"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full lg:min-w-[180px] 2xl:min-w-[200px]",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field?.value?.from ? (
                            field?.value.to ? (
                              <span className="mr-2">
                                {format(field?.value.from, "LLL dd, y")} -{" "}
                                {format(field?.value.to, "LLL dd, y")}
                              </span>
                            ) : (
                              <span className="mr-2">
                                {format(field?.value.from, "LLL dd, y")}
                              </span>
                            )
                          ) : (
                            <span>Created At</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={field.value?.from}
                        selected={field.value}
                        onSelect={field.onChange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                {formState.errors?.dates
                  ? field?.value?.from &&
                    formState.errors?.dates?.to && (
                      <span className="text-[0.8rem] font-medium text-destructive text-red-500">
                        Please select the end date
                      </span>
                    )
                  : null}
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
                    {UserStatusOptions.map((option) => (
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
