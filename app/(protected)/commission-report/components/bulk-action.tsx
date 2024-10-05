"use client";

import Tooltip from "@/components/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useToast } from "@/components/ui/use-toast";
import { useScreenDetector } from "@/hooks/screen-detector";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/constant";
import { API, QueryParams } from "@/lib/fetch";
import { CheckedState } from "@radix-ui/react-checkbox";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { FaCheck } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";

export enum BulkDeleteActionType {
  ADD = "ADD",
  REMOVE = "REMOVE",
  REPLACE = "REPLACE",
}

export interface BulkDeleteAction {
  type: BulkDeleteActionType;
  payload: number[];
}

export const initialState: number[] = [];

export function bulkDeleteReducer(
  state: number[],
  { type, payload }: BulkDeleteAction,
) {
  switch (type) {
    case "ADD": {
      return [...new Set([...state, ...payload])];
    }
    case "REMOVE": {
      return [...state.filter((id) => !payload.includes(id))];
    }
    case "REPLACE": {
      return [...payload];
    }
    default: {
      throw Error("Unknown action: " + type);
    }
  }
}

export const BulkDeleteSelectionContext = createContext<{
  selectedIds: number[];
  pageIds: number[];
  checkAll: boolean;
  defaultChecked: boolean;
  maxLimit: number;
  setCheckAll: Dispatch<SetStateAction<boolean>>;
  dispatch: Dispatch<BulkDeleteAction>;
}>({
  selectedIds: [],
  pageIds: [],
  checkAll: false,
  defaultChecked: false,
  maxLimit: 0,
  setCheckAll: () => Promise.resolve(),
  dispatch: () => Promise.resolve(),
});

export default function BulkDeleteSelectionProvider({
  children,
  defaultChecked,
  pageIds,
  maxLimit,
}: {
  children: ReactNode;
  defaultChecked: boolean;
  pageIds: number[];
  maxLimit: number;
}) {
  const [selectedIds, dispatch] = useReducer(bulkDeleteReducer, initialState);
  const [checkAll, setCheckAll] = useState(defaultChecked);

  return (
    <BulkDeleteSelectionContext.Provider
      value={{
        selectedIds,
        pageIds,
        checkAll,
        defaultChecked,
        maxLimit,
        setCheckAll,
        dispatch,
      }}
    >
      {children}
    </BulkDeleteSelectionContext.Provider>
  );
}

export function CheckAll() {
  const searchParams = useSearchParams();
  const [checked, setChecked] = useState(false);
  const { checkAll, pageIds, dispatch, defaultChecked, selectedIds, maxLimit } =
    useContext(BulkDeleteSelectionContext);

  useEffect(() => {
    setChecked(checkAll);
  }, [checkAll]);

  useEffect(() => {
    if (defaultChecked) {
      dispatch({
        type: BulkDeleteActionType.REPLACE,
        payload: [...pageIds],
      });
    }
  }, [dispatch, defaultChecked, pageIds, searchParams]);
  return (
    <Checkbox
      checked={checked}
      disabled={!checked && selectedIds.length >= maxLimit}
      onCheckedChange={(checked: CheckedState) => {
        if (checked) {
          dispatch({
            type: BulkDeleteActionType.ADD,
            payload: [...pageIds.filter((id) => !selectedIds.includes(id))],
          });
        } else {
          dispatch({
            type: BulkDeleteActionType.REMOVE,
            payload: [...pageIds],
          });
        }
      }}
    />
  );
}

export function Check({ id, status }: { id: number; status: string }) {
  const [checked, setChecked] = useState(false);
  const { selectedIds, pageIds, dispatch, setCheckAll, maxLimit } = useContext(
    BulkDeleteSelectionContext,
  );

  useEffect(() => {
    setChecked(selectedIds.includes(id));
    setCheckAll(
      selectedIds.length > 0 &&
        pageIds.every((item) => selectedIds.includes(item)),
    );
  }, [id, selectedIds, pageIds, setCheckAll]);

  return (
    <Checkbox
      checked={checked}
      disabled={
        (!checked && selectedIds.length >= maxLimit) || status !== "Pending"
      }
      onCheckedChange={(checked: CheckedState) => {
        if (checked) {
          dispatch({
            type: BulkDeleteActionType.ADD,
            payload: [id],
          });
        } else {
          dispatch({
            type: BulkDeleteActionType.REMOVE,
            payload: [id],
          });
        }
      }}
    />
  );
}

