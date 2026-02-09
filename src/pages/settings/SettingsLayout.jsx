import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useRole } from "../../context/RoleContext";
import "../../styles/SettingsLayout.css";

const SETTINGS_MENU = [
  { path: "/settings", end: true, label: "Overview" },
  { path: "/settings/profile", end: false, label: "Profile" },
  { path: "/settings/password", end: false, label: "Password" },
  { path: "/settings/branding", end: false, label: "Branding", hideForArtist: true },
  { path: "/settings/credentials", end: false, label: "Credentials", hideForArtist: true },
];

export default function SettingsLayout() {
  const { actualRole } = useRole();
  const roleLower = actualRole?.toLowerCase() || "";
  const isArtist = roleLower === "artist" || roleLower === "artistadmin" || roleLower === "artist admin";

  const menuItems = SETTINGS_MENU.filter(
    (item) => !(item.hideForArtist && isArtist)
  );

  return (
    <div className="settings-layout">
      <aside className="settings-sidebar">
        <h2 className="settings-sidebar-title">Settings</h2>
        <nav className="settings-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={!!item.end}
              className={({ isActive }) =>
                `settings-nav-link ${isActive ? "settings-nav-link-active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="settings-main">
        <Outlet />
      </main>
    </div>
  );
}
