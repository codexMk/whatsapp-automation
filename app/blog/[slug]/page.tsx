"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import Link from "next/link";
import { useParams } from "next/navigation";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  image?: string;
  createdAt: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs?slug=${slug}`);
        if (!response.ok) throw new Error("Blog not found");
        const data = await response.json();
        setBlog(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <TopBar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-slate-200 rounded w-3/4" />
            <div className="h-96 bg-slate-200 rounded" />
            <div className="h-32 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <TopBar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="bg-red-100 border border-red-400 text-red-700 p-6 rounded-lg">
            <p className="font-bold">{error || "Blog not found"}</p>
          </div>
          <Link href="/blog" className="text-blue-600 hover:underline font-bold mt-6 inline-block">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <TopBar />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/blog" className="text-blue-600 hover:underline font-bold mb-6 inline-block">
          ← Back to Blog
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {blog.image && (
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-96 object-cover bg-slate-200"
            />
          )}

          <div className="p-8 md:p-12">
            <h1 className="text-4xl font-black text-slate-900 mb-2">{blog.title}</h1>
            <p className="text-slate-500 mb-8">
              Published on {new Date(blog.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </p>

            <div className="prose prose-sm max-w-none">
              {blog.content.split("\n").map((paragraph, i) => (
                <p key={i} className="text-slate-700 leading-relaxed mb-4 text-lg">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Ready to automate your WhatsApp?</h3>
              <Link
                href="/category-select"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
              >
                Start Free Trial →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
