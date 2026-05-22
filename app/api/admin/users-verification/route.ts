import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateSession } from "@/lib/session-server";

export async function GET(req: NextRequest) {
  try {
    // Validate admin session
    const session = await validateSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: { role: true }
    });

    if (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(req.url);
    const filterType = searchParams.get("filter"); // "verified" or "unverified" or "all"
    const searchEmail = searchParams.get("search");

    // Build where clause for filtering
    let where: any = { role: "USER" };

    if (filterType === "verified") {
      where.AND = [
        { emailVerified: true },
        { phoneVerified: true },
        { isBusinessVerified: true }
      ];
    } else if (filterType === "unverified") {
      where.OR = [
        { emailVerified: false },
        { phoneVerified: false },
        { isBusinessVerified: false }
      ];
    }

    if (searchEmail) {
      where.email = { contains: searchEmail, mode: "insensitive" };
    }

    // Fetch all users with verification status
    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        businessName: true,
        ownerName: true,
        category: true,
        emailVerified: true,
        phoneVerified: true,
        isBusinessVerified: true,
        createdAt: true
      },
      orderBy: { createdAt: "desc" }
    });

    // Process data
    const processedUsers = users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      phone: u.phone,
      businessName: u.businessName,
      ownerName: u.ownerName,
      category: u.category,
      verification: {
        email: u.emailVerified,
        phone: u.phoneVerified,
        business: u.isBusinessVerified,
        fullyVerified: u.emailVerified && u.phoneVerified && u.isBusinessVerified
      },
      createdAt: u.createdAt
    }));

    // Calculate summary stats
    const totalUsers = processedUsers.length;
    const verifiedUsers = processedUsers.filter(u => u.verification.fullyVerified).length;
    const emailVerified = processedUsers.filter(u => u.verification.email).length;
    const phoneVerified = processedUsers.filter(u => u.verification.phone).length;
    const businessVerified = processedUsers.filter(u => u.verification.business).length;

    return NextResponse.json({
      success: true,
      data: {
        users: processedUsers,
        summary: {
          totalUsers,
          verifiedUsers,
          unverifiedUsers: totalUsers - verifiedUsers,
          emailVerified,
          phoneVerified,
          businessVerified,
          fullyVerifiedPercentage: totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0
        }
      }
    });
  } catch (error) {
    console.error("[ADMIN_USERS_VERIFICATION] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user verification data" },
      { status: 500 }
    );
  }
}
