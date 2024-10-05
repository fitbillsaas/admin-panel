"use server";

import { revalidateTag } from "next/cache";

export default async function clearDataCache(...tags: string[]) {
  tags.forEach((tag) => revalidateTag(tag));
}
