"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { User } from "@/models/user";
import Image from "next/image";
import userDefault from "../../../../public/images/prof.svg";
export async function RecentCustomers({ users }: { users: User[] }) {
  return (
    <div className="space-y-8">
      {users?.map((item, index) => (
        <div className="flex items-center " key={`order_list_${index}`}>
          <Avatar className="h-9 w-9">
            {/* <AvatarImage src="/avatars/01.png" alt="Avatar" /> */}

            <AvatarFallback>
              <Image
                src={item?.avatar || userDefault}
                height={70}
                width={70}
                alt="order"
              />
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{item?.name}</p>
            <p className="text-sm text-muted-foreground">{item?.email}</p>
          </div>
          {/* <div className="ml-auto font-medium">${item?.total}</div> */}
        </div>
      ))}
    </div>
  );
}
