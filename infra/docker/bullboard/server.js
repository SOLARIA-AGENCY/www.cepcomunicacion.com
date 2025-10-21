// BullBoard Server - Queue Monitoring UI
// Standalone Express server for monitoring BullMQ queues

const express = require('express');
const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const { Queue } = require('bullmq');
const basicAuth = require('express-basic-auth');

const app = express();
const PORT = process.env.PORT || 3010;
const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379';

// Parse Redis connection
const redisConfig = {
  connection: REDIS_URL
};

// Define all queues
const queues = [
  // Automation queues
  new Queue('lead.created', redisConfig),
  new Queue('lead.updated', redisConfig),
  new Queue('campaign.sync', redisConfig),
  new Queue('meta.conversion', redisConfig),
  new Queue('mailchimp.sync', redisConfig),
  new Queue('whatsapp.notify', redisConfig),

  // LLM queues
  new Queue('llm.ingest', redisConfig),
  new Queue('llm.generate', redisConfig),

  // Stats queues
  new Queue('stats.rollup', redisConfig),
  new Queue('backup.daily', redisConfig),
  new Queue('backup.weekly', redisConfig)
];

// Setup BullBoard
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/');

createBullBoard({
  queues: queues.map(queue => new BullMQAdapter(queue)),
  serverAdapter: serverAdapter
});

// Basic authentication
if (process.env.BASIC_AUTH_USER && process.env.BASIC_AUTH_PASSWORD) {
  const users = {};
  users[process.env.BASIC_AUTH_USER] = process.env.BASIC_AUTH_PASSWORD;

  app.use(basicAuth({
    users,
    challenge: true,
    realm: 'CEPComunicacion BullBoard'
  }));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', queues: queues.length });
});

// Mount BullBoard
app.use('/', serverAdapter.getRouter());

// Start server
app.listen(PORT, () => {
  console.log(`BullBoard running at http://localhost:${PORT}`);
  console.log(`Monitoring ${queues.length} queues`);
  console.log(`Redis: ${REDIS_URL}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing queues...');
  await Promise.all(queues.map(q => q.close()));
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing queues...');
  await Promise.all(queues.map(q => q.close()));
  process.exit(0);
});
