/**
 * Calculate Read Time Hook
 *
 * Calculates estimated reading time based on content length.
 * Uses standard 200 words per minute reading speed.
 * Minimum read time is 1 minute.
 *
 * Algorithm:
 * 1. Extract text content from rich text field
 * 2. Count words
 * 3. Divide by 200 (average reading speed)
 * 4. Round up to nearest minute
 * 5. Ensure minimum of 1 minute
 */

import type { FieldHook } from 'payload';

/**
 * Extract text from Slate rich text content
 */
const extractTextFromSlate = (content: any): string => {
  if (!content) return '';

  let text = '';

  const traverse = (node: any) => {
    if (!node) return;

    // If node has text property, add it
    if (typeof node.text === 'string') {
      text += node.text + ' ';
    }

    // If node has children, traverse them
    if (Array.isArray(node.children)) {
      node.children.forEach(traverse);
    }
  };

  // Start traversal from root
  if (content.root) {
    traverse(content.root);
  } else {
    traverse(content);
  }

  return text.trim();
};

export const calculateReadTime: FieldHook = async ({
  data,
  req,
  operation,
  value,
  originalDoc,
}) => {
  // Get content from data or originalDoc
  const content = data?.content || originalDoc?.content;
  if (!content) {
    return 1; // Minimum 1 minute
  }

  // Extract text from rich text content
  const text = extractTextFromSlate(content);

  // Count words
  const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length;

  // Calculate read time (200 words per minute)
  const readTime = Math.ceil(wordCount / 200);

  // Ensure minimum of 1 minute
  return Math.max(readTime, 1);
};

export default calculateReadTime;
