"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useRef,
  useState,
} from "react";
import AlertPopup from "./alert-popup";

export const DeleteContext = createContext<{
  deleteFn: (onConfirm: () => Promise<void>) => Promise<void>;
  setOptions: Dispatch<
    SetStateAction<{
      message: string;
      description: string;
    }>
  >;
}>({
  deleteFn: () => Promise.resolve(),
  setOptions: () => Promise.resolve(),
});

export default function DeleteProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [options, setOptions] = useState<{
    message: string;
    description: string;
  }>({
    message: "Are you sure, you want to delete this record?",
    description:
      "Are you sure you want to delete this record?. This action cannot be reversed.",
  });
  const confirmAction = useRef<() => Promise<void>>();

  const onClickHandler = async (onConfirm: () => Promise<void>) => {
    confirmAction.current = onConfirm;
    setOpenModal(true);
  };

  const onModalConfirmHandler = async () => {
    if (typeof confirmAction.current === "function") {
      setIsLoading(true);
      await confirmAction.current();
      setIsLoading(false);
    }
    setOpenModal(false);
  };

  return (
    <DeleteContext.Provider
      value={{
        deleteFn: onClickHandler,
        setOptions,
      }}
    >
      {children}
      <AlertPopup
        open={openModal}
        isLoading={isLoading}
        options={options}
        onConfirm={onModalConfirmHandler}
        onCancel={() => setOpenModal(false)}
      />
    </DeleteContext.Provider>
  );
}
