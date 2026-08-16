import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import {
  getCurrentUser,
  type CurrentUser,
} from "../api/authApi";

import AdminHeader from "../components/admin/AdminHeader";
import AdminSidebar from "../components/admin/AdminSidebar";
import { AdminSidebarProvider } from "../contexts/AdminSidebarContext";

import "../styles/admin-layout.css";

function AdminLayout() {
  const [currentUser, setCurrentUser] =
    useState<CurrentUser | null>(null);

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error(
          "Не вдалося завантажити поточного користувача:",
          error
        );
      }
    }

    loadCurrentUser();
  }, []);

  return (
    <AdminSidebarProvider>
      <div className="admin-layout">
        <AdminSidebar />

        <div className="admin-content">
          <AdminHeader currentUser={currentUser} />

          <main className="admin-main">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminSidebarProvider>
  );
}

export default AdminLayout;