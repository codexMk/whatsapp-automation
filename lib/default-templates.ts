import type { Category } from './category-context';
import { getCategoryConfig } from './category-config';

export interface RecommendedTemplate {
  name: string;
  description: string;
  content: string;
  icon: string;
  useCase: string;
}

export interface ReadyMadeTemplate {
  id: string;
  title: string;
  category: string;
  type: 'broadcast';
  content: string;
  description: string;
  tags: string[];
}

/**
 * READY-MADE TEMPLATES LIBRARY
 * 50+ professional templates across 5 categories
 * All templates use smart placeholders: {{name}}, {{date}}, {{time}}, {{business}}, {{amount}}
 */

const READY_MADE_TEMPLATES: ReadyMadeTemplate[] = [
  // ========== CLINIC TEMPLATES (10) ==========
  {
    id: 'clinic-001',
    title: 'Appointment Reminder - Same Day',
    category: 'clinic',
    type: 'broadcast',
    description: 'Remind patients about their appointment today',
    content: 'Hi {{name}}, this is a reminder about your appointment at {{business}} today at {{time}}. Please arrive 10 minutes early. Call {{phone}} if you need to reschedule.',
    tags: ['appointment', 'reminder', 'urgent'],
  },
  {
    id: 'clinic-002',
    title: 'Appointment Reminder - Next Day',
    category: 'clinic',
    type: 'broadcast',
    description: 'Confirm appointment for tomorrow',
    content: 'Hi {{name}}, your appointment with {{business}} is tomorrow at {{time}}. Please be on time. Arrive 10 minutes early. See you soon!',
    tags: ['appointment', 'reminder', 'confirmation'],
  },
  {
    id: 'clinic-003',
    title: 'Post-Visit Follow-up',
    category: 'clinic',
    type: 'broadcast',
    description: 'Check-in with patient after their visit',
    content: 'Hi {{name}}, we hope your visit on {{date}} was helpful! If you have any questions about your care, please reach out. Thank you for choosing {{business}}!',
    tags: ['follow-up', 'patient care', 'engagement'],
  },
  {
    id: 'clinic-004',
    title: 'Medicine Reminder',
    category: 'clinic',
    type: 'broadcast',
    description: 'Remind patients to take prescribed medicines',
    content: 'Hi {{name}}, this is a friendly reminder to take your prescribed medicine as per {{business}}\'s instructions. Your health is our priority!',
    tags: ['medicine', 'reminder', 'health'],
  },
  {
    id: 'clinic-005',
    title: 'Lab Report Ready Notification',
    category: 'clinic',
    type: 'broadcast',
    description: 'Inform patient their lab results are ready',
    content: 'Hi {{name}}, your lab reports from {{date}} are ready! Please visit {{business}} to collect them or call us for details. Thank you for trusting us.',
    tags: ['lab reports', 'notification', 'important'],
  },
  {
    id: 'clinic-006',
    title: 'Health Checkup Campaign',
    category: 'clinic',
    type: 'broadcast',
    description: 'Encourage patients to get regular checkups',
    content: 'Hi {{name}}, stay healthy with regular checkups! {{business}} is offering health screening packages at affordable rates. Schedule your checkup today!',
    tags: ['checkup', 'health', 'campaign', 'offer'],
  },
  {
    id: 'clinic-007',
    title: 'Prescription Refill Reminder',
    category: 'clinic',
    type: 'broadcast',
    description: 'Remind patients to refill their prescriptions',
    content: 'Hi {{name}}, it\'s time to refill your prescription from {{date}}. Visit {{business}} or call us to refill. Don\'t run out!',
    tags: ['prescription', 'refill', 'reminder'],
  },
  {
    id: 'clinic-008',
    title: 'Feedback Request',
    category: 'clinic',
    type: 'broadcast',
    description: 'Ask patients for feedback on their visit',
    content: 'Hi {{name}}, thank you for visiting {{business}} on {{date}}. We\'d love to hear about your experience! Please reply with your feedback.',
    tags: ['feedback', 'review', 'engagement'],
  },
  {
    id: 'clinic-009',
    title: 'Vaccination Drive Notice',
    category: 'clinic',
    type: 'broadcast',
    description: 'Announce vaccination campaigns and drives',
    content: 'Hi {{name}}, {{business}} is conducting a vaccination drive on {{date}}. Protect your health. Limited slots available. Reply to book your slot!',
    tags: ['vaccination', 'campaign', 'health drive'],
  },
  {
    id: 'clinic-010',
    title: 'Wellness Tip Share',
    category: 'clinic',
    type: 'broadcast',
    description: 'Share health and wellness tips with patients',
    content: 'Hi {{name}}, wellness tip from {{business}}: Stay hydrated and exercise for 30 minutes daily. Your health journey starts with small steps. Take care!',
    tags: ['wellness', 'tips', 'health education'],
  },

  // ========== SHOP TEMPLATES (10) ==========
  {
    id: 'shop-001',
    title: 'Festival Sale Announcement',
    category: 'shop',
    type: 'broadcast',
    description: 'Announce special festival season sales',
    content: 'Hi {{name}}, 🎉 {{business}} is having a HUGE {{event}} SALE! Up to 50% OFF on all products. Limited time only! Shop now before stock runs out!',
    tags: ['sale', 'festival', 'promotion', 'urgency'],
  },
  {
    id: 'shop-002',
    title: 'New Arrival Notification',
    category: 'shop',
    type: 'broadcast',
    description: 'Inform customers about new products',
    content: 'Hi {{name}}, new collection arrived at {{business}}! Check out exclusive items just for you. Limited stock available. Shop now! 👉 {{link}}',
    tags: ['new products', 'launch', 'notification'],
  },
  {
    id: 'shop-003',
    title: 'Discount Coupon Offer',
    category: 'shop',
    type: 'broadcast',
    description: 'Share exclusive discount coupons',
    content: 'Hi {{name}}, exclusive coupon for you! Use code {{coupon}} at {{business}} for {{discount}}% OFF on your next purchase. Valid till {{date}}.',
    tags: ['discount', 'coupon', 'offer', 'exclusive'],
  },
  {
    id: 'shop-004',
    title: 'Restock Alert',
    category: 'shop',
    type: 'broadcast',
    description: 'Notify when previously out-of-stock items are back',
    content: 'Hi {{name}}, great news! The item you wanted is back in stock at {{business}}! Grab it before it sells out again. Limited quantities available.',
    tags: ['restock', 'alert', 'inventory'],
  },
  {
    id: 'shop-005',
    title: 'Loyalty Program Welcome',
    category: 'shop',
    type: 'broadcast',
    description: 'Welcome customers to loyalty program',
    content: 'Hi {{name}}, welcome to {{business}} Loyalty Club! Earn points on every purchase and unlock exclusive rewards. Start shopping and save more! 🎁',
    tags: ['loyalty', 'membership', 'rewards'],
  },
  {
    id: 'shop-006',
    title: 'Cart Abandonment Reminder',
    category: 'shop',
    type: 'broadcast',
    description: 'Remind customers about items left in cart',
    content: 'Hi {{name}}, you have items in your cart at {{business}}! Complete your purchase now and enjoy {{discount}}% OFF. Don\'t miss out! {{link}}',
    tags: ['cart', 'reminder', 'conversion'],
  },
  {
    id: 'shop-007',
    title: 'Customer Appreciation Message',
    category: 'shop',
    type: 'broadcast',
    description: 'Thank loyal customers with special rewards',
    content: 'Hi {{name}}, thank you for being a loyal customer of {{business}}! As a token of appreciation, enjoy {{discount}}% OFF on your next purchase. Coupon: {{coupon}}',
    tags: ['appreciation', 'loyalty', 'thank you'],
  },
  {
    id: 'shop-008',
    title: 'Weekend Special Sale',
    category: 'shop',
    type: 'broadcast',
    description: 'Promote weekend-only deals',
    content: 'Hi {{name}}, don\'t miss {{business}}\'s weekend special! Get {{discount}}% OFF on selected items this {{day}} & {{day2}} only. Offer ends {{date}}!',
    tags: ['weekend', 'sale', 'limited time'],
  },
  {
    id: 'shop-009',
    title: 'Birthday Special Offer',
    category: 'shop',
    type: 'broadcast',
    description: 'Offer special birthday discounts',
    content: 'Hi {{name}}, happy birthday! 🎂 {{business}} is celebrating with you! Enjoy {{discount}}% OFF on your birthday month purchase. Use code BIRTHDAY{{year}}',
    tags: ['birthday', 'special offer', 'personalized'],
  },
  {
    id: 'shop-010',
    title: 'Product Review Request',
    category: 'shop',
    type: 'broadcast',
    description: 'Ask customers to review their purchase',
    content: 'Hi {{name}}, how was your shopping experience at {{business}}? We\'d love your feedback! Reply with your review and get {{reward}} OFF on your next purchase. 😊',
    tags: ['review', 'feedback', 'engagement'],
  },

  // ========== REAL ESTATE TEMPLATES (10) ==========
  {
    id: 'realEstate-001',
    title: 'Site Visit Appointment Reminder',
    category: 'real_estate',
    type: 'broadcast',
    description: 'Remind prospects about property site visits',
    content: 'Hi {{name}}, this is a reminder for your site visit at {{property}} on {{date}} at {{time}}. Parking available. Looking forward to showing you this amazing property! 🏡',
    tags: ['site visit', 'reminder', 'appointment'],
  },
  {
    id: 'realEstate-002',
    title: 'New Property Launch',
    category: 'real_estate',
    type: 'broadcast',
    description: 'Announce newly listed properties',
    content: 'Hi {{name}}, {{business}} has just launched a NEW premium property at {{location}}! ₹{{price}} • {{features}}. Limited units available. Book your visit today! 🔑',
    tags: ['new launch', 'property', 'promotion'],
  },
  {
    id: 'realEstate-003',
    title: 'Post-Visit Follow-up',
    category: 'real_estate',
    type: 'broadcast',
    description: 'Follow up after property viewing',
    content: 'Hi {{name}}, thank you for visiting {{property}} with {{business}}! Interested? We can discuss payment plans & offers. Reply with your questions!',
    tags: ['follow-up', 'lead nurturing', 'conversion'],
  },
  {
    id: 'realEstate-004',
    title: 'Price Reduction Alert',
    category: 'real_estate',
    type: 'broadcast',
    description: 'Notify about reduced property prices',
    content: 'Hi {{name}}, {{business}} just reduced the price of {{property}} from ₹{{oldPrice}} to ₹{{newPrice}}! This is your chance to get your dream home. Limited offer!',
    tags: ['price reduction', 'alert', 'opportunity'],
  },
  {
    id: 'realEstate-005',
    title: 'EMI Reminder',
    category: 'real_estate',
    type: 'broadcast',
    description: 'Remind buyers about upcoming EMI payments',
    content: 'Hi {{name}}, friendly reminder: Your EMI of ₹{{amount}} for {{property}} is due on {{date}}. Pay online through {{link}} to avoid late fees. Thank you!',
    tags: ['emi', 'payment', 'reminder'],
  },
  {
    id: 'realEstate-006',
    title: 'Exclusive Investor Offer',
    category: 'real_estate',
    type: 'broadcast',
    description: 'Target investors with special deals',
    content: 'Hi {{name}}, {{business}} is offering investment opportunity with 25% guaranteed returns on {{property}}! Limited investor slots. Schedule a call with our team.',
    tags: ['investment', 'offer', 'exclusive'],
  },
  {
    id: 'realEstate-007',
    title: 'Document Submission Reminder',
    category: 'real_estate',
    type: 'broadcast',
    description: 'Remind clients to submit required documents',
    content: 'Hi {{name}}, to proceed with {{property}} registration, please submit the following documents by {{date}}: {{docs}}. {{link}} for details.',
    tags: ['documents', 'reminder', 'process'],
  },
  {
    id: 'realEstate-008',
    title: 'Loan Approval Status Update',
    category: 'real_estate',
    type: 'broadcast',
    description: 'Update customers on loan approval',
    content: 'Hi {{name}}, great news! Your home loan for {{property}} has been approved for ₹{{amount}}. Next step: site verification on {{date}}. Congratulations! 🎉',
    tags: ['loan', 'approval', 'update'],
  },
  {
    id: 'realEstate-009',
    title: 'Project Completion Notification',
    category: 'real_estate',
    type: 'broadcast',
    description: 'Inform about project handover',
    content: 'Hi {{name}}, your dream home at {{property}} is ready for handover! 🔑 Schedule your possession appointment on {{link}}. Thank you for your trust!',
    tags: ['completion', 'handover', 'celebration'],
  },
  {
    id: 'realEstate-010',
    title: 'Referral Reward Program',
    category: 'real_estate',
    type: 'broadcast',
    description: 'Encourage customers to refer others',
    content: 'Hi {{name}}, refer a friend to {{business}} and earn ₹{{reward}}! For every successful property purchase through your referral, we\'ll reward you. Share now! 📲',
    tags: ['referral', 'reward', 'growth'],
  },

  // ========== COACHING TEMPLATES (10) ==========
  {
    id: 'coaching-001',
    title: 'Class Reminder - Same Day',
    category: 'coaching',
    type: 'broadcast',
    description: 'Remind students about class today',
    content: 'Hi {{name}}, class at {{business}} starts in 1 hour at {{time}} - {{subject}}. Don\'t be late! Join us on {{platform}}. See you there! 📚',
    tags: ['class', 'reminder', 'urgent'],
  },
  {
    id: 'coaching-002',
    title: 'Doubt Clearing Session Announcement',
    category: 'coaching',
    type: 'broadcast',
    description: 'Announce special doubt clearing sessions',
    content: 'Hi {{name}}, {{business}} is conducting a free doubt clearing session on {{subject}} on {{date}} at {{time}}. Get your questions answered live! 🙋 Register now!',
    tags: ['doubt', 'session', 'learning'],
  },
  {
    id: 'coaching-003',
    title: 'Fee Reminder',
    category: 'coaching',
    type: 'broadcast',
    description: 'Remind about pending fee payment',
    content: 'Hi {{name}}, your fee payment of ₹{{amount}} for {{month}} month is due on {{date}}. Pay online at {{link}}. Late payment may affect access. Pay now!',
    tags: ['fee', 'payment', 'reminder'],
  },
  {
    id: 'coaching-004',
    title: 'Exam Preparation Alert',
    category: 'coaching',
    type: 'broadcast',
    description: 'Motivate students before exams',
    content: 'Hi {{name}}, {{exam}} is on {{date}}! {{business}} wishes you all the best. Revise important topics and get good sleep. You\'ve got this! 💪 Believe in yourself!',
    tags: ['exam', 'preparation', 'motivation'],
  },
  {
    id: 'coaching-005',
    title: 'Test Results Announcement',
    category: 'coaching',
    type: 'broadcast',
    description: 'Share test or exam results',
    content: 'Hi {{name}}, your {{exam}} results are ready! Score: {{score}}/{{total}}. Login to {{platform}} to see detailed analysis. Great effort! 👏',
    tags: ['results', 'score', 'performance'],
  },
  {
    id: 'coaching-006',
    title: 'Study Material Download',
    category: 'coaching',
    type: 'broadcast',
    description: 'Share study materials and resources',
    content: 'Hi {{name}}, download the {{chapter}} study notes from {{link}}. These will help you master {{topic}}. Mark important points and revise regularly. Good luck! 📖',
    tags: ['study material', 'resource', 'learning'],
  },
  {
    id: 'coaching-007',
    title: 'Attendance Warning',
    category: 'coaching',
    type: 'broadcast',
    description: 'Alert about low attendance',
    content: 'Hi {{name}}, your attendance at {{business}} is {{percentage}}%. Minimum {{minAttendance}}% is required. Attend more classes to stay compliant. Talk to us!',
    tags: ['attendance', 'warning', 'important'],
  },
  {
    id: 'coaching-008',
    title: 'Parent Progress Update',
    category: 'coaching',
    type: 'broadcast',
    description: 'Share student progress with parents',
    content: 'Hi {{parentName}}, your {{childName}}\'s progress at {{business}} is excellent! Score in last test: {{score}}. Keep encouraging! Parent-teacher meeting on {{date}}.',
    tags: ['progress', 'parent', 'communication'],
  },
  {
    id: 'coaching-009',
    title: 'Scholarship Announcement',
    category: 'coaching',
    type: 'broadcast',
    description: 'Promote scholarship opportunities',
    content: 'Hi {{name}}, {{business}} is offering scholarships for merit students! {{discount}}% fee waiver available. Apply now at {{link}}. Deadline: {{date}}',
    tags: ['scholarship', 'opportunity', 'award'],
  },
  {
    id: 'coaching-010',
    title: 'Course Completion Certificate',
    category: 'coaching',
    type: 'broadcast',
    description: 'Congratulate on course completion',
    content: 'Hi {{name}}, congratulations! 🎓 You\'ve successfully completed {{course}} at {{business}}. Your certificate is ready. Download it from {{link}}. Well done!',
    tags: ['certificate', 'completion', 'achievement'],
  },

  // ========== CSC TEMPLATES (10) ==========
  {
    id: 'csc-001',
    title: 'Document Ready Notification',
    category: 'csc',
    type: 'broadcast',
    description: 'Inform about processed documents ready for collection',
    content: 'Hi {{name}}, your {{document}} from {{business}} is ready for collection! Visit us on {{date}} with {{id}}. Timings: {{time}}. Thank you! 📄',
    tags: ['document', 'ready', 'notification'],
  },
  {
    id: 'csc-002',
    title: 'Government Scheme Update',
    category: 'csc',
    type: 'broadcast',
    description: 'Announce government scheme updates and benefits',
    content: 'Hi {{name}}, {{business}} is now offering {{scheme}} through {{cscName}}! Get {{benefit}}. Eligibility: {{criteria}}. Apply today at {{link}}',
    tags: ['government', 'scheme', 'update'],
  },
  {
    id: 'csc-003',
    title: 'Application Status Update',
    category: 'csc',
    type: 'broadcast',
    description: 'Update on application processing status',
    content: 'Hi {{name}}, your {{application}} application dated {{date}} is {{status}}. Expected completion date: {{completionDate}}. Thank you for using {{business}}!',
    tags: ['application', 'status', 'update'],
  },
  {
    id: 'csc-004',
    title: 'Document Verification Reminder',
    category: 'csc',
    type: 'broadcast',
    description: 'Remind to complete document verification',
    content: 'Hi {{name}}, to process your {{document}}, we need {{details}}. Visit {{business}} with {{documents}} by {{date}}. Avoid delays. {{link}} for more info.',
    tags: ['verification', 'reminder', 'important'],
  },
  {
    id: 'csc-005',
    title: 'Passport Service Reminder',
    category: 'csc',
    type: 'broadcast',
    description: 'Remind about passport application status',
    content: 'Hi {{name}}, your passport application is {{status}}. Reference: {{refNumber}}. Track it at {{link}}. For queries, visit {{business}}. Safe travels! 🛫',
    tags: ['passport', 'service', 'travel'],
  },
  {
    id: 'csc-006',
    title: 'Aadhar Update Notification',
    category: 'csc',
    type: 'broadcast',
    description: 'Announce Aadhar update services',
    content: 'Hi {{name}}, update your Aadhar at {{business}} quickly and easily! {{service}} now available. Book appointment at {{link}}. Timings: {{time}}',
    tags: ['aadhar', 'update', 'service'],
  },
  {
    id: 'csc-007',
    title: 'Pan Card Service Update',
    category: 'csc',
    type: 'broadcast',
    description: 'Update on PAN card services',
    content: 'Hi {{name}}, apply for new PAN or update existing at {{business}}! Quick processing in {{days}} days. Visit us {{days}} times a week. {{link}}',
    tags: ['pan', 'income', 'tax'],
  },
  {
    id: 'csc-008',
    title: 'Bank Account Opening',
    category: 'csc',
    type: 'broadcast',
    description: 'Promote PMJDY and bank account services',
    content: 'Hi {{name}}, open a free bank account at {{business}} under PMJDY! Zero balance, free debit card, insurance. Visit us today! 🏦 {{link}}',
    tags: ['banking', 'account', 'government'],
  },
  {
    id: 'csc-009',
    title: 'Bill Payment Service',
    category: 'csc',
    type: 'broadcast',
    description: 'Promote bill payment and recharge services',
    content: 'Hi {{name}}, pay your {{billType}} at {{business}}! Electricity, water, mobile - pay all at one place. No extra charges. {{link}} for more.',
    tags: ['payment', 'bill', 'service'],
  },
  {
    id: 'csc-010',
    title: 'Grievance Resolution Update',
    category: 'csc',
    type: 'broadcast',
    description: 'Update on filed grievance/complaint status',
    content: 'Hi {{name}}, your complaint ref {{refNumber}} filed on {{date}} is being processed. Current status: {{status}}. Contact {{business}} for details.',
    tags: ['grievance', 'complaint', 'resolution'],
  },
];

