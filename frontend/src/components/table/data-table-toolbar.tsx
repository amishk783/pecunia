import { Table } from "@tanstack/react-table";

import { Button } from "../ui/button";
import { X } from "lucide-react";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { dates } from "./data/data";

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
    <div className="flex flex-col md:flex-row items-center justify-between gap-2">
      <div className="flex flex-1 items-center w-full space-x-2">
        <input
          placeholder="Filter tasks..."
          value={
            (table.getColumn("category")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("category")?.setFilterValue(event.target.value)
          }
          className=" w-full h-8 md:w-[150px] lg:w-[250px]"
        />
        {table.getColumn("category") && (
          <DataTableFacetedFilter
            className=" "
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
      <div className="flex space-x-2 w-full">
        {table.getColumn("date") && (
          <DataTableFacetedFilter
            className="max-sm:w-1/2 max-sm:text-md"
            column={table.getColumn("date")}
            title="All"
            options={dates}
          />
        )}
        <DataTableViewOptions
          className="max-sm:w-1/2 max-sm:text-md "
          table={table}
        />
      </div>
    </div>
  );
}
