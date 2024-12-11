import { CloudUpload } from "lucide-react";
import { useState } from "react";

import { useExpense } from "@/lib/providers/ExpenseProvier";

interface Props {
  handleSetActiveTab: (tab: "scan" | "multiple" | "single" | null) => void;
}

export const ReceiptUploadComponent: React.FC<Props> = ({
  handleSetActiveTab,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { handleReceiptUpload, scanStatus } = useExpense();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event || !event.target.files) return;
    const file = event.target.files[0];
    console.log("🚀 ~ handleFileChange ~ file:", file);

    handleReceiptUpload(file);
    setSelectedFile(file);
    handleSetActiveTab(null);
  };

  return (
    <div>
      <div className="flex w-full flex-col h-14 p-4  gap-4 justify-center  md:h-[320px]  ">
        <h2 className=" font-semibold text-lg">Upload a Receipt</h2>
        <div className=" w-full h-full   rounded-xl  relative">
          <input
            onChange={(event) => handleFileChange(event)}
            type="file"
            className=" absolute w-full h-full top-0 left-0 right-0 opacity-0 cursor-pointer"
          />

          {!selectedFile && (
            <div className="w-full flex relative bg-secondary/80 justify-center items-center h-60 border-dashed border-slate-600 border-2 rounded-lg pb-4">
              <div className="flex flex-col items-center">
                <CloudUpload className="mt-1" />
                <h5 className="font-medium">
                  Drop an image or click to browse
                </h5>
              </div>
              <input
                onChange={(event) => handleFileChange(event)}
                type="file"
                className=" absolute w-full h-full top-0 left-0 right-0 opacity-0 cursor-pointer"
              />
            </div>
          )}
          {selectedFile && (
            <>
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className=" w-full h-full object-cover rounded-xl hidden md:block"
              />
              <div className="w-full h-full items-center justify-center flex gap-2 md:hidden">
                <CloudUpload className="mt-1" />
                <p className="text-lg">{selectedFile.name}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
