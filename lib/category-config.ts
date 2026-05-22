import type { Category } from "./category-context";

export interface AutomationPreset {
  name: string;
  description: string;
  key: string;
  icon: string;
  triggerType: "NEW_CUSTOMER" | "APPOINTMENT_REMINDER" | "REVIEW_REQUEST" | "BIRTHDAY" | "FOLLOW_UP";
  templateSuggestion?: string;
}

export interface TemplateRecommendation {
  name: string;
  description: string;
  content: string;
  icon: string;
  useCase: string;
}

export interface CategoryConfig {
  name: string;
  description: string;
  labels: {
    customer: string;
    customers: string;
    campaign: string;
    campaigns: string;
    automation: string;
    automations: string;
  };
  emptyStates: {
    customers: {
      heading: string;
      description: string;
      icon: string;
    };
    templates: {
      heading: string;
      description: string;
      icon: string;
    };
    campaigns: {
      heading: string;
      description: string;
      icon: string;
    };
  };
  recommendedTemplates: TemplateRecommendation[];
  automationPresets: AutomationPreset[];
  quickActions: Array<{
    title: string;
    description: string;
    icon: string;
    actionHint: string;
  }>;
  hints: {
    dashboard: string;
    templates: string;
    automations: string;
    customers: string;
  };
}

