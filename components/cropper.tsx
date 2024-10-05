"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import "cropperjs/dist/cropper.css";
import {
  Dispatch,
  HTMLAttributes,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
interface CropperFormType {
  isOpen: boolean;
  item: any | null;
  responseItem: { status?: "success" | "cancel"; data?: any };
  setResponseItem: Dispatch<
    SetStateAction<{ status?: "success" | "cancel"; data?: any }>
  >;
  closeForm: (response: { status?: "success" | "cancel"; data?: any }) => void;
  openForm: (cropper: any | null) => void;
}
const CropperFormContext = createContext<CropperFormType>({
  isOpen: false,
  item: null,
  responseItem: {},
  setResponseItem: () => Promise.resolve(),
  closeForm: () => Promise.resolve(),
  openForm: () => Promise.resolve(),
});
export const useCropperForm = () => useContext(CropperFormContext);

export function CropperFormProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<any | null>(null);
  const [responseItem, setResponseItem] = useState<{
    status?: "success" | "cancel";
    data?: any;
  }>({});
  const openForm = (cropper: any | null) => {
    setItem(cropper);
    setIsOpen(true);
  };

  const closeForm = (response: {
    status?: "success" | "cancel";
    data?: any;
  }) => {
    setItem(null);
    setResponseItem(response);
    setIsOpen(false);
  };

  return (
    <CropperFormContext.Provider
      value={{
        isOpen,
        item,
        closeForm,
        openForm,
        responseItem,
        setResponseItem,
      }}
    >
      {children}
      <SpecificationForm />
    </CropperFormContext.Provider>
  );
}

interface FormTemplateProps extends HTMLAttributes<HTMLDivElement> {}
export function FormTemplate({}: FormTemplateProps) {
  const { item, closeForm } = useCropperForm();
  const cropperRef = useRef<ReactCropperElement>(null);

  const onSubmit = async () => {
    if (cropperRef.current) {
      const imageElement: any = cropperRef?.current;
      const cropperElement: any = imageElement?.cropper;
      const imageData: any = cropperElement.getCroppedCanvas().toDataURL();
      closeForm({
        status: "success",
        data: { item: imageData },
      });
    }
  };

  return (
    <>
      <Cropper
        ref={cropperRef}
        style={{ height: 400, width: 400 }}
        // zoomTo={0.5}
        initialAspectRatio={1 / 1}
        aspectRatio={1 / 1}
        preview=".img-preview"
        src={item}
        viewMode={1}
        minCropBoxHeight={10}
        minCropBoxWidth={10}
        background={false}
        responsive={true}
        autoCropArea={1}
        checkOrientation={false}
        guides={true}
      />
      <div className="flex justify-end mt-4">
        <Button
          className="mr-2"
          onClick={() => {
            closeForm({ status: "cancel" });
          }}
        >
          Cancel
        </Button>
        <Button onClick={onSubmit}>Save</Button>
      </div>
    </>
  );
}

export default function SpecificationForm() {
  const { isOpen, closeForm } = useCropperForm();
  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(s) => {
          if (!s) {
            closeForm({ status: "cancel" });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          <FormTemplate />
        </DialogContent>
      </Dialog>
    </>
  );
}
