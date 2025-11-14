import { config } from 'dotenv';
import path from 'path';
import '@testing-library/jest-dom';

// Load test environment variables
config({ path: path.resolve(__dirname, '../.env.test') });

// Global test setup
beforeAll(async () => {
  console.log('🧪 Setting up test environment...');
  console.log('📦 Database:', process.env.DATABASE_NAME || 'cepcomunicacion');
  console.log('🔌 PostgreSQL Host:', process.env.DATABASE_HOST || 'localhost');

  // Database connection will be established by Payload
  // when the server starts in each test suite
});

// Setup that runs before each test file
beforeEach(() => {
  // Reset any global state if needed
});