// Category configurations
const categoryConfigs: Record<Category, CategoryConfig> = {
  clinic: {
    name: "Clinic",
    description: "Healthcare provider managing patients",
    labels: {
      customer: "Patient",
      customers: "Patients",
      campaign: "Campaign",
      campaigns: "Campaigns",
      automation: "Automation",
      automations: "Automations",
    },
    emptyStates: {
      customers: {
        heading: "No patients added yet",
        description: "Add your first patient to manage appointments and health reminders.",
        icon: "👨‍⚕️",
      },
      templates: {
        heading: "No message templates yet",
        description: "Create templates for appointment reminders, follow-ups, and health tips.",
        icon: "📋",
      },
      campaigns: {
        heading: "No campaigns yet",
        description: "Create a campaign to send health tips or appointment reminders to patients.",
        icon: "📢",
      },
    },
    recommendedTemplates: [
      {
        name: "Appointment Confirmation",
        description: "Confirm upcoming appointments with patients",
        content:
          "Hi {{name}}, your appointment is scheduled for {{date}} at {{time}}. Please arrive 10 minutes early. Reply with any questions.",
        icon: "📅",
        useCase: "appointment-confirmation",
      },
      {
        name: "Pre-Appointment Checklist",
        description: "Send preparation instructions before appointments",
        content:
          "Hi {{name}}, To prepare for your {{appointmentType}} appointment on {{date}}: {{instructions}}. See you soon!",
        icon: "✅",
        useCase: "pre-appointment",
      },
      {
        name: "Post-Appointment Follow-up",
        description: "Check on patient status after visit",
        content:
          "Hi {{name}}, Thank you for visiting us on {{date}}. How are you feeling? Please share any concerns or questions.",
        icon: "💬",
        useCase: "post-appointment",
      },
      {
        name: "Prescription Reminder",
        description: "Remind patients to take medications",
        content:
          "Hi {{name}}, This is a reminder to take your {{medicationName}} as prescribed. If you have any side effects, contact us.",
        icon: "💊",
        useCase: "medication-reminder",
      },
      {
        name: "Health Tip of the Week",
        description: "Share health and wellness tips",
        content:
          "Health Tip: {{tipTitle}}\n\n{{tipDescription}}\n\nIf you have questions, feel free to contact our clinic.",
        icon: "🏥",
        useCase: "health-tip",
      },
    ],
    automationPresets: [
      {
        name: "Appointment Reminders",
        description: "Send reminders to patients 24 hours before appointments",
        key: "appointment_reminders",
        icon: "⏰",
        triggerType: "APPOINTMENT_REMINDER",
        templateSuggestion: "Appointment Confirmation",
      },
      {
        name: "Post-Visit Follow-up",
        description: "Check on patients after they visit",
        key: "post_visit_followup",
        icon: "💬",
        triggerType: "FOLLOW_UP",
        templateSuggestion: "Post-Appointment Follow-up",
      },
      {
        name: "New Patient Welcome",
        description: "Send welcome message when a new patient registers",
        key: "new_patient_welcome",
        icon: "👋",
        triggerType: "NEW_CUSTOMER",
        templateSuggestion: "Pre-Appointment Checklist",
      },
      {
        name: "Medication Reminders",
        description: "Remind patients to take their medications",
        key: "medication_reminders",
        icon: "💊",
        triggerType: "FOLLOW_UP",
        templateSuggestion: "Prescription Reminder",
      },
    ],
    quickActions: [
      {
        title: "Import Patient List",
        description: "Bulk upload patient contact information",
        icon: "📁",
        actionHint: "CSV or Excel file",
      },
      {
        title: "Schedule Patient Campaign",
        description: "Send health tips to all patients",
        icon: "📅",
        actionHint: "Select date and message",
      },
      {
        title: "Setup Appointment Reminders",
        description: "Automatically remind patients before appointments",
        icon: "⏰",
        actionHint: "Enable automation",
      },
    ],
    hints: {
      dashboard: "Use automations to send appointment reminders and follow-ups automatically",
      templates: "Create templates for appointments, prescriptions, and health tips",
      automations: "Automate appointment reminders, follow-ups, and medication alerts",
      customers: "Add patients and organize by specialty or appointment type",
    },
  },
  shop: {
    name: "E-commerce",
    description: "Online retail store",
    labels: {
      customer: "Customer",
      customers: "Customers",
      campaign: "Campaign",
      campaigns: "Campaigns",
      automation: "Automation",
      automations: "Automations",
    },
    emptyStates: {
      customers: {
        heading: "No customers yet",
        description: "Add your first customer to track purchases and send personalized offers.",
        icon: "🛍️",
      },
      templates: {
        heading: "No message templates yet",
        description: "Create templates for order confirmations, shipping, and special offers.",
        icon: "📦",
      },
      campaigns: {
        heading: "No campaigns yet",
        description: "Create a campaign to promote products or announce special sales.",
        icon: "🎯",
      },
    },
    recommendedTemplates: [
      {
        name: "Order Confirmation",
        description: "Confirm order receipt to customers",
        content:
          "Thank you for your order {{orderId}}! We're packing your items now. You'll receive a tracking link soon.",
        icon: "✅",
        useCase: "order-confirmation",
      },
      {
        name: "Shipping Notification",
        description: "Notify when order ships with tracking",
        content:
          "Great news {{name}}! Your order {{orderId}} shipped today. Track it here: {{trackingLink}}",
        icon: "📦",
        useCase: "shipping",
      },
      {
        name: "Delivery Reminder",
        description: "Remind customers about coming delivery",
        content:
          "Hi {{name}}, Your order {{orderId}} is arriving {{deliveryDate}}. Make sure someone is home to receive it.",
        icon: "🚚",
        useCase: "delivery-reminder",
      },
      {
        name: "Product Review Request",
        description: "Ask customers to review purchased items",
        content:
          "Hi {{name}}, How do you like your {{productName}}? Leave a review and help other customers! {{reviewLink}}",
        icon: "⭐",
        useCase: "review-request",
      },
      {
        name: "Special Offer",
        description: "Announce sales and discounts",
        content:
          "Exclusive offer for you, {{name}}! Get {{discount}}% off {{productCategory}}. Use code: {{promoCode}} Valid until {{expiryDate}}",
        icon: "🎁",
        useCase: "special-offer",
      },
    ],
    automationPresets: [
      {
        name: "Order Status Updates",
        description: "Send confirmation and shipping updates automatically",
        key: "order_updates",
        icon: "📬",
        triggerType: "NEW_CUSTOMER",
        templateSuggestion: "Order Confirmation",
      },
      {
        name: "Review Requests",
        description: "Ask customers to review products after purchase",
        key: "review_requests",
        icon: "⭐",
        triggerType: "FOLLOW_UP",
        templateSuggestion: "Product Review Request",
      },
      {
        name: "Abandoned Cart Recovery",
        description: "Remind customers about incomplete purchases",
        key: "abandoned_cart",
        icon: "🛒",
        triggerType: "FOLLOW_UP",
        templateSuggestion: "Special Offer",
      },
      {
        name: "Welcome New Customer",
        description: "Greet new customers with a welcome offer",
        key: "welcome_offer",
        icon: "👋",
        triggerType: "NEW_CUSTOMER",
        templateSuggestion: "Special Offer",
      },
    ],
    quickActions: [
      {
        title: "Import Customer List",
        description: "Upload customer phone numbers from file",
        icon: "📥",
        actionHint: "CSV or Excel",
      },
      {
        title: "Launch Sale Campaign",
        description: "Send promotional messages to customers",
        icon: "🎯",
        actionHint: "Customize discount details",
      },
      {
        title: "Enable Order Updates",
        description: "Send automatic order and shipping notifications",
        icon: "📦",
        actionHint: "Integrate with store",
      },
    ],
    hints: {
      dashboard: "Use automations to send order updates and reviews automatically",
      templates: "Create templates for orders, shipping tracking, and promotional offers",
      automations: "Automate order confirmations, reviews, and loyalty messages",
      customers: "Segment customers by purchase history or preferences",
    },
  },
  "real-estate": {
    name: "Real Estate",
    description: "Property sales and rentals",
    labels: {
      customer: "Prospect",
      customers: "Prospects",
      campaign: "Campaign",
      campaigns: "Campaigns",
      automation: "Automation",
      automations: "Automations",
    },
    emptyStates: {
      customers: {
        heading: "No prospects yet",
        description: "Add prospects to manage leads and send property updates.",
        icon: "🏠",
      },
      templates: {
        heading: "No message templates yet",
        description: "Create templates for property showcases and follow-up communications.",
        icon: "🔑",
      },
      campaigns: {
        heading: "No campaigns yet",
        description: "Create campaigns to promote properties or nurture leads.",
        icon: "📍",
      },
    },
    recommendedTemplates: [
      {
        name: "Property Showcase",
        description: "Introduce a property to interested prospects",
        content:
          "Hi {{name}}, Check out this {{propertyType}} at {{location}}! {{bedrooms}} bed, {{bathrooms}} bath, {{area}} sqft. {{link}}",
        icon: "🏘️",
        useCase: "property-showcase",
      },
      {
        name: "Viewing Appointment",
        description: "Confirm property viewing appointments",
        content:
          "Hi {{name}}, Your viewing is scheduled for {{date}} at {{time}}. Address: {{address}}. Please arrive 10 minutes early.",
        icon: "📅",
        useCase: "viewing-appointment",
      },
      {
        name: "Price Alert",
        description: "Notify about new properties within budget",
        content:
          "Hi {{name}}, A new {{propertyType}} in {{location}} within your budget is now available. Starting at {{price}}. {{link}}",
        icon: "💰",
        useCase: "price-alert",
      },
      {
        name: "Post-Viewing Follow-up",
        description: "Follow up after property viewings",
        content:
          "Hi {{name}}, Thank you for viewing the property at {{address}}. Are you interested? Let's discuss next steps.",
        icon: "💬",
        useCase: "follow-up",
      },
      {
        name: "Market Update",
        description: "Share market trends and insights",
        content:
          "Market Update for {{area}}: {{marketTrend}}. Now is a great time to {{suggestion}}. Schedule a call to discuss.",
        icon: "📊",
        useCase: "market-update",
      },
    ],
    automationPresets: [
      {
        name: "Property Alerts",
        description: "Send automatic alerts for new properties matching criteria",
        key: "property_alerts",
        icon: "🔔",
        triggerType: "NEW_CUSTOMER",
        templateSuggestion: "Price Alert",
      },
      {
        name: "Viewing Reminders",
        description: "Remind prospects before scheduled viewings",
        key: "viewing_reminders",
        icon: "⏰",
        triggerType: "APPOINTMENT_REMINDER",
        templateSuggestion: "Viewing Appointment",
      },
      {
        name: "Lead Nurture",
        description: "Send property updates to interested prospects",
        key: "lead_nurture",
        icon: "🌱",
        triggerType: "FOLLOW_UP",
        templateSuggestion: "Property Showcase",
      },
      {
        name: "Post-Viewing Follow-up",
        description: "Check in with prospects after viewings",
        key: "post_viewing",
        icon: "💌",
        triggerType: "FOLLOW_UP",
        templateSuggestion: "Post-Viewing Follow-up",
      },
    ],
    quickActions: [
      {
        title: "Import Prospect List",
        description: "Upload qualified leads",
        icon: "📋",
        actionHint: "CSV file",
      },
      {
        title: "Send Property Update",
        description: "Announce new listings",
        icon: "🆕",
        actionHint: "Select properties",
      },
      {
        title: "Enable Viewing Reminders",
        description: "Automatic appointment reminders",
        icon: "⏰",
        actionHint: "1 activation",
      },
    ],
    hints: {
      dashboard: "Track leads through viewings with automated reminders",
      templates: "Create property showcases and follow-up messages",
      automations: "Automate property alerts and viewing reminders",
      customers: "Organize prospects by property interest and budget",
    },
  },
  coaching: {
    name: "Coaching",
    description: "Personal or professional coaching",
    labels: {
      customer: "Student",
      customers: "Students",
      campaign: "Campaign",
      campaigns: "Campaigns",
      automation: "Automation",
      automations: "Automations",
    },
    emptyStates: {
      customers: {
        heading: "No students yet",
        description: "Add students to send lessons, assignments, and progress updates.",
        icon: "👨‍🎓",
      },
      templates: {
        heading: "No message templates yet",
        description: "Create templates for course updates, assignments, and feedback.",
        icon: "📚",
      },
      campaigns: {
        heading: "No campaigns yet",
        description: "Create campaigns for batch updates or challenge announcements.",
        icon: "🎯",
      },
    },
    recommendedTemplates: [
      {
        name: "Class Schedule",
        description: "Share upcoming class times and topics",
        content:
          "Hi {{name}}, Next class: {{topic}}\nDate: {{date}}\nTime: {{time}}\nLink: {{classLink}}\nSee you there!",
        icon: "📅",
        useCase: "class-schedule",
      },
      {
        name: "Weekly Lesson",
        description: "Send weekly learning modules",
        content:
          "Hi {{name}}, This week's lesson: {{lessonTitle}}\n\n{{lessonSummary}}\n\nDownload materials: {{link}}",
        icon: "📖",
        useCase: "lesson-delivery",
      },
      {
        name: "Assignment Reminder",
        description: "Remind students about pending assignments",
        content:
          "Hi {{name}}, Reminder: {{assignmentName}} is due {{dueDate}}. Submit here: {{submissionLink}}",
        icon: "✏️",
        useCase: "assignment-reminder",
      },
      {
        name: "Feedback & Progress",
        description: "Share feedback and progress updates",
        content:
          "Hi {{name}}, Great progress on {{topic}}! {{feedbackMessage}}\n\nNext focus: {{nextSteps}}",
        icon: "⭐",
        useCase: "feedback",
      },
      {
        name: "Motivational Reminder",
        description: "Send motivational messages",
        content:
          "Hi {{name}}, {{motivationalMessage}}\n\nYour dedication is showing! Keep pushing towards {{goal}}.",
        icon: "💪",
        useCase: "motivation",
      },
    ],
    automationPresets: [
      {
        name: "Weekly Lessons",
        description: "Automatically send lesson content every week",
        key: "weekly_lessons",
        icon: "📚",
        triggerType: "NEW_CUSTOMER",
        templateSuggestion: "Weekly Lesson",
      },
      {
        name: "Assignment Reminders",
        description: "Remind students when assignments are due",
        key: "assignment_reminders",
        icon: "⏱️",
        triggerType: "FOLLOW_UP",
        templateSuggestion: "Assignment Reminder",
      },
      {
        name: "Class Notifications",
        description: "Send class schedule and updates",
        key: "class_notifications",
        icon: "🔔",
        triggerType: "APPOINTMENT_REMINDER",
        templateSuggestion: "Class Schedule",
      },
      {
        name: "Progress Check-ins",
        description: "Send periodic progress feedback",
        key: "progress_checkins",
        icon: "📊",
        triggerType: "FOLLOW_UP",
        templateSuggestion: "Feedback & Progress",
      },
    ],
    quickActions: [
      {
        title: "Import Student List",
        description: "Add students from CSV",
        icon: "📝",
        actionHint: "Names and numbers",
      },
      {
        title: "Send Weekly Lesson",
        description: "Broadcast lesson to all students",
        icon: "📚",
        actionHint: "Customize content",
      },
      {
        title: "Enable Assignment Reminders",
        description: "Auto-remind about deadlines",
        icon: "⏰",
        actionHint: "Set due dates",
      },
    ],
    hints: {
      dashboard: "Use automations to send lessons and reminders automatically",
      templates: "Create lesson modules, assignments, and feedback templates",
      automations: "Automate lesson delivery, assignment reminders, and check-ins",
      customers: "Track student progress and organize by course or level",
    },
  },
  csc: {
    name: "CSC (Common Service Center)",
    description: "Government service center operations",
    labels: {
      customer: "Applicant",
      customers: "Applicants",
      campaign: "Campaign",
      campaigns: "Campaigns",
      automation: "Automation",
      automations: "Automations",
    },
    emptyStates: {
      customers: {
        heading: "No applicants yet",
        description: "Add applicants to send updates about document status and appointments.",
        icon: "📋",
      },
      templates: {
        heading: "No message templates yet",
        description: "Create templates for application status, appointments, and requirements.",
        icon: "📄",
      },
      campaigns: {
        heading: "No campaigns yet",
        description: "Create campaigns to notify applicants about new services.",
        icon: "📢",
      },
    },
    recommendedTemplates: [
      {
        name: "Application Received",
        description: "Confirm receipt of application",
        content:
          "Your {{serviceName}} application {{refNumber}} has been received. We'll review and contact you within {{days}} days.",
        icon: "✅",
        useCase: "application-received",
      },
      {
        name: "Document Status Update",
        description: "Notify about document verification status",
        content:
          "Hi {{name}}, Your {{documentName}} is {{status}}. {{nextStep}} Reference: {{refNumber}}",
        icon: "📄",
        useCase: "document-status",
      },
      {
        name: "Appointment Confirmation",
        description: "Confirm appointment at CSC",
        content:
          "Your appointment is confirmed for {{date}} at {{time}} at {{location}}. Please bring {{documents}}. Ref: {{refNumber}}",
        icon: "📅",
        useCase: "appointment",
      },
      {
        name: "Payment Due Reminder",
        description: "Remind about payment deadlines",
        content:
          "Hi {{name}}, Payment of {{amount}} is due for {{serviceName}} by {{dueDate}}. Pay here: {{paymentLink}}",
        icon: "💳",
        useCase: "payment-reminder",
      },
      {
        name: "Certificate Ready",
        description: "Notify when certificate is ready for pickup",
        content:
          "Good news! Your {{certificateType}} is ready for pickup. Visit us during office hours. Ref: {{refNumber}}",
        icon: "🎖️",
        useCase: "certificate-ready",
      },
    ],
    automationPresets: [
      {
        name: "Application Status Updates",
        description: "Send automatic application status notifications",
        key: "app_status",
        icon: "📬",
        triggerType: "NEW_CUSTOMER",
        templateSuggestion: "Application Received",
      },
      {
        name: "Appointment Reminders",
        description: "Remind applicants about their appointments",
        key: "appointment_reminders",
        icon: "⏰",
        triggerType: "APPOINTMENT_REMINDER",
        templateSuggestion: "Appointment Confirmation",
      },
      {
        name: "Document Verification Alerts",
        description: "Notify about document status changes",
        key: "doc_alerts",
        icon: "🔔",
        triggerType: "FOLLOW_UP",
        templateSuggestion: "Document Status Update",
      },
      {
        name: "Payment Due Reminders",
        description: "Remind about payment deadlines",
        key: "payment_reminders",
        icon: "💰",
        triggerType: "FOLLOW_UP",
        templateSuggestion: "Payment Due Reminder",
      },
    ],
    quickActions: [
      {
        title: "Import Applicant List",
        description: "Upload applicant contacts",
        icon: "📥",
        actionHint: "CSV format",
      },
      {
        title: "Send Status Update",
        description: "Bulk notification about service status",
        icon: "📢",
        actionHint: "Customize message",
      },
      {
        title: "Schedule Appointments",
        description: "Enable appointment reminders",
        icon: "🗓️",
        actionHint: "Auto-reminder 24h before",
      },
    ],
    hints: {
      dashboard: "Automate applicant notifications and appointment reminders",
      templates: "Create status updates, appointment, and payment reminders",
      automations: "Automate document tracking and appointment notifications",
      customers: "Organize applicants by service type",
    },
  },
};

