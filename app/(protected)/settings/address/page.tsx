import { ListOptions, SearchParams } from "@/lib/definitions";
import { API } from "@/lib/fetch";
import { Setting } from "@/models/setting";
import { SenderAddressForm } from "./sender-address-form";
export interface CustomSearchParams extends SearchParams {}

interface CustomListOptions extends ListOptions {}

async function getSenderAddress(
  options: CustomListOptions,
): Promise<{ settings: Setting[]; count: number }> {
  try {
    const where: any = { group_id: 2 };
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

async function getReturnAddress(
  options: CustomListOptions,
): Promise<{ settings: Setting[]; count: number }> {
  try {
    const where: any = { group_id: 3 };
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
  const limit = 10;
  const page = +searchParams.page || 1;
  const offset = page * limit - limit;

  const { settings } = await getSenderAddress({
    offset,
    limit,
  });
  const returnAddress = await getReturnAddress({
    offset,
    limit,
  });

  return (
    <>
      <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Manage Address</h2>
        </div>
        <SenderAddressForm settings={settings} returnAddress={returnAddress} />
      </section>
    </>
  );
}
