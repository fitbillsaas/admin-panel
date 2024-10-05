"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { PersonIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { MdKeyboardArrowDown } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
export function TopMenu() {
  return (
    <NavigationMenu className="hidden lg:block">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Dashboard
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Users
              <MdKeyboardArrowDown className="ml-1 h-4 w-4" />
            </NavigationMenuLink>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/customer-management" passHref>
                <PersonIcon className="mr-2 h-4 w-4" />
                <span>Customer Management</span>
              </Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem asChild>
              <Link href="/applicant-management" passHref>
                <BsJournalMedical className="mr-2 h-4 w-4" />
                <span>Applicant Management</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dispenser-management" passHref>
                <DispenserIcon className="mr-2 h-4 w-4" />
                <span>Dispenser Management</span>
              </Link>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* <DropdownMenu>
          <DropdownMenuTrigger>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Products
              <MdKeyboardArrowDown className="ml-1 h-4 w-4" />
            </NavigationMenuLink>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/category-management" passHref>
                <MdOutlineCategory className="mr-2 h-4 w-4" />
                <span>Category Management</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/product-management" passHref>
                <LuArchive className="mr-2 h-4 w-4" />
                <span>Product Management</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/product-review-management" passHref>
                <MdOutlineRateReview className="mr-2 h-4 w-4" />
                <span>Ratings and Reviews</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Orders
              <MdKeyboardArrowDown className="ml-1 h-4 w-4" />
            </NavigationMenuLink>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/order-management" passHref>
                <TiClipboard className="mr-2 h-4 w-4" />
                <span>Order Management</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/reorder-management" passHref>
                <LuClipboardList className="mr-2 h-4 w-4" />
                <span>Reorder Management</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/commission-report" passHref>
                <ReportIcon className="mr-2 h-4 w-4" />
                <span>Commission Report</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              CMS
              <MdKeyboardArrowDown className="ml-1 h-4 w-4" />
            </NavigationMenuLink>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/content-management" passHref>
                <LuFileEdit className="mr-2 h-4 w-4" />
                <span>Content Management</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/email-template" passHref>
                <LuMail className="mr-2 h-4 w-4" />
                <span>Email Templates</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/testimonials" passHref>
                <MdOutlineSpeakerNotes className="mr-2 h-4 w-4" />
                <span>Testimonials</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Coupons
              <MdKeyboardArrowDown className="ml-1 h-4 w-4" />
            </NavigationMenuLink>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/coupon-management" passHref>
                <RiCoupon2Line className="mr-2 h-4 w-4" />
                <span>General Coupon</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dispenser-coupon-management" passHref>
                <RiCoupon3Line className="mr-2 h-4 w-4" />
                <span>Dispenser Coupon</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}

        {/* <DropdownMenu>
          <DropdownMenuTrigger>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Learn
              <MdKeyboardArrowDown className="ml-1 h-4 w-4" />
            </NavigationMenuLink>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/youtube-video-management" passHref>
                <CiYoutube className="mr-2 h-4 w-4" />
                <span>Youtube Links</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/article-management" passHref>
                <GrArticle className="mr-2 h-4 w-4" />
                <span>Articles</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Gallery
              <MdKeyboardArrowDown className="ml-1 h-4 w-4" />
            </NavigationMenuLink>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-65">
            <DropdownMenuItem asChild>
              <Link href="/gallery-management/image-management" passHref>
                <CiImageOn className="mr-2 h-4 w-4" />
                <span className="whitespace-nowrap">
                  Image Gallery Management
                </span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/gallery-management/gallery-category" passHref>
                <TbCategory className="mr-2 h-4 w-4" />
                <span className="whitespace-nowrap">
                  Gallery Category Management
                </span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/gallery-management/video-management" passHref>
                <GrPlay className="mr-2 h-4 w-4" />
                <span className="whitespace-nowrap">
                  Video Gallery Management
                </span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
        <NavigationMenuItem>
          <Link href="/contact" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Contact
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        {/* <DropdownMenu>
          <DropdownMenuTrigger>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              E-Learning
              <MdKeyboardArrowDown className="ml-1 h-4 w-4" />
            </NavigationMenuLink>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/e-learning/video-management" passHref>
                <ELearnVideoIcon className="mr-2 h-4 w-4" />
                <span>Video Management</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/e-learning/question-management" passHref>
                <ELearnQuestionIcon className="mr-2 h-4 w-4" />
                <span>Question Management</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/e-learning/exam-management" passHref>
                <ELearnExamIcon className="mr-2 h-4 w-4" />
                <span>Exam Management</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}

        {/* <NavigationMenuItem>
          <Link href="/commission-report" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Commission Report
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem> */}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
