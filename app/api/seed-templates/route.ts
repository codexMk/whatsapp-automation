import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const TEMPLATE_DATA = {
  clinic: [
    {
      name: "Appointment Reminder",
      category: "clinic",
      content: "Hi {{customerName}}, this is a reminder for your appointment on {{appointmentDate}} at {{appointmentTime}} with {{doctorName}}. Please arrive 10 minutes early. Reply OK to confirm.",
      variables: ["customerName", "appointmentDate", "appointmentTime", "doctorName"]
    },
    {
      name: "Prescription Alert",
      category: "clinic",
      content: "{{patientName}}, your prescription is ready for pickup at {{clinicName}}. Medicine: {{medicineName}}. Cost: {{cost}}. Visit us during {{clinicHours}}.",
      variables: ["patientName", "clinicName", "medicineName", "cost", "clinicHours"]
    },
    {
      name: "Follow-up Checkup",
      category: "clinic",
      content: "Hi {{patientName}}, it's time for your follow-up checkup. Please call {{clinicNumber}} to book an appointment. Dr. {{doctorName}} will be available on {{availableDates}}.",
      variables: ["patientName", "clinicNumber", "doctorName", "availableDates"]
    },
    {
      name: "Test Results",
      category: "clinic",
      content: "{{patientName}}, your {{testName}} results are ready. Please visit us to discuss the results. Appointment slot available on {{date}} at {{time}}.",
      variables: ["patientName", "testName", "date", "time"]
    },
    {
      name: "Health Tips",
      category: "clinic",
      content: "💊 Health Tip: {{tip}} For more health guidance, consult with Dr. {{doctorName}} at {{clinicName}}. Call {{clinicNumber}} to book now!",
      variables: ["tip", "doctorName", "clinicName", "clinicNumber"]
    }
  ],
  shop: [
    {
      name: "Order Confirmation",
      category: "shop",
      content: "Thank you {{customerName}}! Your order #{{orderID}} is confirmed. Total: {{amount}}. Expected delivery: {{deliveryDate}}. Track here: {{trackingLink}}",
      variables: ["customerName", "orderID", "amount", "deliveryDate", "trackingLink"]
    },
    {
      name: "Stock Alert",
      category: "shop",
      content: "🔔 {{productName}} is back in stock! Get it now at {{price}}. Limited quantity available. Shop now: {{shopLink}}",
      variables: ["productName", "price", "shopLink"]
    },
    {
      name: "Feedback Request",
      category: "shop",
      content: "Hi {{customerName}}, how was your recent purchase of {{productName}}? Rate your experience: {{ratingLink}} Help us improve!",
      variables: ["customerName", "productName", "ratingLink"]
    },
    {
      name: "Special Offer",
      category: "shop",
      content: "🎉 {{discount}}% OFF on {{category}}! Use code: {{promoCode}} at checkout. Valid till {{expiryDate}}. Shop now: {{shopLink}}",
      variables: ["discount", "category", "promoCode", "expiryDate", "shopLink"]
    },
    {
      name: "Shipping Update",
      category: "shop",
      content: "📦 Your order #{{orderID}} is on the way! Estimated delivery: {{deliveryDate}}. Tracking ID: {{trackingID}}",
      variables: ["orderID", "deliveryDate", "trackingID"]
    }
  ],
  "real-estate": [
    {
      name: "Property Listing Alert",
      category: "real-estate",
      content: "🏠 New Property Alert! {{propertyType}} in {{location}}. Price: {{price}}. {{bedrooms}} BHK, {{area}} sq.ft. View: {{listingLink}}",
      variables: ["propertyType", "location", "price", "bedrooms", "area", "listingLink"]
    },
    {
      name: "Site Visit Reminder",
      category: "real-estate",
      content: "Hi {{clientName}}, reminder for your site visit at {{propertyAddress}} on {{visitDate}} at {{visitTime}}. Contact agent: {{agentContact}}",
      variables: ["clientName", "propertyAddress", "visitDate", "visitTime", "agentContact"]
    },
    {
      name: "Offer Update",
      category: "real-estate",
      content: "{{clientName}}, your offer of {{offerAmount}} for {{propertyAddress}} has been {{offerStatus}}. Next steps: {{nextsteps}}",
      variables: ["clientName", "offerAmount", "propertyAddress", "offerStatus", "nextsteps"]
    },
    {
      name: "Document Request",
      category: "real-estate",
      content: "Hi {{clientName}}, please submit required documents for {{propertyAddress}} by {{deadline}}. Documents needed: {{documentList}}. Send to: {{email}}",
      variables: ["clientName", "propertyAddress", "deadline", "documentList", "email"]
    },
    {
      name: "Registration Complete",
      category: "real-estate",
      content: "🎉 Congratulations {{clientName}}! Registration for {{propertyAddress}} is complete. Your property details available at: {{linkToDetails}}",
      variables: ["clientName", "propertyAddress", "linkToDetails"]
    }
  ],
  coaching: [
    {
      name: "Class Reminder",
      category: "coaching",
      content: "Hi {{studentName}}, reminder for {{courseTitle}} class on {{classDate}} at {{classTime}}. Join link: {{meetLink}}. Prepare {{topic}}",
      variables: ["studentName", "courseTitle", "classDate", "classTime", "meetLink", "topic"]
    },
    {
      name: "Assignment Submission",
      category: "coaching",
      content: "{{studentName}}, assignment for {{courseTitle}} is due on {{dueDate}}. Topic: {{topic}}. Submit here: {{submissionLink}}",
      variables: ["studentName", "courseTitle", "dueDate", "topic", "submissionLink"]
    },
    {
      name: "Grade Update",
      category: "coaching",
      content: "Great work {{studentName}}! Your {{examName}} score is {{score}}/{{totalMarks}}. Keep it up! Next test on {{nextTestDate}}.",
      variables: ["studentName", "examName", "score", "totalMarks", "nextTestDate"]
    },
    {
      name: "Course Completion",
      category: "coaching",
      content: "🎓 Congratulations {{studentName}}! You've completed {{courseTitle}}. Certificate issued. Download: {{certificateLink}}",
      variables: ["studentName", "courseTitle", "certificateLink"]
    },
    {
      name: "Enrollment Confirmation",
      category: "coaching",
      content: "Welcome {{studentName}} to {{courseTitle}}! Start date: {{startDate}}. First class: {{firstClassDate}} at {{classTime}}. Join link: {{meetLink}}",
      variables: ["studentName", "courseTitle", "startDate", "firstClassDate", "classTime", "meetLink"]
    }
  ],
  csc: [
    {
      name: "Service Application Status",
      category: "csc",
      content: "Hi {{citizenName}}, your {{serviceName}} application #{{applicationID}} status: {{status}}. Track here: {{trackingLink}}",
      variables: ["citizenName", "serviceName", "applicationID", "status", "trackingLink"]
    },
    {
      name: "Document Submission",
      category: "csc",
      content: "{{citizenName}}, documents required for {{serviceName}}: {{documentList}}. Submit by {{deadline}} at {{cscLocation}}.",
      variables: ["citizenName", "serviceName", "documentList", "deadline", "cscLocation"]
    },
    {
      name: "Payment Receipt",
      category: "csc",
      content: "Payment receipt for {{serviceName}} - Amount: {{amount}}, Reference ID: {{referenceID}}, Date: {{date}}. Print this message for records.",
      variables: ["serviceName", "amount", "referenceID", "date"]
    },
    {
      name: "Service Delivery",
      category: "csc",
      content: "{{citizenName}}, your {{serviceName}} is ready for pickup. Please visit {{cscLocation}} during {{operatingHours}}. Bring ID proof.",
      variables: ["citizenName", "serviceName", "cscLocation", "operatingHours"]
    },
    {
      name: "Government Notification",
      category: "csc",
      content: "📢 Important: {{notificationTitle}}. Details: {{notificationBody}}. For more info visit: {{officialLink}}",
      variables: ["notificationTitle", "notificationBody", "officialLink"]
    }
  ]
};

