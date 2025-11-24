
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import Tunewavelogo from "../assets/Tunewave Media Logo Final-01 1.png";
import { MdAccountBalanceWallet } from "react-icons/md";
import { FaYoutube } from "react-icons/fa";
import NavProfile from "../assets/NavProfile.png";
import SearchIcon from "../assets/Vector.png";
import DownArrow from "../assets/DownArrow.png";
import UpArrow from "../assets/UpArrow.png";

import ReleasesIcon from "../assets/ReleasesIcon.svg";
import TracksIcon from "../assets/TracksIcon.svg";
import ArtistsIcon from "../assets/ArtistsIcon.svg";

import ReleasesIconFill from "../assets/ReleasesIconFill.svg";
import TracksIconFill from "../assets/TracksIconFill.svg";
import ArtistsIconFill from "../assets/ArtistsIconFill.svg";
import supportIcon from "../assets/support.png";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
// import { RoleContext } from "../context/RoleContext";
import { useRole } from "../context/RoleContext";
const Navbar = () => {
  const { role, actualRole } = useRole();
  
  // Debug: Log role values
  React.useEffect(() => {
    console.log("Navbar - role:", role, "actualRole:", actualRole);
  }, [role, actualRole]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [hovered, setHovered] = useState(null);

  ////////////////////////////////////////    Role    /////////////////////////////////////////////////////////////
  // Role-based navbar

  //////////////////////////////////////////////////////////////////////////////////////////////////////

  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);
  const navigate = useNavigate();

  //  Logout handler
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("displayName");
    document.cookie =
      "jwt_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Dispatch custom event to notify RoleContext of role change
    window.dispatchEvent(new Event("roleChanged"));
    setProfileOpen(false);
    navigate("/login");
  };

  // Search Box in navbar
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const query = e.target.value.toLowerCase().trim();

      // Map search terms to routes
      const searchRoutes = {
        dashboard: "/dashboard",
        catalog: "/catalog",
        releases: "/catalog?tab=releases",
        tracks: "/catalog?tab=tracks",
        artists: "/catalog?tab=artists",
        analytics: "/analytics",
        wallet: "/wallet",
        tools: "/tools",
        "yt services": "/yt-services",
        "support ticket": "/ticket-raise",
        settings: "/settings",
      };

      if (searchRoutes[query]) {
        navigate(searchRoutes[query]);
        e.target.value = "";
        setMenuOpen(false);
        setCatalogOpen(false);
        setWalletOpen(false);
        setToolsOpen(false);
        setProfileOpen(false);
      } else {
        toast.error("No page found for this search term!");
      }
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".navbar")) {
        setCatalogOpen(false);
        setWalletOpen(false);
        setToolsOpen(false);
        setProfileOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const currWallet = 100.01;

  return (
    <div className="navbar">
      {/* Logo */}
      <img
        src={Tunewavelogo}
        alt="logo"
        className="logo"
        onClick={() => {
          navigate("/");
        }}
      />

      {/* Search */}
      <div className="search-box">
        <img src={SearchIcon} alt="search" className="search-icon" />
        <input
          type="text"
          className="input-box"
          placeholder="Search for..."
          onKeyDown={handleSearch}
        />
      </div>

      {/* Hamburger menu */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Main Menu */}
      <ul className={`menu ${menuOpen ? "active" : ""}`}>
        {role === "normal" ? (
          <>
            {/* Dashboard */}
            <li className="nav-item">
              <Link
                to="/dashboard"
                className={isActive("/dashboard") ? "active" : ""}
                onClick={() => {
                  setMenuOpen(false);
                  setCatalogOpen(false);
                }}
              >
                Dashboard
              </Link>
            </li>

            {/* Catalog Dropdown */}
            <li className="dropdown-parent nav-item">
              <button
                className={`dropdown-toggle ${
                  isActive("/catalog") ? "active" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCatalogOpen(!catalogOpen);
                  setWalletOpen(false);
                  setToolsOpen(false);
                  setProfileOpen(false);
                }}
              >
                Catalog
                <img
                  src={catalogOpen ? UpArrow : DownArrow}
                  alt="arrow"
                  className="arrow-icon"
                />
              </button>
              {catalogOpen && (
                <ul className="dropdown-menu">
                  <li>
                    <Link
                      to="/catalog?tab=releases"
                      onClick={() => {
                        setMenuOpen(false);
                        setCatalogOpen(false);
                      }}
                      className="catalog-link"
                      onMouseEnter={() => setHovered("releases")}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <img
                        src={
                          hovered === "releases" ||
                          location.search.includes("releases")
                            ? ReleasesIconFill
                            : ReleasesIcon
                        }
                        alt="releases"
                        className="menu-icon"
                      />
                      Releases
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/catalog?tab=tracks"
                      onClick={() => {
                        setMenuOpen(false);
                        setCatalogOpen(false);
                      }}
                      className="catalog-link"
                      onMouseEnter={() => setHovered("tracks")}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <img
                        src={
                          hovered === "tracks" ||
                          location.search.includes("tracks")
                            ? TracksIconFill
                            : TracksIcon
                        }
                        alt="tracks"
                        className="menu-icon"
                      />
                      Tracks
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/catalog?tab=artists"
                      onClick={() => {
                        setMenuOpen(false);
                        setCatalogOpen(false);
                      }}
                      className="catalog-link"
                      onMouseEnter={() => setHovered("artists")}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <img
                        src={
                          hovered === "artists" ||
                          location.search.includes("artists")
                            ? ArtistsIconFill
                            : ArtistsIcon
                        }
                        alt="artists"
                        className="menu-icon"
                      />
                      Artists
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Analytics */}
            <li className="nav-item">
              <Link
                to="/analytics"
                className={isActive("/analytics") ? "active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                Analytics
              </Link>
            </li>

            {/* Tools Dropdown */}
            <li className="dropdown-parent nav-item">
              <button
                className={`dropdown-toggle ${
                  isActive("/tools") ? "active" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setToolsOpen(!toolsOpen);
                  setCatalogOpen(false);
                  setWalletOpen(false);
                  setProfileOpen(false);
                }}
              >
                Tools
                <img
                  src={toolsOpen ? UpArrow : DownArrow}
                  alt="arrow"
                  className="arrow-icon"
                />
              </button>
              {toolsOpen && (
                <ul className="dropdown-menu">
                  <li>
                    <Link
                      to="/yt-services"
                      className="nav-link flex items-center gap-2"
                      onClick={() => {
                        setMenuOpen(false);
                        setToolsOpen(false);
                      }}
                    >
                      <FaYoutube style={{ color: "red", fontSize: "20px" }} />
                      YT Services
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/ticket-raise"
                      onClick={() => {
                        setProfileOpen(false);
                        setMenuOpen(false);
                        setToolsOpen(false);
                      }}
                    >
                      <img src={supportIcon} alt="" />
                      Support Ticket
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Wallet */}
            <li className="dropdown-parent nav-item menu">
              <Link
                to="/wallet"
                onClick={(e) => {
                  e.stopPropagation();
                  setCatalogOpen(false);
                  setToolsOpen(false);
                  setProfileOpen(false);
                }}
              >
                <MdAccountBalanceWallet className="menu-icon" /> ${currWallet}
              </Link>
            </li>
          </>
        ) : (
          <>
            {/* ---- ENTERPRISE MENU ---- */}
            <li className="nav-item">
              <Link
                to="/dashboard"
                className={isActive("/dashboard") ? "active" : ""}
                onClick={() => {
                  setMenuOpen(false);
                  setCatalogOpen(false);
                }}
              >
                Dashboard
              </Link>
            </li>
            {/* SuperAdmin: Show Enterprises */}
            {(actualRole === "SuperAdmin" || actualRole?.toLowerCase() === "superadmin") && (
              <li className="nav-item">
                <Link
                  to="/enterprise-catalog?tab=enterprises&section=all-enterprises"
                  onClick={() => setMenuOpen(false)}
                  className={isActive("/enterprise-catalog") && location.search.includes("enterprises") ? "active" : ""}
                >
                  Enterprises
                </Link>
              </li>
            )}
            {/* EnterpriseAdmin: Show Labels */}
            {(actualRole === "EnterpriseAdmin" || actualRole?.toLowerCase() === "enterpriseadmin") && (
              <li className="nav-item">
                <Link
                  to="/enterprise-catalog?tab=labels&section=all-labels"
                  onClick={() => setMenuOpen(false)}
                  className={isActive("/enterprise-catalog") && location.search.includes("labels") ? "active" : ""}
                >
                  Labels
                </Link>
              </li>
            )}
            {/* LabelAdmin role: Show Artists (which navigates to artists catalog) */}
            {(actualRole === "LabelAdmin" || actualRole?.toLowerCase() === "labeladmin") && (
              <li className="nav-item">
                <Link
                  to="/enterprise-catalog?tab=artists&section=all-artists"
                  onClick={() => setMenuOpen(false)}
                  className={isActive("/enterprise-catalog") && location.search.includes("artists") ? "active" : ""}
                >
                  Artists
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link
                to="/enterprise-catalog?tab=qc"
                onClick={() => setMenuOpen(false)}
              >
                QC
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/enterprise-catalog?tab=billing"
                onClick={() => setMenuOpen(false)}
              >
                Billing
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/analytics" onClick={() => setMenuOpen(false)}>
                Analytics
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/enterprise-catalog?tab=tickets"
                onClick={() => setMenuOpen(false)}
              >
                Tickets
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/enterprise-catalog?tab=users"
                onClick={() => setMenuOpen(false)}
              >
                Users
              </Link>
            </li>

            {/* System Config Dropdown */}
            <li className="dropdown-parent nav-item">
              <button
                className="dropdown-toggle"
                onClick={(e) => {
                  e.stopPropagation();
                  setToolsOpen(!toolsOpen);
                }}
              >
                Syst Config
                <img
                  src={toolsOpen ? UpArrow : DownArrow}
                  alt="arrow"
                  className="arrow-icon"
                />
              </button>

              {toolsOpen && (
                <ul className="dropdown-menu">
                  <li>
                    <Link
                      to="/enterprise-catalog?tab=system-config/dsp"
                      onClick={() => {
                        setMenuOpen(false);
                        setToolsOpen(false);
                      }}
                    >
                      DSP
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </>
        )}
      </ul>

      {/* Profile Dropdown */}
      <div
        className="profile-section"
        onClick={(e) => {
          e.stopPropagation();
          setProfileOpen(!profileOpen);
          setCatalogOpen(false);
          setWalletOpen(false);
          setToolsOpen(false);
        }}
      >
        <img src={NavProfile} alt="profile" className="profile-icon" />
        {profileOpen && (
          <ul className="profile-menu">
            <li>
              <Link to="/settings" onClick={() => setProfileOpen(false)}>
                Settings
              </Link>
            </li>
            {/*  Logout */}
            <li
              onClick={() => handleLogout()}
              style={{
                cursor: "pointer",
                color: "red",
              }}
            >
              Logout
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navbar;
