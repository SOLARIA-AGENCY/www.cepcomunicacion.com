import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { slateEditor } from '@payloadcms/richtext-slate';
import path from 'path';
import { fileURLToPath } from 'url';

// Import collections
import { Users } from './collections/Users';
import { Cycles } from './collections/Cycles';
import { Campuses } from './collections/Campuses';
import { Courses } from './collections/Courses';
import { CourseRuns } from './collections/CourseRuns';
import { Students } from './collections/Students';
import { Enrollments } from './collections/Enrollments';
import { Leads } from './collections/Leads';
import { Campaigns } from './collections/Campaigns';
import { AdsTemplates } from './collections/AdsTemplates';
import { BlogPosts } from './collections/BlogPosts';
import { FAQs } from './collections/FAQs';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Validate required environment variables
if (!process.env.PAYLOAD_SECRET) {
  throw new Error(
    'PAYLOAD_SECRET environment variable is required. ' +
    'Generate with: openssl rand -base64 32'
  );
}

if (process.env.PAYLOAD_SECRET.length < 32) {
  throw new Error(
    'PAYLOAD_SECRET must be at least 32 characters long. ' +
    'Generate with: openssl rand -base64 32'
  );
}

export default buildConfig({
  // Secret for JWT encryption
  secret: process.env.PAYLOAD_SECRET,

  // Database configuration
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/cepcomunicacion',
    },
  }),

  // Rich text editor
  editor: slateEditor({}),

  // Admin UI configuration
  admin: {
    user: 'users', // Collection for authentication
    meta: {
      titleSuffix: '- CEP Comunicación',
      favicon: '/favicon.ico',
      ogImage: '/og-image.jpg',
    },
  },

  // Collections
  collections: [
    // Authentication & User Management
    Users,
    // Tier 1 Collections - Taxonomies
    Cycles,
    Campuses,
    // Tier 1 Collections - Content
    Courses,
    // Tier 2 Collections - Course Management
    CourseRuns,
    // Tier 3 Collections - Student Management (CRITICAL - Maximum GDPR Security)
    Students,
    // Tier 3 Collections - Lead Management (CRITICAL - Public Endpoint + GDPR Security)
    Leads,
    // Tier 3 Collections - Marketing Management (Business Intelligence Protection)
    Campaigns,
    AdsTemplates,
    // Tier 4 Collections - Enrollment Management (CRITICAL - Financial Data Protection)
    Enrollments,
    // Content Management - Blog & Help Center
    BlogPosts,
    FAQs,
  ],

  // TypeScript type generation
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // GraphQL configuration
  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },

  // CORS configuration
  cors: [
    'http://localhost:3000',
    'https://cepcomunicacion.com',
    'https://www.cepcomunicacion.com',
  ],

  // CSRF protection
  csrf: [
    'http://localhost:3000',
    'https://cepcomunicacion.com',
    'https://www.cepcomunicacion.com',
  ],

  // Upload configuration (local for now, S3 later)
  upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
  },

  // Server URL
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
});