export async function GET() {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    console.log("[SEED-TEMPLATES] Starting template seeding...");

    // Get or create admin user
    let admin = await db.user.findUnique({
      where: { email: "admin@system.local" }
    });

    if (!admin) {
      console.log("[SEED-TEMPLATES] Admin not found, creating...");
      return NextResponse.json(
        { error: "Admin user not found. Please create admin first." },
        { status: 404 }
      );
    }

    console.log("[SEED-TEMPLATES] Found admin:", admin.id);

    let totalCreated = 0;

    // Seed templates for each category
    for (const [category, templates] of Object.entries(TEMPLATE_DATA)) {
      console.log(`[SEED-TEMPLATES] Seeding ${templates.length} templates for ${category}...`);

      for (const template of templates) {
        // Check if template already exists
        const existing = await db.template.findFirst({
          where: {
            userId: admin.id,
            name: template.name,
            category: template.category
          }
        });

        if (!existing) {
          await db.template.create({
            data: {
              userId: admin.id,
              name: template.name,
              category: template.category,
              content: template.content,
              variables: template.variables as any
            }
          });
          totalCreated++;
          console.log(`[SEED-TEMPLATES] Created template: ${template.name}`);
        } else {
          console.log(`[SEED-TEMPLATES] Template already exists: ${template.name}`);
        }
      }
    }

    console.log(`[SEED-TEMPLATES] Total templates created: ${totalCreated}`);

    // Now seed templates to all existing users except admin
    const users = await db.user.findMany({
      where: {
        email: { not: "admin@system.local" }
      }
    });

    console.log(`[SEED-TEMPLATES] Copying templates to ${users.length} existing users...`);

    let userTemplatesCreated = 0;

    for (const user of users) {
      const adminTemplates = await db.template.findMany({
        where: { userId: admin.id }
      });

      for (const template of adminTemplates) {
        const existing = await db.template.findFirst({
          where: {
            userId: user.id,
            name: template.name
          }
        });

        if (!existing) {
          await db.template.create({
            data: {
              userId: user.id,
              name: template.name,
              category: template.category,
              content: template.content,
              variables: template.variables || undefined
            }
          });
          userTemplatesCreated++;
        }
      }
    }

    console.log(`[SEED-TEMPLATES] Created ${userTemplatesCreated} templates for existing users`);

    return NextResponse.json({
      status: "success",
      message: "✅ All templates seeded successfully!",
      stats: {
        adminTemplatesCreated: totalCreated,
        totalCategories: Object.keys(TEMPLATE_DATA).length,
        existingUsers: users.length,
        userTemplatesCreated: userTemplatesCreated,
        categoryStats: Object.entries(TEMPLATE_DATA).reduce((acc, [cat, temps]) => {
          acc[cat] = temps.length;
          return acc;
        }, {} as Record<string, number>)
      },
      nextStep: "All users now have access to templates. Raj clinic and new users will see them immediately!"
    });
  } catch (error) {
    console.error("[SEED-TEMPLATES] Error:", error);
    return NextResponse.json(
      { error: "Failed to seed templates", details: String(error) },
      { status: 500 }
    );
  }
}
