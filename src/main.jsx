import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { RoleProvider } from "./context/RoleContext.jsx";
import { BrandingProvider } from "./context/BrandingContext.jsx";
import DomainGuard from "./components/DomainGuard.jsx";
import { initializeDefaultStyles } from "./utils/brandingStyles";

// Initialize default CSS variables before React renders
initializeDefaultStyles();

createRoot(document.getElementById("root")).render(
 <StrictMode>
    <BrandingProvider>
      <DomainGuard>
        <RoleProvider>  
          <App />
        </RoleProvider>
      </DomainGuard>
    </BrandingProvider>
  </StrictMode>
);
