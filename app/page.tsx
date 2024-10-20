import { Breadcrumb } from "@/components/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchParams } from "@/lib/definitions";
import { DashboardIcon, PersonIcon } from "@radix-ui/react-icons";
import Link from "next/link";
export interface CustomSearchParams extends SearchParams {}
// interface CustomListOptions extends ListOptions {}
// async function getLatestOrders(options: CustomListOptions): Promise<{
//   orders: Orders[];
//   count: number;
//   queryParams: QueryParams;
// }> {
//   try {
//     const where: any = {
//       // "$items.product.active$": true,
//       // "$items.product..status$": "Y",
//     };
//     const sort: string[][] = [];
//     if (options.sortField && options.sortDir) {
//       sort.push([options.sortField, options.sortDir]);
//     }
//     const queryParams = {
//       limit: options.limit,
//       offset: options.offset,
//       search: options.search,
//       populate: ["items", "items.product", "user"],
//       where,
//       sort,
//     };
//     const { data, error } = await API.GetAll("order", queryParams, undefined);
//     if (error) throw error;
//     return { ...data, queryParams };
//   } catch (error) {
//     return { orders: [], count: 0, queryParams: {} };
//   }
// }

// async function getLatestCustomers(options: CustomListOptions): Promise<{
//   users: User[];
//   count: number;
//   queryParams: QueryParams;
// }> {
//   try {
//     const where: any = {
//       // "$items.product.active$": true,
//       // "$items.product..status$": "Y",
//     };
//     const sort: string[][] = [];
//     if (options.sortField && options.sortDir) {
//       sort.push([options.sortField, options.sortDir]);
//     }
//     const queryParams = {
//       limit: options.limit,
//       offset: options.offset,
//       search: options.search,
//       where,
//       sort,
//     };
//     const { data, error } = await API.GetAll(
//       "user/customer",
//       queryParams,
//       undefined,
//     );
//     if (error) throw error;
//     return { ...data, queryParams };
//   } catch (error) {
//     return { users: [], count: 0, queryParams: {} };
//   }
// }

// async function getDashboardCounts(): Promise<{
//   [key: string]: { count: number };
// }> {
//   try {
//     const { data, error } = await API.GetAll("dashboard");
//     if (error) throw error;
//     return data.counts; // Assuming data.counts is the correct structure based on your console log
//   } catch (error) {
//     console.error("Error fetching dashboard counts:", error);
//     return {};
//   }
// }

