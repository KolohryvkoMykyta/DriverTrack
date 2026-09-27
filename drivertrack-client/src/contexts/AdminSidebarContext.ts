import { createContext, useContext, type ReactNode } from "react";

type AdminSidebarContextValue = {
  sidebarContent: ReactNode;
  setSidebarContent: (content: ReactNode) => void;
  clearSidebarContent: () => void;
};

export const AdminSidebarContext =
  createContext<AdminSidebarContextValue | null>(null);

export function useAdminSidebar() {
  const context = useContext(AdminSidebarContext);

  if (!context) {
    throw new Error(
      "useAdminSidebar повинен використовуватися всередині AdminSidebarProvider"
    );
  }

  return context;
}