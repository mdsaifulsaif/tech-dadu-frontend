import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "", ...props }) => {
  return (
    <div
      className={`animate-pulse bg-theme-border/60 rounded-md ${className}`}
      {...props}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="card-surface p-3 sm:p-5 space-y-3 sm:space-y-4">
      <Skeleton className="h-28 sm:h-44 w-full rounded-xl" />
      <Skeleton className="h-4 sm:h-5 w-3/4" />
      <Skeleton className="h-3 sm:h-4 w-full" />
      <Skeleton className="h-3 sm:h-4 w-5/6" />
      <div className="pt-2 flex items-center justify-between">
        <Skeleton className="h-5 sm:h-6 w-16 sm:w-20" />
        <Skeleton className="h-7 sm:h-8 w-18 sm:w-24 rounded-lg" />
      </div>
    </div>
  );
};

export default Skeleton;

