import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Loader, Trash2 } from "lucide-react";
import { useState } from "react";

import { ConfirmDelete } from "../ConfirmDelete";

export interface BudgetItemProps {
  id: number;
  label: string;
  planned: string | number;
  received: string | number;
  handleItemDelete: (id: number) => void;
}

export const BudgetItem: React.FC<BudgetItemProps> = ({
  id,
  label,
  planned,
  handleItemDelete,
  received,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [itemInputs, setItemInputs] = useState({
    label: label,
    allocatedBudget: planned,
  });
  const [isConfirmDelete, setIsConfirmDelete] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState({
    label: false,
    allocatedBudget: false,
  });
  const [isActive, setIsActive] = useState<boolean>(false);

  const ref = useClickOutside<HTMLDivElement>(() => {
    setIsActive(false);
    setIsEditOpen({ label: false, allocatedBudget: false });
  });

  const handleDelete = async () => {
    setIsLoading(true);

    setIsConfirmDelete(false);
    await handleItemDelete(id);

    setIsLoading(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="flex opacity-40 w-full h-min min-h-11 content-none bg-blue-200 border-dashed border-2 border-blue-500 rounded-md  relative items-center justify-center "
      ></div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn(
          "flex  relative items-center justify-center group ",
          isActive
            ? "w-[115%] h-16 -left-20 bg-background rounded-lg drop-shadow-lg shadow-xl shadow-primary/5"
            : "w-full h-min"
        )}
      >
        <GripVertical
          className={cn(
            "absolute -left-8  opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out ",
            isActive ? "hidden" : ""
          )}
          {...listeners}
        />

        <div
          onClick={() => {
            setIsActive(true);
          }}
          className={cn(
            "flex justify-between relative  w-full  py-2 ",
            isActive ? "px-[78px]" : "border-b-2"
          )}
        >
          <div className="flex w-full items-center h-full relative  ">
            <div className="text-lg  flex items-center flex-grow-0 flex-shrink basis-1/2  flex-wrap  ">
              <div className={cn("w-full   h-full rounded-md ")}>
                {isEditOpen.label ? (
                  <input
                    value={itemInputs.label}
                    onChange={(e) =>
                      setItemInputs((prev) => ({
                        ...prev,
                        label: e.target.value,
                      }))
                    }
                    className="w-[80%] h-1 py-5 px-4 focus:outline-none bg-transparent ring-2 shadow-sm rounded-md"
                  />
                ) : (
                  <p
                    className="w-full hover:bg-secondary/60 rounded-md px-2 py-2"
                    onClick={() =>
                      setIsEditOpen((prev) => ({ ...prev, label: true }))
                    }
                  >
                    {label}
                  </p>
                )}
              </div>
            </div>
            {isEditOpen.allocatedBudget ? (
              <div className="w-32  justify-end flex flex-1 px-4 focus:outline-none bg-transparent">
                <input
                  value={itemInputs.allocatedBudget}
                  onChange={(e) =>
                    setItemInputs((prev) => ({
                      ...prev,
                      allocatedBudget: e.target.value,
                    }))
                  }
                  className=" w-2/3 py-2  px-2 text-end my-2  focus:outline-none bg-transparent  ring-2 shadow-sm rounded-md"
                />
              </div>
            ) : (
              <div className="flex items-end w-full  -right-2 justify-end text-right flex-1 relative ">
                <p
                  onClick={() =>
                    setIsEditOpen((prev) => ({
                      ...prev,
                      label: false,
                      allocatedBudget: true,
                    }))
                  }
                  className="w-2/3 p-2 my-2  hover:bg-secondary/50 rounded-xl"
                >
                  ${planned}
                </p>
              </div>
            )}
            <p className="flex items-end w-full justify-end text-right flex-1 relative">
              ${received}
            </p>
          </div>
          {isActive && (
            <div className="flex  items-center w-20 justify-center text-right absolute -right-0 top-1/2">
              <div className=" flex w-20 h-full absolute items-center basis-4 flex-shrink flex-grow-0 justify-center right-0">
                {!isLoading && (
                  <Trash2
                    onClick={() => setIsConfirmDelete(true)}
                    className="w-20 text-red-600 "
                  />
                )}
                {isLoading && (
                  <div className="flex w-20 h-full absolute items-center basis-4 flex-shrink flex-grow-0 justify-center right-0">
                    <Loader size={24} className="  animate-spin text-red-500" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <ConfirmDelete
        className="p-8 flex flex-col gap-6 bg-white rounded-xl"
        isOpen={isConfirmDelete}
        handleDelete={handleDelete}
        handleClose={() => {
          setIsActive(false);

          setIsConfirmDelete(false);
        }}
      >
        <h2 className="text-2xl py-4 border-b">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{label}</span>?
        </h2>
      </ConfirmDelete>
    </div>
  );
};
