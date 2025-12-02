import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRole } from "../../context/RoleContext";

import DataTable from "../DataTable";
import GridView from "../GridView";
import "../../styles/TabComponents.css";
import "../../styles/TableShared.css";

function Artists({ searchItem, showMode, setTable, onSelectionChange, selectedFilter }) {
  const [filteredData, setFilteredData] = useState([]);
  const [artistsData, setArtistsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const toastShownRef = useRef(false);
  const lastFilterRef = useRef("");
  const { actualRole } = useRole();

  // Reset toast flag when filter changes
  useEffect(() => {
    const currentFilter = selectedFilter?.toLowerCase() || "";
    if (lastFilterRef.current !== currentFilter) {
      toastShownRef.current = false;
      lastFilterRef.current = currentFilter;
    }
  }, [selectedFilter]);

  // Fetch artists from API
  useEffect(() => {
    const fetchArtists = async () => {
      const token = localStorage.getItem("jwtToken");
      
      if (!token) {
        console.warn("No JWT token found");
        setLoading(false);
        return;
      }

      try {
        // Build query parameters for filters
        const params = new URLSearchParams();
        
        // Add status filter if selected (using API status values)
        if (selectedFilter && selectedFilter.toLowerCase() !== "all" && selectedFilter.toLowerCase() !== "all-artists") {
          if (selectedFilter.toLowerCase() === "active-artists") {
            params.append("status", "active");
          } else if (selectedFilter.toLowerCase() === "suspended-artists") {
            params.append("status", "suspend");
          } else if (selectedFilter.toLowerCase() === "disabled-artists") {
            params.append("status", "disable");
          }
        }
        
        // Add search filter if provided
        if (searchItem?.trim()) {
          params.append("search", searchItem.trim());
        }

        // Use the correct endpoint: /api/artists (plural)
        const url = `/api/artists${params.toString() ? `?${params.toString()}` : ""}`;
        
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        // Handle API response structure - API returns array directly
        const artistsArray = Array.isArray(response.data) ? response.data : [];
        
        if (Array.isArray(artistsArray)) {
          // Helper function to safely extract string values from API response
          // Handles empty objects {} and null/undefined values
          const safeString = (value, defaultValue = "") => {
            if (value === null || value === undefined) return defaultValue;
            if (typeof value === "object" && Object.keys(value).length === 0) return defaultValue;
            if (typeof value === "string") return value;
            return String(value);
          };

          // Map API response to component format based on actual API structure
          const mappedData = artistsArray.map((artist) => {
            // Handle status mapping: API returns "Active" but we need to check for filter compatibility
            let status = safeString(artist.status, "Active");
            // Normalize status for filtering
            if (status.toLowerCase() === "active") {
              status = "Active";
            } else if (status.toLowerCase() === "suspend" || status.toLowerCase() === "suspended") {
              status = "Suspended";
            } else if (status.toLowerCase() === "disable" || status.toLowerCase() === "disabled") {
              status = "Disabled";
            }
            
            // Safely extract image URL - handle empty objects
            const imageUrl = safeString(artist.imageUrl);
            const image = imageUrl || "/src/assets/samplIcon.png";
            
            return {
              id: artist.artistId || artist.artistID || artist.id || 0,
              artistid: `ART-${String(artist.artistId || artist.artistID || artist.id || 0).padStart(4, '0')}`,
              name: safeString(artist.artistName || artist.name),
              email: safeString(artist.email),
              country: safeString(artist.country),
              genre: safeString(artist.genre),
              bio: safeString(artist.bio),
              imageUrl: imageUrl,
              dateOfBirth: safeString(artist.dateOfBirth),
              revenueShare: artist.revenueShare ? `${artist.revenueShare}%` : "",
              labelID: artist.labelId || artist.labelID || null,
              releases: artist.releases || artist.releaseCount || 0,
              image: image,
              status: status,
              createdAt: safeString(artist.createdAt || artist.createdDate),
            };
          });
          
          setArtistsData(mappedData);
        } else {
          console.warn("Unexpected API response format:", response.data);
          setArtistsData([]);
        }
      } catch (error) {
        // Log full error details for debugging
        console.error("Error fetching artists:", error);
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url,
        });
        
        if (error.response) {
          const status = error.response.status;
          const errorData = error.response.data;
          
          let errorMessage = "Failed to fetch artists.";
          
          if (status === 404) {
            errorMessage = "Artists endpoint not found. Please contact support.";
          } else if (status === 401 || status === 403) {
            errorMessage = "Unauthorized. Please login again.";
            setTimeout(() => {
              localStorage.removeItem("jwtToken");
              navigate("/login");
            }, 2000);
          } else if (status >= 500) {
            errorMessage = "Server error. Please try again later.";
          } else {
            errorMessage = errorData?.message || 
                          errorData?.error || 
                          errorData?.title ||
                          error.response.statusText || 
                          `Failed to fetch artists (${status})`;
          }
          
          toast.dark(errorMessage, {
            transition: Slide,
            autoClose: status === 404 || status >= 500 ? 5000 : 3000,
          });
        } else if (error.request) {
          console.error("No response received:", error.request);
          toast.dark("Network error: Unable to reach the server. Please check your connection.", {
            transition: Slide,
          });
        } else {
          console.error("Error setting up request:", error.message);
          toast.dark(`Error: ${error.message || "Failed to fetch artists. Please try again."}`, {
            transition: Slide,
          });
        }
        setArtistsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [selectedFilter, searchItem, location.key, navigate]);

  useEffect(() => {
    let filtered = artistsData;

    // Apply client-side search filter if API doesn't handle it
    if (searchItem?.trim() && !searchItem.includes("?")) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchItem.toLowerCase()) ||
        item.artistid.toLowerCase().includes(searchItem.toLowerCase()) ||
        (item.email && item.email.toLowerCase().includes(searchItem.toLowerCase())) ||
        (item.country && item.country.toLowerCase().includes(searchItem.toLowerCase())) ||
        (item.genre && item.genre.toLowerCase().includes(searchItem.toLowerCase()))
      );
    }

    setFilteredData(filtered);
    setTable(filtered);

    // Toast + redirect if no results (only show once per filter)
    const currentFilter = selectedFilter?.toLowerCase() || "";
    
    if (
      !loading &&
      filtered.length === 0 &&
      selectedFilter &&
      currentFilter !== "all" &&
      currentFilter !== "all-artists" &&
      !toastShownRef.current
    ) {
      toastShownRef.current = true;
      
      // Map filter IDs to display labels
      const filterLabelMap = {
        "active-artists": "Active Artists",
        "suspended-artists": "Suspended Artists",
        "disabled-artists": "Disabled Artists",
      };
      const displayLabel = filterLabelMap[currentFilter] || selectedFilter;
      
      toast.dark(`No records found under "${displayLabel}"`, {
        autoClose: 2500,
        transition: Slide,
      });

      setTimeout(() => {
        navigate("/enterprise-catalog?tab=artists&section=all-artists");
      }, 2600);
    }
  }, [searchItem, selectedFilter, artistsData, setTable, navigate, loading]);

  // Helper to safely render values (handles empty objects, null, undefined)
  const safeRender = (value) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "object" && Object.keys(value).length === 0) return "N/A";
    if (typeof value === "string" && value.trim() === "") return "N/A";
    return String(value);
  };

  const columns = [
    { 
      key: "artistid", 
      label: "Artist ID",
      render: (item) => <span>{safeRender(item.artistid)}</span>
    },
    { 
      key: "name", 
      label: "Artist Name",
      render: (item) => (
        <div className="title-cell">
          <img 
            src={item.image || "/src/assets/samplIcon.png"} 
            alt={safeRender(item.name)} 
            className="release-image" 
            onError={(e) => {
              e.target.src = "/src/assets/samplIcon.png";
            }}
          />
          <span>{safeRender(item.name)}</span>
        </div>
      )
    },
    { 
      key: "email", 
      label: "Email",
      render: (item) => <span>{safeRender(item.email)}</span>
    },
    { 
      key: "country", 
      label: "Country",
      render: (item) => <span>{safeRender(item.country)}</span>
    },
    { 
      key: "genre", 
      label: "Genre",
      render: (item) => <span>{safeRender(item.genre)}</span>
    },
    { 
      key: "revenueShare", 
      label: "Revenue Share",
      render: (item) => <span>{safeRender(item.revenueShare)}</span>
    },
    { 
      key: "releases", 
      label: "Releases",
      render: (item) => {
        const count = item.releases || 0;
        return <span>{count} release{count !== 1 ? "s" : ""}</span>;
      }
    },
  ];

  if (loading) {
    return (
      <div className="tab-content">
        <div className="loading-container">Loading artists...</div>
        <ToastContainer position="bottom-center" transition={Slide} />
      </div>
    );
  }

  return (
    <div className="tab-content">
      {showMode === "grid" ? (
        <GridView data={filteredData} />
      ) : (
        <DataTable
          data={filteredData}
          columns={columns}
          onSelectionChange={onSelectionChange}
        />
      )}
      <ToastContainer position="bottom-center" transition={Slide} />
    </div>
  );
}

export default Artists;

