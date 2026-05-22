/**
 * Pricing Configuration for Message Mitra
 * Defines all available plans and pricing tiers
 */

export interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  messageLimit: number;
  extraMessagePrice: number;
  automationLimit: number;
  features: string[];
  description: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 599,
    messageLimit: 500,
    extraMessagePrice: 0.60,
    automationLimit: 5,
    features: [
      "500 messages/month",
      "Basic templates",
      "5 automations",
      "Email support",
      "1 WhatsApp account"
    ],
    description: "Perfect for getting started with WhatsApp automation"
  },
  {
    id: "growth",
    name: "Growth",
    monthlyPrice: 1999,
    messageLimit: 2000,
    extraMessagePrice: 0.50,
    automationLimit: 20,
    features: [
      "2000 messages/month",
      "Advanced templates",
      "20 automations",
      "Priority email support",
      "3 WhatsApp accounts",
      "Basic analytics"
    ],
    description: "Ideal for growing businesses scaling their customer engagement"
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 3999,
    messageLimit: 5000,
    extraMessagePrice: 0.45,
    automationLimit: 100,
    features: [
      "5000 messages/month",
      "Custom templates",
      "100 automations",
      "24/7 phone support",
      "10 WhatsApp accounts",
      "Advanced analytics",
      "API access",
      "Dedicated account manager"
    ],
    description: "For enterprises with high-volume messaging needs"
  }
];

export function getPlanById(planId: string): PricingPlan | undefined {
  return PRICING_PLANS.find(p => p.id === planId);
}

export function getPlanByName(name: string): PricingPlan | undefined {
  return PRICING_PLANS.find(p => p.name === name);
}

/**
 * Calculate remaining messages for a user
 */
export function calculateRemainingMessages(
  messagesUsedThisMonth: number,
  messageLimit: number
): number {
  return Math.max(0, messageLimit - messagesUsedThisMonth);
}

/**
 * Calculate usage percentage
 */
export function calculateUsagePercentage(
  messagesUsedThisMonth: number,
  messageLimit: number
): number {
  if (messageLimit === 0) return 0;
  return Math.round((messagesUsedThisMonth / messageLimit) * 100);
}

/**
 * Calculate estimated extra cost
 */
export function calculateExtraCost(
  extraMessagesUsed: number,
  extraMessagePrice: number
): number {
  return Math.round(extraMessagesUsed * extraMessagePrice * 100) / 100;
}

/**
 * Get usage warning based on percentage
 */
export function getUsageWarning(usagePercentage: number): {
  level: "none" | "warning" | "critical";
  message: string;
} {
  if (usagePercentage >= 100) {
    return {
      level: "critical",
      message: "⚠️ You have exceeded your message limit. Extra charges apply."
    };
  }
  if (usagePercentage >= 80) {
    return {
      level: "warning",
      message: "⚠️ You are nearing your message limit (80% used)."
    };
  }
  return {
    level: "none",
    message: ""
  };
}

/**
 * Get warning color for UI display
 */
export function getWarningColor(level: "none" | "warning" | "critical"): string {
  switch (level) {
    case "critical":
      return "bg-red-100 border-red-400 text-red-800";
    case "warning":
      return "bg-yellow-100 border-yellow-400 text-yellow-800";
    default:
      return "";
  }
}

/**
 * Format currency (Indian Rupees)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(amount);
}

/**
 * Get usage color for progress bar
 */
export function getUsageColor(usagePercentage: number): string {
  if (usagePercentage >= 100) return "bg-red-600";
  if (usagePercentage >= 80) return "bg-yellow-600";
  return "bg-blue-600";
}
