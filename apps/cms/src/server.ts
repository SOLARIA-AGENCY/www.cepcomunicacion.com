import { config as dotenvConfig } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenvConfig({ path: path.resolve(__dirname, '../.env') });

// Import Payload CMS after env is loaded
import { getPayload } from 'payload';
import payloadConfig from './payload.config.js';

const PORT = parseInt(process.env.PORT || '3001');

// Start Payload CMS
const start = async (): Promise<void> => {
  // Initialize Payload - it handles Express internally in 3.x
  const payload = await getPayload({
    config: payloadConfig,
  });

  payload.logger.info(`Payload initialized`);
  payload.logger.info(`Admin URL: ${payload.getAdminURL()}`);
  payload.logger.info(`API URL: ${payload.getAdminURL().replace('/admin', '/api')}`);

  // In Payload 3.x with Next.js, the server is started internally
  // For standalone mode, we would need Next.js server
  payload.logger.info(`Server ready on port ${PORT}`);
};

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