export function CheckedStat() {
  // const pathname = usePathname();
  // const router = useRouter();
  // const searchParams = useSearchParams();
  const { selectedIds } = useContext(BulkDeleteSelectionContext);

  // const createQueryString = useCallback(
  //   (page: number) => {
  //     const params = new URLSearchParams(Array.from(searchParams.entries()));
  //     params.set("max", "Y");
  //     params.set("page", `${page}`);
  //     return params.toString();
  //   },
  //   [searchParams],
  // );

  // function onClickHandler(page: number) {
  //   router.push(pathname + "?" + createQueryString(page));
  // }

  return (
    <span className="text-primary-500">
      {selectedIds.length > 0 ? (
        <>{selectedIds.length} record(s) selected</>
      ) : (
        <>{"Please select the records you wish to update the status of"}</>
      )}
      {/* {!searchParams.get("max") ? (
        <span
          className="font-semibold cursor-pointer"
          onClick={() => onClickHandler(1)}
        >
          (Select first {maxLimit} matching records)
        </span>
      ) : (
        pageIds.length === maxLimit && (
          <span
            className="font-semibold cursor-pointer"
            onClick={() =>
              onClickHandler(
                searchParams.get("page") ? +searchParams.get("page")! + 1 : 1
              )
            }
          >
            (Select next {maxLimit} matching records)
          </span>
        )
      )} */}
    </span>
  );
}

