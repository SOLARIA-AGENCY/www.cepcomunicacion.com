import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import path from 'path';

// Import collections (will be implemented next with TDD methodology)
import { Cycles } from './collections/Cycles/Cycles';
import { Campuses } from './collections/Campuses/Campuses';
import { Users } from './collections/Users/Users';
import { Courses } from './collections/Courses/Courses';
import { Leads } from './collections/Leads/Leads';
import { Campaigns } from './collections/Campaigns/Campaigns';
// import { CourseRuns } from './collections/CourseRuns/CourseRuns';
import { AdsTemplates } from './collections/AdsTemplates/AdsTemplates';
import { BlogPosts } from './collections/BlogPosts/BlogPosts';
import { FAQs } from './collections/FAQs/FAQs';
// import { Media } from './collections/Media/Media';
// import { SEOMetadata } from './collections/SEOMetadata/SEOMetadata';
// import { AuditLogs } from './collections/AuditLogs/AuditLogs';

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
  admin: {
    user: Users.slug, // CRITICAL: Specify auth collection
    meta: {
      titleSuffix: '- CEP Comunicación',
      favicon: '/favicon.ico',
    },
  },
  collections: [
    // Collections will be added here as they are implemented following TDD methodology
    // Core entities
    Users, // IMPORTANT: Users collection MUST be first for auth to work properly
    Cycles,
    Campuses,

    // Courses
    Courses,
    // CourseRuns,

    // Marketing
    Campaigns, // ✅ Marketing campaign tracking with UTM & analytics
    AdsTemplates, // ✅ Reusable ad templates (email, social, display ads)
    Leads, // ✅ Phase 1: Implemented with GDPR compliance

    // Content
    BlogPosts, // ✅ Blog content with SEO optimization
    FAQs, // ✅ Frequently Asked Questions
    // Media,

    // Metadata & Compliance
    // SEOMetadata,
    // AuditLogs,
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'YOUR_SECRET_HERE',
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: `postgresql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`,
    },
    migrationDir: path.resolve(__dirname, '../migrations'),
  }),
  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.MINIO_BUCKET || 'cepcomunicacion',
      config: {
        endpoint: process.env.MINIO_ENDPOINT || 'http://minio:9000',
        credentials: {
          accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
          secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadmin_dev_2025',
        },
        region: 'us-east-1', // MinIO requires a region
        forcePathStyle: true, // Required for MinIO
      },
    }),
  ],
  cors: [
    'http://localhost:3000', // React frontend
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
  ],
  csrf: [
    'http://localhost:3000',
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
  ],
});
