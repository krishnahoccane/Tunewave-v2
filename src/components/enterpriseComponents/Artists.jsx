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

        let url = `/api/Artist${params.toString() ? `?${params.toString()}` : ""}`;
        let response;
        
        try {
          response = await axios.get(url, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });
        } catch (firstError) {
          // If 404, try lowercase endpoint as fallback
          if (firstError.response?.status === 404) {
            console.log("Trying lowercase endpoint as fallback...");
            url = `/api/artist${params.toString() ? `?${params.toString()}` : ""}`;
            response = await axios.get(url, {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
            });
          } else {
            throw firstError;
          }
        }

        // Handle API response structure - API might return array directly or wrapped in object
        const responseData = response.data || {};
        const artistsArray = Array.isArray(response.data) 
          ? response.data 
          : responseData.artists || responseData.data || [];
        
        if (Array.isArray(artistsArray)) {
          // Map API response to component format
          const mappedData = artistsArray.map((artist) => {
            return {
              id: artist.artistID || artist.artistId || artist.id || 0,
              artistid: `ART-${String(artist.artistID || artist.artistId || artist.id || 0).padStart(3, '0')}`,
              name: artist.artistName || artist.name || "",
              email: artist.email || "",
              country: artist.country || "",
              genre: artist.genre || "",
              revenueShare: artist.revenueShare ? `${artist.revenueShare}%` : "",
              labelID: artist.labelID || artist.labelId || "",
              releases: artist.releases || artist.releaseCount || 0,
              image: artist.image || artist.profileImage || "/src/assets/samplIcon.png",
              status: artist.status || "Active",
              createdAt: artist.createdAt || artist.createdDate || "",
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

  const columns = [
    { key: "artistid", label: "Artist ID" },
    { 
      key: "name", 
      label: "Artist Name",
      render: (item) => (
        <div className="title-cell">
          <img src={item.image} alt={item.name} className="release-image" />
          <span>{item.name}</span>
        </div>
      )
    },
    { key: "email", label: "Email" },
    { key: "country", label: "Country" },
    { key: "genre", label: "Genre" },
    { key: "revenueShare", label: "Revenue Share" },
    { 
      key: "releases", 
      label: "Releases",
      render: (item) => (
        <span>{item.releases} release{item.releases !== 1 ? "s" : ""}</span>
      )
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

