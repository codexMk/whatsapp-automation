import { reminderSendQueue } from '../queue';

export type ReminderSendJob = {
  userId: string;
  reminderId: string;
  scheduleTime?: string;
};

export async function enqueueReminderSend(job: ReminderSendJob) {
  return reminderSendQueue.add('reminder_send', job, {
    delay: job.scheduleTime ? new Date(job.scheduleTime).getTime() - Date.now() : 0,
  });
}
