"use client";

import { useCallback, useEffect, useState } from "react";
import type { Category } from "./category-context";
import { useCategory } from "./category-context";

/**
 * Hook to get the user's selected category with fallback logic
 * Tries: sessionStorage → context → null
 */
export function useCategoryOrNull(): Category | null {
  const context = useCategory();
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to get from sessionStorage first (persisted across page navigation)
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("selectedCategory") as Category | null;
      if (stored) {
        setCategory(stored);
        setIsLoading(false);
        return;
      }
    }

    // Fall back to context
    if (context.selectedCategory) {
      setCategory(context.selectedCategory);
    }

    setIsLoading(false);
  }, [context.selectedCategory]);

  return category;
}

/**
 * Hook for getting category on server side (for API routes)
 * To be used in API route handlers
 */
export async function getServerCategory(userId: string) {
  try {
    // In production, fetch from BusinessSettings in database
    // For now, we'll just return null and let client-side context handle it
    return null;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

/**
 * Utility to ensure category is available before performing operations
 */
export function ensureCategory(category: Category | null, message: string = "Category not selected") {
  if (!category) {
    throw new Error(message);
  }
  return category;
}
