import { automationTriggerQueue } from '../queue';

export type AutomationTriggerJob = {
  userId: string;
  automationId: string;
  scheduleTime?: string;
};

export async function enqueueAutomationTrigger(job: AutomationTriggerJob) {
  return automationTriggerQueue.add('automation_trigger', job, {
    delay: job.scheduleTime ? new Date(job.scheduleTime).getTime() - Date.now() : 0,
  });
}
