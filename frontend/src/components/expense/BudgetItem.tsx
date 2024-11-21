import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Delete, Loader, Trash2 } from "lucide-react";
import { useState } from "react";
import Button from "../ui/Button";
import { deleteCategory } from "@/services/category";
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
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const [isItemDeleted, setIsItemDeleted] = useState<boolean>(false);

  const handleClose = () => {
    setIsActive(false);
  };
  const [isActive, setIsActive] = useState<boolean>(false);
  const ref = useClickOutside<HTMLDivElement>(handleClose);

  const handleDelete = async () => {
    try {
      setIsItemDeleted(true);
      true;
      await handleItemDelete(id);
    } catch (error) {
      console.log(error);
    } finally {
      setIsItemDeleted(false);
    }
  };
  const [isConfirmDelete, setIsConfirmDelete] = useState<boolean>(false);

  return (
    <div
      ref={ref}
      onClick={() => {
        setIsActive(true);
      }}
    >
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="flex w-full h-min  relative items-center justify-center "
      >
        <div
          className={cn(
            "flex justify-between border-b-2 ",
            isActive
              ? "flex  w-[115%] bg-yellow-100/10  rounded-md drop-shadow-lg shadow-sm  py-4 mt-2 "
              : "w-[90%]  py-4"
          )}
        >
          <div
            className={cn(
              "flex w-full h-full ",
              isActive ? "pl-12  " : "w-full "
            )}
          >
            <h2 className="text-lg ">{label}</h2>
          </div>
          <div className="flex w-full gap-4 h-full">
            <p className="flex items-end w-full justify-end">0</p>
            <p className="flex items-end w-full justify-center ">0</p>
          </div>
          {isActive && !isItemDeleted && (
            <Trash2
              onClick={() => setIsConfirmDelete(true)}
              className="w-20 pr-4 text-red-600 "
            />
          )}

          {isItemDeleted && (
            <div className=" w-20 ">
              <Loader size={24} className="  animate-spin text-red-500" />
            </div>
          )}
          <ConfirmDelete
            className=" p-8 flex flex-col gap-6 bg-white rounded-xl"
            isOpen={isConfirmDelete}
            handleDelete={() => handleDelete()}
            handleClose={() => setIsConfirmDelete(false)}
          >
            <div className="w-full py-4 border-b ">
              <h2 className="text-2xl">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{label}</span>?
              </h2>
            </div>
          </ConfirmDelete>
        </div>
      </div>
    </div>
  );
};