/**
 * Get category configuration
 */
export function getCategoryConfig(category: Category | null): CategoryConfig | null {
  if (!category) return null;
  return categoryConfigs[category];
}

/**
 * Get label override for a given key
 */
export function getLabel(category: Category | null, key: string): string {
  if (!category) {
    // Default labels
    const defaults: Record<string, string> = {
      customer: "Customer",
      customers: "Customers",
      campaign: "Campaign",
      campaigns: "Campaigns",
      automation: "Automation",
      automations: "Automations",
    };
    return defaults[key] || key;
  }

  const config = getCategoryConfig(category);
  if (!config) return key;

  const labels = config.labels as Record<string, string>;
  return labels[key] || key;
}

/**
 * Get empty state configuration for a page
 */
export function getEmptyState(
  category: Category | null,
  page: "customers" | "templates" | "campaigns"
) {
  const defaults = {
    customers: {
      heading: "No customers yet",
      description: "Add your first customer to start building your contact list.",
      icon: "👥",
    },
    templates: {
      heading: "No templates yet",
      description: "Create reusable message templates to save time.",
      icon: "📝",
    },
    campaigns: {
      heading: "No campaigns yet",
      description: "Create a campaign to send messages to your customers.",
      icon: "📢",
    },
  };

  if (!category) return defaults[page];

  const config = getCategoryConfig(category);
  if (!config) return defaults[page];

  return config.emptyStates[page];
}

