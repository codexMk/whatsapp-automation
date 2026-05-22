import { Queue, Worker, Job } from 'bullmq';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const queueNames = {
  campaignSend: 'campaign_send',
  automationTrigger: 'automation_trigger',
  reminderSend: 'reminder_send',
};

export const campaignSendQueue = new Queue(queueNames.campaignSend, { connection: { url: REDIS_URL } });
export const automationTriggerQueue = new Queue(queueNames.automationTrigger, { connection: { url: REDIS_URL } });
export const reminderSendQueue = new Queue(queueNames.reminderSend, { connection: { url: REDIS_URL } });

// Placeholder worker (no real processing)
export function createWorker(queueName: string) {
  return new Worker(queueName, async (job: Job) => {
    // Placeholder: just log the job
    console.log(`[Worker] Processing job`, job.name, job.data);
  }, { connection: { url: REDIS_URL } });
}
