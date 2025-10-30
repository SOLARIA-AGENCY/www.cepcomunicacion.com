/**
 * BlogPostCard Component
 *
 * Displays a blog post preview in card format with image, title, excerpt, and metadata.
 * Optimized with React.memo to prevent unnecessary re-renders in lists.
 * Adapted for Next.js with Link component
 *
 * @example
 * <BlogPostCard post={blogPost} />
 */

'use client';

import { memo, useMemo, useCallback } from 'react';
import Link from 'next/link';

// BlogPost type definition
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  category: string;
  author: string;
  published_at: string;
  reading_time: number; // in minutes
}

export interface BlogPostCardProps {
  /**
   * The blog post data to display
   */
  post: BlogPost;

  /**
   * Optional click handler (overrides default navigation)
   */
  onClick?: () => void;

  /**
   * Optional className for the container
   */
  className?: string;
}

// Category color mapping (hoisted to module scope for performance)
const CATEGORY_COLORS: Record<string, string> = {
  'Noticias': 'bg-blue-100 text-blue-800',
  'Guías': 'bg-green-100 text-green-800',
  'Consejos': 'bg-yellow-100 text-yellow-800',
  'Opinión': 'bg-purple-100 text-purple-800',
  'Casos de Éxito': 'bg-pink-100 text-pink-800',
} as const;

export const BlogPostCard = memo(function BlogPostCard({
  post,
  onClick,
  className = '',
}: BlogPostCardProps) {
  // Memoized image URL
  const imageUrl = useMemo(() => {
    return post.featured_image || 'https://placehold.co/600x400/e5e7eb/6b7280?text=Blog+Post';
  }, [post.featured_image]);

  // Memoized category color
  const categoryColor = useMemo(() => {
    return CATEGORY_COLORS[post.category] || 'bg-neutral-100 text-neutral-800';
  }, [post.category]);

  // Memoized formatted date
  const formattedDate = useMemo(() => {
    const date = new Date(post.published_at);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }, [post.published_at]);

  // Memoized click handler
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  // Memoized keyboard handler
  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  const cardContent = (
    <>
      {/* Featured Image */}
      <div className="relative overflow-hidden rounded-t-lg aspect-video">
        <img
          src={imageUrl}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColor}`}>
            {post.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold mb-3 text-neutral-900 group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-neutral-600 mb-4 line-clamp-3">{post.excerpt}</p>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-neutral-500">
          {/* Author */}
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>{post.author}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <time dateTime={post.published_at}>{formattedDate}</time>
          </div>

          {/* Reading Time */}
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{post.reading_time} min</span>
          </div>
        </div>

        {/* Read More Link */}
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <span className="text-primary font-semibold group-hover:underline">
            Leer más →
          </span>
        </div>
      </div>
    </>
  );

  if (onClick) {
    return (
      <article
        className={`card cursor-pointer hover:shadow-lg transition-all duration-200 group ${className}`}
        onClick={handleClick}
        onKeyPress={handleKeyPress}
        role="button"
        tabIndex={0}
        aria-label={`Leer artículo: ${post.title}`}
      >
        {cardContent}
      </article>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`card cursor-pointer hover:shadow-lg transition-all duration-200 group block ${className}`}
      aria-label={`Leer artículo: ${post.title}`}
    >
      {cardContent}
    </Link>
  );
});
