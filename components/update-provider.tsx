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

export const UpdateContext = createContext<{
  updateFn: (onConfirm: () => Promise<void>) => Promise<void>;
  setOptions: Dispatch<
    SetStateAction<{
      message: string;
      description: string;
    }>
  >;
}>({
  updateFn: () => Promise.resolve(),
  setOptions: () => Promise.resolve(),
});

export default function UpdateProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [options, setOptions] = useState<{
    message: string;
    description: string;
  }>({
    message: "Are you sure, you want to update this customer?",
    description: "Are you sure you want to update this record?",
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
    <UpdateContext.Provider
      value={{
        updateFn: onClickHandler,
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
    </UpdateContext.Provider>
  );
}
