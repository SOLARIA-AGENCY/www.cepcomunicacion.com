import express from 'express';
import payload from 'payload';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import payloadConfig from './payload.config.js';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Start Payload CMS
const start = async (): Promise<void> => {
  // Initialize Payload
  await payload.init({
    config: payloadConfig,
    secret: process.env.PAYLOAD_SECRET!,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  // Add your own express routes here

  app.listen(PORT, async () => {
    payload.logger.info(`Server listening on port ${PORT}`);
    payload.logger.info(`Admin URL: http://localhost:${PORT}/admin`);
    payload.logger.info(`API URL: http://localhost:${PORT}/api`);
  });
};

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export { app, payload };
