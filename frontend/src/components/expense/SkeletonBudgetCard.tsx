import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonBudgetCard() {
  return (
    <div className="flex flex-col space-y-3   w-full">
      <div className=" flex flex-col gap-8 bg-card h-[185px] rounded-xl p-5">
        <Skeleton className="h-8  rounded-xl" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4  rounded-xl" />
          <Skeleton className="h-4  rounded-xl" />
          <Skeleton className="h-4  rounded-xl" />
        </div>
      </div>
    </div>
  );
}
