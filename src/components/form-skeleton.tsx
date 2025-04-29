// FormSectionSkeleton.tsx

import { Skeleton } from "./ui/skeleton";

type FormSectionSkeletonProps = {
  label: string;
  count?: number;
};

export function FormSectionSkeleton({
  label,
  count = 3,
}: FormSectionSkeletonProps) {
  return (
    <div className="max-w-sm space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-40" />
      </div>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
      <Skeleton className="h-8 w-24" />
    </div>
  );
}
