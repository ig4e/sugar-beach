import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface SearchState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  categoryIDs: string[];
  addCategory: (id: string) => void;
  removeCategory: (id: string) => void;
  clearCategories: () => void;
  setCategories: (ids: string[]) => void;

  priceRange: { min: number; max: number };
  setPriceRange: (range: { min?: number; max?: number }) => void;

  generateUrl: () => string;
  parseUrl: (url: string) => void;
}

export const useSearchStore = create<SearchState>()(
  devtools((set, get) => ({
    searchQuery: "",
    categoryIDs: [],
    priceRange: { min: 0, max: 0 },
    setSearchQuery: (query) => set({ searchQuery: query }),
    addCategory: (id) =>
      set((state) => ({ categoryIDs: [...state.categoryIDs, id] })),
    removeCategory: (id) =>
      set((state) => ({
        categoryIDs: state.categoryIDs.filter((i) => i !== id),
      })),
    setCategories: (ids) => set({ categoryIDs: ids }),
    clearCategories: () => set({ categoryIDs: [] }),
    setPriceRange: (range) =>
      set((state) => ({ priceRange: { ...state.priceRange, ...range } })),

    generateUrl() {
      const { searchQuery, categoryIDs, priceRange } = get();

      const categories = categoryIDs.join(",");
      const min = priceRange.min;
      const max = priceRange.max;

      return `/search?query=${searchQuery}&categories=${categories}&min=${min}&max=${max}`;
    },

    parseUrl(url: string) {
      const params = new URLSearchParams(url);

      const searchQuery = params.get("query") || "";
      const categories = params.get("categories") || "";
      const min = Number(params.get("min") || "0");
      const max = Number(params.get("max") || "0");

      return set((state) => ({
        ...state,
        searchQuery,
        categoryIDs: categories.split(",").filter(x => x),
        priceRange: { min, max },
      }));
    },
  }))
);
