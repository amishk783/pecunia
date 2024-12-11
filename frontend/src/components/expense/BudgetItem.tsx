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

  const handleClose = () => {
    setIsActive(false);
    setIsEditOpen((prev) => ({
      ...prev,
      label: false,
      allocatedBudget: false,
    }));
  };

  const ref = useClickOutside<HTMLDivElement>(() => {
    setIsActive(false);
    setIsEditOpen({ label: false, allocatedBudget: false });
  });

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      setIsConfirmDelete(false);
      await handleItemDelete(id);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
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
    <div ref={ref} className={cn("", isDragging ? "" : "")}>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className="flex w-full h-min relative items-center justify-center group  "
      >
        <GripVertical
          className="absolute -left-8  opacity-0 group-hover:opacity-100 
             transition-opacity duration-500 ease-in-out "
          {...listeners}
        />

        <div
          onClick={() => {
            setIsActive(true);
          }}
          className={cn("flex justify-between border-b-2 w-full  py-2 ")}
        >
          <div
            className={cn(
              "flex w-full h-full relative ",
              isActive ? " " : "w-full "
            )}
          >
            <div className="text-lg flex items-center flex-grow-0 flex-shrink basis-1/2  flex-wrap  ">
              <div
                className={cn(
                  " w-[70%] h-full py-2 px-2 rounded-md ",
                  isEditOpen || isActive ? "" : "hover:bg-zinc-100"
                )}
              >
                <p
                  onClick={() =>
                    setIsEditOpen((prev) => ({ ...prev, label: true }))
                  }
                >
                  {label}
                </p>
              </div>
            </div>
            <p className="flex items-end w-full justify-end text-right flex-1 relative">
              {planned}
            </p>
            <p className="flex items-end w-full justify-end text-right flex-1 relative">
              {received}
            </p>
          </div>
        </div>

        {isActive && (
          <div
            className={cn(
              "flex justify-between absolute border-b-2  w-[115%]  bg-white rounded-md drop-shadow-xl shadow-lg  top-0 py-1  "
            )}
          >
            <div
              className={cn(
                "flex w-full h-full relative ",
                isActive ? " " : "w-full "
              )}
            >
              <div className="text-lg flex items-center flex-grow-0 flex-shrink  basis-1/2  flex-wrap  ">
                <div
                  className={cn(
                    " w-[70%] flex items-center h-full px-8 rounded-md relative ",
                    isEditOpen || isActive ? "" : "hover:bg-zinc-100"
                  )}
                >
                  {isEditOpen.label ? (
                    <input
                      value={itemInputs.label}
                      onChange={(e) =>
                        setItemInputs((prev) => ({
                          ...prev,
                          label: e.target.value,
                        }))
                      }
                      className="w-64 h-1 py-6 px-4 focus:outline-none  ring-2 shadow-sm rounded-md"
                    />
                  ) : (
                    <p
                      onClick={() =>
                        setIsEditOpen((prev) => ({
                          ...prev,
                          label: true,
                          allocatedBudget: false,
                        }))
                      }
                    >
                      {label}
                    </p>
                  )}
                </div>
              </div>
              {isEditOpen.allocatedBudget ? (
                <input
                  value={itemInputs.allocatedBudget}
                  onChange={(e) =>
                    setItemInputs((prev) => ({
                      ...prev,
                      allocatedBudget: e.target.value,
                    }))
                  }
                  className="w-64 h-1 py-6 px-4 focus:outline-none  ring-2 shadow-sm rounded-md"
                />
              ) : (
                <p
                  onClick={() =>
                    setIsEditOpen((prev) => ({
                      ...prev,
                      label: false,
                      allocatedBudget: true,
                    }))
                  }
                  className="flex py-4 items-end h-full w-full justify-end text-right flex-1 relative"
                >
                  {planned}
                </p>
              )}
              <p className="flex py-4 items-end h-full w-full justify-end text-right flex-1 relative">
                {received}
              </p>
              {!isLoading && (
                <div className="flex  items-center w-20 justify-center text-right  relative">
                  <div className=" flex w-20 h-full absolute items-center basis-4 flex-shrink flex-grow-0 justify-center right-0">
                    <Trash2
                      onClick={() => setIsConfirmDelete(true)}
                      className="w-20 text-red-600 "
                    />
                  </div>
                </div>
              )}

              {isLoading && (
                <div className=" w-20 ">
                  <Loader size={24} className="  animate-spin text-red-500" />
                </div>
              )}
            </div>
          </div>
        )}
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
