import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
      // Get single blog by slug
      const blog = await db.blogPost.findUnique({
        where: { slug }
      });

      if (!blog || !blog.published) {
        return NextResponse.json(
          { error: "Blog not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: blog
      });
    }

    // Get all published blogs
    const blogs = await db.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      success: true,
      data: blogs
    });
  } catch (error) {
    console.error("[BLOGS_GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
