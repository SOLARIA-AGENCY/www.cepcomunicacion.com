/**
 * CourseDetailSkeleton Component
 *
 * Loading skeleton for CourseDetailPage.
 * Matches the layout structure: hero section + main content + sidebar.
 */

import { Skeleton } from '@components/ui';

export function CourseDetailSkeleton() {
  return (
    <div className="course-detail-page">
      {/* Hero Section Skeleton */}
      <section className="bg-gradient-to-r from-primary to-primary-light text-white py-16">
        <div className="container">
          <div className="max-w-4xl">
            {/* Breadcrumb Skeleton */}
            <div className="mb-4 flex items-center gap-2">
              <Skeleton width="50px" height="14px" className="bg-white/30" rounded="sm" />
              <Skeleton width="8px" height="8px" className="bg-white/30" rounded="full" />
              <Skeleton width="60px" height="14px" className="bg-white/30" rounded="sm" />
              <Skeleton width="8px" height="8px" className="bg-white/30" rounded="full" />
              <Skeleton width="150px" height="14px" className="bg-white/30" rounded="sm" />
            </div>

            {/* Badge Skeleton */}
            <Skeleton width="120px" height="28px" className="mb-4 bg-white/30" rounded="default" />

            {/* Title Skeleton */}
            <Skeleton height="40px" className="mb-2 bg-white/30" rounded="default" />
            <Skeleton width="60%" height="40px" className="mb-4 bg-white/30" rounded="default" />

            {/* Short Description Skeleton */}
            <Skeleton height="28px" className="mb-2 bg-white/30" rounded="default" />
            <Skeleton width="80%" height="28px" className="mb-6 bg-white/30" rounded="default" />

            {/* Meta Info Skeleton */}
            <div className="flex flex-wrap gap-4">
              <Skeleton width="100px" height="20px" className="bg-white/30" rounded="default" />
              <Skeleton width="90px" height="20px" className="bg-white/30" rounded="default" />
              <Skeleton width="130px" height="20px" className="bg-white/30" rounded="default" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Skeleton */}
      <section className="py-12">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2">
              {/* Description Card */}
              <div className="card mb-8">
                <Skeleton height="32px" width="250px" className="mb-4" rounded="default" />
                <div className="space-y-3">
                  <Skeleton height="18px" rounded="default" />
                  <Skeleton height="18px" rounded="default" />
                  <Skeleton height="18px" rounded="default" />
                  <Skeleton height="18px" width="90%" rounded="default" />
                  <Skeleton height="18px" rounded="default" />
                  <Skeleton height="18px" width="85%" rounded="default" />
                </div>
              </div>

              {/* Campuses Card */}
              <div className="card mb-8">
                <Skeleton height="32px" width="200px" className="mb-4" rounded="default" />
                <div className="space-y-3">
                  <Skeleton height="24px" rounded="default" />
                  <Skeleton height="24px" rounded="default" />
                  <Skeleton height="24px" width="80%" rounded="default" />
                </div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1">
              <div className="card sticky top-24">
                <Skeleton height="28px" width="180px" className="mb-4" rounded="default" />

                {/* Price Skeleton */}
                <div className="mb-4 pb-4 border-b border-neutral-200">
                  <Skeleton height="40px" width="120px" className="mb-2" rounded="default" />
                  <Skeleton height="16px" width="110px" rounded="default" />
                </div>

                {/* CTA Button Skeleton */}
                <Skeleton height="44px" className="mb-3" rounded="lg" />
                <Skeleton height="12px" className="mb-6" rounded="default" />

                {/* Features List Skeleton */}
                <div className="pt-6 border-t border-neutral-200 space-y-3">
                  <Skeleton height="20px" rounded="default" />
                  <Skeleton height="20px" rounded="default" />
                  <Skeleton height="20px" rounded="default" />
                  <Skeleton height="20px" width="90%" rounded="default" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