/**
 * Get automation presets for category
 */
export function getAutomationPresets(category: Category | null): AutomationPreset[] {
  if (!category) {
    // Return generic presets
    return [
      {
        name: "New Lead Welcome",
        description: "Send a welcome message when a new customer is created.",
        key: "new_lead_welcome",
        icon: "👋",
        triggerType: "NEW_CUSTOMER",
      },
      {
        name: "Appointment Reminder",
        description: "Remind customers of upcoming appointments 24 hours before.",
        key: "appointment_reminder",
        icon: "📅",
        triggerType: "APPOINTMENT_REMINDER",
      },
      {
        name: "Follow-up After Visit",
        description: "Ask for feedback and reviews after customer visits.",
        key: "post_visit_followup",
        icon: "⭐",
        triggerType: "FOLLOW_UP",
      },
      {
        name: "Birthday Greetings",
        description: "Send personalized birthday messages to customers.",
        key: "birthday_greeting",
        icon: "🎂",
        triggerType: "FOLLOW_UP",
      },
    ];
  }

  const config = getCategoryConfig(category);
  return config?.automationPresets || [];
}

/**
 * Get recommended templates for category
 */
export function getRecommendedTemplates(category: Category | null): TemplateRecommendation[] {
  if (!category) return [];

  const config = getCategoryConfig(category);
  return config?.recommendedTemplates || [];
}

/**
 * Get quick action suggestions for category
 */
export function getQuickActions(category: Category | null) {
  if (!category) return [];

  const config = getCategoryConfig(category);
  return config?.quickActions || [];
}

/**
 * Get dashboard hint for category
 */
export function getDashboardHint(category: Category | null): string {
  if (!category) {
    return "Use automations and templates to scale your messaging";
  }

  const config = getCategoryConfig(category);
  return config?.hints.dashboard || "";
}

/**
 * Get hint for templates page
 */
export function getTemplatesHint(category: Category | null): string {
  if (!category) {
    return "Create reusable message templates";
  }

  const config = getCategoryConfig(category);
  return config?.hints.templates || "";
}

/**
 * Get hint for automations page
 */
export function getAutomationsHint(category: Category | null): string {
  if (!category) {
    return "Set up automated workflows";
  }

  const config = getCategoryConfig(category);
  return config?.hints.automations || "";
}

/**
 * Get hint for customers page
 */
export function getCustomersHint(category: Category | null): string {
  if (!category) {
    return "Manage your customers and contacts";
  }

  const config = getCategoryConfig(category);
  return config?.hints.customers || "";
}
