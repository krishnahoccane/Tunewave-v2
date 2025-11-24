import { createContext, useContext, useState, useEffect } from "react";

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  // Use state to track role so it updates when localStorage changes
  const [storedRole, setStoredRole] = useState(() => {
    return localStorage.getItem("role") || "normal";
  });

  // Listen for localStorage changes (from same tab or other tabs)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "role") {
        setStoredRole(e.newValue || "normal");
      }
    };

    // Listen for storage events (changes from other tabs)
    window.addEventListener("storage", handleStorageChange);

    // Listen for custom role change events (changes from same tab)
    const handleRoleChange = () => {
      const newRole = localStorage.getItem("role") || "normal";
      setStoredRole(newRole);
    };
    window.addEventListener("roleChanged", handleRoleChange);

    // Check localStorage periodically as fallback
    const checkRole = () => {
      const currentRole = localStorage.getItem("role") || "normal";
      setStoredRole((prevRole) => {
        if (currentRole !== prevRole) {
          return currentRole;
        }
        return prevRole;
      });
    };
    
    // Set up interval to check for changes (fallback - checks every 500ms)
    const interval = setInterval(checkRole, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("roleChanged", handleRoleChange);
      clearInterval(interval);
    };
  }, []); // Empty dependency array - only run on mount/unmount

  // Map server role → frontend role
  // SuperAdmin, EnterpriseAdmin, and LabelAdmin all get "enterprise" role
  // Normalize role to handle case variations
  const normalizedRole = storedRole?.trim() || "normal";
  const role = (
    normalizedRole === "SuperAdmin" || 
    normalizedRole === "superadmin" || 
    normalizedRole?.toLowerCase() === "superadmin" ||
    normalizedRole === "EnterpriseAdmin" || 
    normalizedRole === "enterpriseadmin" ||
    normalizedRole?.toLowerCase() === "enterpriseadmin" ||
    normalizedRole === "LabelAdmin" || 
    normalizedRole === "labeladmin" ||
    normalizedRole?.toLowerCase() === "labeladmin"
  ) ? "enterprise" : "normal";
  
  // Expose actual role for role-specific checks (normalize to match expected format)
  const actualRole = normalizedRole === "superadmin" || normalizedRole?.toLowerCase() === "superadmin" 
    ? "SuperAdmin" 
    : normalizedRole === "enterpriseadmin" || normalizedRole?.toLowerCase() === "enterpriseadmin"
    ? "EnterpriseAdmin"
    : normalizedRole === "labeladmin" || normalizedRole?.toLowerCase() === "labeladmin"
    ? "LabelAdmin"
    : normalizedRole;

  return (
    <RoleContext.Provider value={{ role, actualRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
