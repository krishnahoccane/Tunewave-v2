// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import "./App.css";
// import Navbar from "./components/Navbar.jsx";
// import Login from "./pages/Login";
// import Home from "./pages/Home.jsx";
// import CatalogPage from "./pages/CatalogPage.jsx";
// import Analytics from "./pages/Analytics.jsx";
// import Transactions from "./pages/Transactions.jsx";
// import Settings from "./pages/Settings.jsx";
// import Wallet from "./pages/Wallet.jsx";
// import CreateRelease from "./pages/CreateRelease.jsx";
// import ReleasesTab from "./components/ReleasesTab.jsx";
// import ReleaseMetadataPage from "./pages/ReleaseMetadataPage.jsx";
// import YTServicesPage from "./pages/YTServicesPage.jsx";
// import WithdrawPage from "./pages/WithDrawPage.jsx";
// import NewReleasePage from "./pages/NewReleasePage.jsx";
// import UploadTracks from "./pages/UploadTracks.jsx";
// import ReleaseForm from "./pages/ReleaseForm.jsx";
// import PreviewDistributePage from "./pages/PreviewDistributePage.jsx";
// import TrackDetails from "./pages/TrackDetails.jsx";
// import TicketRaisePage from "./pages/TicketRaisePage.jsx";
// import SelectStoresPage from "./pages/SelectStoresPage.jsx";

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(
//     localStorage.getItem("isLoggedIn") === "true"
//   );

//   // Logout handler
//   const handleLogout = () => {
//     localStorage.removeItem("isLoggedIn");
//     localStorage.removeItem("jwtToken");
//     localStorage.removeItem("displayName");
//     setIsLoggedIn(false);
//   };

//   // 🔐 Check token expiry on app load
//   useEffect(() => {
//     const token = localStorage.getItem("jwtToken");
//     if (token) {
//       try {
//         const [, payload] = token.split(".");
//         const decoded = JSON.parse(atob(payload));

//         if (decoded.exp * 1000 < Date.now()) {
//           // Token expired
//           handleLogout();
//         } else {
//           // Set timer to logout exactly when token expires
//           const timeLeft = decoded.exp * 1000 - Date.now();
//           const timer = setTimeout(() => {
//             handleLogout();
//           }, timeLeft);

//           return () => clearTimeout(timer);
//         }
//       } catch (err) {
//         handleLogout(); // Invalid token
//       }
//     }
//   }, []);

//   return (
//     <Router>
//       {/* Show Navbar only if logged in */}
//       {isLoggedIn && location.pathname !== "/login" && (
//         <Navbar onLogout={handleLogout} />
//       )}

//       <Routes>
//         {/* Login page */}
//         <Route
//           path="/login"
//           element={<Login onLogin={() => setIsLoggedIn(true)} />}
//         />

//         {/* Redirect root */}
//         <Route
//           path="/"
//           element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
//         />

//         {/* Protected routes */}
//         <Route
//           path="/dashboard"
//           element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/catalog"
//           element={isLoggedIn ? <CatalogPage /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/catalog/*"
//           element={isLoggedIn ? <CatalogPage /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/analytics"
//           element={isLoggedIn ? <Analytics /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/transactions"
//           element={isLoggedIn ? <Transactions /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/settings"
//           element={isLoggedIn ? <Settings /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/create-release"
//           element={isLoggedIn ? <CreateRelease /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/releases"
//           element={isLoggedIn ? <ReleasesTab /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/wallet/withdraw"
//           element={isLoggedIn ? <WithdrawPage /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/wallet"
//           element={isLoggedIn ? <Wallet /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/release-metadata"
//           element={isLoggedIn ? <ReleaseMetadataPage /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/upload-tracks"
//           element={isLoggedIn ? <UploadTracks /> : <Navigate to="/login" />}
//         />
//          <Route
//           path="/select-stores"
//           element={isLoggedIn ? <SelectStoresPage /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/four-page"
//           element={isLoggedIn ? <ReleaseForm /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/preview-distribute"
//           element={isLoggedIn ? <PreviewDistributePage /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/track-details"
//           element={isLoggedIn ? <TrackDetails /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/ticket-raise"
//           element={isLoggedIn ? <TicketRaisePage /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/yt-services"
//           element={isLoggedIn ? <YTServicesPage /> : <Navigate to="/login" />}
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login";
import Home from "./pages/Home.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";
import Analytics from "./pages/Analytics.jsx";
import Transactions from "./pages/Transactions.jsx";
import Settings from "./pages/Settings.jsx";
import Wallet from "./pages/Wallet.jsx";
import CreateRelease from "./pages/CreateRelease.jsx";
import ReleasesTab from "./components/ReleasesTab.jsx";
import ReleaseMetadataPage from "./pages/ReleaseMetadataPage.jsx";
import YTServicesPage from "./pages/YTServicesPage.jsx";
import WithdrawPage from "./pages/WithDrawPage.jsx";
import NewReleasePage from "./pages/NewReleasePage.jsx";
import UploadTracks from "./pages/UploadTracks.jsx";
import ReleaseForm from "./pages/ReleaseForm.jsx";
import PreviewDistributePage from "./pages/PreviewDistributePage.jsx";
import TrackDetails from "./pages/TrackDetails.jsx";
import TicketRaisePage from "./pages/TicketRaisePage.jsx";
import SelectStoresPage from "./pages/SelectStoresPage.jsx";
import { useRole } from "./context/RoleContext";
// change name later
import "./styles/styled.css";
import EnterpriseCatalogPage from "./pages/EnterpriseCatalogPage.jsx";
import CreateEnterprise from "./pages/CreateEnterprise.jsx";
import CreateLabel from "./pages/CreateLabel.jsx";
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const { role } = useRole();
  const location = useLocation(); // ✅ React Router location
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("displayName");
    localStorage.removeItem("role");
    // Dispatch custom event to notify RoleContext of role change
    window.dispatchEvent(new Event("roleChanged"));
    setIsLoggedIn(false);
  };

  // 🔐 Token expiry check
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const [, payload] = token.split(".");
        const decoded = JSON.parse(atob(payload));

        if (decoded.exp * 1000 < Date.now()) {
          handleLogout();
        } else {
          const timeLeft = decoded.exp * 1000 - Date.now();
          const timer = setTimeout(handleLogout, timeLeft);
          return () => clearTimeout(timer);
        }
      } catch {
        handleLogout();
      }
    }
  }, []);

  return (
    <>
      {isLoggedIn && location.pathname !== "/login" && (
        <Navbar onLogout={handleLogout} />
      )}

      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={() => setIsLoggedIn(true)} />}
        />
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/catalog"
          element={isLoggedIn ? <CatalogPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/catalog/*"
          element={isLoggedIn ? <CatalogPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/analytics"
          element={isLoggedIn ? <Analytics /> : <Navigate to="/login" />}
        />
        <Route
          path="/transactions"
          element={isLoggedIn ? <Transactions /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={isLoggedIn ? <Settings /> : <Navigate to="/login" />}
        />
        <Route
          path="/create-release"
          element={isLoggedIn ? <CreateRelease /> : <Navigate to="/login" />}
        />
        <Route
          path="/releases"
          element={isLoggedIn ? <ReleasesTab /> : <Navigate to="/login" />}
        />
        <Route
          path="/wallet/withdraw"
          element={isLoggedIn ? <WithdrawPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/wallet"
          element={isLoggedIn ? <Wallet /> : <Navigate to="/login" />}
        />
        <Route
          path="/release-metadata"
          element={
            isLoggedIn ? <ReleaseMetadataPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/upload-tracks"
          element={isLoggedIn ? <UploadTracks /> : <Navigate to="/login" />}
        />
        <Route
          path="/select-stores"
          element={isLoggedIn ? <SelectStoresPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/four-page"
          element={isLoggedIn ? <ReleaseForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/preview-distribute"
          element={
            isLoggedIn ? <PreviewDistributePage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/track-details"
          element={isLoggedIn ? <TrackDetails /> : <Navigate to="/login" />}
        />
        <Route
          path="/ticket-raise"
          element={isLoggedIn ? <TicketRaisePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/yt-services"
          element={isLoggedIn ? <YTServicesPage /> : <Navigate to="/login" />}
        />

        <Route
          path="/enterprise-catalog/"
          element={
            isLoggedIn ? <EnterpriseCatalogPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/enterprise-catalog/create-enterprise"
          element={
            isLoggedIn ? <CreateEnterprise /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/enterprise-catalog/create-label"
          element={
            isLoggedIn ? <CreateLabel /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </>
  );
}

export default AppWrapper;
