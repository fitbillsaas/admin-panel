"use client";
import Pagination from "@/components/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
export default function ProductTable(props: any) {
  return (
    <>
      <Table className="listing-table">
        <TableHeader>
          <TableRow>
            <TableHead>Sl. No</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props?.data?.map((item: any, index: any) => {
            return (
              <TableRow key={`list_${index}`}>
                <TableCell>
                  {(props?.page - 1) * props?.limit + index + 1}
                </TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>--</TableCell>
              </TableRow>
            );
          })}
          {!props?.data.length && (
            <TableRow>
              <TableCell className="text-center" colSpan={3}>
                No data found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Pagination
        currentPage={props?.page}
        totalRecords={props?.count}
        pageSize={props?.limit}
      />
    </>
  );
}
