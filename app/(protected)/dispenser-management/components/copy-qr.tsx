"use client";
import Tooltip from "@/components/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { toastSuccessMessage } from "@/lib/constant";
import { User } from "@/models/user";
import { MdContentCopy } from "react-icons/md";
export default function CopyQR({ item }: { item: User }) {
  const { toast } = useToast();

  const copyToClipboard = (url: string) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast({
          ...toastSuccessMessage,
          description: "QR Code copied to clipboard",
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };
  return (
    <Tooltip content="Copy URL">
      <MdContentCopy
        className="h-5 w-5 cursor-pointer"
        onClick={() => {
          copyToClipboard(item?.qr_code);
        }}
      />
    </Tooltip>
  );
}
