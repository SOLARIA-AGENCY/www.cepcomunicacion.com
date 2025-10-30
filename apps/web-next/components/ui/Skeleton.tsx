/**
 * Skeleton Component
 *
 * Base skeleton component for loading states with pulse animation.
 * Provides visual feedback while content is loading.
 * Optimized with React.memo to prevent unnecessary re-renders.
 *
 * @example
 * <Skeleton width="100%" height="24px" />
 * <Skeleton className="w-32 h-8 rounded-lg" />
 */

import { memo } from 'react';

export interface SkeletonProps {
  /**
   * Width of the skeleton (any valid CSS width value)
   */
  width?: string | number;

  /**
   * Height of the skeleton (any valid CSS height value)
   */
  height?: string | number;

  /**
   * Border radius style
   * @default 'default'
   */
  rounded?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | 'full';

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Disable pulse animation
   * @default false
   */
  noPulse?: boolean;
}

/**
 * Skeleton component for loading states
 * Memoized to prevent unnecessary re-renders
 */
export const Skeleton = memo(function Skeleton({
  width,
  height,
  rounded = 'default',
  className = '',
  noPulse = false,
}: SkeletonProps) {
  // Map rounded prop to Tailwind classes
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    default: 'rounded',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  // Convert width/height to CSS
  const getSize = (size: string | number | undefined) => {
    if (size === undefined) return undefined;
    return typeof size === 'number' ? `${size}px` : size;
  };

  const style = {
    width: getSize(width),
    height: getSize(height),
  };

  return (
    <div
      className={`
        bg-neutral-200
        ${roundedClasses[rounded]}
        ${noPulse ? '' : 'animate-pulse'}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      style={style}
      aria-busy="true"
      aria-live="polite"
      role="status"
    >
      <span className="sr-only">Cargando...</span>
    </div>
  );
});

/**
 * Skeleton Text - Pre-configured for text lines
 * Memoized to prevent unnecessary re-renders
 */
export const SkeletonText = memo(function SkeletonText({
  lines = 1,
  className = '',
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height="16px"
          width={index === lines - 1 ? '80%' : '100%'}
        />
      ))}
    </div>
  );
});

/**
 * Skeleton Card - Pre-configured for card layouts
 * Memoized to prevent unnecessary re-renders
 */
export const SkeletonCard = memo(function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`card ${className}`}>
      {/* Image placeholder */}
      <Skeleton height="192px" className="-mx-8 -mt-8 mb-4 rounded-t-xl" />

      {/* Badge */}
      <Skeleton width="80px" height="24px" className="mb-2" />

      {/* Title */}
      <Skeleton height="28px" className="mb-2" />

      {/* Description */}
      <SkeletonText lines={3} className="mb-4" />

      {/* Meta info */}
      <div className="flex items-center justify-between">
        <Skeleton width="120px" height="20px" />
        <Skeleton width="80px" height="20px" />
      </div>
    </div>
  );
});
