import { create } from "zustand";

const useBreadCrumbStore = create((set) => ({
  breadcrumb: [],
  newBreadcrumb: (newBreadcrumb) => set({ breadcrumb: [newBreadcrumb] }),
  addBreadcrumb: (newBreadcrumb) =>
    set((state) => ({ breadcrumb: [...state.breadcrumb, newBreadcrumb] })),
  resetBreadcrumb: () => set({ breadcrumb: [] }),
}));

export default useBreadCrumbStore;
