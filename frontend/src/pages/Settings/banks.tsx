import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { CloudUpload } from "lucide-react";
import { useState } from "react";

export const BankSection = () => {
  const [openTransactionModal, setOpenTransactionModal] =
  useState<boolean>(false);
  console.log("🚀 ~ BankSection ~ openTransactionModal:", openTransactionModal)

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  console.log("🚀 ~ BankSection ~ selectedFile:", selectedFile);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event || !event.target.files) return;
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  return (
    <section className="flex flex-col space-y-6 xl:w-2/3 ">
      <div className=" pt-4 px-4 py-6 rounded-lg min-w-80 bg-white">
        <div className="flex flex-col gap-2 ">
          <h3 className="font-semibold text-xl">
            Import Bank / Card Statement{" "}
          </h3>
          <div className="">
            <p>
              Sync your card transactions — just connect your account and your
              expenses are automatically imported into Pecunia.
            </p>
          </div>
          <div className="flex  justify-end mt-4  ">
            <Button
              onClick={() => setOpenTransactionModal(true)}
              variant="outline"
            >
              Import transaction from file
            </Button>
          </div>
        </div>
      </div>
      <Modal className=" items-end">
        <div className="flex flex-col  border-slate-600 p-4 w-full md:w-[40%] rounded-lg  bg-white ">
          <div className="flex flex-col gap-4">
            {!selectedFile && (
              <div className="flex flex-col gap-8 w-full border-b pb-6">
                <p className="font-semibold">Import Transaction</p>
                <div className="w-full flex relative bg-secondary/80 justify-center items-center h-60 border-dashed border-slate-600 border-2 rounded-lg pb-4">
                  <div className="flex flex-col items-center">
                    <CloudUpload className="mt-1" />
                    <h5 className="font-medium">
                      Drop a file or click to browse
                    </h5>
                    <p>File with up to 10,000 works best</p>
                  </div>
                  <input
                    onChange={(event) => handleFileChange(event)}
                    type="file"
                    className=" absolute w-full h-full top-0 left-0 right-0 opacity-0 cursor-pointer"
                  />
                </div>

                <p>
                  <span className=" underline">Learn more</span> about importing
                  transactions or
                  <span className=" underline">
                    download a sample csv file{" "}
                  </span>
                </p>
              </div>
            )}
            {selectedFile && (
              <div className="flex flex-col gap-2">
                <div className=" flex flex-col gap-2 ">
                  <h2 className="font-semibold text-xl">
                    Idenitfy Transaction
                  </h2>
                  <p>
                    These properties will be userd to identify your transactions
                  </p>
                </div>
                <table className="">
                  <thead className="text-left">
                    <th className="">Columns in your file</th>
                    <th className="">Properties in Pecunia</th>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Date</td>
                      <td>Date</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </section>
  );
};
