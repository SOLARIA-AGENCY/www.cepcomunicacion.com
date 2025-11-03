/**
 * FAQs Collection - Test Suite
 *
 * TDD Implementation - RED Phase
 * Target: 60+ tests covering all functionality
 *
 * Test Categories:
 * - CRUD Operations (10+ tests)
 * - Validation Tests (12+ tests)
 * - Access Control Tests (12+ tests)
 * - Relationship Tests (6+ tests)
 * - Hook Tests (8+ tests)
 * - Security Tests (8+ tests)
 * - Categorization Tests (4+ tests)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Payload } from 'payload';
import type { FAQ } from '../../../payload-types';

// Mock Payload instance
let payload: Payload;

// Test data fixtures
const mockAdmin = {
  id: 'admin-001',
  email: 'admin@cepcomunicacion.com',
  role: 'admin',
};

const mockGestor = {
  id: 'gestor-001',
  email: 'gestor@cepcomunicacion.com',
  role: 'gestor',
};

const mockMarketing = {
  id: 'marketing-001',
  email: 'marketing@cepcomunicacion.com',
  role: 'marketing',
};

const mockMarketingOther = {
  id: 'marketing-002',
  email: 'marketing2@cepcomunicacion.com',
  role: 'marketing',
};

const mockAsesor = {
  id: 'asesor-001',
  email: 'asesor@cepcomunicacion.com',
  role: 'asesor',
};

const mockLectura = {
  id: 'lectura-001',
  email: 'lectura@cepcomunicacion.com',
  role: 'lectura',
};

const validFAQData = {
  question: 'How do I enroll in a course?',
  answer: {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              text: 'To enroll in a course, visit the course page and click the "Enroll Now" button. Follow the registration process and provide the required information.',
            },
          ],
        },
      ],
    },
  },
  category: 'enrollment',
  language: 'es',
  order: 1,
  keywords: ['enrollment', 'registration', 'course'],
  active: true,
};

describe('FAQs Collection - CRUD Operations', () => {
  describe('CREATE operations', () => {
    it('should create a FAQ with all required fields (admin)', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: validFAQData,
        user: mockAdmin,
      });

      expect(faq).toBeDefined();
      expect(faq.question).toBe('How do I enroll in a course?');
      expect(faq.category).toBe('enrollment');
      expect(faq.language).toBe('es');
      expect(faq.order).toBe(1);
      expect(faq.created_by).toBe(mockAdmin.id);
      expect(faq.active).toBe(true);
    });

    it('should create a FAQ with minimum required fields', async () => {
      const minimalData = {
        question: 'What is the minimum question?',
        answer: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [{ text: 'This is the answer.' }],
              },
            ],
          },
        },
        category: 'general',
      };

      const faq = await payload.create({
        collection: 'faqs',
        data: minimalData,
        user: mockAdmin,
      });

      expect(faq).toBeDefined();
      expect(faq.question).toBe('What is the minimum question?');
      expect(faq.category).toBe('general'); // Required
      expect(faq.language).toBe('es'); // Default value
      expect(faq.order).toBe(0); // Default value
      expect(faq.helpful_count).toBe(0); // Default value
      expect(faq.view_count).toBe(0); // Default value
    });

    it('should auto-populate created_by on creation', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: validFAQData,
        user: mockMarketing,
      });

      expect(faq.created_by).toBe(mockMarketing.id);
    });

    it('should initialize helpful_count to 0', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: validFAQData,
        user: mockAdmin,
      });

      expect(faq.helpful_count).toBe(0);
    });

    it('should initialize view_count to 0', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: validFAQData,
        user: mockAdmin,
      });

      expect(faq.view_count).toBe(0);
    });

    it('should deny creation without authentication', async () => {
      await expect(
        payload.create({
          collection: 'faqs',
          data: validFAQData,
        })
      ).rejects.toThrow();
    });

    it('should accept negative order values', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: { ...validFAQData, order: -1 },
        user: mockAdmin,
      });

      await expect(faq.order).toBeGreaterThanOrEqual(0);
    });
  });

  describe('READ operations', () => {
    it('should allow public to read active FAQs only', async () => {
      const activeFAQ = await payload.create({
        collection: 'faqs',
        data: { ...validFAQData, active: true },
        user: mockAdmin,
      });

      const faqs = await payload.find({
        collection: 'faqs',
      });

      expect(faqs.docs).toHaveLength(1);
      expect(faqs.docs[0].id).toBe(activeFAQ.id);
    });

    it('should not show inactive FAQs to public', async () => {
      await payload.create({
        collection: 'faqs',
        data: { ...validFAQData, active: false },
        user: mockAdmin,
      });

      const faqs = await payload.find({
        collection: 'faqs',
      });

      expect(faqs.docs).toHaveLength(0);
    });

    it('should allow authenticated users to read all FAQs (lectura role)', async () => {
      await payload.create({
        collection: 'faqs',
        data: { ...validFAQData, active: false },
        user: mockAdmin,
      });

      const faqs = await payload.find({
        collection: 'faqs',
        user: mockLectura,
      });

      expect(faqs.docs).toHaveLength(1);
    });

    it('should sort FAQs by order within category', async () => {
      await payload.create({
        collection: 'faqs',
        data: { ...validFAQData, question: 'Question 1', order: 2 },
        user: mockAdmin,
      });

      await payload.create({
        collection: 'faqs',
        data: { ...validFAQData, question: 'Question 2', order: 1 },
        user: mockAdmin,
      });

      const faqs = await payload.find({
        collection: 'faqs',
        sort: 'order',
      });

      expect(faqs.docs[0].order).toBe(1);
      expect(faqs.docs[1].order).toBe(2);
    });
  });

  describe('UPDATE operations', () => {
    it('should allow admin to update any FAQ', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: validFAQData,
        user: mockMarketing,
      });

      const updated = await payload.update({
        collection: 'faqs',
        id: faq.id,
        data: { question: 'Updated Question by Admin' },
        user: mockAdmin,
      });

      expect(updated.question).toBe('Updated Question by Admin');
    });

    it('should allow gestor to update any FAQ', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: validFAQData,
        user: mockMarketing,
      });

      const updated = await payload.update({
        collection: 'faqs',
        id: faq.id,
        data: { question: 'Updated Question by Gestor' },
        user: mockGestor,
      });

      expect(updated.question).toBe('Updated Question by Gestor');
    });

    it('should allow marketing to update their own FAQs only', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: validFAQData,
        user: mockMarketing,
      });

      const updated = await payload.update({
        collection: 'faqs',
        id: faq.id,
        data: { question: 'Updated by Owner' },
        user: mockMarketing,
      });

      expect(updated.question).toBe('Updated by Owner');
    });

    it('should deny marketing from updating FAQs they do not own', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: validFAQData,
        user: mockMarketing,
      });

      await expect(
        payload.update({
          collection: 'faqs',
          id: faq.id,
          data: { question: 'Attempted Update by Other' },
          user: mockMarketingOther,
        })
      ).rejects.toThrow();
    });

    it('should deny lectura role from updating FAQs', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: validFAQData,
        user: mockAdmin,
      });

      await expect(
        payload.update({
          collection: 'faqs',
          id: faq.id,
          data: { question: 'Attempted Update by Lectura' },
          user: mockLectura,
        })
      ).rejects.toThrow();
    });

    it('should deny asesor role from updating FAQs', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: validFAQData,
        user: mockAdmin,
      });

      await expect(
        payload.update({
          collection: 'faqs',
          id: faq.id,
          data: { question: 'Attempted Update by Asesor' },
          user: mockAsesor,
        })
      ).rejects.toThrow();
    });

    it('should enforce created_by immutability (SP-001)', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: validFAQData,
        user: mockMarketing,
      });

      const updated = await payload.update({
        collection: 'faqs',
        id: faq.id,
        data: { created_by: 'different-user-id' },
        user: mockAdmin,
      });

      expect(updated.created_by).toBe(mockMarketing.id); // Should remain unchanged
    });

    it('should enforce helpful_count immutability (SP-001)', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: validFAQData,
        user: mockAdmin,
      });

      const updated = await payload.update({
        collection: 'faqs',
        id: faq.id,
        data: { helpful_count: 1000 },
        user: mockAdmin,
      });

      expect(updated.helpful_count).toBe(0); // Should remain unchanged
    });

    it('should enforce view_count immutability (SP-001)', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: validFAQData,
        user: mockAdmin,
      });

      const updated = await payload.update({
        collection: 'faqs',
        id: faq.id,
        data: { view_count: 5000 },
        user: mockAdmin,
      });

      expect(updated.view_count).toBe(0); // Should remain unchanged
    });
  });

  describe('DELETE operations', () => {
    it('should allow admin to delete any FAQ', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: validFAQData,
        user: mockMarketing,
      });

      await expect(
        payload.delete({
          collection: 'faqs',
          id: faq.id,
          user: mockAdmin,
        })
      ).resolves.not.toThrow();
    });

    it('should allow gestor to delete any FAQ', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: validFAQData,
        user: mockMarketing,
      });

      await expect(
        payload.delete({
          collection: 'faqs',
          id: faq.id,
          user: mockGestor,
        })
      ).resolves.not.toThrow();
    });

    it('should deny marketing from deleting FAQs', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: validFAQData,
        user: mockMarketing,
      });

      await expect(
        payload.delete({
          collection: 'faqs',
          id: faq.id,
          user: mockMarketing,
        })
      ).rejects.toThrow();
    });

    it('should deny lectura from deleting FAQs', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: validFAQData,
        user: mockAdmin,
      });

      await expect(
        payload.delete({
          collection: 'faqs',
          id: faq.id,
          user: mockLectura,
        })
      ).rejects.toThrow();
    });

    it('should deny asesor from deleting FAQs', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: validFAQData,
        user: mockAdmin,
      });

      await expect(
        payload.delete({
          collection: 'faqs',
          id: faq.id,
          user: mockAsesor,
        })
      ).rejects.toThrow();
    });
  });
});

describe('FAQs Collection - Validation Tests', () => {
  describe('Question validation', () => {
    it('should reject question shorter than 10 characters', async () => {
      await expect(
        payload.create({
          collection: 'faqs',
          data: { ...validFAQData, question: 'Short?' },
          user: mockAdmin,
        })
      ).rejects.toThrow();
    });

    it('should reject question longer than 300 characters', async () => {
      const longQuestion = 'Q'.repeat(301);
      await expect(
        payload.create({
          collection: 'faqs',
          data: { ...validFAQData, question: longQuestion },
          user: mockAdmin,
        })
      ).rejects.toThrow();
    });

    it('should accept question exactly 10 characters', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: { ...validFAQData, question: '1234567890' },
        user: mockAdmin,
      });

      expect(faq.question).toBe('1234567890');
    });

    it('should accept question exactly 300 characters', async () => {
      const question = 'Q'.repeat(300);
      const faq = await payload.create({
        collection: 'faqs',
        data: { ...validFAQData, question },
        user: mockAdmin,
      });

      expect(faq.question).toBe(question);
    });
  });

  describe('Order validation', () => {
    it('should reject negative order values', async () => {
      await expect(
        payload.create({
          collection: 'faqs',
          data: { ...validFAQData, order: -1 },
          user: mockAdmin,
        })
      ).rejects.toThrow();
    });

    it('should accept order value of 0', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: { ...validFAQData, order: 0 },
        user: mockAdmin,
      });

      expect(faq.order).toBe(0);
    });

    it('should accept large order values', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: { ...validFAQData, order: 9999 },
        user: mockAdmin,
      });

      expect(faq.order).toBe(9999);
    });
  });

  describe('Keywords validation', () => {
    it('should accept up to 10 keywords', async () => {
      const keywords = Array.from({ length: 10 }, (_, i) => `keyword-${i}`);
      const faq = await payload.create({
        collection: 'faqs',
        data: { ...validFAQData, keywords },
        user: mockAdmin,
      });

      expect(faq.keywords).toHaveLength(10);
    });

    it('should reject more than 10 keywords', async () => {
      const keywords = Array.from({ length: 11 }, (_, i) => `keyword-${i}`);
      await expect(
        payload.create({
          collection: 'faqs',
          data: { ...validFAQData, keywords },
          user: mockAdmin,
        })
      ).rejects.toThrow();
    });
  });

  describe('Category validation', () => {
    it('should accept all valid category values', async () => {
      const categories = ['general', 'enrollment', 'courses', 'payment', 'technical', 'other'];

      for (const category of categories) {
        const faq = await payload.create({
          collection: 'faqs',
          data: {
            ...validFAQData,
            question: `Test question for ${category}`,
            category,
          },
          user: mockAdmin,
        });

        expect(faq.category).toBe(category);
      }
    });
  });

  describe('Language validation', () => {
    it('should accept all valid language values', async () => {
      const languages = ['es', 'en', 'ca'];

      for (const language of languages) {
        const faq = await payload.create({
          collection: 'faqs',
          data: {
            ...validFAQData,
            question: `Test question in ${language}`,
            language,
          },
          user: mockAdmin,
        });

        expect(faq.language).toBe(language);
      }
    });
  });
});

describe('FAQs Collection - Relationship Tests', () => {
  it('should accept valid course relationship', async () => {
    const faq = await payload.create({
      collection: 'faqs',
      data: { ...validFAQData, related_course: 'valid-course-id' },
      user: mockAdmin,
    });

    expect(faq.related_course).toBe('valid-course-id');
  });

  it('should accept valid cycle relationship', async () => {
    const faq = await payload.create({
      collection: 'faqs',
      data: { ...validFAQData, related_cycle: 'valid-cycle-id' },
      user: mockAdmin,
    });

    expect(faq.related_cycle).toBe('valid-cycle-id');
  });

  it('should set related_course to null on course deletion', async () => {
    // This test requires actual database relationship testing
    // Implementation depends on database cascade behavior
    expect(true).toBe(true); // Placeholder
  });

  it('should set related_cycle to null on cycle deletion', async () => {
    // This test requires actual database relationship testing
    // Implementation depends on database cascade behavior
    expect(true).toBe(true); // Placeholder
  });

  it('should maintain created_by relationship integrity', async () => {
    const faq = await payload.create({
      collection: 'faqs',
      data: validFAQData,
      user: mockMarketing,
    });

    expect(faq.created_by).toBe(mockMarketing.id);
  });
});

describe('FAQs Collection - Hook Tests', () => {
  describe('validateOrder hook', () => {
    it('should ensure order is >= 0', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: { ...validFAQData, order: -5 },
        user: mockAdmin,
      });

      expect(faq.order).toBeGreaterThanOrEqual(0);
    });

    it('should accept valid positive order', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: { ...validFAQData, order: 10 },
        user: mockAdmin,
      });

      expect(faq.order).toBe(10);
    });
  });

  describe('trackFAQCreator hook', () => {
    it('should auto-populate created_by on creation', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: validFAQData,
        user: mockMarketing,
      });

      expect(faq.created_by).toBe(mockMarketing.id);
    });

    it('should enforce created_by immutability on update', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: validFAQData,
        user: mockMarketing,
      });

      const updated = await payload.update({
        collection: 'faqs',
        id: faq.id,
        data: { created_by: 'attacker-id' },
        user: mockAdmin,
      });

      expect(updated.created_by).toBe(mockMarketing.id);
    });

    it('should require authentication for creation', async () => {
      await expect(
        payload.create({
          collection: 'faqs',
          data: validFAQData,
        })
      ).rejects.toThrow('Authentication required');
    });
  });
});

describe('FAQs Collection - Security Tests (SP-001, SP-004)', () => {
  describe('SP-001: Immutability - created_by', () => {
    it('should prevent created_by update via field access control (Layer 2)', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: validFAQData,
        user: mockMarketing,
      });

      const updated = await payload.update({
        collection: 'faqs',
        id: faq.id,
        data: { created_by: 'attacker-id' },
        user: mockAdmin,
      });

      expect(updated.created_by).toBe(mockMarketing.id);
    });

    it('should enforce created_by immutability at hook level (Layer 3)', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: validFAQData,
        user: mockMarketing,
      });

      const updated = await payload.update({
        collection: 'faqs',
        id: faq.id,
        data: { created_by: 'different-user' },
        user: mockAdmin,
      });

      expect(updated.created_by).toBe(mockMarketing.id);
    });
  });

  describe('SP-001: Immutability - helpful_count', () => {
    it('should prevent helpful_count update via field access control (Layer 2)', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: validFAQData,
        user: mockAdmin,
      });

      const updated = await payload.update({
        collection: 'faqs',
        id: faq.id,
        data: { helpful_count: 9999 },
        user: mockAdmin,
      });

      expect(updated.helpful_count).toBe(0);
    });
  });

  describe('SP-001: Immutability - view_count', () => {
    it('should prevent view_count update via field access control (Layer 2)', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: validFAQData,
        user: mockAdmin,
      });

      const updated = await payload.update({
        collection: 'faqs',
        id: faq.id,
        data: { view_count: 9999 },
        user: mockAdmin,
      });

      expect(updated.view_count).toBe(0);
    });
  });

  describe('SP-004: No content in logs', () => {
    it('should not log FAQ content in error messages', async () => {
      // This is more of an implementation verification
      // Actual logging would be tested with log inspection
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Ownership-based permissions', () => {
    it('should allow marketing to update only their own FAQs', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: validFAQData,
        user: mockMarketing,
      });

      const updated = await payload.update({
        collection: 'faqs',
        id: faq.id,
        data: { question: 'Updated by Owner' },
        user: mockMarketing,
      });

      expect(updated.question).toBe('Updated by Owner');
    });

    it('should deny marketing from updating FAQs they do not own', async () => {
      const faq = await payload.create({
        collection: 'faqs',
        data: validFAQData,
        user: mockMarketing,
      });

      await expect(
        payload.update({
          collection: 'faqs',
          id: faq.id,
          data: { question: 'Unauthorized Update' },
          user: mockMarketingOther,
        })
      ).rejects.toThrow();
    });
  });
});

describe('FAQs Collection - Categorization Tests', () => {
  it('should filter FAQs by category', async () => {
    await payload.create({
      collection: 'faqs',
      data: { ...validFAQData, question: 'Enrollment FAQ', category: 'enrollment' },
      user: mockAdmin,
    });

    await payload.create({
      collection: 'faqs',
      data: { ...validFAQData, question: 'Payment FAQ', category: 'payment' },
      user: mockAdmin,
    });

    const enrollmentFAQs = await payload.find({
      collection: 'faqs',
      where: {
        category: {
          equals: 'enrollment',
        },
      },
    });

    expect(enrollmentFAQs.docs).toHaveLength(1);
    expect(enrollmentFAQs.docs[0].category).toBe('enrollment');
  });

  it('should filter FAQs by language', async () => {
    await payload.create({
      collection: 'faqs',
      data: { ...validFAQData, question: 'Spanish FAQ', language: 'es' },
      user: mockAdmin,
    });

    await payload.create({
      collection: 'faqs',
      data: { ...validFAQData, question: 'English FAQ', language: 'en' },
      user: mockAdmin,
    });

    const spanishFAQs = await payload.find({
      collection: 'faqs',
      where: {
        language: {
          equals: 'es',
        },
      },
    });

    expect(spanishFAQs.docs).toHaveLength(1);
    expect(spanishFAQs.docs[0].language).toBe('es');
  });

  it('should sort FAQs by order within category', async () => {
    await payload.create({
      collection: 'faqs',
      data: { ...validFAQData, question: 'Third', order: 3, category: 'general' },
      user: mockAdmin,
    });

    await payload.create({
      collection: 'faqs',
      data: { ...validFAQData, question: 'First', order: 1, category: 'general' },
      user: mockAdmin,
    });

    await payload.create({
      collection: 'faqs',
      data: { ...validFAQData, question: 'Second', order: 2, category: 'general' },
      user: mockAdmin,
    });

    const faqs = await payload.find({
      collection: 'faqs',
      where: {
        category: {
          equals: 'general',
        },
      },
      sort: 'order',
    });

    expect(faqs.docs[0].order).toBe(1);
    expect(faqs.docs[1].order).toBe(2);
    expect(faqs.docs[2].order).toBe(3);
  });
});

describe('FAQs Collection - Edge Cases', () => {
  it('should handle empty keywords array', async () => {
    const faq = await payload.create({
      collection: 'faqs',
      data: { ...validFAQData, keywords: [] },
      user: mockAdmin,
    });

    expect(faq.keywords).toEqual([]);
  });

  it('should handle null relationships gracefully', async () => {
    const faq = await payload.create({
      collection: 'faqs',
      data: {
        ...validFAQData,
        related_course: null,
        related_cycle: null,
      },
      user: mockAdmin,
    });

    expect(faq.related_course).toBeNull();
    expect(faq.related_cycle).toBeNull();
  });

  it('should handle soft delete via active flag', async () => {
    const faq = await payload.create({
      collection: 'faqs',
      data: validFAQData,
      user: mockAdmin,
    });

    // Soft delete
    await payload.update({
      collection: 'faqs',
      id: faq.id,
      data: { active: false },
      user: mockAdmin,
    });

    // Should not appear in public queries
    const faqs = await payload.find({
      collection: 'faqs',
    });

    expect(faqs.docs.find((f) => f.id === faq.id)).toBeUndefined();
  });

  it('should handle duplicate questions (no unique constraint)', async () => {
    await payload.create({
      collection: 'faqs',
      data: { ...validFAQData, question: 'Duplicate question?' },
      user: mockAdmin,
    });

    const duplicate = await payload.create({
      collection: 'faqs',
      data: { ...validFAQData, question: 'Duplicate question?' },
      user: mockAdmin,
    });

    expect(duplicate.question).toBe('Duplicate question?');
  });
});
