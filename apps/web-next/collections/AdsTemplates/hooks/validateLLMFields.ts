import type { FieldHook } from 'payload';

/**
 * validateLLMFields Hook
 *
 * Enforces LLM field dependencies:
 * - If llm_generated = true, llm_model MUST be provided
 * - Validates llm_model format (non-empty string)
 * - Validates llm_prompt length (max 1000 characters)
 *
 * Business Rules:
 * - llm_model is required when llm_generated is true
 * - llm_prompt is optional but has max length constraint
 * - LLM fields are visible only when llm_generated is true (UI-level)
 *
 * Triggered: beforeChange
 */
export const validateLLMFields: FieldHook = async ({ data, operation }) => {
  // Only validate on create and update operations
  if (operation !== 'create' && operation !== 'update') {
    return;
  }

  const isLLMGenerated = data?.llm_generated === true;
  const llmModel = data?.llm_model;
  const llmPrompt = data?.llm_prompt;

  // If llm_generated is true, llm_model is REQUIRED
  if (isLLMGenerated) {
    if (!llmModel || typeof llmModel !== 'string' || llmModel.trim().length === 0) {
      throw new Error(
        'llm_model is required when llm_generated is true. ' +
        'Please specify the model used (e.g., "gpt-4", "claude-3-opus", "ollama-llama3").'
      );
    }

    // Validate llm_model format (alphanumeric, hyphens, underscores, dots)
    const modelPattern = /^[a-zA-Z0-9._-]+$/;
    if (!modelPattern.test(llmModel.trim())) {
      throw new Error(
        'llm_model must contain only alphanumeric characters, hyphens, underscores, and dots. ' +
        'Example: "gpt-4-turbo", "claude-3.5-sonnet"'
      );
    }

    // Validate llm_model length (reasonable limit)
    if (llmModel.trim().length > 100) {
      throw new Error('llm_model must be 100 characters or less');
    }
  }

  // Validate llm_prompt length if present
  if (llmPrompt && typeof llmPrompt === 'string') {
    if (llmPrompt.length > 1000) {
      throw new Error('llm_prompt must be 1000 characters or less');
    }
  }

  // Warning: If llm_model or llm_prompt are set but llm_generated is false
  // This is allowed but may indicate user error
  if (!isLLMGenerated && (llmModel || llmPrompt)) {
    // Optional: Log warning (no PII per SP-004)
    // This allows manual correction without blocking the operation
  }
};
