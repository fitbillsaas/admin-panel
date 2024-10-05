"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface CheatListProviderType {
  openCheatListModal: boolean;
  setOpenCheatListModal: Dispatch<SetStateAction<boolean>>;
}

export const CheatListContext = createContext<CheatListProviderType>({
  openCheatListModal: false,
  setOpenCheatListModal: () => Promise.resolve(),
});

export const useCheatListContext = () => useContext(CheatListContext);

export default function CheatListProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [openCheatListModal, setOpenCheatListModal] = useState(false);

  return (
    <CheatListContext.Provider
      value={{
        openCheatListModal,
        setOpenCheatListModal,
      }}
    >
      {children}
      <Dialog
        open={openCheatListModal}
        onOpenChange={(open) => setOpenCheatListModal(open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Command</TableHead>
                <TableHead>Keybinding</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Dashboard</TableCell>
                <TableCell>
                  <kbd>⌘</kbd> + <kbd>alt</kbd> + <kbd>D</kbd>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Products: Product Management</TableCell>
                <TableCell>
                  <kbd>⌘</kbd> + <kbd>alt</kbd> + <kbd>P</kbd>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Products: Create a product</TableCell>
                <TableCell>
                  <kbd>⌘</kbd> + <kbd>alt</kbd> + <kbd>N</kbd>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Coupons: Coupon Management</TableCell>
                <TableCell>
                  <kbd>⌘</kbd> + <kbd>alt</kbd> + <kbd>C</kbd>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Quick Search</TableCell>
                <TableCell>
                  <kbd>⌘</kbd> + <kbd>alt</kbd> + <kbd>K</kbd>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Keyboard Shortcuts</TableCell>
                <TableCell>
                  <kbd>⌘</kbd> + <kbd>alt</kbd> + <kbd>S</kbd>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Logout</TableCell>
                <TableCell>
                  <kbd>⌘</kbd> + <kbd>alt</kbd> + <kbd>Q</kbd>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </CheatListContext.Provider>
  );
}
