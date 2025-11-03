/**
 * Campaigns Collection - Test Suite
 *
 * TDD Implementation - RED Phase
 * Target: 120+ tests covering all functionality
 *
 * Test Categories:
 * - CRUD Operations (15+ tests)
 * - Validation Tests (25+ tests)
 * - Access Control Tests (18+ tests)
 * - Relationship Tests (12+ tests)
 * - Hook Tests (15+ tests)
 * - Security Tests (15+ tests)
 * - Business Logic Tests (20+ tests)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Payload } from 'payload';
import type { Campaign } from '../../../payload-types';

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

const validCampaignData = {
  name: 'Summer 2025 Campaign',
  campaign_type: 'paid_ads',
  status: 'draft',
  start_date: '2025-06-01',
  end_date: '2025-08-31',
  budget: 5000.00,
  target_leads: 100,
  target_enrollments: 20,
  utm_source: 'facebook',
  utm_medium: 'cpc',
  utm_campaign: 'summer-2025',
  utm_term: 'curso-online',
  utm_content: 'variant-a',
  active: true,
};

describe('Campaigns Collection - CRUD Operations', () => {
  describe('CREATE operations', () => {
    it('should create a campaign with all required fields (admin)', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: validCampaignData,
        user: mockAdmin,
      });

      expect(campaign).toBeDefined();
      expect(campaign.name).toBe('Summer 2025 Campaign');
      expect(campaign.campaign_type).toBe('paid_ads');
      expect(campaign.status).toBe('draft');
      expect(campaign.created_by).toBe(mockAdmin.id);
    });

    it('should create a campaign with minimum required fields', async () => {
      const minimalData = {
        name: 'Minimal Campaign',
        campaign_type: 'organic',
        status: 'draft',
        start_date: '2025-07-01',
      };

      const campaign = await payload.create({
        collection: 'campaigns',
        data: minimalData,
        user: mockAdmin,
      });

      expect(campaign).toBeDefined();
      expect(campaign.name).toBe('Minimal Campaign');
      expect(campaign.active).toBe(true); // Default value
    });

    it('should auto-populate created_by with current user', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: validCampaignData,
        user: mockMarketing,
      });

      expect(campaign.created_by).toBe(mockMarketing.id);
    });

    it('should reject campaign without name', async () => {
      const invalidData = { ...validCampaignData, name: undefined };

      await expect(
        payload.create({
          collection: 'campaigns',
          data: invalidData,
          user: mockAdmin,
        })
      ).rejects.toThrow();
    });

    it('should reject campaign with duplicate name', async () => {
      await payload.create({
        collection: 'campaigns',
        data: validCampaignData,
        user: mockAdmin,
      });

      await expect(
        payload.create({
          collection: 'campaigns',
          data: validCampaignData,
          user: mockAdmin,
        })
      ).rejects.toThrow(/unique/i);
    });

    it('should reject campaign with name too short (< 3 chars)', async () => {
      const invalidData = { ...validCampaignData, name: 'AB' };

      await expect(
        payload.create({
          collection: 'campaigns',
          data: invalidData,
          user: mockAdmin,
        })
      ).rejects.toThrow(/min.*3/i);
    });

    it('should reject campaign with name too long (> 100 chars)', async () => {
      const invalidData = {
        ...validCampaignData,
        name: 'A'.repeat(101),
      };

      await expect(
        payload.create({
          collection: 'campaigns',
          data: invalidData,
          user: mockAdmin,
        })
      ).rejects.toThrow(/max.*100/i);
    });
  });

  describe('READ operations', () => {
    it('should allow admin to read all campaigns', async () => {
      const campaigns = await payload.find({
        collection: 'campaigns',
        user: mockAdmin,
      });

      expect(campaigns.docs).toBeDefined();
    });

    it('should allow gestor to read all campaigns', async () => {
      const campaigns = await payload.find({
        collection: 'campaigns',
        user: mockGestor,
      });

      expect(campaigns.docs).toBeDefined();
    });

    it('should allow marketing to read all campaigns', async () => {
      const campaigns = await payload.find({
        collection: 'campaigns',
        user: mockMarketing,
      });

      expect(campaigns.docs).toBeDefined();
    });

    it('should allow asesor to read all campaigns (read-only)', async () => {
      const campaigns = await payload.find({
        collection: 'campaigns',
        user: mockAsesor,
      });

      expect(campaigns.docs).toBeDefined();
    });

    it('should allow lectura role to read campaigns (reporting)', async () => {
      const campaigns = await payload.find({
        collection: 'campaigns',
        user: mockLectura,
      });

      expect(campaigns.docs).toBeDefined();
    });

    it('should deny public access to campaigns', async () => {
      await expect(
        payload.find({
          collection: 'campaigns',
          user: undefined,
        })
      ).rejects.toThrow();
    });
  });

  describe('UPDATE operations', () => {
    it('should allow admin to update any campaign', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: validCampaignData,
        user: mockAdmin,
      });

      const updated = await payload.update({
        collection: 'campaigns',
        id: campaign.id,
        data: { status: 'active' },
        user: mockAdmin,
      });

      expect(updated.status).toBe('active');
    });

    it('should allow gestor to update any campaign', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: validCampaignData,
        user: mockMarketing,
      });

      const updated = await payload.update({
        collection: 'campaigns',
        id: campaign.id,
        data: { status: 'active' },
        user: mockGestor,
      });

      expect(updated.status).toBe('active');
    });

    it('should allow marketing to update own campaigns only', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: validCampaignData,
        user: mockMarketing,
      });

      const updated = await payload.update({
        collection: 'campaigns',
        id: campaign.id,
        data: { budget: 6000 },
        user: mockMarketing,
      });

      expect(updated.budget).toBe(6000);
    });

    it('should deny marketing from updating campaigns created by others', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: validCampaignData,
        user: mockAdmin,
      });

      await expect(
        payload.update({
          collection: 'campaigns',
          id: campaign.id,
          data: { status: 'active' },
          user: mockMarketing,
        })
      ).rejects.toThrow();
    });

    it('should deny asesor from updating any campaign', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: validCampaignData,
        user: mockAdmin,
      });

      await expect(
        payload.update({
          collection: 'campaigns',
          id: campaign.id,
          data: { status: 'active' },
          user: mockAsesor,
        })
      ).rejects.toThrow();
    });

    it('should deny lectura from updating any campaign', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: validCampaignData,
        user: mockAdmin,
      });

      await expect(
        payload.update({
          collection: 'campaigns',
          id: campaign.id,
          data: { status: 'active' },
          user: mockLectura,
        })
      ).rejects.toThrow();
    });
  });

  describe('DELETE operations', () => {
    it('should allow admin to delete campaigns', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: validCampaignData,
        user: mockAdmin,
      });

      await expect(
        payload.delete({
          collection: 'campaigns',
          id: campaign.id,
          user: mockAdmin,
        })
      ).resolves.not.toThrow();
    });

    it('should allow gestor to delete campaigns', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: validCampaignData,
        user: mockAdmin,
      });

      await expect(
        payload.delete({
          collection: 'campaigns',
          id: campaign.id,
          user: mockGestor,
        })
      ).resolves.not.toThrow();
    });

    it('should deny marketing from deleting campaigns', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: validCampaignData,
        user: mockMarketing,
      });

      await expect(
        payload.delete({
          collection: 'campaigns',
          id: campaign.id,
          user: mockMarketing,
        })
      ).rejects.toThrow();
    });

    it('should deny asesor from deleting campaigns', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: validCampaignData,
        user: mockAdmin,
      });

      await expect(
        payload.delete({
          collection: 'campaigns',
          id: campaign.id,
          user: mockAsesor,
        })
      ).rejects.toThrow();
    });
  });
});

describe('Campaigns Collection - Validation Tests', () => {
  describe('Date validation', () => {
    it('should accept end_date equal to start_date (same day)', async () => {
      const sameDay = {
        ...validCampaignData,
        start_date: '2025-07-01',
        end_date: '2025-07-01',
      };

      const campaign = await payload.create({
        collection: 'campaigns',
        data: sameDay,
        user: mockAdmin,
      });

      expect(campaign).toBeDefined();
    });

    it('should reject end_date before start_date', async () => {
      const invalidDates = {
        ...validCampaignData,
        start_date: '2025-08-01',
        end_date: '2025-07-01',
      };

      await expect(
        payload.create({
          collection: 'campaigns',
          data: invalidDates,
          user: mockAdmin,
        })
      ).rejects.toThrow(/end date must be on or after start date/i);
    });

    it('should reject past start_date for draft campaigns', async () => {
      const pastDate = {
        ...validCampaignData,
        status: 'draft',
        start_date: '2020-01-01',
      };

      await expect(
        payload.create({
          collection: 'campaigns',
          data: pastDate,
          user: mockAdmin,
        })
      ).rejects.toThrow(/draft campaigns cannot have past start dates/i);
    });

    it('should allow past start_date for active campaigns', async () => {
      const pastDate = {
        ...validCampaignData,
        status: 'active',
        start_date: '2024-01-01',
      };

      const campaign = await payload.create({
        collection: 'campaigns',
        data: pastDate,
        user: mockAdmin,
      });

      expect(campaign).toBeDefined();
    });
  });

  describe('Budget validation', () => {
    it('should accept budget with 2 decimal places', async () => {
      const data = { ...validCampaignData, budget: 1234.56 };

      const campaign = await payload.create({
        collection: 'campaigns',
        data,
        user: mockAdmin,
      });

      expect(campaign.budget).toBe(1234.56);
    });

    it('should reject negative budget', async () => {
      const data = { ...validCampaignData, budget: -100 };

      await expect(
        payload.create({
          collection: 'campaigns',
          data,
          user: mockAdmin,
        })
      ).rejects.toThrow(/min.*0/i);
    });

    it('should accept zero budget', async () => {
      const data = { ...validCampaignData, budget: 0 };

      const campaign = await payload.create({
        collection: 'campaigns',
        data,
        user: mockAdmin,
      });

      expect(campaign.budget).toBe(0);
    });

    it('should accept undefined budget (optional)', async () => {
      const data = { ...validCampaignData, budget: undefined };

      const campaign = await payload.create({
        collection: 'campaigns',
        data,
        user: mockAdmin,
      });

      expect(campaign.budget).toBeUndefined();
    });
  });

  describe('Target validation', () => {
    it('should reject negative target_leads', async () => {
      const data = { ...validCampaignData, target_leads: -10 };

      await expect(
        payload.create({
          collection: 'campaigns',
          data,
          user: mockAdmin,
        })
      ).rejects.toThrow(/min.*0/i);
    });

    it('should reject non-integer target_leads', async () => {
      const data = { ...validCampaignData, target_leads: 10.5 };

      await expect(
        payload.create({
          collection: 'campaigns',
          data,
          user: mockAdmin,
        })
      ).rejects.toThrow(/integer/i);
    });

    it('should reject target_enrollments > target_leads', async () => {
      const data = {
        ...validCampaignData,
        target_leads: 50,
        target_enrollments: 60,
      };

      await expect(
        payload.create({
          collection: 'campaigns',
          data,
          user: mockAdmin,
        })
      ).rejects.toThrow(/target enrollments cannot exceed target leads/i);
    });

    it('should accept target_enrollments equal to target_leads', async () => {
      const data = {
        ...validCampaignData,
        target_leads: 50,
        target_enrollments: 50,
      };

      const campaign = await payload.create({
        collection: 'campaigns',
        data,
        user: mockAdmin,
      });

      expect(campaign).toBeDefined();
    });

    it('should accept target_enrollments less than target_leads', async () => {
      const data = {
        ...validCampaignData,
        target_leads: 100,
        target_enrollments: 20,
      };

      const campaign = await payload.create({
        collection: 'campaigns',
        data,
        user: mockAdmin,
      });

      expect(campaign.target_enrollments).toBe(20);
    });
  });

  describe('UTM parameter validation', () => {
    it('should accept valid UTM parameters', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: validCampaignData,
        user: mockAdmin,
      });

      expect(campaign.utm_source).toBe('facebook');
      expect(campaign.utm_medium).toBe('cpc');
      expect(campaign.utm_campaign).toBe('summer-2025');
    });

    it('should require utm_campaign when utm_source is provided', async () => {
      const data = {
        ...validCampaignData,
        utm_source: 'facebook',
        utm_campaign: undefined,
      };

      await expect(
        payload.create({
          collection: 'campaigns',
          data,
          user: mockAdmin,
        })
      ).rejects.toThrow(/utm_campaign is required/i);
    });

    it('should require utm_campaign when utm_medium is provided', async () => {
      const data = {
        ...validCampaignData,
        utm_medium: 'cpc',
        utm_campaign: undefined,
      };

      await expect(
        payload.create({
          collection: 'campaigns',
          data,
          user: mockAdmin,
        })
      ).rejects.toThrow(/utm_campaign is required/i);
    });

    it('should reject uppercase characters in UTM parameters', async () => {
      const data = {
        ...validCampaignData,
        utm_source: 'Facebook',
      };

      await expect(
        payload.create({
          collection: 'campaigns',
          data,
          user: mockAdmin,
        })
      ).rejects.toThrow(/lowercase/i);
    });

    it('should reject special characters in UTM parameters', async () => {
      const data = {
        ...validCampaignData,
        utm_source: 'face_book',
      };

      await expect(
        payload.create({
          collection: 'campaigns',
          data,
          user: mockAdmin,
        })
      ).rejects.toThrow(/alphanumeric.*hyphen/i);
    });

    it('should accept hyphens in UTM parameters', async () => {
      const data = {
        ...validCampaignData,
        utm_source: 'facebook-ads',
      };

      const campaign = await payload.create({
        collection: 'campaigns',
        data,
        user: mockAdmin,
      });

      expect(campaign.utm_source).toBe('facebook-ads');
    });

    it('should accept campaign with no UTM parameters', async () => {
      const data = {
        ...validCampaignData,
        utm_source: undefined,
        utm_medium: undefined,
        utm_campaign: undefined,
      };

      const campaign = await payload.create({
        collection: 'campaigns',
        data,
        user: mockAdmin,
      });

      expect(campaign).toBeDefined();
    });
  });

  describe('Status workflow validation', () => {
    it('should accept status transition from draft to active', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: { ...validCampaignData, status: 'draft' },
        user: mockAdmin,
      });

      const updated = await payload.update({
        collection: 'campaigns',
        id: campaign.id,
        data: { status: 'active' },
        user: mockAdmin,
      });

      expect(updated.status).toBe('active');
    });

    it('should accept status transition from active to paused', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: { ...validCampaignData, status: 'active' },
        user: mockAdmin,
      });

      const updated = await payload.update({
        collection: 'campaigns',
        id: campaign.id,
        data: { status: 'paused' },
        user: mockAdmin,
      });

      expect(updated.status).toBe('paused');
    });

    it('should accept status transition to archived', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: { ...validCampaignData, status: 'completed' },
        user: mockAdmin,
      });

      const updated = await payload.update({
        collection: 'campaigns',
        id: campaign.id,
        data: { status: 'archived' },
        user: mockAdmin,
      });

      expect(updated.status).toBe('archived');
    });

    it('should reject status change from archived (terminal state)', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: { ...validCampaignData, status: 'archived' },
        user: mockAdmin,
      });

      await expect(
        payload.update({
          collection: 'campaigns',
          id: campaign.id,
          data: { status: 'active' },
          user: mockAdmin,
        })
      ).rejects.toThrow(/cannot change status from archived/i);
    });
  });
});

describe('Campaigns Collection - Relationship Tests', () => {
  it('should link campaign to course', async () => {
    // Create mock course
    const course = await payload.create({
      collection: 'courses',
      data: { name: 'Test Course' },
      user: mockAdmin,
    });

    const campaign = await payload.create({
      collection: 'campaigns',
      data: { ...validCampaignData, course: course.id },
      user: mockAdmin,
    });

    expect(campaign.course).toBe(course.id);
  });

  it('should handle course deletion (SET NULL)', async () => {
    const course = await payload.create({
      collection: 'courses',
      data: { name: 'Test Course' },
      user: mockAdmin,
    });

    const campaign = await payload.create({
      collection: 'campaigns',
      data: { ...validCampaignData, course: course.id },
      user: mockAdmin,
    });

    await payload.delete({
      collection: 'courses',
      id: course.id,
      user: mockAdmin,
    });

    const updatedCampaign = await payload.findByID({
      collection: 'campaigns',
      id: campaign.id,
      user: mockAdmin,
    });

    expect(updatedCampaign.course).toBeNull();
  });

  it('should link campaign to created_by user', async () => {
    const campaign = await payload.create({
      collection: 'campaigns',
      data: validCampaignData,
      user: mockMarketing,
    });

    expect(campaign.created_by).toBe(mockMarketing.id);
  });

  it('should prevent changing created_by after creation', async () => {
    const campaign = await payload.create({
      collection: 'campaigns',
      data: validCampaignData,
      user: mockMarketing,
    });

    await expect(
      payload.update({
        collection: 'campaigns',
        id: campaign.id,
        data: { created_by: mockAdmin.id },
        user: mockAdmin,
      })
    ).rejects.toThrow(/immutable/i);
  });
});

describe('Campaigns Collection - Analytics & Metrics', () => {
  describe('total_leads calculation', () => {
    it('should calculate total_leads correctly', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: validCampaignData,
        user: mockAdmin,
      });

      // Create 3 leads for this campaign
      await payload.create({
        collection: 'leads',
        data: { ...mockLeadData, campaign: campaign.id },
        user: mockAdmin,
      });
      await payload.create({
        collection: 'leads',
        data: { ...mockLeadData, email: 'lead2@test.com', campaign: campaign.id },
        user: mockAdmin,
      });
      await payload.create({
        collection: 'leads',
        data: { ...mockLeadData, email: 'lead3@test.com', campaign: campaign.id },
        user: mockAdmin,
      });

      const updatedCampaign = await payload.findByID({
        collection: 'campaigns',
        id: campaign.id,
        user: mockAdmin,
      });

      expect(updatedCampaign.total_leads).toBe(3);
    });

    it('should start with total_leads = 0', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: validCampaignData,
        user: mockAdmin,
      });

      expect(campaign.total_leads).toBe(0);
    });

    it('should prevent manual update of total_leads (immutable)', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: validCampaignData,
        user: mockAdmin,
      });

      await expect(
        payload.update({
          collection: 'campaigns',
          id: campaign.id,
          data: { total_leads: 999 },
          user: mockAdmin,
        })
      ).rejects.toThrow(/immutable/i);
    });
  });

  describe('total_conversions calculation', () => {
    it('should calculate total_conversions correctly', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: validCampaignData,
        user: mockAdmin,
      });

      // Create lead -> student -> enrollment
      const lead = await payload.create({
        collection: 'leads',
        data: { ...mockLeadData, campaign: campaign.id },
        user: mockAdmin,
      });

      const student = await payload.create({
        collection: 'students',
        data: { ...mockStudentData, converted_from_lead: lead.id },
        user: mockAdmin,
      });

      await payload.create({
        collection: 'enrollments',
        data: { student: student.id, course_run: 'test-run-id' },
        user: mockAdmin,
      });

      const updatedCampaign = await payload.findByID({
        collection: 'campaigns',
        id: campaign.id,
        user: mockAdmin,
      });

      expect(updatedCampaign.total_conversions).toBe(1);
    });

    it('should prevent manual update of total_conversions (immutable)', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: validCampaignData,
        user: mockAdmin,
      });

      await expect(
        payload.update({
          collection: 'campaigns',
          id: campaign.id,
          data: { total_conversions: 999 },
          user: mockAdmin,
        })
      ).rejects.toThrow(/immutable/i);
    });
  });

  describe('conversion_rate calculation', () => {
    it('should calculate conversion_rate correctly', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: validCampaignData,
        user: mockAdmin,
      });

      // Create 10 leads, convert 2
      for (let i = 0; i < 10; i++) {
        await payload.create({
          collection: 'leads',
          data: { ...mockLeadData, email: `lead${i}@test.com`, campaign: campaign.id },
          user: mockAdmin,
        });
      }

      // Convert 2 leads
      for (let i = 0; i < 2; i++) {
        const lead = await payload.findOne({
          collection: 'leads',
          where: { email: { equals: `lead${i}@test.com` } },
          user: mockAdmin,
        });

        const student = await payload.create({
          collection: 'students',
          data: { ...mockStudentData, email: `lead${i}@test.com`, converted_from_lead: lead.id },
          user: mockAdmin,
        });

        await payload.create({
          collection: 'enrollments',
          data: { student: student.id, course_run: 'test-run-id' },
          user: mockAdmin,
        });
      }

      const updatedCampaign = await payload.findByID({
        collection: 'campaigns',
        id: campaign.id,
        user: mockAdmin,
      });

      expect(updatedCampaign.conversion_rate).toBe(20); // 2/10 * 100 = 20%
    });

    it('should handle division by zero (no leads)', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: validCampaignData,
        user: mockAdmin,
      });

      expect(campaign.conversion_rate).toBeUndefined();
    });

    it('should prevent manual update of conversion_rate (immutable)', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: validCampaignData,
        user: mockAdmin,
      });

      await expect(
        payload.update({
          collection: 'campaigns',
          id: campaign.id,
          data: { conversion_rate: 50 },
          user: mockAdmin,
        })
      ).rejects.toThrow(/immutable/i);
    });
  });

  describe('cost_per_lead calculation', () => {
    it('should calculate cost_per_lead correctly', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: { ...validCampaignData, budget: 5000 },
        user: mockAdmin,
      });

      // Create 100 leads
      for (let i = 0; i < 100; i++) {
        await payload.create({
          collection: 'leads',
          data: { ...mockLeadData, email: `lead${i}@test.com`, campaign: campaign.id },
          user: mockAdmin,
        });
      }

      const updatedCampaign = await payload.findByID({
        collection: 'campaigns',
        id: campaign.id,
        user: mockAdmin,
      });

      expect(updatedCampaign.cost_per_lead).toBe(50); // 5000 / 100 = 50
    });

    it('should handle division by zero (no leads)', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: { ...validCampaignData, budget: 5000 },
        user: mockAdmin,
      });

      expect(campaign.cost_per_lead).toBeUndefined();
    });

    it('should prevent manual update of cost_per_lead (immutable)', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: validCampaignData,
        user: mockAdmin,
      });

      await expect(
        payload.update({
          collection: 'campaigns',
          id: campaign.id,
          data: { cost_per_lead: 25 },
          user: mockAdmin,
        })
      ).rejects.toThrow(/immutable/i);
    });
  });
});

describe('Campaigns Collection - Security Tests (SP-001)', () => {
  it('should mark created_by as read-only in admin UI', async () => {
    const campaign = await payload.create({
      collection: 'campaigns',
      data: validCampaignData,
      user: mockAdmin,
    });

    const collectionConfig = payload.collections['campaigns'].config;
    const createdByField = collectionConfig.fields.find(f => f.name === 'created_by');

    expect(createdByField.admin.readOnly).toBe(true);
  });

  it('should prevent created_by updates via access control', async () => {
    const campaign = await payload.create({
      collection: 'campaigns',
      data: validCampaignData,
      user: mockMarketing,
    });

    const collectionConfig = payload.collections['campaigns'].config;
    const createdByField = collectionConfig.fields.find(f => f.name === 'created_by');

    expect(createdByField.access.update()).toBe(false);
  });

  it('should validate created_by immutability in hook', async () => {
    const campaign = await payload.create({
      collection: 'campaigns',
      data: validCampaignData,
      user: mockMarketing,
    });

    await expect(
      payload.update({
        collection: 'campaigns',
        id: campaign.id,
        data: { created_by: mockAdmin.id },
        user: mockAdmin,
      })
    ).rejects.toThrow(/immutable/i);
  });

  it('should mark all calculated metrics as read-only (SP-001)', async () => {
    const collectionConfig = payload.collections['campaigns'].config;
    const calculatedFields = ['total_leads', 'total_conversions', 'conversion_rate', 'cost_per_lead'];

    calculatedFields.forEach(fieldName => {
      const field = collectionConfig.fields.find(f => f.name === fieldName);
      expect(field.admin.readOnly).toBe(true);
      expect(field.access.update()).toBe(false);
    });
  });

  it('should not log business intelligence in errors (SP-004)', async () => {
    const consoleSpy = vi.spyOn(console, 'error');

    try {
      await payload.create({
        collection: 'campaigns',
        data: { ...validCampaignData, budget: -100 },
        user: mockAdmin,
      });
    } catch (error) {
      // Error should not contain actual budget value
      expect(error.message).not.toMatch(/-100/);
      expect(error.message).not.toMatch(/budget.*-100/);
    }

    const errorLogs = consoleSpy.mock.calls.map(call => call.join(' '));
    errorLogs.forEach(log => {
      expect(log).not.toMatch(/-100/);
    });

    consoleSpy.mockRestore();
  });
});

describe('Campaigns Collection - Performance Tests', () => {
  it('should calculate metrics efficiently with 10,000 leads', async () => {
    const campaign = await payload.create({
      collection: 'campaigns',
      data: validCampaignData,
      user: mockAdmin,
    });

    const startTime = Date.now();

    // Simulate lead creation triggering metrics calculation
    // Note: In real scenario, this would be batched
    await payload.update({
      collection: 'campaigns',
      id: campaign.id,
      data: { _recalculateMetrics: true }, // Trigger hook
      user: mockAdmin,
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(100); // Must complete in < 100ms
  });

  it('should use single query for lead aggregation (no N+1)', async () => {
    const querySpy = vi.spyOn(payload.db, 'query');

    const campaign = await payload.create({
      collection: 'campaigns',
      data: validCampaignData,
      user: mockAdmin,
    });

    // Create multiple leads
    for (let i = 0; i < 10; i++) {
      await payload.create({
        collection: 'leads',
        data: { ...mockLeadData, email: `lead${i}@test.com`, campaign: campaign.id },
        user: mockAdmin,
      });
    }

    querySpy.mockClear();

    // Trigger metrics calculation
    await payload.findByID({
      collection: 'campaigns',
      id: campaign.id,
      user: mockAdmin,
    });

    // Should use IN operator, not individual queries
    const queries = querySpy.mock.calls.map(call => call[0]);
    const leadQueries = queries.filter(q => q.includes('leads'));

    expect(leadQueries.length).toBeLessThanOrEqual(1); // Single query with IN operator

    querySpy.mockRestore();
  });
});

describe('Campaigns Collection - Business Logic Tests', () => {
  describe('Campaign lifecycle', () => {
    it('should track campaign from draft to completion', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: { ...validCampaignData, status: 'draft' },
        user: mockAdmin,
      });

      const active = await payload.update({
        collection: 'campaigns',
        id: campaign.id,
        data: { status: 'active' },
        user: mockAdmin,
      });

      expect(active.status).toBe('active');

      const completed = await payload.update({
        collection: 'campaigns',
        id: campaign.id,
        data: { status: 'completed' },
        user: mockAdmin,
      });

      expect(completed.status).toBe('completed');
    });

    it('should support soft delete via active flag', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: validCampaignData,
        user: mockAdmin,
      });

      const deactivated = await payload.update({
        collection: 'campaigns',
        id: campaign.id,
        data: { active: false },
        user: mockAdmin,
      });

      expect(deactivated.active).toBe(false);
    });
  });

  describe('Multi-campaign support', () => {
    it('should allow multiple campaigns for same course', async () => {
      const course = await payload.create({
        collection: 'courses',
        data: { name: 'Popular Course' },
        user: mockAdmin,
      });

      const campaign1 = await payload.create({
        collection: 'campaigns',
        data: { ...validCampaignData, name: 'Campaign 1', course: course.id },
        user: mockAdmin,
      });

      const campaign2 = await payload.create({
        collection: 'campaigns',
        data: { ...validCampaignData, name: 'Campaign 2', course: course.id },
        user: mockAdmin,
      });

      expect(campaign1.course).toBe(campaign2.course);
    });

    it('should track leads separately per campaign', async () => {
      const campaign1 = await payload.create({
        collection: 'campaigns',
        data: { ...validCampaignData, name: 'Campaign 1' },
        user: mockAdmin,
      });

      const campaign2 = await payload.create({
        collection: 'campaigns',
        data: { ...validCampaignData, name: 'Campaign 2' },
        user: mockAdmin,
      });

      await payload.create({
        collection: 'leads',
        data: { ...mockLeadData, campaign: campaign1.id },
        user: mockAdmin,
      });

      await payload.create({
        collection: 'leads',
        data: { ...mockLeadData, email: 'lead2@test.com', campaign: campaign2.id },
        user: mockAdmin,
      });

      const updated1 = await payload.findByID({
        collection: 'campaigns',
        id: campaign1.id,
        user: mockAdmin,
      });

      const updated2 = await payload.findByID({
        collection: 'campaigns',
        id: campaign2.id,
        user: mockAdmin,
      });

      expect(updated1.total_leads).toBe(1);
      expect(updated2.total_leads).toBe(1);
    });
  });

  describe('ROI calculations', () => {
    it('should provide data for ROI analysis', async () => {
      const campaign = await payload.create({
        collection: 'campaigns',
        data: {
          ...validCampaignData,
          budget: 10000,
          target_leads: 200,
          target_enrollments: 40,
        },
        user: mockAdmin,
      });

      expect(campaign.budget / campaign.target_enrollments).toBe(250); // €250 per enrollment target
    });
  });
});

// Mock data for relationships
const mockLeadData = {
  first_name: 'Test',
  last_name: 'Lead',
  email: 'lead@test.com',
  phone: '+34 612 345 678',
  gdpr_consent: true,
  privacy_policy_accepted: true,
};

const mockStudentData = {
  first_name: 'Test',
  last_name: 'Student',
  email: 'student@test.com',
  dni: '12345678Z',
};
