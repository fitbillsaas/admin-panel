import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ListOptions, SearchParams } from "@/lib/definitions";
import { API } from "@/lib/fetch";
import { Setting } from "@/models/setting";
import { EditConfig } from "./components/edit-config-form";
export interface CustomSearchParams extends SearchParams {}

interface CustomListOptions extends ListOptions {}

async function getListWithCount(
  options: CustomListOptions,
): Promise<{ settings: Setting[]; count: number }> {
  try {
    const where: any = { group_id: 1 };
    const { data, error } = await API.GetAll("setting", {
      limit: options.limit,
      offset: options.offset,
      where,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    return { settings: [], count: 0 };
  }
}

export default async function GeneralConfigManagement({
  searchParams,
}: {
  searchParams: CustomSearchParams;
}) {
  const limit = -1;
  const page = +searchParams.page || 1;
  const offset = page * limit - limit;

  const { settings } = await getListWithCount({
    offset,
    limit,
  });

  return (
    <>
      <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">General Config</h2>
        </div>
        <div className="flex sm:flex-1 items-center flex-wrap gap-2">
          <Table className="listing-table">
            <TableHeader>
              <TableRow>
                <TableHead>Sl. No</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {settings.map((item, index) => {
                return (
                  <TableRow key={`list_${index}`}>
                    <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                    <TableCell>{item.display_name}</TableCell>
                    <TableCell>{item.value}</TableCell>
                    <TableCell>
                      <EditConfig data={item} />
                    </TableCell>
                  </TableRow>
                );
              })}
              {!settings.length && (
                <TableRow>
                  <TableCell className="text-center" colSpan={3}>
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </>
  );
}
