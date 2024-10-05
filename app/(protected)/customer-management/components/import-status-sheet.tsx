"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { ReactNode, createContext, useContext, useState } from "react";

export interface ImportUser {
  ADDRESS: string;
  CITY: string;
  COUNTRY: string;
  EMAIL: string;
  FIRST_NAME: string;
  LAST_NAME: string;
  PHONE: string;
  STATE: string;
  ZIP_CODE: string;
  error?: { path: string[]; message: string }[];
}
export interface SheetData {
  failed: ImportUser[];
  success: ImportUser[];
}
interface ImportStatusSheetType {
  isOpen: boolean;
  item: SheetData | null;
  closeSheet: () => void;
  openSheet: (data: SheetData | null) => void;
}
const ImportStatusSheetContext = createContext<ImportStatusSheetType>({
  isOpen: false,
  item: null,
  closeSheet: () => Promise.resolve(),
  openSheet: () => Promise.resolve(),
});
export const useImportStatusSheet = () => useContext(ImportStatusSheetContext);

export function ImportStatusSheetProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<SheetData | null>(null);
  const openSheet = (data: SheetData | null) => {
    setItem(data);
    setIsOpen(true);
  };

  const closeSheet = () => {
    setItem(null);
    setIsOpen(false);
  };
  return (
    <ImportStatusSheetContext.Provider
      value={{ isOpen, item, closeSheet, openSheet }}
    >
      {children}
      <ImportStatusSheet />
    </ImportStatusSheetContext.Provider>
  );
}

export function ImportStatusSheet() {
  const { isOpen, item, closeSheet } = useImportStatusSheet();
  const router = useRouter();
  return (
    <Sheet
      open={isOpen}
      onOpenChange={(s) => {
        if (!s) {
          closeSheet();
          router.refresh();
        }
      }}
    >
      <SheetContent side="bottom" className="max-h-screen">
        <SheetHeader>
          <SheetTitle>Import Status</SheetTitle>
        </SheetHeader>
        <div className="my-3">
          <Tabs defaultValue="success" className="w-full">
            <TabsList className="grid max-w-[400px] grid-cols-2">
              <TabsTrigger value="success">
                Success ({item?.success?.length})
              </TabsTrigger>
              <TabsTrigger value="failed">
                Failed ({item?.failed?.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="success"
              className="max-h-[80vh] overflow-y-scroll"
            >
              <Table className="listing-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Sl. No</TableHead>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Zip Code</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {item?.success?.map((item, index) => {
                    return (
                      <TableRow key={`failed_list_${1}`}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item?.FIRST_NAME}</TableCell>
                        <TableCell>{item?.LAST_NAME}</TableCell>
                        <TableCell>{item?.EMAIL}</TableCell>
                        <TableCell>{item?.PHONE}</TableCell>
                        <TableCell>{item?.ADDRESS}</TableCell>
                        <TableCell>{item?.CITY}</TableCell>
                        <TableCell>{item?.STATE}</TableCell>
                        <TableCell>{item?.COUNTRY}</TableCell>
                        <TableCell>{item?.ZIP_CODE}</TableCell>
                      </TableRow>
                    );
                  })}
                  {!item?.success?.length && (
                    <TableRow>
                      <TableCell className="text-center" colSpan={11}>
                        No data found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent
              value="failed"
              className="max-h-[80vh] overflow-y-scroll"
            >
              <Table className="listing-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Sl. No</TableHead>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Zip Code</TableHead>
                    <TableHead>Error</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {item?.failed?.map((item, index) => {
                    return (
                      <TableRow key={`failed_list_${index}`}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item?.FIRST_NAME}</TableCell>
                        <TableCell>{item?.LAST_NAME}</TableCell>
                        <TableCell>{item?.EMAIL}</TableCell>
                        <TableCell>{item?.PHONE}</TableCell>
                        <TableCell>{item?.ADDRESS}</TableCell>
                        <TableCell>{item?.CITY}</TableCell>
                        <TableCell>{item?.STATE}</TableCell>
                        <TableCell>{item?.COUNTRY}</TableCell>
                        <TableCell>{item?.ZIP_CODE}</TableCell>
                        <TableCell>
                          {item?.error?.map((e, i) => {
                            return (
                              <ul
                                key={`err-${i}`}
                                className="list-disc list-inside"
                              >
                                <li>
                                  <span className="text-destructive">
                                    {e.path?.map((p) => p)}
                                  </span>
                                  :{" "}
                                  <span className="font-bold">{e.message}</span>
                                </li>
                              </ul>
                            );
                          })}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {!item?.failed?.length && (
                    <TableRow>
                      <TableCell className="text-center" colSpan={11}>
                        No data found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
