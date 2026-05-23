import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/session';
import { db } from '@/lib/db';
export const dynamic = "force-dynamic";

/**
 * POST /api/campaigns/create-advanced
 * Create campaign with optional scheduling
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('wa_session')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifySession(token);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = payload.userId;
    const formData = await request.formData();

    const name = (formData.get('name') ?? '').toString().trim();
    const description = (formData.get('description') ?? '').toString().trim() || undefined;
    const templateId = (formData.get('templateId') ?? '').toString();
    const scheduleMode = (formData.get('scheduleMode') ?? 'immediate').toString();
    const scheduledDate = (formData.get('scheduledDate') ?? '').toString() || undefined;
    const scheduledTime = (formData.get('scheduledTime') ?? '').toString() || undefined;

    const customerIds = formData.getAll('customerIds').map((id) => id.toString());

    // Validation
    if (!name || !templateId || customerIds.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify template belongs to user
    const template = await db.template.findFirst({
      where: { id: templateId, userId },
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Verify all customers belong to user
    const customers = await db.customer.findMany({
      where: { id: { in: customerIds }, userId },
    });

    if (customers.length !== customerIds.length) {
      return NextResponse.json(
        { error: 'Some customers not found' },
        { status: 404 }
      );
    }

    // Create campaign
    const campaign = await db.campaign.create({
      data: {
        userId,
        name,
        description,
        templateId,
        status: 'DRAFT',
      },
    });

    // Create message logs for each customer
    const messageLogs = await Promise.all(
      customers.map((customer) =>
        db.messageLog.create({
          data: {
            userId,
            campaignId: campaign.id,
            customerId: customer.id,
            templateId,
            toPhone: customer.phone,
            content: template.content,
            status: 'PENDING',
            scheduledFor: 
              scheduleMode === 'scheduled' && scheduledDate && scheduledTime
                ? new Date(scheduledDate + 'T' + scheduledTime)
                : new Date(), // Immediate
          },
        })
      )
    );

    // Update campaign status based on schedule
    await db.campaign.update({
      where: { id: campaign.id },
      data: {
        status: scheduleMode === 'immediate' ? 'DRAFT' : 'SCHEDULED',
      },
    });

    return NextResponse.json({
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      recipientCount: customers.length,
      messageCount: messageLogs.length,
      scheduledFor: 
        scheduleMode === 'scheduled' && scheduledDate && scheduledTime
          ? new Date(scheduledDate + 'T' + scheduledTime)
          : null,
    });
  } catch (error) {
    console.error('[CAMPAIGN-CREATE]', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}
