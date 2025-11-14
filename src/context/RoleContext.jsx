// // context/RoleContext.jsx
// import { createContext, useState, useEffect, useContext } from "react";

// const RoleContext = createContext();

// export const RoleProvider = ({ children }) => {
//   const [role, setRole] = useState(null);

//   useEffect(() => {
//     const savedRole = localStorage.getItem("role");
//     if (savedRole) setRole(savedRole);
//   }, []);

//   return (
//     <RoleContext.Provider value={{ role, setRole }}>
//       {children}
//     </RoleContext.Provider>
//   );
// };

// export const useRole = () => useContext(RoleContext);
import { createContext, useContext } from "react";

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const storedRole = localStorage.getItem("role");

  // Map server role → frontend role
  const role = storedRole === "SuperAdmin" ? "enterprise" : "normal";

  return (
    <RoleContext.Provider value={{ role }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