/**
 * Get all ready-made templates
 */
export function getAllReadyMadeTemplates(): ReadyMadeTemplate[] {
  return READY_MADE_TEMPLATES;
}

/**
 * Get ready-made templates for a specific category
 */
export function getReadyMadeTemplatesByCategory(category: string): ReadyMadeTemplate[] {
  return READY_MADE_TEMPLATES.filter(
    (template) => template.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get a single ready-made template by ID
 */
export function getReadyMadeTemplateById(id: string): ReadyMadeTemplate | undefined {
  return READY_MADE_TEMPLATES.find((template) => template.id === id);
}

/**
 * Search ready-made templates by keywords
 */
export function searchReadyMadeTemplates(query: string): ReadyMadeTemplate[] {
  const lowerQuery = query.toLowerCase();
  return READY_MADE_TEMPLATES.filter(
    (template) =>
      template.title.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get recommended templates for a user's category/industry
 */
export function getRecommendedTemplates(industry: string | null | undefined): RecommendedTemplate[] {
  if (!industry) return [];

  // Map industry string to category key
  const categoryMap: Record<string, Category> = {
    'clinic': 'clinic',
    'healthcare': 'clinic',
    'hospital': 'clinic',
    'doctor': 'clinic',

    'shop': 'shop',
    'ecommerce': 'shop',
    'store': 'shop',
    'retail': 'shop',
    'shopify': 'shop',
    'woocommerce': 'shop',

    'real_estate': 'real-estate',
    'realestate': 'real-estate',
    'property': 'real-estate',
    'real estate': 'real-estate',

    'coaching': 'coaching',
    'education': 'coaching',
    'training': 'coaching',
    'course': 'coaching',
    'academy': 'coaching',

    'csc': 'csc',
    'service_center': 'csc',
    'government': 'csc',
  };

  const normalizedIndustry = (industry || '').toLowerCase().trim();
  const category = categoryMap[normalizedIndustry] as Category | undefined;

  if (!category) return [];

  const config = getCategoryConfig(category);
  if (!config) return [];

  return config.recommendedTemplates;
}

/**
 * Get a limited set of recommended templates (e.g., 4-6 for dashboard)
 */
export function getRecommendedTemplatesLimited(
  industry: string | null | undefined,
  limit: number = 6
): RecommendedTemplate[] {
  const templates = getRecommendedTemplates(industry);
  return templates.slice(0, limit);
}
