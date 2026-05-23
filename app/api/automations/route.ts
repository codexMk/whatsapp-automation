import { NextResponse } from "next/server";
import { z } from "zod";
import { AutomationTrigger } from "@prisma/client";
import { getAutomations, createAutomation, toggleAutomation, updateAutomation } from "@/lib/automations";
import { getSessionUserId } from "@/lib/session-server";
export const dynamic = "force-dynamic";

const automationSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  enabled: z.boolean().optional(),
  triggerType: z.nativeEnum(AutomationTrigger).optional()
});

export async function GET(_request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const automations = await getAutomations(userId);
  return NextResponse.json({ automations });
}

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parseResult = automationSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const automation = await createAutomation(userId, parseResult.data);
  return NextResponse.json({ automation }, { status: 201 });
}

const patchSchema = z.object({
  id: z.string(),
  enabled: z.boolean().optional(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  triggerType: z.nativeEnum(AutomationTrigger).optional()
}).refine(
  (data) =>
    data.enabled !== undefined ||
    data.name !== undefined ||
    data.description !== undefined ||
    data.triggerType !== undefined,
  {
    message: "At least one update field must be provided"
  }
);

type AutomationPatchPayload = z.infer<typeof patchSchema>;

function hasAutomationDetailsUpdate(data: AutomationPatchPayload) {
  return data.name !== undefined || data.description !== undefined || data.triggerType !== undefined;
}

export async function PATCH(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parseResult = patchSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { id, enabled } = parseResult.data;
  let automation;

  if (typeof enabled === "boolean") {
    automation = await toggleAutomation(userId, id, enabled);
  } else if (hasAutomationDetailsUpdate(parseResult.data)) {
    automation = await updateAutomation(userId, id, {
      name: parseResult.data.name,
      description: parseResult.data.description,
      triggerType: parseResult.data.triggerType
    });
  } else {
    return NextResponse.json({ error: "No valid update field provided" }, { status: 400 });
  }

  if (!automation) {
    return NextResponse.json({ error: "Automation not found" }, { status: 404 });
  }

  return NextResponse.json({ automation });
}

