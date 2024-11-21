import { BudgetGroup } from "@/components/expense/BudgetGroup";

import Button from "@/components/ui/Button";

import { useClickOutside } from "@/hooks/useClickOutside";
import { useBudget } from "@/lib/providers/BudgetProvider";

import { addGroup } from "@/services/group";
import { GroupType } from "@/type";

import { Bug, ChevronLeft, ChevronRight, Loader, Plus } from "lucide-react";
import { format } from "date-fns";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/providers/Theme";

const Budget = () => {
  const [isAddingGroup, setIsAddingGroup] = useState<boolean>(false);
  const itemInputRef = useRef<HTMLInputElement | null>(null);
  const { budget, setBudget, loading } = useBudget();

  const handleCloseAdditem = async () => {
    if (itemInputRef.current && itemInputRef.current.value) {
      try {
        if (!budget) return;

        const newGroup: GroupType = await addGroup({
          label: `${itemInputRef.current.value}`,
          budgetId: budget?.id,
          type: "expense",
        });

        setBudget((prev) => {
          if (!prev) return prev;
          const updatedBudget = {
            ...prev,
            groups: [...prev.groups, newGroup],
          };

          return updatedBudget;
        });
        setIsAddingGroup(false);
      } catch (error) {
        console.log(error);
      } finally {
        setIsAddingGroup(false);
      }
    } else {
      setIsAddingGroup(false);
    }
  };
  const ref = useClickOutside<HTMLDivElement>(handleCloseAdditem);
  const monthNumber = budget?.month ?? 1;
  const monthName = format(new Date(2024, monthNumber - 1, 1), "MMMM");
  console.log("🚀 ~ Budget ~ month:", monthName);

  const { theme } = useTheme();
  return (
    <div className="flex w-full h-min ">
      <div className="flex flex-col justify-center items-center  w-full h-full gap-4 overflow-auto">
        <div className="flex justify-between   w-[90%] px-10 pt-5 pb-10  h-min">
          <h2 className=" text-4xl">
            <span className=" font-semibold">{monthName}'s </span>
            2024 Budget
          </h2>
          <div className="flex">
            <Button className="relative group">
              <ChevronLeft />
              <div className="absolute w-auto py-2 rounded-xl whitespace-nowrap bg-white top-12 -left-1/2 px-4 opacity-0 group-hover:opacity-100 duration-300 transition-transform">
                prev month
              </div>
            </Button>
            <Button className="relative group">
              <ChevronRight />
              <div className="absolute w-auto py-2 rounded-xl whitespace-nowrap bg-white top-12 -left-1/2 px-4 opacity-0 group-hover:opacity-100 duration-200 transition-all">
                next month
              </div>
            </Button>
          </div>
        </div>
        <div className="flex flex-col  w-2/3 h-full items-center justify-center gap-4 ">
          {loading ? (
            <div className="flex w-full h-screen items-center justify-center  ">
              <Loader className=" animate-spin " />
            </div>
          ) : (
            <div className="flex h-full w-full flex-col gap-4 justify-normal items-start">
              {budget?.groups.map((group) => (
                <div
                  key={group.id}
                  className=" flex flex-col gap-4 w-full h-full "
                >
                  <BudgetGroup
                    id={group.id}
                    type={group.type}
                    grouptitle={group.label}
                    initialItems={group.items ?? []}
                  />
                </div>
              ))}
            </div>
          )}
          <div className="flex w-full h-full p-4 border-dashed rounded-2xl border-2">
            <div ref={ref} className="flex gap-2 items-center">
              {!isAddingGroup && (
                <Button
                  onClick={() => setIsAddingGroup((prev) => !prev)}
                  className="p-0 flex gap-2 items-center text-zinc-800"
                  variant="ghost"
                >
                  <Plus />
                  <p className="font-semibold">ADD GROUP</p>
                </Button>
              )}
              {isAddingGroup && (
                <input
                  ref={itemInputRef}
                  className="w-72 h-1 py-6 px-4 focus:outline-none bg-zinc-200 focus:border-0 focus:bg-blue-100 shadow-sm rounded-md"
                />
              )}
            </div>
          </div>
          <div className="flex w-full h-min justify-end items-center py-4">
            <h5 className="text-lg font-bold">Download as CSV</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;
