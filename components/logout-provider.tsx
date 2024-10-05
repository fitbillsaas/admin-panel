"use client";

import { useRouter } from "next/navigation";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import AlertPopup from "./alert-popup";

interface LogoutProviderType {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

export const LogoutContext = createContext<LogoutProviderType>({
  openModal: false,
  setOpenModal: () => Promise.resolve(),
});

export const useLogoutContext = () => useContext(LogoutContext);

export default function LogoutProvider({ children }: { children: ReactNode }) {
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  const onModalConfirmHandler = async () => {
    setOpenModal(false);
    router.replace("/signout");
  };

  return (
    <LogoutContext.Provider
      value={{
        openModal,
        setOpenModal,
      }}
    >
      {children}
      <AlertPopup
        open={openModal}
        options={{
          message: "Confirm logout",
          description: "Are you sure you want to logout?",
        }}
        onConfirm={onModalConfirmHandler}
        onCancel={() => setOpenModal(false)}
      />
    </LogoutContext.Provider>
  );
}
