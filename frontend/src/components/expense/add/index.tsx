import { Modal } from "@/components/Modal";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/Input";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import receiptIcon from "@/assets/receipt.png";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import {
  expensesPayMode,
  GroupWithCategoriesType,
} from "@/constants/constants";
import { useBudget } from "@/lib/providers/BudgetProvider";

import { addTransaction } from "@/services/transaction";
import { CloudUpload, X } from "lucide-react";
import { ReceiptUploadComponent } from "./ReceiptUploadComponent";
import { useExpense } from "@/lib/providers/ExpenseProvier";

interface Expense {
  activeTab: "scan" | "multiple" | "single" | null;
  handleSetActiveTab: (tab: "scan" | "multiple" | "single" | null) => void;
}

const tabs: ("single" | "scan" | "multiple")[] = ["single", "multiple", "scan"];

const expenseSingleSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  label: z.string().min(1, "Name is required"),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof expenseSingleSchema>;

const initalState = {
  date: new Date(),
  category: "",
  paidVia: "",
};

export const AddExpense: React.FC<Expense> = ({
  activeTab,
  handleSetActiveTab,
}) => {
  const [isOutsideDivActive, setIsOutsideDivActive] = useState(false);
  const { setExpenses } = useExpense();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  console.log("🚀 ~ selectedFile:", selectedFile);
  const ref = useClickOutside<HTMLDivElement>(() =>
    isOutsideDivActive ? handleSetActiveTab(null) : ""
  );

  const [selectedData, setSelectedData] = useState<{
    date: Date;
    category: string;
    paidVia: string;
  }>(initalState);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(expenseSingleSchema),
  });
  const { budget } = useBudget();

  if (!budget) return; // render when budget is loaded

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event || !event.target.files) return;
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSelectDataChange = (
    field: string,
    value: Date | undefined | string
  ) => {
    setSelectedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onSubmit = async (formDetails: FormData) => {
    const { amount, label, notes } = formDetails;

    const data = {
      amount,
      label,
      notes,
      ...selectedData,
    };
    console.log("🚀 ~ onSubmit ~ data:", data);
    try {
      const res = await addTransaction(data);
      handleSetActiveTab(null);
      console.log(res);
      setExpenses((prev) => [...prev, res]);
    } catch (error) {
      console.log(error);
    }
  };

  const groupsWithCategories: GroupWithCategoriesType = budget.groups.reduce(
    (acc, group) => {
      if (group.items.length === 0) return acc;
      acc[group.label] = group.items.map((item) => ({
        name: item.label,
      }));

      return acc;
    },
    {} as GroupWithCategoriesType
  );

  return (
    <Modal className=" items-end">
      <div className="flex justify-end md:justify-center md:items-center w-full md:w-[80%]  xl:w-[50%] rounded-xl  bg-theme-secondary ">
        <div ref={ref} className="w-full h-min   ">
          <div className="w-full h-min py-5 pb-10 px-4  relative flex  justify-between items-center  ">
            <p className=" w-full text-lg font-semibold">New Expense</p>
            <Button
              onClick={() => handleSetActiveTab(null)}
              variant="ghost"
              className="group"
            >
              <X size={60} className=" h-20 w-20 group-hover:text-red-700" />
            </Button>
          </div>
          <div className=" border-b  border-solid min-h-11 w-full relative -top-5  -mb-5 px-5">
            <ul className="p-0 list-none flex gap-4  absolute">
              {tabs.map((tab, index) => {
                return (
                  <li
                    onClick={() => handleSetActiveTab(tab)}
                    className={cn(
                      "relative min-w-32 h-11 border-1 flex items-center justify-center rounded-t-lg border-t border-l border-r ",
                      activeTab === tab
                        ? " !border-b-0 bg-white"
                        : " bg-zinc-200/80"
                    )}
                    key={index}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </li>
                );
              })}
            </ul>
          </div>
          {activeTab === "single" && (
            <div className="mx-4 py-2">
              <div className="w-full  h-min flex flex-col md:flex-row gap-5 md:gap-10 md:pt-5">
                <div className=" w-full md:w-2/3 h-full md:p-4">
                  <form className="md:ml-10" onSubmit={handleSubmit(onSubmit)}>
                    <ol className="flex flex-col gap-2  md:gap-4 list-none">
                      <li className="flex flex-col   md:flex-row md:items-center justify-center gap-2 md:gap-4">
                        <label className=" pr-2 py-1 relative w-28 md:text-end">
                          Name
                        </label>
                        <Input
                          className=" py-6 md:py-4 bg-theme-secondary"
                          register={register}
                          error={errors.label}
                          name="label"
                          label="name"
                        />
                      </li>
                      <div className="flex md:flex-col gap-2 md:gap-4">
                        <li className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                          <label className=" pr-2 py-1 relative w-28 md:text-end">
                            Date
                          </label>
                          <div className="w-full">
                            <DatePicker
                              onSelect={(value: Date | undefined) =>
                                handleSelectDataChange("date", value)
                              }
                              date={selectedData.date}
                              className="gap-1 w-48 max-sm:h-12"
                            />
                          </div>
                        </li>
                        <li className="flex flex-col md:flex-row md:items-center justify-center gap-2 md:gap-4">
                          <label className=" pr-2 py-1 relative w-28 md:text-end">
                            Amount
                          </label>
                          <Input
                            className="py-6 md:py-4 bg-theme-secondary"
                            register={register}
                            error={errors.amount}
                            name="amount"
                            label="amount"
                          />
                        </li>
                      </div>
                      <div className="flex flex-row md:flex-col max-sm:gap-2 gap-4 ">
                        <li className="flex flex-col md:flex-row md:items-center justify-center gap-2 md:gap-4 w-full">
                          <label className=" pr-2 py-1 relative w-28 md:text-end">
                            Category
                          </label>
                          <Select
                            value={selectedData.category}
                            onValueChange={(value) =>
                              handleSelectDataChange("category", value)
                            }
                          >
                            <SelectTrigger
                              onClick={() => setIsOutsideDivActive(true)}
                            >
                              <SelectValue placeholder="Food" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(groupsWithCategories).map((key) => {
                                return (
                                  <SelectGroup key={key}>
                                    <SelectLabel className="w-full  px-2 text-left">
                                      {key}
                                    </SelectLabel>

                                    {groupsWithCategories[key].map(
                                      (item, index) => (
                                        <SelectItem
                                          key={index}
                                          value={item.name}
                                        >
                                          {item.name}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectGroup>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </li>
                        <li className="flex flex-col md:flex-row md:items-center justify-center gap-2 md:gap-4 w-full">
                          <label className=" pr-2 py-1 relative w-28 md:text-end">
                            Paid Via
                          </label>

                          <Select
                            onValueChange={(value) =>
                              handleSelectDataChange("paidVia", value)
                            }
                          >
                            <SelectTrigger
                              onClick={() => setIsOutsideDivActive(true)}
                            >
                              <SelectValue placeholder="UPI" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(expensesPayMode).map((key) => {
                                return (
                                  <SelectItem key={key} value={key}>
                                    {expensesPayMode[key].name}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </li>
                      </div>
                      <li className="flex flex-col md:flex-row  md:justify-center gap-4">
                        <label className=" pr-2 py-1 relative w-28 md:text-end">
                          Notes
                        </label>

                        <textarea className="w-full h-20 py-2 px-2 focus:outline-none focus:border-0 focus:bg-blue-100 shadow-sm rounded- bg-theme-secondary"></textarea>
                      </li>
                    </ol>
                  </form>
                </div>
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
              </div>
              <div className="w-full py-4 h-min flex justify-end ">
                <Button
                  onClick={() => handleSubmit(onSubmit)()}
                  className="px-10"
                >
                  Save
                </Button>
              </div>
            </div>
          )}
          {activeTab === "scan" && (
            <ReceiptUploadComponent handleSetActiveTab={handleSetActiveTab} />
          )}
        </div>
      </div>
    </Modal>
  );
};
