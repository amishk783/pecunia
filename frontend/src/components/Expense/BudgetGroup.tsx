import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { BudgetItem, BudgetItemProps } from "./BudgetItem";
import { useState } from "react";

interface BudgetGroupProps {
  initalItems: BudgetItemProps[];
}

export const BudgetGroup: React.FC<BudgetGroupProps> = ({ initalItems }) => {
  const [items, setItems] = useState<BudgetItemProps[]>(initalItems);
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  return (
    <div>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="glass p-4 rounded-lg">
          BudgetGroup
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((item) => (
              <BudgetItem
                key={item.id}
                id={item.id}
                label={item.label}
                planned={item.planned}
                received={item.received}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
};
