import { createWorker, queueNames } from '../lib/queue';

// Placeholder workers for each job type
createWorker(queueNames.campaignSend);
createWorker(queueNames.automationTrigger);
createWorker(queueNames.reminderSend);

console.log('Workers started (placeholder, no real processing)');
