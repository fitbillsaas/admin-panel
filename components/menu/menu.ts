import { ReactElement } from "react";

interface BasicMenu {
  id: string;
  label: string;
  isActive?: (pathname: string) => boolean;
  icon?: ReactElement;
  permission?: string;
  dropdown?: boolean;
}

interface MenuWithDropdown extends BasicMenu {
  dropdown?: false;
  url: string;
}

interface MenuWithoutDropdown extends BasicMenu {
  dropdown: true;
  menus: Menu[];
}

type Menu = MenuWithDropdown | MenuWithoutDropdown;

export const menus: Menu[] = [
  {
    id: "dashboard",
    url: "/",
    label: "Dashboard",
    isActive: (pathname) => pathname === "/",
  },
  {
    id: "users",
    label: "Users",
    isActive: (pathname) =>
      pathname === "/customers" || pathname === "/physicians",
    dropdown: true,
    menus: [
      {
        id: "customer-management",
        url: "/customers",
        label: "Customer Management",
        isActive: (pathname) => pathname === "/customers",
      },
      {
        id: "physician-management",
        url: "/physicians",
        label: "Physician Management",
        isActive: (pathname) => pathname === "/physicians",
      },
    ],
  },
  {
    id: "products",
    label: "Products",
    isActive: (pathname) =>
      pathname === "/categories" || pathname === "/physicians",
    dropdown: true,
    menus: [
      {
        id: "category-management",
        url: "/categories",
        label: "Category Management",
        isActive: (pathname) => pathname === "/categories",
      },
      {
        id: "product-management",
        url: "/products",
        label: "Product Management",
        isActive: (pathname) => pathname === "/products",
      },
    ],
  },
  {
    id: "cms",
    label: "CMS",
    isActive: (pathname) =>
      pathname === "/categories" || pathname === "/physicians",
    dropdown: true,
    menus: [
      {
        id: "content-management",
        url: "/content-management",
        label: "Content Management",
        isActive: (pathname) => pathname === "/content-management",
      },
      {
        id: "email-templates",
        url: "/email-template",
        label: "Email Templates",
        isActive: (pathname) => pathname === "/email-template",
      },
    ],
  },
];
