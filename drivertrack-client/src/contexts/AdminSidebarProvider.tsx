import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { AdminSidebarContext } from "./AdminSidebarContext";

type AdminSidebarProviderProps = {
  children: ReactNode;
};

export function AdminSidebarProvider({
  children,
}: AdminSidebarProviderProps) {
  const [sidebarContent, setSidebarContent] =
    useState<ReactNode>(null);

  const clearSidebarContent = useCallback(() => {
    setSidebarContent(null);
  }, []);

  const value = useMemo(
    () => ({
      sidebarContent,
      setSidebarContent,
      clearSidebarContent,
    }),
    [sidebarContent, clearSidebarContent]
  );

  return (
    <AdminSidebarContext.Provider value={value}>
      {children}
    </AdminSidebarContext.Provider>
  );
}