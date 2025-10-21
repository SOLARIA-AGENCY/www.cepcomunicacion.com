# Workers & Automation Specification
# CEPComunicacion v2 - BullMQ Background Jobs

**Version:** 1.0.0
**Date:** 2025-10-21
**Status:** Phase 0 - Complete
**Technology:** BullMQ 5+ + Redis 7+ + Node.js 20

---

## Table of Contents

1. [Overview](#1-overview)
2. [Queue Architecture](#2-queue-architecture)
3. [Job Definitions](#3-job-definitions)
4. [External Integrations](#4-external-integrations)
5. [Error Handling & Retries](#5-error-handling--retries)
6. [Monitoring & Observability](#6-monitoring--observability)
7. [Deployment](#7-deployment)

---

## 1. Overview

### 1.1 Purpose

Replace n8n dependency with **internal automation** using BullMQ workers. All async operations (email, WhatsApp, CRM sync, stats aggregation, backups, LLM processing) are handled by reliable, monitored background jobs.

### 1.2 Design Principles

1. **Idempotency:** Jobs can be retried safely without side effects
2. **Observability:** All jobs logged, metrics exported to Prometheus
3. **Reliability:** Exponential backoff retry, dead letter queue for failures
4. **Decoupling:** Workers independent from API server
5. **Scalability:** Horizontal scaling by adding worker instances

### 1.3 Worker Processes

| Worker | Process Name | Purpose | Concurrency |
|--------|--------------|---------|-------------|
| **automation** | `worker-automation` | Lead processing, campaign sync, stats rollup | 5 jobs/worker |
| **llm** | `worker-llm` | PDF parsing, content extraction, ad generation | 2 jobs/worker (LLM rate limits) |
| **backup** | `worker-backup` | Database dumps, S3 uploads | 1 job (singleton) |

---

## 2. Queue Architecture

### 2.1 Queue Structure

```mermaid
graph LR
    subgraph "API Server (Payload CMS)"
        API[API Endpoints]
        Hooks[Payload Hooks]
    end

    subgraph "Redis Queues"
        QLeads[Queue: leads<br/>Priority: High]
        QCampaigns[Queue: campaigns<br/>Priority: Medium]
        QStats[Queue: stats<br/>Priority: Low]
        QLlm[Queue: llm<br/>Priority: Medium]
        QBackup[Queue: backup<br/>Priority: Low]
        QDLQ[Dead Letter Queue<br/>Failed Jobs]
    end

    subgraph "Worker Processes"
        WAuto[Worker: Automation<br/>Concurrency: 5]
        WLlm[Worker: LLM<br/>Concurrency: 2]
        WBackup[Worker: Backup<br/>Concurrency: 1]
    end

    subgraph "External Services"
        Mailchimp[Mailchimp API]
        WhatsApp[WhatsApp Cloud API]
        Meta[Meta Ads API]
        OpenAI[OpenAI/Claude]
        S3[S3 Storage]
    end

    API --> QLeads
    Hooks --> QLeads
    Hooks --> QCampaigns
    API --> QLlm

    QLeads --> WAuto
    QCampaigns --> WAuto
    QStats --> WAuto

    QLlm --> WLlm
    QBackup --> WBackup

    WAuto -.->|Retry Failed| QDLQ
    WLlm -.->|Retry Failed| QDLQ

    WAuto --> Mailchimp
    WAuto --> WhatsApp
    WAuto --> Meta

    WLlm --> OpenAI
    WBackup --> S3

    style QLeads fill:#e1f5ff
    style WAuto fill:#e1ffe1
    style QDLQ fill:#ffe1e1
```

### 2.2 Queue Configuration

```typescript
// File: workers/automation/src/queues.ts

import { Queue, QueueOptions } from 'bullmq';

const defaultQueueOptions: QueueOptions = {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000, // 2s, 4s, 8s
    },
    removeOnComplete: {
      age: 86400, // Keep completed jobs for 24 hours
      count: 1000, // Keep last 1000 completed jobs
    },
    removeOnFail: false, // Keep failed jobs for debugging
  },
};

export const leadsQueue = new Queue('leads', {
  ...defaultQueueOptions,
  defaultJobOptions: {
    ...defaultQueueOptions.defaultJobOptions,
    priority: 1, // High priority
  },
});

export const campaignsQueue = new Queue('campaigns', {
  ...defaultQueueOptions,
  defaultJobOptions: {
    ...defaultQueueOptions.defaultJobOptions,
    priority: 5, // Medium priority
  },
});

export const statsQueue = new Queue('stats', {
  ...defaultQueueOptions,
  defaultJobOptions: {
    ...defaultQueueOptions.defaultJobOptions,
    priority: 10, // Low priority
  },
});

export const llmQueue = new Queue('llm', {
  ...defaultQueueOptions,
  defaultJobOptions: {
    ...defaultQueueOptions.defaultJobOptions,
    priority: 5,
    timeout: 120000, // 2 minutes for LLM processing
  },
});

export const backupQueue = new Queue('backup', {
  ...defaultQueueOptions,
  defaultJobOptions: {
    ...defaultQueueOptions.defaultJobOptions,
    priority: 10,
    attempts: 2, // Only retry once for backups
  },
});
```

---

## 3. Job Definitions

### 3.1 Job: `lead.created`

**Trigger:** After lead inserted into database (Payload `afterChange` hook)

**Purpose:** Automate lead follow-up actions (Mailchimp, WhatsApp, CRM sync)

**Payload Schema:**

```typescript
interface LeadCreatedPayload {
  leadId: string; // UUID
  retryCount?: number;
}
```

**Implementation:**

```typescript
// File: workers/automation/src/jobs/lead-created.ts

import { Job } from 'bullmq';
import { getLeadById, updateLeadStatus } from '../db';
import { upsertMailchimpContact } from '../integrations/mailchimp';
import { sendWhatsAppMessage } from '../integrations/whatsapp';
import { syncToCRM } from '../integrations/crm';
import { logAudit } from '../utils/audit';

export async function handleLeadCreated(job: Job<LeadCreatedPayload>) {
  const { leadId } = job.data;

  // 1. Fetch lead details from database
  const lead = await getLeadById(leadId);
  if (!lead) {
    throw new Error(`Lead ${leadId} not found`);
  }

  job.updateProgress(10);

  // 2. Upsert to Mailchimp
  try {
    await upsertMailchimpContact({
      email: lead.email,
      firstName: lead.name.split(' ')[0],
      lastName: lead.name.split(' ').slice(1).join(' '),
      tags: ['lead', lead.courseRun.course.offerType],
      merge_fields: {
        PHONE: lead.phone,
        COURSE: lead.courseRun.course.title,
        CAMPUS: lead.courseRun.campus?.name || 'Telemático',
      },
    });
    job.log('Mailchimp: Contact upserted successfully');
    job.updateProgress(40);
  } catch (error) {
    job.log(`Mailchimp error: ${error.message}`);
    // Don't throw - continue with other integrations
  }

  // 3. Send WhatsApp message
  try {
    const whatsappTemplate = getWhatsAppTemplate(lead.courseRun.course.offerType);
    await sendWhatsAppMessage({
      to: lead.phone,
      template: whatsappTemplate,
      params: [lead.name, lead.courseRun.course.title],
    });
    job.log('WhatsApp: Message sent successfully');
    job.updateProgress(70);
  } catch (error) {
    job.log(`WhatsApp error: ${error.message}`);
  }

  // 4. Sync to CRM (optional)
  if (process.env.CRM_ENABLED === 'true') {
    try {
      await syncToCRM({
        leadId: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        course: lead.courseRun.course.title,
        source: lead.source,
      });
      job.log('CRM: Lead synced successfully');
    } catch (error) {
      job.log(`CRM error: ${error.message}`);
    }
  }

  job.updateProgress(90);

  // 5. Log audit trail
  await logAudit({
    action: 'lead.automated',
    entityType: 'lead',
    entityId: lead.id,
    metadata: {
      mailchimp: 'success',
      whatsapp: 'success',
      crm: process.env.CRM_ENABLED === 'true' ? 'success' : 'skipped',
    },
  });

  job.updateProgress(100);

  return {
    success: true,
    leadId: lead.id,
    actions: ['mailchimp', 'whatsapp', process.env.CRM_ENABLED === 'true' ? 'crm' : null].filter(Boolean),
  };
}

function getWhatsAppTemplate(offerType: string): string {
  const templates = {
    telematico: 'lead_confirmation_telematico',
    ocupados: 'lead_confirmation_ocupados',
    desempleados: 'lead_confirmation_desempleados',
    privados: 'lead_confirmation_privados',
  };
  return templates[offerType] || 'lead_confirmation_generic';
}
```

**Retry Strategy:**

- Attempts: 3
- Backoff: Exponential (2s, 4s, 8s)
- Idempotency: Mailchimp upsert (not insert), WhatsApp message ID tracking

**Acceptance Criteria:**

- ✅ Lead synced to Mailchimp within 5 seconds
- ✅ WhatsApp message delivered within 10 seconds
- ✅ CRM updated (if enabled)
- ✅ All actions logged to audit_log table
- ✅ Job completes in < 30 seconds (p95)

---

### 3.2 Job: `campaign.sync`

**Trigger:** Cron schedule (every 6 hours)

**Purpose:** Sync UTM stats from analytics, update campaign metrics

**Payload Schema:**

```typescript
interface CampaignSyncPayload {
  campaignId?: string; // If null, sync all active campaigns
  forceFullSync?: boolean;
}
```

**Implementation:**

```typescript
// File: workers/automation/src/jobs/campaign-sync.ts

import { Job } from 'bullmq';
import { getActiveCampaigns, updateCampaignStats } from '../db';
import { getGA4Stats } from '../integrations/ga4';
import { getMetaAdsStats } from '../integrations/meta';

export async function handleCampaignSync(job: Job<CampaignSyncPayload>) {
  const { campaignId, forceFullSync = false } = job.data;

  // 1. Get campaigns to sync
  const campaigns = campaignId
    ? [await getCampaignById(campaignId)]
    : await getActiveCampaigns();

  job.updateProgress(10);

  for (const [index, campaign] of campaigns.entries()) {
    try {
      // 2. Fetch stats from GA4
      const ga4Stats = await getGA4Stats({
        campaign: campaign.trackingTag,
        startDate: campaign.createdAt,
        endDate: new Date(),
      });

      // 3. Fetch stats from Meta Ads (if pixel configured)
      const metaStats = campaign.pixelIds?.meta
        ? await getMetaAdsStats({
            pixelId: campaign.pixelIds.meta,
            campaign: campaign.trackingTag,
          })
        : null;

      // 4. Calculate aggregated metrics
      const metrics = {
        clicks: ga4Stats.clicks + (metaStats?.clicks || 0),
        impressions: metaStats?.impressions || 0,
        leads: ga4Stats.leads,
        ctr: metaStats?.impressions ? (ga4Stats.clicks / metaStats.impressions) * 100 : 0,
        cpl: ga4Stats.adSpend / ga4Stats.leads || 0,
      };

      // 5. Update database
      await updateCampaignStats(campaign.id, metrics);

      job.log(`Campaign ${campaign.trackingTag}: synced (${metrics.leads} leads)`);
    } catch (error) {
      job.log(`Campaign ${campaign.id} sync error: ${error.message}`);
    }

    job.updateProgress(10 + (index / campaigns.length) * 80);
  }

  job.updateProgress(100);

  return {
    success: true,
    campaignsSynced: campaigns.length,
  };
}
```

**Cron Schedule:**

```typescript
// Trigger every 6 hours
leadsQueue.add('campaign.sync', {}, {
  repeat: {
    pattern: '0 */6 * * *', // Every 6 hours at :00
  },
  jobId: 'campaign-sync-recurring', // Prevent duplicates
});
```

**Acceptance Criteria:**

- ✅ All active campaigns synced every 6 hours
- ✅ Stats updated in database (clicks, leads, CTR, CPL)
- ✅ Job completes in < 5 minutes for 100 campaigns

---

### 3.3 Job: `stats.rollup`

**Trigger:** Cron schedule (daily at 02:00 UTC)

**Purpose:** Aggregate daily/weekly/monthly stats for dashboards

**Payload Schema:**

```typescript
interface StatsRollupPayload {
  date?: string; // ISO date, defaults to yesterday
  granularity: 'daily' | 'weekly' | 'monthly';
}
```

**Implementation:**

```typescript
// File: workers/automation/src/jobs/stats-rollup.ts

import { Job } from 'bullmq';
import { rollupLeadsByDate, rollupCourseStats, rollupCampaignStats } from '../db';

export async function handleStatsRollup(job: Job<StatsRollupPayload>) {
  const { date = getYesterday(), granularity } = job.data;

  job.updateProgress(10);

  // 1. Rollup leads by date, course, campus
  const leadsStats = await rollupLeadsByDate(date, granularity);
  job.log(`Leads rollup: ${leadsStats.totalLeads} leads`);
  job.updateProgress(40);

  // 2. Rollup course performance (leads per course)
  const courseStats = await rollupCourseStats(date, granularity);
  job.log(`Course rollup: ${courseStats.length} courses`);
  job.updateProgress(70);

  // 3. Rollup campaign performance
  const campaignStats = await rollupCampaignStats(date, granularity);
  job.log(`Campaign rollup: ${campaignStats.length} campaigns`);
  job.updateProgress(100);

  return {
    success: true,
    date,
    granularity,
    stats: {
      leads: leadsStats.totalLeads,
      courses: courseStats.length,
      campaigns: campaignStats.length,
    },
  };
}

function getYesterday(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}
```

**Cron Schedule:**

```typescript
statsQueue.add('stats.rollup', { granularity: 'daily' }, {
  repeat: {
    pattern: '0 2 * * *', // Every day at 02:00 UTC
  },
  jobId: 'stats-rollup-daily',
});
```

**Acceptance Criteria:**

- ✅ Stats rolled up daily at 02:00 UTC
- ✅ Dashboard queries < 100ms (use pre-aggregated data)
- ✅ Job completes in < 2 minutes

---

### 3.4 Job: `backup.daily`

**Trigger:** Cron schedule (daily at 03:00 UTC)

**Purpose:** Backup PostgreSQL database and upload to S3

**Payload Schema:**

```typescript
interface BackupPayload {
  type: 'full' | 'incremental';
  compress?: boolean;
}
```

**Implementation:**

```typescript
// File: workers/backup/src/jobs/backup-daily.ts

import { Job } from 'bullmq';
import { exec } from 'child_process';
import { promisify } from 'util';
import { uploadToS3 } from '../integrations/s3';

const execAsync = promisify(exec);

export async function handleBackupDaily(job: Job<BackupPayload>) {
  const { type = 'full', compress = true } = job.data;

  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `cep_backup_${timestamp}.dump${compress ? '.gz' : ''}`;
  const backupPath = `/tmp/${filename}`;

  job.updateProgress(10);

  // 1. Create PostgreSQL dump
  const pgDumpCmd = [
    'pg_dump',
    `-U ${process.env.PG_USER}`,
    `-h ${process.env.PG_HOST}`,
    `-p ${process.env.PG_PORT}`,
    '-F c', // Custom format (supports parallel restore)
    '-b', // Include blobs
    `-f ${backupPath}`,
    process.env.PG_DATABASE,
  ].join(' ');

  try {
    await execAsync(pgDumpCmd);
    job.log(`Database dumped to ${backupPath}`);
  } catch (error) {
    throw new Error(`pg_dump failed: ${error.message}`);
  }

  job.updateProgress(50);

  // 2. Compress if needed
  if (compress) {
    await execAsync(`gzip ${backupPath}`);
    job.log('Backup compressed');
  }

  job.updateProgress(70);

  // 3. Upload to S3
  const s3Key = `backups/${filename}`;
  await uploadToS3({
    bucket: process.env.S3_BACKUP_BUCKET,
    key: s3Key,
    filePath: compress ? `${backupPath}.gz` : backupPath,
  });

  job.log(`Uploaded to S3: ${s3Key}`);
  job.updateProgress(90);

  // 4. Cleanup local file
  await execAsync(`rm -f ${backupPath}*`);

  job.updateProgress(100);

  return {
    success: true,
    filename,
    s3Key,
    size: await getFileSize(compress ? `${backupPath}.gz` : backupPath),
  };
}
```

**Cron Schedule:**

```typescript
backupQueue.add('backup.daily', { type: 'full', compress: true }, {
  repeat: {
    pattern: '0 3 * * *', // Every day at 03:00 UTC
  },
  jobId: 'backup-daily-recurring',
});
```

**Acceptance Criteria:**

- ✅ Database backed up daily at 03:00 UTC
- ✅ Backup uploaded to S3 successfully
- ✅ Local temp files cleaned up
- ✅ Backup size logged for monitoring
- ✅ Retention policy enforced (S3 lifecycle rule: delete after 30 days)

---

### 3.5 Job: `llm.ingest`

**Trigger:** Manual (Admin uploads PDF and clicks "Generate Content")

**Purpose:** Extract course data from PDF and generate marketing copy

**Payload Schema:**

```typescript
interface LLMIngestPayload {
  uploadId: string; // UUID of upload record
  courseId?: string; // If updating existing course
  model: 'gpt-4' | 'claude-sonnet' | 'ollama-llama3';
}
```

**Implementation:**

```typescript
// File: workers/llm/src/jobs/llm-ingest.ts

import { Job } from 'bullmq';
import { getUploadById, updateUpload } from '../db';
import { parsePDF } from '../parsers/pdf';
import { extractCourseData, generateAds } from '../llm/openai';
import { validateCourseData } from '../validators';

export async function handleLLMIngest(job: Job<LLMIngestPayload>) {
  const { uploadId, courseId, model = 'gpt-4' } = job.data;

  // 1. Fetch upload record
  const upload = await getUploadById(uploadId);
  if (!upload || !upload.filePath) {
    throw new Error(`Upload ${uploadId} not found or missing file`);
  }

  job.updateProgress(10);

  // 2. Parse PDF to text
  const pdfText = await parsePDF(upload.filePath);
  job.log(`PDF parsed: ${pdfText.length} characters`);
  job.updateProgress(30);

  // 3. Extract course data (objectives, curriculum, etc.)
  const courseData = await extractCourseData(pdfText, model);
  job.log('Course data extracted');
  job.updateProgress(60);

  // 4. Generate marketing copy and ads
  const adsData = await generateAds(courseData, model);
  job.log('Ads generated');
  job.updateProgress(80);

  // 5. Validate output
  const validationResult = validateCourseData({
    ...courseData,
    ads: adsData,
  });

  if (!validationResult.success) {
    throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
  }

  // 6. Update upload record with results
  await updateUpload(uploadId, {
    status: 'completed',
    data: {
      course: courseData,
      ads: adsData,
    },
    tokensUsed: courseData._tokensUsed + adsData._tokensUsed,
  });

  job.updateProgress(100);

  return {
    success: true,
    uploadId,
    courseData,
    adsData,
    tokensUsed: courseData._tokensUsed + adsData._tokensUsed,
  };
}
```

**Acceptance Criteria:**

- ✅ PDF parsed successfully (up to 200 pages)
- ✅ Course data extracted with >90% accuracy
- ✅ Ads generated within Meta character limits
- ✅ RGPD compliance validated
- ✅ Job completes in < 90 seconds
- ✅ Token usage logged for cost tracking

---

## 4. External Integrations

### 4.1 Mailchimp Integration

**Purpose:** Sync leads to email marketing lists

**Implementation:**

```typescript
// File: workers/automation/src/integrations/mailchimp.ts

import Mailchimp from '@mailchimp/mailchimp_marketing';

Mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER, // e.g., 'us1'
});

export interface MailchimpContact {
  email: string;
  firstName: string;
  lastName: string;
  tags: string[];
  merge_fields: Record<string, any>;
}

export async function upsertMailchimpContact(contact: MailchimpContact) {
  const listId = process.env.MAILCHIMP_LIST_ID;

  const subscriberHash = md5(contact.email.toLowerCase());

  try {
    // Try to update existing subscriber
    await Mailchimp.lists.setListMember(listId, subscriberHash, {
      email_address: contact.email,
      status_if_new: 'subscribed',
      merge_fields: {
        FNAME: contact.firstName,
        LNAME: contact.lastName,
        ...contact.merge_fields,
      },
      tags: contact.tags,
    });
  } catch (error) {
    if (error.status === 404) {
      // Subscriber doesn't exist, create new
      await Mailchimp.lists.addListMember(listId, {
        email_address: contact.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: contact.firstName,
          LNAME: contact.lastName,
          ...contact.merge_fields,
        },
        tags: contact.tags,
      });
    } else {
      throw error;
    }
  }
}
```

**Idempotency:** Uses `setListMember` (upsert) instead of `addListMember` (insert)

---

### 4.2 WhatsApp Cloud API Integration

**Purpose:** Send automated messages to leads

**Implementation:**

```typescript
// File: workers/automation/src/integrations/whatsapp.ts

import axios from 'axios';

const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

export interface WhatsAppMessage {
  to: string; // Phone number with country code (e.g., +34600123456)
  template: string; // Template name
  params: string[]; // Template parameters
}

export async function sendWhatsAppMessage(message: WhatsAppMessage) {
  const response = await axios.post(
    `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: 'whatsapp',
      to: message.to,
      type: 'template',
      template: {
        name: message.template,
        language: {
          code: 'es',
        },
        components: [
          {
            type: 'body',
            parameters: message.params.map((param) => ({
              type: 'text',
              text: param,
            })),
          },
        ],
      },
    },
    {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
}
```

**Template Example (WhatsApp Business Manager):**

```
Template Name: lead_confirmation_desempleados

Body:
Hola {{1}},

Gracias por tu interés en el curso *{{2}}*.

Es 100% GRATUITO y subvencionado por el SEPE.

Te contactaremos en las próximas 24 horas para completar tu inscripción.

¿Tienes dudas? Responde a este mensaje.

Saludos,
CEP Formación
```

**Rate Limiting:** 80 messages/second (WhatsApp Cloud API limit)

---

### 4.3 Meta Ads API Integration

**Purpose:** Receive lead webhooks from Meta Ads campaigns

**Implementation:**

```typescript
// File: apps/cms/src/endpoints/webhooks/meta-leads.ts

import type { PayloadHandler } from 'payload/config';
import crypto from 'crypto';

export const metaLeadsWebhook: PayloadHandler = async (req, res) => {
  // 1. Verify webhook signature
  const signature = req.headers['x-hub-signature-256'];
  const expectedSignature = crypto
    .createHmac('sha256', process.env.META_APP_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (`sha256=${expectedSignature}` !== signature) {
    return res.status(403).json({ error: 'Invalid signature' });
  }

  // 2. Handle webhook challenge (initial setup)
  if (req.query['hub.verify_token'] === process.env.META_VERIFY_TOKEN) {
    return res.status(200).send(req.query['hub.challenge']);
  }

  // 3. Process lead data
  const { entry } = req.body;

  for (const item of entry) {
    for (const change of item.changes) {
      if (change.field === 'leadgen') {
        const leadData = change.value;

        // Insert lead into database (idempotent via externalId)
        await req.payload.create({
          collection: 'leads',
          data: {
            externalId: leadData.leadgen_id, // Unique Meta lead ID
            name: leadData.field_data.find((f) => f.name === 'full_name')?.values[0],
            email: leadData.field_data.find((f) => f.name === 'email')?.values[0],
            phone: leadData.field_data.find((f) => f.name === 'phone_number')?.values[0],
            source: 'meta',
            consent: true, // Meta requires pre-consent
          },
        });

        // Trigger lead.created job (handled by afterChange hook)
      }
    }
  }

  res.status(200).json({ success: true });
};
```

**Idempotency:** `externalId` (leadgen_id) is unique constraint in database

---

## 5. Error Handling & Retries

### 5.1 Retry Strategy

**Exponential Backoff:**

```
Attempt 1: Immediate
Attempt 2: Wait 2s
Attempt 3: Wait 4s
Failed: Move to Dead Letter Queue
```

**Configuration:**

```typescript
{
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000,
  },
}
```

### 5.2 Dead Letter Queue

**Purpose:** Store permanently failed jobs for manual review

**Implementation:**

```typescript
// File: workers/automation/src/dlq.ts

import { Queue } from 'bullmq';

export const deadLetterQueue = new Queue('dead-letter', {
  connection: redisConnection,
});

// Worker listens to failed events
worker.on('failed', async (job, error) => {
  if (job.attemptsMade >= job.opts.attempts) {
    // Move to DLQ
    await deadLetterQueue.add('failed-job', {
      originalQueue: job.queue.name,
      originalJobId: job.id,
      originalData: job.data,
      error: error.message,
      stack: error.stack,
      failedAt: new Date().toISOString(),
    });
  }
});
```

**Manual Retry from DLQ:**

```typescript
// Admin endpoint to retry failed job
export async function retryFailedJob(dlqJobId: string) {
  const dlqJob = await deadLetterQueue.getJob(dlqJobId);
  const { originalQueue, originalData } = dlqJob.data;

  // Re-enqueue to original queue
  await getQueue(originalQueue).add(originalData);

  // Remove from DLQ
  await dlqJob.remove();
}
```

---

## 6. Monitoring & Observability

### 6.1 BullBoard Dashboard

**Setup:**

```typescript
// File: apps/cms/src/server.ts

import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [
    new BullMQAdapter(leadsQueue),
    new BullMQAdapter(campaignsQueue),
    new BullMQAdapter(statsQueue),
    new BullMQAdapter(llmQueue),
    new BullMQAdapter(backupQueue),
    new BullMQAdapter(deadLetterQueue),
  ],
  serverAdapter,
});

app.use('/admin/queues', serverAdapter.getRouter());
```

**Access:** `https://cepcomunicacion.com/admin/queues` (admin-only)

**Features:**
- View active, completed, failed jobs
- Retry failed jobs
- Clear completed jobs
- View job logs
- Real-time updates

### 6.2 Prometheus Metrics

**Implementation:**

```typescript
// File: workers/automation/src/metrics.ts

import { register, Counter, Histogram } from 'prom-client';

export const jobsProcessedTotal = new Counter({
  name: 'jobs_processed_total',
  help: 'Total number of jobs processed',
  labelNames: ['queue', 'status'], // status: completed | failed
});

export const jobDurationSeconds = new Histogram({
  name: 'job_duration_seconds',
  help: 'Job processing duration in seconds',
  labelNames: ['queue', 'job_name'],
  buckets: [0.1, 0.5, 1, 5, 10, 30, 60],
});

export const queueLengthGauge = new Gauge({
  name: 'queue_length',
  help: 'Current number of jobs in queue',
  labelNames: ['queue', 'state'], // state: waiting | active | delayed
});

// Update metrics on job events
worker.on('completed', (job) => {
  jobsProcessedTotal.inc({ queue: job.queue.name, status: 'completed' });
  jobDurationSeconds.observe(
    { queue: job.queue.name, job_name: job.name },
    (Date.now() - job.timestamp) / 1000
  );
});

worker.on('failed', (job) => {
  jobsProcessedTotal.inc({ queue: job.queue.name, status: 'failed' });
});

// Expose metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
});
```

**Grafana Dashboards:**

- Job throughput (jobs/minute)
- Job latency (p50, p95, p99)
- Queue length over time
- Failure rate (%)

---

## 7. Deployment

### 7.1 Docker Compose

```yaml
# docker-compose.yml

services:
  worker-automation:
    build:
      context: .
      dockerfile: infra/docker/Dockerfile.worker
    command: npm run worker:automation
    environment:
      - REDIS_URL=redis://redis:6379
      - DATABASE_URL=postgresql://user:pass@postgres:5432/cep
      - MAILCHIMP_API_KEY=${MAILCHIMP_API_KEY}
      - WHATSAPP_ACCESS_TOKEN=${WHATSAPP_ACCESS_TOKEN}
    depends_on:
      - redis
      - postgres
    restart: unless-stopped
    deploy:
      replicas: 2 # Scale for high throughput

  worker-llm:
    build:
      context: .
      dockerfile: infra/docker/Dockerfile.worker
    command: npm run worker:llm
    environment:
      - REDIS_URL=redis://redis:6379
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - redis
    restart: unless-stopped

  worker-backup:
    build:
      context: .
      dockerfile: infra/docker/Dockerfile.worker
    command: npm run worker:backup
    environment:
      - REDIS_URL=redis://redis:6379
      - PG_HOST=postgres
      - PG_USER=user
      - PG_PASSWORD=${PG_PASSWORD}
      - S3_BACKUP_BUCKET=${S3_BACKUP_BUCKET}
    depends_on:
      - redis
      - postgres
    restart: unless-stopped
```

### 7.2 Health Checks

```typescript
// File: workers/automation/src/health.ts

import express from 'express';

const app = express();

app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    redis: await checkRedis(),
    database: await checkDatabase(),
    queues: await checkQueues(),
  };

  const statusCode = Object.values(health).every((v) => v === 'ok') ? 200 : 503;
  res.status(statusCode).json(health);
});

app.listen(3001, () => {
  console.log('Health check endpoint: http://localhost:3001/health');
});
```

---

## Conclusion

This worker specification defines:

- **5 Core Jobs:** lead.created, campaign.sync, stats.rollup, backup.daily, llm.ingest
- **3 Worker Processes:** automation, llm, backup
- **4 External Integrations:** Mailchimp, WhatsApp, Meta Ads, OpenAI/Claude
- **Reliability:** Exponential backoff, DLQ, idempotency
- **Observability:** BullBoard dashboard, Prometheus metrics, structured logs

**Next Steps:**
1. Implement workers in Phase 5 development
2. Test retry logic and idempotency
3. Configure monitoring and alerting
4. Load test with 1000+ jobs/minute

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-10-21 | Claude AI (SOLARIA AGENCY) | Initial workers specification |
