"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { truncateToTwoDecimalPlaces } from "@/lib/utils";
import { Orders } from "@/models/orders";
import Image from "next/image";
import Link from "next/link";
import orderLogo from "../../../../public/images/order.png";

export async function RecentOrders({ orders }: { orders: Orders[] }) {
  return (
    <div className="space-y-8">
      {orders?.map((item, index) => (
        <div
          // className="flex items-center cursor-pointer"
          key={`order_list_${index}`}
        >
          <Link
            className="flex items-center"
            href={`/order-management/order-detail/${item?.uid}`}
            key={`dashboard_card_${index}`}
          >
            <Avatar className="h-9 w-9">
              {/* <AvatarImage src="/avatars/01.png" alt="Avatar" /> */}
              <AvatarFallback>
                <Image src={orderLogo} height={70} width={70} alt="order" />
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{item?.uid}</p>
              <p className="text-sm text-muted-foreground">
                {item?.user?.email}
              </p>
            </div>
            <div className="ml-auto font-medium">
              ${truncateToTwoDecimalPlaces(item?.total)}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
