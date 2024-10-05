import { Breadcrumb } from "@/components/breadcrumb";
import { DateTimePipe } from "@/components/date-pipe";
import { Card, CardContent } from "@/components/ui/card";
import { API, ApiResponse } from "@/lib/fetch";
import { truncateToTwoDecimalPlaces } from "@/lib/utils";
import { DashboardIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { TiClipboard } from "react-icons/ti";
import ActionStatus from "../../components/action-status";
import MarkasReturn from "../../components/mark-as-return";
import OrderTimeline from "../../components/order-timeline";
import StatusForm, { StatusFormProvider } from "../../components/status-modal";
const getDetailsBySlug = async ({
  uid,
}: {
  uid: string;
}): Promise<ApiResponse> => {
  const res = await API.Get(
    `order/${uid}`,
    {
      populate: [
        "current_status",
        "status_logs",
        "payments",
        "items",
        "address",
        "items.product",
        "items.product.product_primary_image",
        "items.item_review",
        "coupon",
        "user",
      ],
    },
    undefined,
    {
      next: { tags: ["paymentCurrentStatus", "paymentStatus"] },
    },
  );
  return res;
};

export default async function UpdateProduct({
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
            title: "Order management",
            link: "/order-management",
            icon: TiClipboard,
          },
          {
            title: "Order detail",
            icon: Pencil1Icon,
            active: true,
          },
        ]}
      />
      <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
        <div className="w-full border-b border-[#f0f0f0]">
          <div className="container p-5">
            <div className="main_title flex justify-between gap-2 flex-wrap md:px-[15px] md:items-center flex-col md:flex-row">
              <div className="title_left flex-[0.8]">
                <OrderTimeline logs={data?.order?.status_logs} />
              </div>
              <div className="title_right flex gap-2 flex-wrap">
                <StatusFormProvider>
                  <ActionStatus
                    orderStatus={data?.order?.status}
                    orderId={data?.order?.id}
                  />
                  <StatusForm />
                </StatusFormProvider>
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
                    <span className="text-[#28D0B0]">{data?.order?.uid}</span>
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
                      <DateTimePipe date={data?.order?.created_at} />
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
        {data?.order?.items?.map((item: any) => (
          <div className="w-full" key={item.id}>
            <div className="container pb-5 m-auto">
              <Card
                className={`m-0 ${item.status === "Returned" ? "bg-[#f3dede]" : ""}`}
              >
                <CardContent className="flex flex-wrap pt-6 items-center">
                  <div className="w-full lg:w-3/4 order_itm_left">
                    <h3 className="text-[20px]">
                      <b>{item?.product?.product_name}</b>
                    </h3>
                    <p>{item?.product?.product_description}</p>
                    <p>
                      <b>
                        Price:{" "}
                        {/* <span>
                          $
                          {truncateToTwoDecimalPlaces(
                            item?.product?.product_price,
                          )}
                        </span> */}
                        {data?.order?.user?.role === "Dispenser" ? (
                          <span>
                            $
                            {truncateToTwoDecimalPlaces(
                              item?.product?.wholesale_price,
                            )}
                          </span>
                        ) : (
                          <span>
                            $
                            {truncateToTwoDecimalPlaces(
                              item?.product?.product_price,
                            )}
                          </span>
                        )}
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
                    <div className="prod_img h-full flex justify-end relative">
                      {/* <Image
                        height={200}
                        width={200}
                        className="object-cover max-h-[200px] m-auto "
                        src={
                          item?.product?.product_primary_image?.product_image
                        }
                        alt={item?.product?.slug}
                      /> */}
                      {item?.status == "Returned" && (
                        <>
                          <p className="text-[#C74848]">Returned</p>
                        </>
                      )}
                      <MarkasReturn order={data?.order} item={item} />
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
                  <div className="desc_area area_item mb-[30px] ">
                    <h2 className="text-[#000] text-[24px] pb-[20px]">
                      Shipping Address
                    </h2>

                    <div className="border border-[#E4E4E4] p-[15px]">
                      <p className="text-[#000] opacity-[.65] mb-[10px]">
                        {data?.order?.address?.shipping_first_name}{" "}
                        {data?.order?.address?.shipping_last_name}
                      </p>
                      <p className="text-[#000] opacity-[.65] mb-[10px]">
                        {data?.order?.address?.shipping_address} ,{" "}
                        {data?.order?.address?.shipping_city},{" "}
                        {data?.order?.address?.shipping_state},{" "}
                        {data?.order?.address?.shipping_zip_code}
                      </p>
                      <p className="text-[#000] opacity-[.65] mb-[10px]">
                        Phone number:{" "}
                        {data?.order?.address?.shipping_phone_code}{" "}
                        {data?.order?.address?.shipping_phone}
                      </p>
                      <p className="text-[#000] opacity-[.65] mb-[10px]">
                        Email: {data?.order?.address?.shipping_email}
                      </p>
                    </div>
                  </div>
                  <div className="desc_area area_item mb-[30px] ">
                    <h2 className="text-[#000] text-[24px] pb-[20px]">
                      Billing Address
                    </h2>

                    <div className="border border-[#E4E4E4] p-[15px]">
                      <p className="text-[#000] opacity-[.65] mb-[10px]">
                        {data?.order?.address?.billing_first_name}{" "}
                        {data?.order?.address?.billing_last_name}
                      </p>
                      <p className="text-[#000] opacity-[.65] mb-[10px]">
                        {data?.order?.address?.billing_address} ,{" "}
                        {data?.order?.address?.billing_city},{" "}
                        {data?.order?.address?.billing_state},{" "}
                        {data?.order?.address?.billing_zip_code}
                      </p>
                      <p className="text-[#000] opacity-[.65] mb-[10px]">
                        Phone number: {data?.order?.address?.billing_phone_code}{" "}
                        {data?.order?.address?.billing_phone}
                      </p>
                      <p className="text-[#000] opacity-[.65] mb-[10px]">
                        Email: {data?.order?.address?.billing_email}
                      </p>
                    </div>
                  </div>
                  <div className="area_item mb-[30px]">
                    <h2 className="text-[#000] text-[24px] pb-[20px]">
                      Price Details
                    </h2>
                    <div className="border border-[#E4E4E4] p-[15px]">
                      <div className="prod_itm ">
                        <div className="flex flex-wrap flex-col ">
                          <div className="odl_item flex justify-between mb-[10px]">
                            <span>Price</span>
                            <span>
                              $
                              {truncateToTwoDecimalPlaces(
                                data?.order?.sub_total,
                              )}
                            </span>
                          </div>

                          {data?.order?.coupon_id && (
                            <div className="odl_item flex justify-between mb-[10px]">
                              <span>
                                Coupon Applied ({data?.order?.coupon?.name})
                              </span>
                              <span>
                                $
                                {truncateToTwoDecimalPlaces(
                                  data?.order?.coupon_discount_amount,
                                )}
                              </span>
                            </div>
                          )}
                          {data?.order?.user?.role !== "Dispenser" && (
                            <>
                              <div className="odl_item flex justify-between mb-[10px]">
                                <span>Shipping Charge</span>
                                <span>
                                  $
                                  {truncateToTwoDecimalPlaces(
                                    data?.order?.shipping_price,
                                  )}
                                </span>
                              </div>
                              <div className="odl_item flex justify-between mb-[10px]">
                                <span>Tax</span>
                                <span>
                                  $
                                  {truncateToTwoDecimalPlaces(data?.order?.tax)}
                                </span>
                              </div>
                            </>
                          )}

                          <div className="odl_item flex justify-between mb-[10px]">
                            <span>
                              <b>Total</b>
                            </span>
                            <span>
                              <b>
                                $
                                {truncateToTwoDecimalPlaces(data?.order?.total)}
                              </b>
                            </span>
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
