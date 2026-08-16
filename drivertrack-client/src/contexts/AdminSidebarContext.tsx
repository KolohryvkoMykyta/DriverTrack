import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type AdminSidebarContextValue = {
  sidebarContent: ReactNode;

  setSidebarContent: (
    content: ReactNode
  ) => void;

  clearSidebarContent: () => void;
};

const AdminSidebarContext =
  createContext<AdminSidebarContextValue | null>(
    null
  );

type AdminSidebarProviderProps = {
  children: ReactNode;
};

export function AdminSidebarProvider({
  children,
}: AdminSidebarProviderProps) {
  const [
    sidebarContent,
    setSidebarContent,
  ] = useState<ReactNode>(null);

  const clearSidebarContent =
    useCallback(() => {
      setSidebarContent(null);
    }, []);

  const value = useMemo(
    () => ({
      sidebarContent,
      setSidebarContent,
      clearSidebarContent,
    }),
    [
      sidebarContent,
      clearSidebarContent,
    ]
  );

  return (
    <AdminSidebarContext.Provider
      value={value}
    >
      {children}
    </AdminSidebarContext.Provider>
  );
}

export function useAdminSidebar() {
  const context = useContext(
    AdminSidebarContext
  );

  if (!context) {
    throw new Error(
      "useAdminSidebar повинен використовуватися всередині AdminSidebarProvider"
    );
  }

  return context;
}