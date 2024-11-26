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
import { X } from "lucide-react";
// import {  } from "@radix-ui/react-select";

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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

      console.log(res);
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
    <Modal>
      <div className="flex justify-center items-center w-[40%] bg-white rounded-xl ">
        <div ref={ref} className="w-full h-min  ">
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
          <div className="mx-4 py-2">
            <div className="w-full  h-min flex gap-10 pt-5">
              <div className=" w-2/3 h-full p-4">
                <form className="ml-10" onSubmit={handleSubmit(onSubmit)}>
                  <ol className="flex flex-col gap-4 list-none">
                    <li className="flex items-center justify-center gap-4">
                      <label className=" pr-2 py-1 relative w-28 text-end">
                        Name
                      </label>
                      <Input
                        className="py-4"
                        register={register}
                        error={errors.label}
                        name="label"
                        label="name"
                      />
                    </li>
                    <li className="flex items-center  gap-4">
                      <label className=" pr-2 py-1 relative w-28 text-end">
                        Date
                      </label>
                      <div className="w-full">
                        <DatePicker
                          onSelect={(value: Date | undefined) =>
                            handleSelectDataChange("date", value)
                          }
                          date={selectedData.date}
                          className="gap-1 w-48"
                        />
                      </div>
                    </li>
                    <li className="flex items-center justify-center gap-4">
                      <label className=" pr-2 py-1 relative w-28 text-end">
                        Amount
                      </label>
                      <Input
                        className="py-4"
                        register={register}
                        error={errors.amount}
                        name="amount"
                        label="amount"
                      />
                    </li>
                    <li className="flex items-center justify-center gap-4">
                      <label className=" pr-2 py-1 relative w-28 text-end">
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
                                    <SelectItem key={index} value={item.name}>
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
                    <li className="flex items-center justify-center gap-4">
                      <label className=" pr-2 py-1 relative w-28 text-end">
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
                    <li className="flex  justify-center gap-4">
                      <label className=" pr-2 py-1 relative w-28 text-end">
                        Notes
                      </label>

                      <textarea className="w-full h-20 py-2 px-2 focus:outline-none focus:border-0 focus:bg-blue-100 shadow-sm rounded- bg-slate-100"></textarea>
                    </li>
                  </ol>
                </form>
              </div>
              <div className="flex w-1/2 items-center justify-center h-[350px]  ">
                <div className=" w-full h-full   rounded-xl border-2 relative">
                  <input
                    onChange={(event) => handleFileChange(event)}
                    type="file"
                    className=" absolute w-full h-full top-0 left-0 right-0 opacity-0 cursor-pointer"
                  />

                  {!selectedFile && <img src={receiptIcon} width={400} />}
                  {selectedFile && (
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-xl"
                    />
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
        </div>
      </div>
    </Modal>
  );
};
