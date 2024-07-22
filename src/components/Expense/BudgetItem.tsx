
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface BudgetItemProps {
  id: number;
  label: string;
  planned: string;
  received: string;
}

export const BudgetItem: React.FC<BudgetItemProps> = ({
  id,
  label,
  planned,
  received,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 rounded "
    >
      <div className="flex justify-between border-b w-[90%]">
        <h2>{label}</h2>
        <div className="flex gap-4">
          <p>{planned}</p>
          <p>{received}</p>
        </div>
      </div>

      <div>{/* <Input reg /> */}</div>
    </div>
  );
};
