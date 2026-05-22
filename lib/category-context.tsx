"use client";

import { createContext, useContext, ReactNode, useEffect, useState } from "react";

export type Category = "clinic" | "shop" | "real-estate" | "coaching" | "csc";

interface CategoryContextType {
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category) => void;
  clearCategory: () => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [selectedCategory, setSelectedCategoryState] = useState<Category | null>(null);

  useEffect(() => {
    // Load category from sessionStorage on mount
    const stored = sessionStorage.getItem("selectedCategory") as Category | null;
    if (stored) {
      setSelectedCategoryState(stored);
    }
  }, []);

  const setSelectedCategory = (category: Category) => {
    setSelectedCategoryState(category);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("selectedCategory", category);
    }
  };

  const clearCategory = () => {
    setSelectedCategoryState(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("selectedCategory");
    }
  };

  return (
    <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory, clearCategory }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategory() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error("useCategory must be used within CategoryProvider");
  }
  return context;
}