export interface DeleteAlertPopupActionData {
  action: "cancel" | "all" | "selected";
  data?: any;
}
export interface DeleteAlertPopupProps {
  title: string;
  description: string;
  open: boolean;
  actionClick?: (obj: DeleteAlertPopupActionData) => void;
  onOpenChange?: (status: boolean) => void;
}
export function DeleteAlertPopup({
  isLoading,
  isRecordSelected,
  open,
  options = {
    message: "Are you sure?",
    description:
      "Are you sure you want to delete the record(s)? This action cannot be reversed.",
  },
  deleteSelectedButton = "Submit",
  deleteAllButton = "Submit",
  cancelButton = "No, Cancel",
  onCancel,
  onConfirm,
}: {
  isLoading?: boolean;
  isRecordSelected?: boolean;
  open: boolean;
  options: {
    message?: string;
    description?: string;
  };
  deleteSelectedButton?: string;
  deleteAllButton?: string;
  cancelButton?: string;
  onCancel?: () => void;
  onConfirm?: (res: DeleteAlertPopupActionData) => void;
}) {
  const { isMobile } = useScreenDetector();
  const { selectedIds } = useContext(BulkDeleteSelectionContext);
  if (isMobile) {
    return (
      <Drawer
        open={open}
        onClose={() => onCancel}
        onRelease={(e, o) => {
          if (!o && onCancel) onCancel();
        }}
      >
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{options?.message}</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">{options?.description}</div>
          <DrawerFooter>
            {selectedIds.length > 0 && (
              <Button
                onClick={() =>
                  onConfirm && onConfirm({ action: "selected", data: null })
                }
                disabled={isLoading || !isRecordSelected}
              >
                {isLoading && <BiLoaderAlt className="animate-spin" />}
                {deleteSelectedButton}
              </Button>
            )}

            {!selectedIds.length && (
              <Button
                onClick={() =>
                  onConfirm && onConfirm({ action: "all", data: null })
                }
                disabled={isLoading}
              >
                {isLoading && <BiLoaderAlt className="animate-spin" />}
                {deleteAllButton}
              </Button>
            )}

            <DrawerClose asChild>
              <Button variant="outline" onClick={onCancel}>
                {cancelButton}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }
  return (
    <>
      <AlertDialog
        open={open}
        onOpenChange={(status) => {
          if (!status) onCancel;
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{options?.message}</AlertDialogTitle>
            <AlertDialogDescription>
              {options?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancel}>
              {cancelButton}
            </AlertDialogCancel>
            {!selectedIds.length && (
              <AlertDialogAction
                onClick={() =>
                  onConfirm && onConfirm({ action: "all", data: null })
                }
                disabled={isLoading}
              >
                {isLoading && <BiLoaderAlt className="animate-spin" />}
                {deleteAllButton}
              </AlertDialogAction>
            )}

            {selectedIds.length > 0 && (
              <AlertDialogAction
                onClick={() =>
                  onConfirm && onConfirm({ action: "selected", data: null })
                }
                disabled={isLoading || !isRecordSelected}
              >
                {isLoading && <BiLoaderAlt className="animate-spin" />}
                {deleteSelectedButton}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function BulkPaidAction({
  url,
  queryParams,
}: {
  url: string;
  queryParams: QueryParams;
  count: number;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const { selectedIds, dispatch } = useContext(BulkDeleteSelectionContext);

  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [options, setOption] = useState<{
    message: string;
    description: string;
  }>({
    message: "Are you sure?",
    description:
      "Are you sure you want to mark as paid this commission(s)? This action cannot be reversed.",
  });
  useEffect(() => {
    setOption({
      message: "Are you sure?",
      description:
        selectedIds?.length > 1
          ? `Are you sure you want to mark as paid the ${selectedIds?.length} items? This action cannot be reversed.`
          : `Are you sure you want to mark as paid the item? This action cannot be reversed.`,
    });
  }, [selectedIds]);

  const createQueryString = useCallback(
    (queries: [string, any][]) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      for (let index = 0; index < queries.length; index++) {
        const query = queries[index];
        if (!query[1]) params.delete(query[0]);
        else params.set(query[0], String(query[1]));
      }
      params.delete("page");
      return params.toString();
    },
    [searchParams],
  );

  function applyFiltersHandler() {
    dispatch({
      type: BulkDeleteActionType.REPLACE,
      payload: [],
    });
    router.push(pathname + "?" + createQueryString([]));
  }

  const onModalConfirmHandler = async ({
    action,
  }: DeleteAlertPopupActionData) => {
    setIsLoading(true);
    if (action === "all") {
      const deleteRes = await API.Post(url, { mode: "All" }, queryParams);
      setIsLoading(false);
      if (!!deleteRes.error) {
        toast({
          ...toastErrorMessage,
          description: deleteRes.message,
        });
        return;
      }
      setOpenModal(false);
      toast({
        ...toastSuccessMessage,
        description: "Status Updated Successfully",
      });
      applyFiltersHandler();
      router.refresh();
      return;
    }

    const deleteRes = await API.Post(url, {
      mode: "Selected",
      ids: selectedIds,
    });
    setIsLoading(false);
    if (!!deleteRes.error) {
      toast({
        ...toastErrorMessage,
        description: deleteRes.message,
      });
      return;
    }
    setOpenModal(false);
    toast({
      ...toastSuccessMessage,
      // description:
      //   selectedIds?.length > 1
      //     ? `${selectedIds?.length} Commissions marks as paid successfully`
      //     : `Commission mark as paid successfully`,
      description: "Status Updated Successfully ",
    });
    applyFiltersHandler();
    router.refresh();
    return;
  };

  return (
    <>
      <Tooltip content="Mark as paid">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpenModal(true)}
        >
          <FaCheck className="h-4 w-4" />
        </Button>
      </Tooltip>
      <DeleteAlertPopup
        open={openModal}
        isLoading={isLoading}
        isRecordSelected={!!selectedIds.length}
        options={options}
        onConfirm={(response) => onModalConfirmHandler(response)}
        onCancel={() => setOpenModal(false)}
      />
    </>
  );
}

export function BulkCanelAction({
  url,
  queryParams,
}: {
  url: string;
  queryParams: QueryParams;
  count: number;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const { selectedIds, dispatch } = useContext(BulkDeleteSelectionContext);

  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [options, setOption] = useState<{
    message: string;
    description: string;
  }>({
    message: "Are you sure?",
    description:
      "Are you sure you want to delete this record(s)? This action cannot be reversed.",
  });
  useEffect(() => {
    setOption({
      message: "Are you sure?",
      description:
        selectedIds?.length > 1
          ? `Are you sure you want to cancel the ${selectedIds?.length} items? This action cannot be reversed.`
          : `Are you sure you want to cancel the item? This action cannot be reversed.`,
    });
  }, [selectedIds]);

  const createQueryString = useCallback(
    (queries: [string, any][]) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      for (let index = 0; index < queries.length; index++) {
        const query = queries[index];
        if (!query[1]) params.delete(query[0]);
        else params.set(query[0], String(query[1]));
      }
      params.delete("page");
      return params.toString();
    },
    [searchParams],
  );

  function applyFiltersHandler() {
    dispatch({
      type: BulkDeleteActionType.REPLACE,
      payload: [],
    });
    router.push(pathname + "?" + createQueryString([]));
  }

  const onModalCancelHandler = async ({
    action,
  }: DeleteAlertPopupActionData) => {
    setIsLoading(true);
    if (action === "all") {
      const deleteRes = await API.Post(url, { mode: "All" }, queryParams);
      setIsLoading(false);
      if (!!deleteRes.error) {
        toast({
          ...toastErrorMessage,
          description: deleteRes.message,
        });
        return;
      }
      setOpenModal(false);
      toast({
        ...toastSuccessMessage,
        description: "Status Updated Successfully ",
      });
      applyFiltersHandler();
      router.refresh();
      return;
    }

    const deleteRes = await API.Post(url, {
      mode: "Selected",
      ids: selectedIds,
    });
    setIsLoading(false);
    if (!!deleteRes.error) {
      toast({
        ...toastErrorMessage,
        description: deleteRes.message,
      });
      return;
    }
    setOpenModal(false);
    toast({
      ...toastSuccessMessage,
      // description:
      //   selectedIds?.length > 1
      //     ? `${selectedIds?.length} Commissions cancelled successfully`
      //     : `Commission cancelled successfully`,
      description: "Status Updated Successfully ",
    });
    applyFiltersHandler();
    router.refresh();
    return;
  };

  return (
    <>
      <Tooltip content="Mark as cancel">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpenModal(true)}
        >
          <RxCross1 className="h-4 w-4" />
        </Button>
      </Tooltip>
      <DeleteAlertPopup
        open={openModal}
        isLoading={isLoading}
        isRecordSelected={!!selectedIds.length}
        options={options}
        onConfirm={(response) => onModalCancelHandler(response)}
        onCancel={() => setOpenModal(false)}
      />
    </>
  );
}
