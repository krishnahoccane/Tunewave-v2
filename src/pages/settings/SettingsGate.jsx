import React from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useRole } from "../../context/RoleContext";
import Settings from "../Settings.jsx";

/**
 * For SuperAdmin: keep existing Settings page (no new layout).
 * For others: render nested routes (SettingsLayout + Overview / Profile / Password / Branding).
 */
export default function SettingsGate() {
  const location = useLocation();
  const { actualRole } = useRole();
  const isSuperAdmin = actualRole === "SuperAdmin" || actualRole?.toLowerCase() === "superadmin";

  if (isSuperAdmin) {
    if (location.pathname !== "/settings") {
      return <Navigate to="/settings" replace />;
    }
    return <Settings />;
  }

  return <Outlet />;
}
