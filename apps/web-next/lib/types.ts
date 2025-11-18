/**
 * Type utilities and guards for CEP Comunicación
 * Provides backward compatibility while migrating to shared types
 */

// Import types for use in guards
import type { Cycle, Center, User, CourseRun } from '@cepcomunicacion/types';

// Export all shared types
export type * from '@cepcomunicacion/types';

// Legacy type aliases for backward compatibility
export type { Center as Campus } from '@cepcomunicacion/types';
export type { BlogPost as Post } from '@cepcomunicacion/types';

// Legacy type guards for backward compatibility with proper types
export function isCyclePopulated(cycle: unknown): cycle is Cycle {
  return typeof cycle === 'object' && cycle !== null && 'name' in cycle;
}

export function isCampusPopulated(campus: unknown): campus is Center {
  return typeof campus === 'object' && campus !== null && 'name' in campus;
}

export function isMediaPopulated(media: unknown): media is { url: string } {
  return typeof media === 'object' && media !== null && 'url' in media;
}

export function isUserPopulated(user: unknown): user is User {
  return typeof user === 'object' && user !== null && 'email' in user;
}

export function isCourseRunPopulated(courseRun: unknown): courseRun is CourseRun {
  return typeof courseRun === 'object' && courseRun !== null && 'startDate' in courseRun;
}
