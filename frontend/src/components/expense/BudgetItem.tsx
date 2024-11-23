import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Delete, GripVertical, Loader, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
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
  const [isItemDeleted, setIsItemDeleted] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

  const itemInputRef = useRef<HTMLInputElement | null>(null);

  const handleClose = () => {
    setIsActive(false);
    setIsEditOpen(false);
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
    <div
      ref={ref}
      onClick={() => {
        setIsActive(true);
      }}
      className={cn("", isDragging ? "bg-white" : "bg-white")}
    >
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className="flex w-full h-min relative items-center justify-center group  "
      >
        <GripVertical
          className="absolute -left-8 text-zinc-500 opacity-0 group-hover:opacity-100 
             transition-opacity duration-500 ease-in-out "
          {...listeners}
        />

        <div className={cn("flex justify-between border-b-2 w-full  py-2 ")}>
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
                {isEditOpen ? (
                  <input
                    defaultValue={label}
                    ref={itemInputRef}
                    className="w-64 h-1 py-6 px-4 focus:outline-none  ring-2 shadow-sm rounded-md"
                  />
                ) : (
                  <p onClick={() => setIsEditOpen(true)}>{label}</p>
                )}
              </div>
            </div>
            <p className="flex items-end w-full justify-end text-right flex-1 relative">
              0
            </p>
            <p className="flex items-end w-full justify-end text-right flex-1 relative">
              0
            </p>
            {isActive && !isItemDeleted && (
              <div className=" flex w-20 h-full items-end justify-end">
                <Trash2
                  onClick={() => setIsConfirmDelete(true)}
                  className="w-20 text-red-600 "
                />
              </div>
            )}

            {isItemDeleted && (
              <div className=" w-20 ">
                <Loader size={24} className="  animate-spin text-red-500" />
              </div>
            )}
          </div>

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

        {isActive && (
          <div
            className={cn(
              "flex justify-between absolute border-b-2  w-[115%]  bg-white rounded-md drop-shadow-xl shadow-lg  py-4 mt-2 top-0  "
            )}
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
                    " w-[70%] h-full py-2 px-2 rounded-md relative ",
                    isEditOpen || isActive ? "" : "hover:bg-zinc-100"
                  )}
                >
                  {isEditOpen ? (
                    <input
                      defaultValue={label}
                      ref={itemInputRef}
                      className="w-64 h-1 py-6 px-4 focus:outline-none  ring-2 shadow-sm rounded-md"
                    />
                  ) : (
                    <p onClick={() => setIsEditOpen(true)}>{label}</p>
                  )}
                </div>
              </div>
              <p className="flex items-end w-full justify-end text-right flex-1 relative">
                0
              </p>
              <p className="flex items-end w-full justify-end text-right flex-1 relative">
                0
              </p>
              {isActive && !isItemDeleted && (
                <div  className="w-20 h-full">
                  <div className=" flex w-20 h-full absolute items-end basis-4 flex-shrink flex-grow-0 justify-end right-0 -top-1">
                    <Trash2
                      onClick={() => setIsConfirmDelete(true)}
                      className="w-20 text-red-600 "
                    />
                  </div>
                </div>
              )}

              {isItemDeleted && (
                <div className=" w-20 ">
                  <Loader size={24} className="  animate-spin text-red-500" />
                </div>
              )}
            </div>

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
        )}
      </div>
    </div>
  );
};
