"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  DashboardIcon,
  PaperPlaneIcon,
  Pencil2Icon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BsJournalMedical } from "react-icons/bs";
import { CiImageOn, CiYoutube } from "react-icons/ci";
import { GrArticle, GrPlay } from "react-icons/gr";
import { IoTicketOutline } from "react-icons/io5";
import {
  LuArchive,
  LuArrowDown,
  LuArrowRight,
  LuClipboardList,
  LuUsers,
} from "react-icons/lu";
import {
  MdOutlineCategory,
  MdOutlineMailOutline,
  MdOutlineRateReview,
  MdOutlineSpeakerNotes,
} from "react-icons/md";
import {
  RiContactsBookLine,
  RiCoupon2Line,
  RiCoupon3Line,
} from "react-icons/ri";
import { TbCategory } from "react-icons/tb";
import { TiClipboard } from "react-icons/ti";
import {
  ELearnExamIcon,
  ELearnQuestionIcon,
  ELearnVideoIcon,
  ReportIcon,
} from "../icon";
import { buttonVariants } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

export function SideMenu({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const asPath = usePathname();
  const parentPath =
    asPath.split("/").length > 1 ? "/" + asPath.split("/")[1] : "/";
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isCmsOpen, setIsCmsOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isLearnOpen, setIsLearnOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [isLearningOpen, setIsLearningOpen] = useState(false);
  return (
    <>
      <nav
        className={cn(
          "grid gap-3 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2",
          className,
        )}
      >
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "default", size: "sm" }),
            "dark:bg-white dark:text-black dark:hover:bg-white dark:hover:text-black",
            "justify-start",
          )}
        >
          <DashboardIcon className="mr-2 h-4 w-4" />
          Dashboard
        </Link>

        <Collapsible open={isUserOpen} onOpenChange={setIsUserOpen}>
          <CollapsibleTrigger asChild className="justify-start w-full">
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "dark:bg-white dark:text-black dark:hover:bg-white dark:hover:text-black",
                "justify-start",
              )}
            >
              <LuUsers className="mr-2 h-4 w-4" />
              Users
              <div className="flex justify-end w-full">
                {isUserOpen ? (
                  <LuArrowDown className="h-4 w-4" />
                ) : (
                  <LuArrowRight className="h-4 w-4" />
                )}
              </div>
            </Link>
          </CollapsibleTrigger>
          <CollapsibleContent
            className={cn(isUserOpen && "py-2", "space-y-2 grid")}
          >
            <Link
              href="#"
              className={cn(
                buttonVariants({
                  variant:
                    parentPath === "/customer-management"
                      ? "secondary"
                      : "ghost",
                  size: "sm",
                }),
                "dark:bg-background dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start",
              )}
            >
              <PersonIcon className="mr-2 h-4 w-4" />
              Customer Management
            </Link>
            <Link
              href="#"
              className={cn(
                buttonVariants({
                  variant:
                    parentPath === "/applicant-management"
                      ? "secondary"
                      : "ghost",
                  size: "sm",
                }),
                "dark:bg-background dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start",
              )}
            >
              <BsJournalMedical className="mr-2 h-4 w-4" />
              Applicant Management
            </Link>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={isProductOpen} onOpenChange={setIsProductOpen}>
          <CollapsibleTrigger asChild className="justify-start w-full">
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "dark:bg-white dark:text-black dark:hover:bg-white dark:hover:text-black",
                "justify-start",
              )}
            >
              <LuUsers className="mr-2 h-4 w-4" />
              Products
              <div className="flex justify-end w-full">
                {isProductOpen ? (
                  <LuArrowDown className="h-4 w-4" />
                ) : (
                  <LuArrowRight className="h-4 w-4" />
                )}
              </div>
            </Link>
          </CollapsibleTrigger>
          <CollapsibleContent
            className={cn(isProductOpen && "py-2", "space-y-2 grid")}
          >
            <Link
              href="/category-management"
              className={cn(
                buttonVariants({
                  variant: parentPath === "/categories" ? "secondary" : "ghost",
                  size: "sm",
                }),
                "dark:bg-background dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start",
              )}
            >
              <MdOutlineCategory className="mr-2 h-4 w-4" />
              Category Management
            </Link>
            <Link
              href="/product-management"
              className={cn(
                buttonVariants({
                  variant: parentPath === "/products" ? "secondary" : "ghost",
                  size: "sm",
                }),
                "dark:bg-background dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start",
              )}
            >
              <LuArchive className="mr-2 h-4 w-4" />
              Product Management
            </Link>
            <Link
              href="/product-review-management"
              className={cn(
                buttonVariants({
                  variant: parentPath === "/products" ? "secondary" : "ghost",
                  size: "sm",
                }),
                "dark:bg-background dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start",
              )}
            >
              <MdOutlineRateReview className="mr-2 h-4 w-4" />
              Ratings and Reviews
            </Link>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={isOrderOpen} onOpenChange={setIsOrderOpen}>
          <CollapsibleTrigger asChild className="justify-start w-full">
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "dark:bg-white dark:text-black dark:hover:bg-white dark:hover:text-black",
                "justify-start",
              )}
            >
              <LuUsers className="mr-2 h-4 w-4" />
              Orders
              <div className="flex justify-end w-full">
                {isOrderOpen ? (
                  <LuArrowDown className="h-4 w-4" />
                ) : (
                  <LuArrowRight className="h-4 w-4" />
                )}
              </div>
            </Link>
          </CollapsibleTrigger>
          <CollapsibleContent
            className={cn(isOrderOpen && "py-2", "space-y-2 grid")}
          >
            <Link
              href="/order-management"
              className={cn(
                buttonVariants({
                  variant:
                    parentPath === "/order-management" ? "secondary" : "ghost",
                  size: "sm",
                }),
                "dark:bg-background dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start",
              )}
            >
              <TiClipboard className="mr-2 h-4 w-4" />
              Order Management
            </Link>
            <Link
              href="/reorder-management"
              className={cn(
                buttonVariants({
                  variant:
                    parentPath === "/reorder-management"
                      ? "secondary"
                      : "ghost",
                  size: "sm",
                }),
                "dark:bg-background dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start",
              )}
            >
              <LuClipboardList className="mr-2 h-4 w-4" />
              Reorder Management
            </Link>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={isCmsOpen} onOpenChange={setIsCmsOpen}>
          <CollapsibleTrigger asChild className="justify-start w-full">
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "dark:bg-white dark:text-black dark:hover:bg-white dark:hover:text-black",
                "justify-start",
              )}
            >
              <PaperPlaneIcon className="mr-2 h-4 w-4" />
              CMS
              <div className="flex justify-end w-full">
                {isCmsOpen ? (
                  <LuArrowDown className="h-4 w-4" />
                ) : (
                  <LuArrowRight className="h-4 w-4" />
                )}
              </div>
            </Link>
          </CollapsibleTrigger>
          <CollapsibleContent
            className={cn(isCmsOpen && "py-2", "space-y-2 grid")}
          >
            <Link
              href="/content-management"
              className={cn(
                buttonVariants({
                  variant:
                    parentPath === "/content-management"
                      ? "secondary"
                      : "ghost",
                  size: "sm",
                }),
                "dark:bg-background dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start",
              )}
            >
              <Pencil2Icon className="mr-2 h-4 w-4" />
              Content Management
            </Link>
            <Link
              href="/email-template"
              className={cn(
                buttonVariants({
                  variant:
                    parentPath === "/email-template" ? "secondary" : "ghost",
                  size: "sm",
                }),
                "dark:bg-background dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start",
              )}
            >
              <MdOutlineMailOutline className="mr-2 h-4 w-4" />
              Email Templates
            </Link>
            <Link
              href="/testimonials"
              className={cn(
                buttonVariants({
                  variant:
                    parentPath === "/testimonials" ? "secondary" : "ghost",
                  size: "sm",
                }),
                "dark:bg-background dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start",
              )}
            >
              <MdOutlineSpeakerNotes className="mr-2 h-4 w-4" />
              Testimonials
            </Link>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={isCouponOpen} onOpenChange={setIsCouponOpen}>
          <CollapsibleTrigger asChild className="justify-start w-full">
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "dark:bg-white dark:text-black dark:hover:bg-white dark:hover:text-black",
                "justify-start",
              )}
            >
              <IoTicketOutline className="mr-2 h-4 w-4" />
              Coupons
              <div className="flex justify-end w-full">
                {isCouponOpen ? (
                  <LuArrowDown className="h-4 w-4" />
                ) : (
                  <LuArrowRight className="h-4 w-4" />
                )}
              </div>
            </Link>
          </CollapsibleTrigger>
          <CollapsibleContent
            className={cn(isCouponOpen && "py-2", "space-y-2 grid")}
          >
            <Link
              href="/coupon-management"
              className={cn(
                buttonVariants({
                  variant:
                    parentPath === "/order-management" ? "secondary" : "ghost",
                  size: "sm",
                }),
                "dark:bg-background dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start",
              )}
            >
              <RiCoupon2Line className="mr-2 h-4 w-4" />
              General Coupons
            </Link>
            <Link
              href="/dispenser-coupon-management"
              className={cn(
                buttonVariants({
                  variant:
                    parentPath === "/reorder-management"
                      ? "secondary"
                      : "ghost",
                  size: "sm",
                }),
                "dark:bg-background dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start",
              )}
            >
              <RiCoupon3Line className="mr-2 h-4 w-4" />
              Dispenser Coupons
            </Link>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={isLearnOpen} onOpenChange={setIsLearnOpen}>
          <CollapsibleTrigger asChild className="justify-start w-full">
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "dark:bg-white dark:text-black dark:hover:bg-white dark:hover:text-black",
                "justify-start",
              )}
            >
              <MdOutlineSpeakerNotes className="mr-2 h-4 w-4" />
              Learn
              <div className="flex justify-end w-full">
                {isLearnOpen ? (
                  <LuArrowDown className="h-4 w-4" />
                ) : (
                  <LuArrowRight className="h-4 w-4" />
                )}
              </div>
            </Link>
          </CollapsibleTrigger>
          <CollapsibleContent
            className={cn(isLearnOpen && "py-2", "space-y-2 grid")}
          >
            <Link
              href="/youtube-video-management"
              className={cn(
                buttonVariants({
                  variant: parentPath === "/categories" ? "secondary" : "ghost",
                  size: "sm",
                }),
                "dark:bg-background dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start",
              )}
            >
              <CiYoutube className="mr-2 h-4 w-4" />
              Youtube Links
            </Link>
            <Link
              href="/article-management"
              className={cn(
                buttonVariants({
                  variant: parentPath === "/products" ? "secondary" : "ghost",
                  size: "sm",
                }),
                "dark:bg-background dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start",
              )}
            >
              <GrArticle className="mr-2 h-4 w-4" />
              Articles
            </Link>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
          <CollapsibleTrigger asChild className="justify-start w-full">
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "dark:bg-white dark:text-black dark:hover:bg-white dark:hover:text-black",
                "justify-start",
              )}
            >
              <MdOutlineSpeakerNotes className="mr-2 h-4 w-4" />
              Gallery
              <div className="flex justify-end w-full">
                {isGalleryOpen ? (
                  <LuArrowDown className="h-4 w-4" />
                ) : (
                  <LuArrowRight className="h-4 w-4" />
                )}
              </div>
            </Link>
          </CollapsibleTrigger>
          <CollapsibleContent
            className={cn(isGalleryOpen && "py-2", "space-y-2 grid")}
          >
            <Link
              href="/gallery-management/image-management"
              className={cn(
                buttonVariants({
                  variant: parentPath === "/categories" ? "secondary" : "ghost",
                  size: "sm",
                }),
                "dark:bg-background dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start",
              )}
            >
              <TbCategory className="mr-2 h-4 w-4" />
              Gallery Category Management
            </Link>
            <Link
              href="/gallery-management/image-management"
              className={cn(
                buttonVariants({
                  variant: parentPath === "/categories" ? "secondary" : "ghost",
                  size: "sm",
                }),
                "dark:bg-background dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start",
              )}
            >
              <CiImageOn className="mr-2 h-4 w-4" />
              Image Gallery Management
            </Link>
            <Link
              href="/gallery-management/video-management"
              className={cn(
                buttonVariants({
                  variant: parentPath === "/products" ? "secondary" : "ghost",
                  size: "sm",
                }),
                "dark:bg-background dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start",
              )}
            >
              <GrPlay className="mr-2 h-4 w-4" />
              Video Gallery Management
            </Link>
          </CollapsibleContent>
        </Collapsible>

        <Link
          href="/contact"
          className={cn(
            buttonVariants({ variant: "default", size: "sm" }),
            "dark:bg-white dark:text-black dark:hover:bg-white dark:hover:text-black",
            "justify-start",
          )}
        >
          <RiContactsBookLine className="mr-2 h-4 w-4" />
          Contact
        </Link>
        <Link
          href="/commission-report"
          className={cn(
            buttonVariants({ variant: "default", size: "sm" }),
            "dark:bg-white dark:text-black dark:hover:bg-white dark:hover:text-black",
            "justify-start",
          )}
        >
          <ReportIcon className="mr-2 h-4 w-4" />
          Commission Report
        </Link>

        <Collapsible open={isLearningOpen} onOpenChange={setIsLearningOpen}>
          <CollapsibleTrigger asChild className="justify-start w-full">
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "dark:bg-white dark:text-black dark:hover:bg-white dark:hover:text-black",
                "justify-start",
              )}
            >
              <MdOutlineSpeakerNotes className="mr-2 h-4 w-4" />
              E-Learning
              <div className="flex justify-end w-full">
                {isLearningOpen ? (
                  <LuArrowDown className="h-4 w-4" />
                ) : (
                  <LuArrowRight className="h-4 w-4" />
                )}
              </div>
            </Link>
          </CollapsibleTrigger>
          <CollapsibleContent
            className={cn(isLearningOpen && "py-2", "space-y-2 grid")}
          >
            <Link
              href="/e-learning/video-management"
              className={cn(
                buttonVariants({
                  variant: parentPath === "/categories" ? "secondary" : "ghost",
                  size: "sm",
                }),
                "dark:bg-background dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start",
              )}
            >
              <ELearnVideoIcon className="mr-2 h-4 w-4" />
              Video Management
            </Link>
            <Link
              href="/e-learning/question-management"
              className={cn(
                buttonVariants({
                  variant: parentPath === "/categories" ? "secondary" : "ghost",
                  size: "sm",
                }),
                "dark:bg-background dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start",
              )}
            >
              <ELearnQuestionIcon className="mr-2 h-4 w-4" />
              Question Management
            </Link>
            <Link
              href="/e-learning/exam-management"
              className={cn(
                buttonVariants({
                  variant: parentPath === "/products" ? "secondary" : "ghost",
                  size: "sm",
                }),
                "dark:bg-background dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start",
              )}
            >
              <ELearnExamIcon className="mr-2 h-4 w-4" />
              Exam Management
            </Link>
          </CollapsibleContent>
        </Collapsible>
      </nav>
    </>
  );
}
