import { Breadcrumb } from "@/components/breadcrumb";
import { DateTimePipe } from "@/components/date-pipe";
import { ReportIcon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { API, ApiResponse } from "@/lib/fetch";
import { truncateToTwoDecimalPlaces } from "@/lib/utils";
import { DashboardIcon } from "@radix-ui/react-icons";
import OrderTimeline from "../../components/order-timeline";
const getDetailsBySlug = async ({
  uid,
}: {
  uid: string;
}): Promise<ApiResponse> => {
  const res = await API.Get(
    "commission/find",
    {
      populate: [
        "order",
        "order.items",
        "order.coupon",
        "order.items.product",
        "order.items.product.product_primary_image",
      ],
      where: { uid: uid },
    },
    undefined,
    {
      next: { tags: ["paymentCurrentStatus", "paymentStatus"] },
    },
  );
  return res;
};

export default async function CommissionDetails({
  params,
}: {
  params: { uid: string };
}) {
  const { data } = await getDetailsBySlug({
    uid: params.uid,
  });
  return (
    <>
      <Breadcrumb
        breadcrumbs={[
          {
            title: "Dashboard",
            link: "/",
            icon: DashboardIcon,
          },
          {
            title: "Commission Report",
            link: "/commission-report",
            icon: ReportIcon,
          },
          // {
          //   title: "Order detail",
          //   icon: Pencil1Icon,
          //   active: true,
          // },
        ]}
      />
      <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
        <div className="w-full border-b border-[#f0f0f0]">
          <div className="container p-5">
            <div className="main_title flex justify-between gap-2 flex-wrap md:px-[15px] md:items-center flex-col md:flex-row">
              <div className="title_left flex-[0.8]">
                <OrderTimeline logs={data?.commission} />
              </div>
              <div className="title_right flex gap-2 flex-wrap">
                {data?.commission?.status == "Pending" && (
                  <Button
                    variant="outline"
                    className="px-[30px] py-[10px] bg-[#FFE8C9] rounded-[45px] text-[#F59414]"
                    size="default"
                  >
                    {data?.commission?.status}
                  </Button>
                )}
                {data?.commission?.status == "Paid" && (
                  <Button
                    variant="outline"
                    className="px-[30px] py-[10px] bg-[#CEFCF3] rounded-[45px] text-[#30D1B3]"
                    size="default"
                  >
                    {data?.commission?.status}
                  </Button>
                )}
                {data?.commission?.status == "Cancelled" && (
                  <Button
                    variant="outline"
                    className="px-[30px] py-[10px] bg-[#CCCCCC] rounded-[45px] text-[#FFFFFF]"
                    size="default"
                  >
                    {data?.commission?.status}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full pt-[40px]">
          <div className="container pb-5 m-auto">
            <div className="order-nav mb-4">
              <div className="flex  gap-3 justify-between mb-2 flex-wrap">
                <div>
                  <h3 className="text-[#000]">
                    Order ID:{" "}
                    <span className="text-[#28D0B0]">
                      {data?.commission?.order?.uid}
                    </span>
                  </h3>
                </div>
                <div className=" flex flex-wrap gap-3">
                  {/* <button className="px-[20px] py-[5px] bg-[#28D0B0] text-[#fff] rounded-[45px]">
                    <i>Reorder cycle: 15 days</i>
                  </button> */}
                  {/* <button className="underline">Change</button> */}
                </div>
              </div>
              <div className="flex gap-0 sm:gap-3 justify-between flex-wrap items-center">
                <div className="od_left my-3">
                  <h3 className="text-[20px]">
                    Order Date:{" "}
                    <span>
                      <DateTimePipe
                        date={data?.commission?.order?.created_at}
                      />
                    </span>
                  </h3>
                </div>
                {/* <div className="od_right flex gap-2 sm:gap-3 items-center flex-wrap">
                  <span className="text-[#28D0B0]">Reorder in 12/03/2024</span>
                  <button className="underline">Cancel Reorder?</button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        {data?.commission?.order?.items?.map((item: any) => (
          <div className="w-full" key={item.id}>
            <div className="container pb-5 m-auto">
              <Card className="m-0">
                <CardContent className="flex flex-wrap pt-6 items-center">
                  <div className="w-full lg:w-3/4 order_itm_left">
                    <h3 className="text-[20px]">
                      <b>{item?.product?.product_name}</b>
                    </h3>
                    <p>{item?.product?.product_description}</p>
                    <p>
                      <b>
                        Price:{" "}
                        <span>
                          $
                          {truncateToTwoDecimalPlaces(
                            item?.product?.product_price,
                          )}
                        </span>
                      </b>
                    </p>
                    <p>
                      <b>Item: {item?.quantity}</b>
                    </p>
                    {/* <p>
                      Order Date:{" "}
                      <span className="text-[#28D0B0]">
                        {formatDate(item?.product?.updated_at)}
                      </span>
                    </p> */}
                  </div>
                  <div className="w-full lg:w-1/4 order_itm_right">
                    <div className="prod_img h-full flex flex-col items-center relative">
                      <img
                        className="object-cover max-h-[200px] m-auto "
                        src={
                          item?.product?.product_primary_image?.product_image
                        }
                        alt={item?.product?.slug}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}

        <div className="w-full">
          <div className="container m-auto">
            <div className="flex flex-wrap">
              <div className="w-full lg:w-4/4">
                <div className="right_items">
                  <div className="area_item mb-[30px]">
                    <h2 className="text-[#000] text-[24px] pb-[20px]">
                      Commission Info
                    </h2>
                    <div className="border border-[#E4E4E4] p-[15px]">
                      <div className="prod_itm ">
                        <div className="flex flex-wrap flex-col ">
                          <div className="odl_item flex justify-between mb-[10px]">
                            <span>Product Total</span>
                            <span>
                              $
                              {truncateToTwoDecimalPlaces(
                                data?.commission?.order_amount,
                              )}
                            </span>
                          </div>
                          <div className="odl_item flex justify-between mb-[10px]">
                            <span>
                              Coupon Applied (
                              {data?.commission?.order?.coupon
                                ? data?.commission?.order?.coupon?.name
                                : ""}
                              )
                            </span>
                            <span>
                              {data?.commission?.order?.coupon
                                ? "$" + data?.commission?.coupon_discount_amount
                                : "NA"}
                            </span>
                          </div>
                          <div className="odl_item flex justify-between mb-[10px]">
                            <span>Internal Fee</span>
                            <span>
                              $
                              {truncateToTwoDecimalPlaces(
                                data?.commission?.internal_fee,
                              )}
                            </span>
                          </div>
                          <div className="odl_item flex justify-between mb-[10px]">
                            <span>Commission Percentage</span>
                            <span>
                              {data?.commission?.commission_percentage}%
                            </span>
                          </div>
                          <div className="odl_item flex justify-between mb-[10px]">
                            <span>
                              <b>Commission Receivable</b>
                            </span>
                            <span>${data?.commission?.commission}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
