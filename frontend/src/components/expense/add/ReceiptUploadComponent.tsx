import { checkScanStatus, uploadReceipt } from "@/services/transaction";
import { CloudUpload, Loader2 } from "lucide-react";
import { useState } from "react";
import receiptIcon from "@/assets/receipt.png";
export const ReceiptUploadComponent = () => {
  const [scanSessionId, setScanSessionId] = useState<string | null>(null);
  const [scanStatus, setScanStatus] = useState<
    "IDLE" | "PROCESSING" | "COMPLETED" | "FAILED"
  >("IDLE");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [transactionDetails, setTransactionDetails] = useState(null);

  const handleReceiptUpload = async (file: File) => {
    console.log("🚀 ~ handleReceiptUpload ~ file:", file);
    try {
      const res = await uploadReceipt(file);
      console.log("🚀 ~ handleReceiptUpload ~ res:", res);

      setScanSessionId(res.scanSessionId);
      setScanStatus("PROCESSING");

      pollScanStatus(res.scanSessionId);
    } catch (error) {
      console.log(error);
    }
  };

  const pollScanStatus = async (sessionId: string) => {
    const intervalId = setInterval(async () => {
      try {
        const status = await checkScanStatus(sessionId);
        if (status.status === "COMPLETED") {
          clearInterval(intervalId);
          setTransactionDetails(status.extractedData);
          setScanStatus("COMPLETED");
        }
        if (status.status === "FAILED") {
          clearInterval(intervalId);
          setScanStatus("FAILED");
        }
      } catch (error) {
        console.log(error);
      }
    }, 2000);
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event || !event.target.files) return;
    const file = event.target.files[0];
    console.log("🚀 ~ handleFileChange ~ file:", file);

    handleReceiptUpload(file);
    setSelectedFile(file);
  };

  return (
    <div>
      {scanStatus === "IDLE" && (
        <div className="flex w-full h-14 md:w-1/2 items-center justify-center  md:h-[350px]  ">
          <div className=" w-full h-full   rounded-xl border-2 relative">
            <input
              onChange={(event) => handleFileChange(event)}
              type="file"
              className=" absolute w-full h-full top-0 left-0 right-0 opacity-0 cursor-pointer"
            />

            {!selectedFile && (
              <>
                <img
                  className="hidden md:block"
                  src={receiptIcon}
                  width={400}
                />
                <div className="w-full h-full items-center justify-center flex gap-2 sm:hidden">
                  <CloudUpload className="mt-1" />
                  <p className="text-lg">Upload Receipt</p>
                </div>
              </>
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
      )}
      {scanStatus === "PROCESSING" && <Loader2 className="animate-spin" />}
    </div>
  );
};
