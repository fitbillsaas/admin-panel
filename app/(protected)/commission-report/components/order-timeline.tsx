"use client";
import { formatDateTime } from "@/lib/utils";
import { Commission } from "@/models/commission";
import { GrCircleQuestion } from "react-icons/gr";
import { IoIosCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";

function OrderTimeline({ logs }: { logs: Commission }) {
  const logsData = [
    {
      status: "Payment Pending",
      date: logs?.created_at,
    },
  ];
  if (logs?.status !== "Pending") {
    logsData.push({
      status: logs?.status,
      date: logs?.updated_at,
    });
  }

  return (
    <div>
      <ol className=" sm:flex justify-center 111">
        {logsData?.map((item: any, key: any) => (
          <>
            <li className="relative mb-6 sm:mb-0 flex-1 ">
              <div className="flex items-center">
                {item?.status !== "Cancelled" &&
                  item?.status !== "Payment Failed" &&
                  item?.status !== "Shipping Failed" && (
                    <div className="z-10 flex items-center justify-center w-6 h-6 bg-[#28D0B0] rounded-full ">
                      <IoIosCheckmarkCircle className="h-6 w-6 text-[#fff]" />
                    </div>
                  )}
                {(item?.status == "Cancelled" ||
                  item?.status == "Payment Failed" ||
                  item?.status == "Shipping Failed") && (
                  <div className=" flex items-center justify-center w-6 h-6 rounded-full ">
                    <IoMdCloseCircle className="h-6 w-6 text-[#DF0000]" />
                  </div>
                )}
                {key != logsData.length - 1 && (
                  <div className="hidden sm:flex w-full  h-0.5 bg-[#28D0B0]"></div>
                )}
                {key == logsData.length - 1 &&
                  item?.status !== "Paid" &&
                  item?.status !== "Cancelled" && (
                    <>
                      <div className="hidden sm:flex w-full  h-0.5 bg-[#CCCCCC] animate-slide-right"></div>
                      <span>
                        <GrCircleQuestion className="h-6 w-6 text-[#CCCCCC]" />
                      </span>
                    </>
                  )}
              </div>
              <div className="mt-3 sm:pe-8">
                <h6 className="text-[15px]">
                  <b>{item.status}</b>
                </h6>
                <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                  {formatDateTime(item.date)}
                </time>
              </div>
            </li>
          </>
        ))}

        {/* <li className="relative mb-6 sm:mb-0 flex-1">
          <div className="flex items-center">
            <div className="z-10 flex items-center justify-center w-6 h-6 bg-[#28D0B0] rounded-full ">
              <IoIosCheckmarkCircle className="h-6 w-6 text-[#fff]" />
            </div>
            <div className="hidden sm:flex w-full  h-0.5 bg-[#28D0B0]"></div>
          </div>
          <div className="mt-3 sm:pe-8">
            <h6 className="text-[15px]">
              <b>Order Confirmed</b>
            </h6>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              9:00 am, Mar 03
            </time>
          </div>
        </li>
        <li className="relative mb-6 sm:mb-0 flex-1">
          <div className="flex items-center">
            <div className="z-10 flex items-center justify-center w-6 h-6 bg-[#28D0B0] rounded-full ">
              <IoIosCheckmarkCircle className="h-6 w-6 text-[#fff]" />
            </div>
            <div className="hidden sm:flex w-full  h-0.5 bg-[#28D0B0]"></div>
          </div>
          <div className="mt-3 sm:pe-8">
            <h6 className="text-[15px]">
              <b>Order Shipped</b>
            </h6>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              9:00 am, Mar 03
            </time>
          </div>
        </li>
        <li className="relative mb-6 sm:mb-0 flex-1">
          <div className="flex items-center">
            <div className="z-10 flex items-center justify-center w-6 h-6 bg-[#28D0B0] rounded-full ">
              <IoIosCheckmarkCircle className="h-6 w-6 text-[#fff]" />
            </div>
          </div>
          <div className="mt-3 sm:pe-8">
            <h6 className="text-[15px]">
              <b>Delivered</b>
            </h6>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              9:00 am, Mar 03
            </time>
          </div>
        </li> */}
      </ol>
    </div>
  );
}

export default OrderTimeline;
