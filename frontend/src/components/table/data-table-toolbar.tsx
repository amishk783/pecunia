import { Table } from "@tanstack/react-table";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { X } from "lucide-react";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { dates, priorities, statuses } from "./data/data";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  categories: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

export function DataTableToolbar<TData>({
  table,
  categories,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <input
          placeholder="Filter tasks..."
          value={(table.getColumn("category")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("category")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("category") && (
          <DataTableFacetedFilter
            column={table.getColumn("category")}
            title="Category"
            options={categories}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <div className="flex space-x-2">
        {table.getColumn("date") && (
          <DataTableFacetedFilter
            column={table.getColumn("date")}
            title="All"
            options={dates}
          />
        )}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
