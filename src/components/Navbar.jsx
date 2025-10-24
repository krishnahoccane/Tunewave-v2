import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";  // ✅ useNavigate added
import "../styles/Navbar.css";
import Tunewavelogo from "../assets/Tunewave Media Logo Final-01 1.png";
import TunewaveLogoutImage from "../assets/tunewave.in.png";
import { MdAccountBalanceWallet } from "react-icons/md";
import { FaHandHoldingUsd, FaYoutube } from "react-icons/fa";
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

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [hovered, setHovered] = useState(null);

  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);
  const navigate = useNavigate();


  const [showThemeModal, setShowThemeModal] = useState(false);
const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("isLoggedIn");
    document.cookie =
      "jwt_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
      e.target.value = ""; // clear search box
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
                {/* <input type="text" className="input-box" placeholder="Search for..." /> */}
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
                      hovered === "tracks" || location.search.includes("tracks")
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
            className={`dropdown-toggle ${isActive("/tools") ? "active" : ""}`}
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
                <Link to="/ticket-raise" onClick={() => {setProfileOpen(false); setMenuOpen(false);
                    setToolsOpen(false);
                    }}> <img src={supportIcon} alt="" />
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
                      // setWalletOpen(!walletOpen);
                      setCatalogOpen(false);
                      setToolsOpen(false);
                      setProfileOpen(false);
                    }}

          >
            <MdAccountBalanceWallet className="menu-icon" /> ${currWallet}
          </Link>
          {/* {walletOpen && (
            <ul className="dropdown-menu">
              <li>
                <Link
                  to="/wallet/withdraw"
                  onClick={() => {
                    setMenuOpen(false);
                    setWalletOpen(false);
                  }}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <FaHandHoldingUsd className="menu-icon" /> Withdraw
                </Link>
              </li>
            </ul>
          )} */}
        </li>
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

  
        {/* ✅ Updated Logout */}
        <li
          onClick={() =>handleLogout()}
          style={{
          //   display: "flex",
          //   alignItems: "center",
          //   gap: "5px",
          //   background: "none",
          //   border: "none",
            cursor: "pointer",
            color: "red",
          //   width: "100%",
          //   textAlign: "left",
          //   padding: "8px 12px",
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
