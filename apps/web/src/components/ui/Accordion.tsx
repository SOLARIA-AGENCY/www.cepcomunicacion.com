/**
 * Accordion Component
 *
 * Expandable/collapsible content container.
 * Optimized with React.memo and useCallback.
 * Fully accessible with ARIA attributes and keyboard navigation.
 *
 * @example
 * <Accordion title="¿Cómo me inscribo?">
 *   <p>Para inscribirte debes...</p>
 * </Accordion>
 */

import { memo, useState, useCallback, ReactNode } from 'react';

export interface AccordionProps {
  /**
   * Title shown in the accordion header
   */
  title: string;

  /**
   * Content to show when expanded
   */
  children: ReactNode;

  /**
   * Whether the accordion starts open
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Optional className for the container
   */
  className?: string;
}

export const Accordion = memo(function Accordion({
  title,
  children,
  defaultOpen = false,
  className = '',
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Toggle accordion - memoized to prevent recreation
  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Handle keyboard events
  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle();
      }
    },
    [toggle]
  );

  return (
    <div className={`border border-neutral-200 rounded-lg overflow-hidden ${className}`}>
      {/* Accordion Header */}
      <button
        type="button"
        onClick={toggle}
        onKeyPress={handleKeyPress}
        className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${title}`}
      >
        <span className="text-lg font-semibold text-neutral-900">{title}</span>

        {/* Chevron Icon */}
        <svg
          className={`w-5 h-5 text-neutral-600 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Accordion Content */}
      <div
        id={`accordion-content-${title}`}
        className={`transition-all duration-200 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
        aria-hidden={!isOpen}
      >
        <div className="p-4 pt-0 text-neutral-700 prose prose-sm max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
});
