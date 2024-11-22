import { BudgetGroup } from "@/components/expense/BudgetGroup";

import Button from "@/components/ui/Button";

import { useClickOutside } from "@/hooks/useClickOutside";
import { useBudget } from "@/lib/providers/BudgetProvider";

import { addGroup } from "@/services/group";
import { BudgetType, GroupType } from "@/type";

import {
  ChevronLeft,
  ChevronRight,
  LoaderCiLoaderCircle,
  rcle,
  Plus,
  LoaderCircle,
} from "lucide-react";
import { addMonths, format, getMonth, getYear } from "date-fns";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/providers/Theme";
import api from "@/services/api";
import { cloneBudget } from "@/services/budget";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const Budget = () => {
  const [isAddingGroup, setIsAddingGroup] = useState<boolean>(false);
  const itemInputRef = useRef<HTMLInputElement | null>(null);
  const { budget, setBudget, loading, allExistedBudget } = useBudget();
  // console.log("🚀 ~ Budget ~ allExistedBudget:", allExistedBudget);

  const currentDate = new Date();
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(currentDate);
  const [isBudgetNotPresent, setIsBudgetNotPresent] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState(false);

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

  const monthNumber = getMonth(currentMonthDate);
  const year = getYear(currentMonthDate);
  const monthName = format(new Date(2024, monthNumber, 1), "MMMM");

  const handleMonthClick = async (direction: 1 | -1) => {
    if (!budget) return;
    const updatedDate = addMonths(currentMonthDate, direction);
    const currentYear = getYear(updatedDate);
    const zeroAdjustedMonthNumber = getMonth(updatedDate);
    const monthExists =
      allExistedBudget &&
      allExistedBudget[currentYear]?.[zeroAdjustedMonthNumber + 1];

    setIsBudgetNotPresent(!monthExists);
    if (monthExists) {
      try {
        setIsloading(true);
        const date = format(updatedDate, "dd/MM/yyyy");
        const res = await api.post("/app/budget/by-date", { date });

        setBudget(res.data.currentBudget);
        setIsloading(false);
      } catch (error) {
        console.error("Error fetching budget:", error);
      } finally {
        setIsloading(false);
      }
    }

    setCurrentMonthDate(updatedDate);
  };
  const exisitngBudget = format(
    new Date(2024, (budget?.month ?? 1) - 1, 1),
    "MMMM"
  );
  const handleCloneBudget = async () => {
    try {
      setIsloading(true);
      const id = (budget && budget.id) ?? 1;

      const date = format(new Date(), "MM/dd/yyyy");
      const clonedBudget: BudgetType = await cloneBudget(date, id);
      console.log("🚀 ~ handleCloneBudget ~ clonedBudget:", clonedBudget);
      setBudget(clonedBudget);
      setIsBudgetNotPresent(false);
      setIsloading(false);
    } catch (error) {
      console.error("Error fetching budget:", error);
    } finally {
      setIsloading(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBudget((prev) => {
        if (!prev) return prev;
        const oldIndex = prev.groups.findIndex((item) => item.id === active.id);
        const newIndex = prev.groups.findIndex((item) => item.id === over.id);
        // Ensure valid indices before proceeding
        if (oldIndex === -1 || newIndex === -1) {
          console.error("Invalid indices for dragging:", {
            oldIndex,
            newIndex,
          });
          return prev;
        }
        const updatedGroups = arrayMove(prev.groups, oldIndex, newIndex);
        return {
          ...prev,
          groups: updatedGroups,
        };
      });
    }
  };
  return (
    <div className="flex w-full h-min  min-h-screen">
      <div className="flex flex-col justify-center items-center  w-full h-full gap-4 overflow-auto">
        <div className="flex justify-between   w-[90%] px-10 pt-5 pb-10  h-min">
          <h2 className=" text-4xl">
            <span className=" font-semibold">{monthName}'s </span>
            {year} Budget
          </h2>
          <div className="flex">
            <Button
              onClick={() => handleMonthClick(-1)}
              className="relative group"
            >
              <ChevronLeft />
              <div className="absolute w-auto py-2 rounded-xl whitespace-nowrap bg-white top-12 -left-1/2 px-4 opacity-0 group-hover:opacity-100 duration-300 transition-transform">
                prev month
              </div>
            </Button>
            <Button
              onClick={() => handleMonthClick(1)}
              className="relative group"
            >
              <ChevronRight />
              <div className="absolute w-auto py-2 rounded-xl whitespace-nowrap bg-white top-12 -left-1/2 px-4 opacity-0 group-hover:opacity-100 duration-200 transition-all">
                next month
              </div>
            </Button>
          </div>
        </div>
        <div className="flex flex-col  w-2/3 h-full items-center justify-center gap-4 ">
          {loading || isLoading ? (
            <div className="flex w-full mt-44 items-center  justify-center  ">
              <LoaderCircle size={36} className=" animate-spin " />
            </div>
          ) : !isBudgetNotPresent ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <div className="flex h-full w-full flex-col gap-4 justify-normal items-start">
                <SortableContext
                  items={budget?.groups ?? []}
                  strategy={verticalListSortingStrategy}
                >
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
                </SortableContext>

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
            </DndContext>
          ) : (
            renderNoBudgetState(
              monthName,
              exisitngBudget,
              handleCloneBudget,
              isLoading
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Budget;

const renderNoBudgetState = (
  monthName: string,
  lastExistedBudget: string,
  handleCloneBudget: () => void,
  isLoading: boolean
) => (
  <div className="flex h-full w-full justify-center flex-col gap-4 items-center mt-28">
    <div className="w-[90%] items-center flex justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <h4 className="font-semibold text-xl text-center">
          Hey there, looks like you need a budget for{" "}
          <span className="font-bold">{monthName}</span>
        </h4>
        <p>We'll copy {lastExistedBudget}’s budget to get you started.</p>
        <Button
          className=" min-w-52 justify-center gap-1 items-center flex rounded-lg"
          disabled={isLoading}
          onClick={handleCloneBudget}
        >
          {isLoading ? (
            <LoaderCircle className=" animate-spin " size={20} />
          ) : (
            <>
              Start Planning for <span className="">{monthName}</span>
            </>
          )}
        </Button>
      </div>
    </div>
  </div>
);
