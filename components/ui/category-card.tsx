"use client";

import Link from "next/link";

interface CategoryCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export function CategoryCard({ id, title, description, icon }: CategoryCardProps) {
  return (
    <Link href={`/category-select?category=${id}`}>
      <div className="group cursor-pointer rounded-lg border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-md hover:shadow-slate-100">
        <div className="mb-3 text-4xl">{icon}</div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
        <div className="mt-4 text-sm font-medium text-slate-500 group-hover:text-slate-700">
          Learn more →
        </div>
      </div>
    </Link>
  );
}
