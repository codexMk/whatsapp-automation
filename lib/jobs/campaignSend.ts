import { campaignSendQueue, automationTriggerQueue, reminderSendQueue } from '../queue';

export type CampaignSendJob = {
  userId: string;
  campaignId: string;
  scheduleTime?: string;
};

export async function enqueueCampaignSend(job: CampaignSendJob) {
  return campaignSendQueue.add('campaign_send', job, {
    delay: job.scheduleTime ? new Date(job.scheduleTime).getTime() - Date.now() : 0,
  });
}
