import { NavLink } from "react-router-dom";

import { useAdminSidebar } from "../../contexts/AdminSidebarContext";

const menuItems = [
  {
    to: "/admin",
    label: "Огляд",
    end: true,
  },
  {
    to: "/admin/drivers",
    label: "Водії",
  },
  {
    to: "/admin/vehicles",
    label: "Автомобілі",
  },
  {
    to: "/admin/routes",
    label: "Маршрути",
  },
  {
    to: "/admin/fuel",
    label: "Заправки",
  },
  {
    to: "/admin/route-types",
    label: "Типи маршрутів",
  },
];

function AdminSidebar() {
  const { sidebarContent } = useAdminSidebar();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        DriverTrack
      </div>

      <nav className="admin-sidebar__nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              isActive
                ? "admin-sidebar__link admin-sidebar__link--active"
                : "admin-sidebar__link"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {sidebarContent && (
        <div className="admin-sidebar__content">
          <div className="admin-sidebar__divider" />

          {sidebarContent}
        </div>
      )}
    </aside>
  );
}

export default AdminSidebar;