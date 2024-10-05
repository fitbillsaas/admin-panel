"use client";
import Tooltip from "@/components/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/constant";
import { API } from "@/lib/fetch";
import { User } from "@/models/user";
import { useRouter } from "next/navigation";
export default function GeoTagBtn({ item }: { item: User }) {
  const { toast } = useToast();
  const router = useRouter();
  async function geotagStatusUpdate(item: User, event: any) {
    const payload = {
      geotag: event == false ? false : true,
    };
    const res = await API.UpdateById("user", item?.id, payload);
    if (!!res.data) {
      if (res?.data?.user?.geotag == false) {
        toast({
          ...toastErrorMessage,
          description: "Geotag disabled Successfully",
        });
      } else {
        toast({
          ...toastSuccessMessage,
          description: "Geotag enabled Successfully",
        });
      }
    } else {
      toast({
        description: res?.error,
      });
      return;
    }
    item.active = item?.active == false ? true : false;
    router.refresh();
  }
  return (
    <Tooltip
      content={item?.geotag == true ? "Disable geotag" : "Enable geotag"}
    >
      <div className="relative inline-block cursor-pointer">
        <Checkbox
          checked={item?.geotag}
          onCheckedChange={(e: any) => {
            geotagStatusUpdate(item, e);
          }}
        />
      </div>
    </Tooltip>
  );
}
