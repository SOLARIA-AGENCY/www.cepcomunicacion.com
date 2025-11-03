/**
 * Checkbox Component
 *
 * Reusable checkbox with label and error message
 */

'use client';

import React from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        <div className="flex items-start">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={`mt-1 mr-2 h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary focus:ring-offset-0 ${
              error ? 'border-red-600' : ''
            } ${className}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${checkboxId}-error` : undefined}
            {...props}
          />
          <label htmlFor={checkboxId} className="text-sm text-neutral-700 cursor-pointer">
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        </div>
        {error && (
          <p id={`${checkboxId}-error`} className="form-error ml-6" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
