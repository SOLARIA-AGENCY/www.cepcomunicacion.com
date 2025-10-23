/**
 * CourseCardSkeleton Component
 *
 * Loading skeleton that matches the structure of CourseCard component.
 * Used while course data is being fetched.
 */

import { Skeleton } from '@components/ui';

export function CourseCardSkeleton() {
  return (
    <div className="card">
      {/* Featured Image Skeleton */}
      <Skeleton
        height="192px"
        className="-mx-8 -mt-8 mb-4 rounded-t-xl"
        rounded="none"
      />

      {/* Badge Skeleton */}
      <Skeleton width="80px" height="20px" className="mb-2" rounded="sm" />

      {/* Title Skeleton */}
      <Skeleton height="28px" className="mb-2" rounded="default" />
      <Skeleton width="70%" height="28px" className="mb-2" rounded="default" />

      {/* Short Description Skeleton (3 lines) */}
      <div className="space-y-2 mb-4">
        <Skeleton height="16px" rounded="default" />
        <Skeleton height="16px" rounded="default" />
        <Skeleton width="85%" height="16px" rounded="default" />
      </div>

      {/* Meta Info Skeleton */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Skeleton width="90px" height="20px" rounded="default" />
          <Skeleton width="8px" height="8px" rounded="full" />
          <Skeleton width="50px" height="20px" rounded="default" />
        </div>
        <Skeleton width="70px" height="20px" rounded="default" />
      </div>

      {/* Financial Aid Badge Skeleton */}
      <div className="mt-3 pt-3 border-t border-neutral-200">
        <Skeleton width="140px" height="16px" rounded="default" />
      </div>
    </div>
  );
}

/**
 * CourseListSkeleton - Grid of CourseCardSkeleton
 */
export function CourseListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <CourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
