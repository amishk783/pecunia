import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BudgetItem } from "./BudgetItem";
import { useRef, useState } from "react";
import { ItemType } from "@/type";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/providers/Theme";
import Button from "../ui/Button";

import { useClickOutside } from "@/hooks/useClickOutside";
import {
  addCategory,
  deleteCategory,
  reorderCategory,
} from "@/services/category";
import {
  ChevronDown,
  ChevronUp,
  CircleAlert,
  GripVertical,
  Loader,
  Trash2,
} from "lucide-react";
import { deleteGroup, modifyGroup } from "@/services/group";
import { useBudget } from "@/lib/providers/BudgetProvider";
import toast from "react-hot-toast";
import { ConfirmDelete } from "../ConfirmDelete";

interface BudgetGroupProps {
  id: number;
  type: "expense" | "income";
  grouptitle: string;
  initialItems: ItemType[];
}

export const BudgetGroup: React.FC<BudgetGroupProps> = ({
  grouptitle,
  initialItems,
  type,
  id,
}) => {
  const [items, setItems] = useState<ItemType[]>(
    initialItems.sort((a, b) => a.position - b.position)
  );
  const [isAddItemOn, setIsAddItem] = useState<boolean>();
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [collapseGroup, setCollapseGroup] = useState<boolean>(false);
  const [isGroupEdit, setIsGroupEdit] = useState(false);

  const [activeId, setActiveId] = useState<string | null>("");
  const handleDragStart = (id: string) => {
    setActiveId(id);
  };

  const { theme } = useTheme();
  const { setBudget } = useBudget();

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);

    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      const reorderArray: {
        id: number;
        position: number;
        groupID: number;
      }[] = [];
      for (const item of items) {
        console.log(item.groupId);
        reorderArray.push({
          id: item.id,
          position: item.position,
          groupID: item.groupId,
        });
      }

      console.log("items", items);
      const result = await reorderCategory(reorderArray);
      console.log("🚀 ~ handleDragEnd ~ result:", result);
    }
  };

  const handleDragOver = (e: DragOverEvent) => {
    const overId = e.over?.id;
    if (overId) {
      const index = items.findIndex((item) => item.id === overId);
    }
  };

  const handleCloseAdditem = async () => {
    if (itemInputRef.current && itemInputRef.current.value) {
      console.log(itemInputRef.current.value);

      try {
        setIsloading(true);
        const newCategory = await addCategory({
          label: `${itemInputRef.current.value}`,
          groupId: id,
          type: type,
          amountBudget: 0,
        });
        setItems((prev) => [...prev, newCategory]);
        setIsAddItem(false);
        toast.success("Successfully created Category");
      } catch (error) {
        console.log(error);
        toast.error(
          error.response?.data?.message ||
            "Failed to create category. Please try again."
        );
      } finally {
        setIsloading(false);
      }
    } else {
      setIsAddItem(false);
    }
  };

  const handleCloseGroup = async () => {
    if (itemInputRef.current && itemInputRef.current.value) {
      if (grouptitle === itemInputRef.current.value) {
        setIsGroupEdit(false);
        return;
      }
      try {
        setIsloading(true);

        const updatedGroup = await modifyGroup(id, itemInputRef.current.value);

        setBudget((prev) => {
          if (!prev) return prev;
          const updateBudget = {
            ...prev,
            groups: prev.groups.map((group) =>
              group.id === updatedGroup.id ? updatedGroup : group
            ),
          };
          return updateBudget;
        });

        setIsGroupEdit(false);
        toast.success("Successfully edited Group Name");
      } catch (error) {
        console.log(error);
        toast.error(
          error.response?.data?.message ||
            "Failed to edit Group Name. Please try again."
        );
      } finally {
        setIsloading(false);
      }
    } else {
      setIsGroupEdit(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const ref = useClickOutside<HTMLDivElement>(handleCloseAdditem);
  const groupref = useClickOutside<HTMLDivElement>(handleCloseGroup);

  const itemInputRef = useRef<HTMLInputElement | null>(null);

  const handleItemDelete = async (id: number) => {
    try {
      setIsloading(true);
      await deleteCategory(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Successfully deleted category");
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          "Failed to deleted category. Please try again."
      );
    } finally {
      setIsloading(false);
    }
  };
  const handleGroupDelete = async (id: number) => {
    try {
      setIsloading(true);
      const deletedGroup = await deleteGroup(id);
      console.log("🚀 ~ handleGroupDelete ~ deletedGroup:", deletedGroup);
      setBudget((prev) => {
        if (!prev) return prev;
        const updateBudget = {
          ...prev,
          groups: prev.groups.filter((group) => group.id !== deletedGroup.id),
        };

        return updateBudget;
      });
      toast.success("Successfully deleted group");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to deleted category. Please try again."
      );
    } finally {
      setIsloading(false);
    }
  };
  const [isConfirmDelete, setIsConfirmDelete] = useState<boolean>(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const placeHolderHeight = items.length > 0 ? (items.length + 3) * 48 : 120;
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={{ ...style, height: placeHolderHeight }}
        {...attributes}
        {...listeners}
        className="flex opacity-40 w-full h-full content-none bg-blue-200 border-dashed border-2 border-blue-500 rounded-md  relative items-center justify-center "
      ></div>
    );
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        "w-full h-full rounded-lg p-6 relative",
        theme?.bgColor,
        theme?.textColor
      )}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragStart={(event) => handleDragStart(event.active.id)}
      >
        <div className=" flex flex-col gap-1 w-full h-full transition-transform duration-500 delay-100 ease-in-out px-8 py-4 ">
          <>
            {!isGroupEdit && (
              <div className="flex justify-between  group ">
                <GripVertical
                  className="absolute -left-0 text-zinc-500 opacity-0 group-hover:opacity-100 
             transition-opacity duration-500 ease-in-out "
                  {...listeners}
                />
                <div className="flex items-center gap-1 flex-shrink flex-grow-0 basis-1/2 w-1/2">
                  <h2
                    onClick={() => setIsGroupEdit(true)}
                    className=" text-xl font-semibold text-zinc-600"
                  >
                    {grouptitle}
                  </h2>
                  {collapseGroup ? (
                    <ChevronDown
                      onClick={() => setCollapseGroup((prev) => !prev)}
                    />
                  ) : (
                    <ChevronUp
                      onClick={() => setCollapseGroup((prev) => !prev)}
                    ></ChevronUp>
                  )}
                </div>

                <p className=" font-semibold text-lg text-right flex-shrink-0 flex-grow-0 basis-1/4 flex items-end justify-end   ">
                  Planned
                </p>
                <p className=" font-semibold text-lg text-start flex-shrink-0 flex-grow-0 basis-1/4 flex items-end  justify-end  ">
                  Spent
                </p>
              </div>
            )}
            <div className="flex  items-center gap-5 w-full " ref={groupref}>
              {isGroupEdit && (
                <>
                  <input
                    defaultValue={grouptitle}
                    ref={itemInputRef}
                    className="w-64 h-1 py-6 px-4 focus:outline-none  ring-2 shadow-sm rounded-md"
                  />
                  <Trash2
                    onClick={() => setIsConfirmDelete(true)}
                    size={24}
                    className="text-red-600 hover:scale-105 duration-200 cursor-pointer"
                  />
                </>
              )}
              <ConfirmDelete
                className="w-2/3 p-8 flex flex-col gap-6 bg-white rounded-xl"
                isOpen={isConfirmDelete}
                handleClose={() => setIsConfirmDelete(false)}
                handleDelete={() => {
                  handleGroupDelete(id);
                }}
              >
                <div className="flex flex-col gap-4  ">
                  <h2 className=" text-3xl font-bold">
                    Got it! Here’s what will happen if you delete this group:
                  </h2>
                  <div className="flex flex-col gap-5 text-lg w-[90%]">
                    <p className="flex items-center gap-4">
                      <span className="text-red-400 ">
                        <CircleAlert size={40} />
                      </span>
                      Any tracked transactions to budget items in this group
                      will be untracked (this includes split transactions)
                    </p>
                    <p className="flex items-center gap-4">
                      <span className="text-red-400 ">
                        <CircleAlert size={40} />
                      </span>
                      This group and its budget items will be deleted only from
                      this month’s budget
                    </p>
                  </div>
                </div>
              </ConfirmDelete>
            </div>
          </>
          {!collapseGroup && (
            <div className="transition-transform duration-500 delay-1000 ease-in-out ">
              <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
              >
                {items.map((item) => (
                  <BudgetItem
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    planned={item.amountBudget}
                    received={item.amountBudget}
                    handleItemDelete={handleItemDelete}
                  />
                ))}
              </SortableContext>
              <DragOverlay>
                {activeId
                  ? (() => {
                      const draggedItem = items.find(
                        (item) => item.id === +activeId
                      );
                      return draggedItem ? (
                        <BudgetItem
                          id={draggedItem.id}
                          label={draggedItem.label}
                          planned={draggedItem.amountBudget}
                          received={draggedItem.amountBudget}
                          handleItemDelete={handleItemDelete}
                        />
                      ) : null;
                    })()
                  : null}
              </DragOverlay>

              {isAddItemOn && (
                <div
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleCloseAdditem();
                    }
                  }}
                  ref={ref}
                  className="relative w-full h-min flex pb-20"
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-[110%] h-min absolute -left-12 rounded-md drop-shadow-lg shadow-md ",
                      theme?.bgSecondary
                    )}
                  >
                    <div className="flex items-center justify-between w-full px-2 py-2 ">
                      <div className="flex items-center gap-4 w-full h-full ">
                        <div className="flex items-center w-14 h-14">
                          {isLoading && (
                            <Loader className=" w-14 text-blue-400 animate-spin" />
                          )}
                        </div>
                        <input
                          ref={itemInputRef}
                          className="w-72 h-1 py-6 px-4 focus:outline-none bg-zinc-200 focus:border-0 focus:bg-blue-100 shadow-sm rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {!collapseGroup && (
                <div className="flex text-green-700 text-md pt-4">
                  {
                    <Button
                      onClick={() => setIsAddItem(true)}
                      className="text-green-700 p-0"
                      variant="ghost"
                    >
                      Add Item
                    </Button>
                  }
                </div>
              )}
            </div>
          )}
        </div>
      </DndContext>
    </div>
  );
};
