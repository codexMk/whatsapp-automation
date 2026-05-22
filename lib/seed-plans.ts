import { db } from "@/lib/db";
import { PRICING_PLANS } from "@/lib/pricing";

/**
 * Seed default plans into the database
 * Run this once during initial setup
 */
export async function seedDefaultPlans() {
  try {
    console.log("🌱 Seeding default pricing plans...");

    for (const plan of PRICING_PLANS) {
      // Check if plan already exists
      const existing = await db.plan.findUnique({
        where: { name: plan.name }
      });

      if (!existing) {
        await db.plan.create({
          data: {
            name: plan.name,
            price: plan.monthlyPrice,
            messageLimit: plan.messageLimit,
            extraMessagePrice: plan.extraMessagePrice,
            automationLimit: plan.automationLimit,
            features: plan.features,
            description: plan.description,
            active: true
          }
        });
        console.log(`✅ Created plan: ${plan.name}`);
      } else {
        console.log(`⏭️  Plan already exists: ${plan.name}`);
      }
    }

    console.log("✅ Plan seeding complete!");
  } catch (error) {
    console.error("❌ Error seeding plans:", error);
    throw error;
  }
}

/**
 * Get or create plans
 * Returns array of plan IDs
 */
export async function ensurePlansExist(): Promise<string[]> {
  const plans = [];

  for (const plan of PRICING_PLANS) {
    let dbPlan = await db.plan.findUnique({
      where: { name: plan.name }
    });

    if (!dbPlan) {
      dbPlan = await db.plan.create({
        data: {
          name: plan.name,
          price: plan.monthlyPrice,
          messageLimit: plan.messageLimit,
          extraMessagePrice: plan.extraMessagePrice,
          automationLimit: plan.automationLimit,
          features: plan.features,
          description: plan.description,
          active: true
        }
      });
    }

    plans.push(dbPlan.id);
  }

  return plans;
}