export default async function Dashboard() {
  // const limit = 5;
  // const page = 1;
  // const offset = page * limit - limit;
  // const [{ orders, count }, { users: userData, count: userCount }, counts] =
  //   await Promise.all([
  //     getLatestOrders({
  //       offset,
  //       limit,
  //       sortField: "created_at",
  //       sortDir: "desc",
  //     }),
  //     getLatestCustomers({
  //       offset,
  //       limit,
  //       sortField: "created_at",
  //       sortDir: "desc",
  //     }),
  //     getDashboardCounts(),
  //   ]);

  const cardData: {
    title: string;
    icon: any;
    amount: number;
    link: string;
    api_key: string;
  }[] = [
    {
      title: "Customer Management",
      icon: PersonIcon,
      amount: 0,
      link: "/customer-management",
      api_key: "customer_management",
    },
    // {
    //   title: "Applicant Management",
    //   icon: BsJournalMedical,
    //   amount: 0,
    //   link: "/applicant-management",
    //   api_key: "applicants_management",
    // },
    // {
    //   title: "Dispenser Management",
    //   icon: DispenserIcon,
    //   amount: 0,
    //   link: "/dispenser-management",
    //   api_key: "dispenser_management",
    // },
    // {
    //   title: "Categories",
    //   icon: MdOutlineCategory,
    //   amount: 0,
    //   link: "/category-management",
    // },
    // {
    //   title: "Products",
    //   icon: LuArchive,
    //   amount: 0,
    //   link: "/product-management",
    //   api_key: "products",
    // },
    // {
    //   title: "Orders",
    //   icon: TiClipboard,
    //   amount: 0,
    //   link: "/order-management",
    //   api_key: "orders",
    // },
    // {
    //   title: "Reorders",
    //   icon: LuClipboardList,
    //   amount: 0,
    //   link: "/reorder-management",
    //   api_key: "reorders",
    // },
    // {
    //   title: "Commission Report",
    //   icon: ReportIcon,
    //   amount: 0,
    //   link: "/commission-report",
    //   api_key: "commission_report",
    // },
    // {
    //   title: "Pages",
    //   icon: LuFileEdit,
    //   amount: 0,
    //   link: "/content-management",
    // },
    // {
    //   title: "Templates",
    //   icon: LuMail,
    //   amount: 0,
    //   link: "/email-template",
    // },
    // {
    //   title: "Coupons",
    //   icon: RiCoupon3Line,
    //   amount: 0,
    //   link: "/coupon-management",
    // },
    // {
    //   title: "Testimonials",
    //   icon: MdOutlineSpeakerNotes,
    //   amount: 0,
    //   link: "/testimonials",
    // },
    // {
    //   title: "YouTube Management",
    //   icon: CiYoutube,
    //   amount: 0,
    //   link: "/youtube-video-management",
    //   api_key: "youtube_management",
    // },
    // {
    //   title: "Article Management",
    //   icon: GrArticle,
    //   amount: 0,
    //   link: "/article-management",
    //   api_key: "article_management",
    // },
    // {
    //   title: "E-Learn Video",
    //   icon: ELearnVideoIcon,
    //   amount: 0,
    //   link: "/e-learning/video-management",
    //   api_key: "e_learn_video",
    // },
    // {
    //   title: "E-Learn Question",
    //   icon: ELearnVideoIcon,
    //   amount: 0,
    //   link: "/e-learning/question-management",
    //   api_key: "e_learn_questions",
    // },
    // {
    //   title: "Exam Management",
    //   icon: ELearnExamIcon,
    //   amount: 0,
    //   link: "/e-learning/exam-management",
    //   api_key: "e_learn_exam",
    // },

    // {
    //   title: "Contact",
    //   icon: RiContactsBookLine,
    //   amount: 0,
    //   link: "/contact",
    // },
  ];
  // cardData.forEach((item) => {
  //   if (counts[item.api_key]) {
  //     item.amount = counts[item.api_key].count;
  //   }
  // });
  return (
    <>
      <Breadcrumb
        breadcrumbs={[
          {
            title: "Dashboard",
            link: "#",
            icon: DashboardIcon,
            active: true,
          },
        ]}
      />
      {/* <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 ">
          {cardData?.map((card, index) => (
            <Link href={card?.link} key={`dashboard_card_${index}`}>
              <div className="rounded-xl border bg-card text-card-foreground shadow-lg animate-in fade-in transition-transform transform duration-300 ease-in-out hover:scale-105">
                <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="tracking-tight text-sm font-medium">
                    {card?.title}
                  </h3>
                  {card?.icon && (
                    <card.icon className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="p-6 pt-0">
                  <div className="text-2xl font-bold">
                    <CountUp options={{ start: 0, end: card?.amount }} />
                  </div>
                 
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section> */}

      <ScrollArea className="h-full ">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight ml-14">
              Hi, Welcome back
              <span className="inline-block animate-bounce ml-2">
                &#x1F44B;
              </span>
            </h2>
          </div>
          <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 ">
              {cardData?.map((card: any, index: any) => (
                <Card
                  key={`dashboard_card_${index}`}
                  className=" m-4 rounded-xl border  text-card-foreground shadow-lg animate-in fade-in transition-transform transform duration-300 ease-in-out hover:scale-105 bg-white text-black"
                >
                  <Link href={card?.link}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className=" text-xl font-bold">
                        {card?.title}
                      </CardTitle>
                      {card?.icon && (
                        <card.icon className="h-6 w-6 text-black" />
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl  font-medium">{card?.amount}</div>
                      {/* <p className="text-xs text-muted-foreground">
                        +20.1% from last month
                      </p> */}
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </section>
          {/* <div className="grid grid-cols-1 gap-4 min-[992px]:grid-cols-2 min-[1100px]:grid-cols-2">
            {userData?.length > 0 && (
              <Card className="col-span-1 m-3">
                <CardHeader>
                  <CardTitle>Recent Customers</CardTitle>
                  <CardDescription>
                    {userCount} customers as of now.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {" "}
                  <RecentCustomers users={userData} />
                </CardContent>
              </Card>
            )}

            {orders?.length > 0 && (
              <Card className="col-span-1 m-3">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>{count} orders as of now.</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentOrders orders={orders} />
                </CardContent>
              </Card>
            )}
          </div> */}
        </div>
      </ScrollArea>
    </>
  );
}
