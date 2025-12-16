import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRole } from "../../context/RoleContext";
import * as EnterprisesService from "../../services/enterprises";

import DataTable from "../DataTable";
import GridView from "../GridView";
import "../../styles/TabComponents.css";
import "../../styles/TableShared.css";

function Enterprises({ searchItem, showMode, setTable, onSelectionChange, selectedFilter }) {
  const [filteredData, setFilteredData] = useState([]);
  const [enterprisesData, setEnterprisesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [openStatusDropdown, setOpenStatusDropdown] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const toastShownRef = useRef(false);
  const lastFilterRef = useRef("");
  const { actualRole } = useRole();


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openStatusDropdown && !e.target.closest('.status-dropdown-wrapper')) {
        setOpenStatusDropdown(null);
      }
    };
    
    if (openStatusDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openStatusDropdown]);

  // Reset toast flag when filter changes
  useEffect(() => {
    const currentFilter = selectedFilter?.toLowerCase() || "";
    if (lastFilterRef.current !== currentFilter) {
      toastShownRef.current = false;
      lastFilterRef.current = currentFilter;
    }
  }, [selectedFilter]);

  // Fetch enterprises from API
  useEffect(() => {
    const fetchEnterprises = async () => {
      const token = localStorage.getItem("jwtToken");
      
      if (!token) {
        console.warn("No JWT token found");
        setLoading(false);
        return;
      }

      try {
        // Build query parameters for filters
        const params = {};
        
        // Add status filter if selected (using API status values)
        if (selectedFilter && selectedFilter.toLowerCase() !== "all" && selectedFilter.toLowerCase() !== "all-enterprises") {
          if (selectedFilter.toLowerCase() === "active-enterprises") {
            params.status = "active";
          } else if (selectedFilter.toLowerCase() === "suspended-enterprises") {
            params.status = "suspend";
          } else if (selectedFilter.toLowerCase() === "disabled-enterprises") {
            params.status = "disable";
          }
        }
        
        // Add search filter if provided
        if (searchItem?.trim()) {
          params.search = searchItem.trim();
        }

        const responseData = await EnterprisesService.getEnterprises(params);
        
        // Debug logging
        console.log("[Enterprises] API Response:", responseData);
        console.log("[Enterprises] Response type:", typeof responseData);
        console.log("[Enterprises] Is array:", Array.isArray(responseData));

        // Handle different response formats
        // API might return: array directly, or object with data/enterprises/items property
        let enterprisesArray = null;
        
        if (Array.isArray(responseData)) {
          enterprisesArray = responseData;
        } else if (responseData && typeof responseData === 'object') {
          // Try common property names
          enterprisesArray = responseData.data || 
                            responseData.enterprises || 
                            responseData.items || 
                            responseData.results ||
                            (Array.isArray(responseData) ? responseData : null);
        }

        if (enterprisesArray && Array.isArray(enterprisesArray)) {
          // Map API status to display format
          // API can return: "active", "suspend", "disable", "disabled", "suspended"
          const statusDisplayMap = {
            "active": "Active",
            "suspend": "Suspended",
            "disable": "Disabled",
            "disabled": "Disabled", // Handle variation
            "suspended": "Suspended", // Handle variation
            "Active": "Active",
            "Suspended": "Suspended",
            "Disabled": "Disabled",
          };
          
          // Map API response to component format
          const mappedData = enterprisesArray.map((enterprise) => {
            // Handle status - API returns: "active", "suspend", "disable", "disabled", "suspended"
            const apiStatus = enterprise.status || "active";
            // Normalize status values
            let normalizedStatus = apiStatus.toLowerCase();
            if (normalizedStatus === "disabled") normalizedStatus = "disable";
            if (normalizedStatus === "suspended") normalizedStatus = "suspend";
            
            const displayStatus = statusDisplayMap[normalizedStatus] || statusDisplayMap[apiStatus] || "Active";
            
            // Handle domain - API can return empty object {} instead of string
            let domainValue = "";
            if (typeof enterprise.domain === "string") {
              domainValue = enterprise.domain;
            } else if (enterprise.domain && typeof enterprise.domain === "object") {
              // Skip empty objects
              domainValue = "";
            }
            
            // Handle owner - API returns object with userId, fullName, email
            let ownerValue = null;
            if (enterprise.owner) {
              if (typeof enterprise.owner === "object" && enterprise.owner.email) {
                ownerValue = enterprise.owner.email;
              } else if (typeof enterprise.owner === "string") {
                ownerValue = enterprise.owner;
              }
            } else if (enterprise.ownerEmail) {
              ownerValue = enterprise.ownerEmail;
            }
            
            return {
              id: enterprise.enterpriseId || enterprise.id || 0,
              enterpriseid: `ENT-${String(enterprise.enterpriseId || enterprise.id || 0).padStart(3, '0')}`,
              enterprise: enterprise.enterpriseName || enterprise.name || "",
              domain: domainValue,
              revenueShare: enterprise.revenueSharePercent || enterprise.revenueShare 
                ? `${enterprise.revenueSharePercent || enterprise.revenueShare}%` 
                : "10%",
              qcRequired: enterprise.qcRequired ? "Required" : "Not required",
              status: displayStatus,
              owner: ownerValue,
              createdBy: enterprise.createdBy || "",
              createdAt: enterprise.createdAt || "",
            };
          });
          
          setEnterprisesData(mappedData);
        } else {
          console.warn("Unexpected API response format. Expected array but got:", responseData);
          console.warn("Response type:", typeof responseData);
          console.warn("Is array:", Array.isArray(responseData));
          setEnterprisesData([]);
          toast.dark("Unexpected response format from server. Please contact support.", {
            transition: Slide,
            autoClose: 5000,
          });
        }
      } catch (error) {
        // Only log error details in development
        if (process.env.NODE_ENV === 'development') {
          console.error("Error fetching enterprises:", error);
        }
        
        if (error.response) {
          // Server responded with error status
          const status = error.response.status;
          const errorData = error.response.data;
          
          let errorMessage = "Failed to fetch enterprises.";
          
          if (status === 404) {
            errorMessage = "Enterprises endpoint not found. Please contact support.";
          } else if (status === 401 || status === 403) {
            errorMessage = "Unauthorized. Please login again.";
            // Optionally redirect to login
            setTimeout(() => {
              localStorage.removeItem("jwtToken");
              navigate("/login");
            }, 2000);
          } else if (status >= 500) {
            errorMessage = "Server error. Please try again later.";
          } else {
            errorMessage = errorData?.message || 
                          errorData?.error || 
                          error.response.statusText || 
                          `Failed to fetch enterprises (${status})`;
          }
          
          toast.dark(errorMessage, {
            transition: Slide,
            autoClose: status === 404 || status >= 500 ? 5000 : 3000,
          });
        } else if (error.request) {
          // Request made but no response
          toast.dark("Network error: Unable to reach the server. Please check your connection.", {
            transition: Slide,
          });
        } else {
          // Something else happened
          toast.dark(`Error: ${error.message || "Failed to fetch enterprises. Please try again."}`, {
            transition: Slide,
          });
        }
        setEnterprisesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnterprises();
  }, [selectedFilter, searchItem, location.key, location.pathname, location.search]); // Refetch when filter, search changes, or on navigation

  useEffect(() => {
    // Since API handles filtering, we just use the data directly
    // But we can still apply client-side filtering if needed for additional logic
    let filtered = enterprisesData;

    // Apply client-side status filter as fallback
    const currentFilter = selectedFilter?.toLowerCase() || "";
    if (currentFilter && currentFilter !== "all" && currentFilter !== "all-enterprises") {
      const statusFilterMap = {
        "active-enterprises": "Active",
        "suspended-enterprises": "Suspended",
        "disabled-enterprises": "Disabled",
      };
      const targetStatus = statusFilterMap[currentFilter];
      if (targetStatus) {
        filtered = filtered.filter((item) => item.status === targetStatus);
      }
    }

    // Apply client-side search filter if API doesn't handle it
    // (API should handle search via ?search= parameter, but keeping as fallback)
    if (searchItem?.trim() && !searchItem.includes("?")) {
      filtered = filtered.filter((item) =>
        item.enterprise.toLowerCase().includes(searchItem.toLowerCase()) ||
        item.enterpriseid.toLowerCase().includes(searchItem.toLowerCase()) ||
        (item.domain && item.domain.toLowerCase().includes(searchItem.toLowerCase()))
      );
    }

    setFilteredData(filtered);
    setTable(filtered);

    // ✅ Toast + redirect if no results (only show once per filter)
    if (
      !loading &&
      filtered.length === 0 &&
      selectedFilter &&
      currentFilter !== "all" &&
      currentFilter !== "all-enterprises" &&
      !toastShownRef.current
    ) {
      toastShownRef.current = true;
      
      // Map filter IDs to display labels
      const filterLabelMap = {
        "active-enterprises": "Active Enterprises",
        "suspended-enterprises": "Suspended Enterprises",
        "disabled-enterprises": "Disabled Enterprises",
      };
      const displayLabel = filterLabelMap[currentFilter] || selectedFilter;
      toast.dark(`No records found under "${displayLabel}"`, {
        autoClose: 2500,
        transition: Slide,
      });

      setTimeout(() => {
        navigate("/enterprise-catalog?tab=enterprises&section=all-enterprises");
      }, 2600);
    }
  }, [searchItem, selectedFilter, enterprisesData, setTable, navigate, loading]);

  // Handle status update from dropdown
  const handleStatusUpdate = async (enterpriseId, newDisplayStatus) => {
    if (!enterpriseId || !newDisplayStatus) return;

    const statusMap = {
      "Active": "active",
      "Suspended": "suspend",
      "Disabled": "disable",
    };
    
    const apiStatus = statusMap[newDisplayStatus] || "active";

    setUpdatingStatus(enterpriseId);

    try {
      const responseData = await EnterprisesService.updateEnterpriseStatus(enterpriseId, apiStatus);
      
      if (responseData !== undefined) {
        // Map API status back to display format if provided
        const statusDisplayMap = {
          "active": "Active",
          "suspend": "Suspended",
          "disable": "Disabled",
        };
        
        // If response has status, use it; otherwise use the status we sent
        const apiStatusValue = responseData.status || apiStatus;
        const displayStatus = statusDisplayMap[apiStatusValue] || statusDisplayMap[apiStatus] || newDisplayStatus;
        
        // Update local state
        setEnterprisesData((prev) =>
          prev.map((ent) =>
            ent.id === enterpriseId
              ? { ...ent, status: displayStatus }
              : ent
          )
        );

        toast.dark(responseData.message || "Enterprise status updated successfully", {
          transition: Slide,
        });

        // Close dropdown
        setOpenStatusDropdown(null);

        // Refetch to ensure data is in sync
        setTimeout(() => {
          const fetchEnterprises = async () => {
            try {
              const params = {};
              if (selectedFilter && selectedFilter.toLowerCase() !== "all" && selectedFilter.toLowerCase() !== "all-enterprises") {
                if (selectedFilter.toLowerCase() === "active-enterprises") {
                  params.status = "active";
                } else if (selectedFilter.toLowerCase() === "suspended-enterprises") {
                  params.status = "suspend";
                } else if (selectedFilter.toLowerCase() === "disabled-enterprises") {
                  params.status = "disable";
                }
              }
              if (searchItem?.trim()) {
                params.search = searchItem.trim();
              }
              const resData = await EnterprisesService.getEnterprises(params);
              
              // Handle different response formats
              let enterprisesArray = null;
              if (Array.isArray(resData)) {
                enterprisesArray = resData;
              } else if (resData && typeof resData === 'object') {
                enterprisesArray = resData.data || 
                                  resData.enterprises || 
                                  resData.items || 
                                  resData.results ||
                                  (Array.isArray(resData) ? resData : null);
              }
              
              if (enterprisesArray && Array.isArray(enterprisesArray)) {
                // Map API status to display format
                // API can return: "active", "suspend", "disable", "disabled", "suspended"
                const statusDisplayMap = {
                  "active": "Active",
                  "suspend": "Suspended",
                  "disable": "Disabled",
                  "disabled": "Disabled", // Handle variation
                  "suspended": "Suspended", // Handle variation
                  "Active": "Active",
                  "Suspended": "Suspended",
                  "Disabled": "Disabled",
                };
                
                const mappedData = enterprisesArray.map((enterprise) => {
                  // Handle status - API returns: "active", "suspend", "disable", "disabled", "suspended"
                  const apiStatus = enterprise.status || "active";
                  // Normalize status values
                  let normalizedStatus = apiStatus.toLowerCase();
                  if (normalizedStatus === "disabled") normalizedStatus = "disable";
                  if (normalizedStatus === "suspended") normalizedStatus = "suspend";
                  
                  const displayStatus = statusDisplayMap[normalizedStatus] || statusDisplayMap[apiStatus] || "Active";
                  
                  // Handle domain - API can return empty object {} instead of string
                  let domainValue = "";
                  if (typeof enterprise.domain === "string") {
                    domainValue = enterprise.domain;
                  } else if (enterprise.domain && typeof enterprise.domain === "object") {
                    // Skip empty objects
                    domainValue = "";
                  }
                  
                  // Handle owner - API returns object with userId, fullName, email
                  let ownerValue = null;
                  if (enterprise.owner) {
                    if (typeof enterprise.owner === "object" && enterprise.owner.email) {
                      ownerValue = enterprise.owner.email;
                    } else if (typeof enterprise.owner === "string") {
                      ownerValue = enterprise.owner;
                    }
                  } else if (enterprise.ownerEmail) {
                    ownerValue = enterprise.ownerEmail;
                  }
                  
                  return {
                    id: enterprise.enterpriseId || enterprise.id || 0,
                    enterpriseid: `ENT-${String(enterprise.enterpriseId || enterprise.id || 0).padStart(3, '0')}`,
                    enterprise: enterprise.enterpriseName || enterprise.name || "",
                    domain: domainValue,
                    revenueShare: enterprise.revenueSharePercent || enterprise.revenueShare 
                      ? `${enterprise.revenueSharePercent || enterprise.revenueShare}%` 
                      : "10%",
                    qcRequired: enterprise.qcRequired ? "Required" : "Not required",
                    status: displayStatus,
                    owner: ownerValue,
                    createdBy: enterprise.createdBy || "",
                    createdAt: enterprise.createdAt || "",
                  };
                });
                setEnterprisesData(mappedData);
              }
            } catch (error) {
              console.error("Error refetching enterprises:", error);
            }
          };
          fetchEnterprises();
        }, 500);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      if (error.response) {
        toast.dark(
          error.response.data?.message || `Failed to update status: ${error.response.statusText}`,
          { transition: Slide }
        );
      } else {
        toast.dark("Network error. Please try again.", { transition: Slide });
      }
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Get status pill class based on status
  const getStatusPillClass = (status) => {
    const statusLower = (status || "Active").toLowerCase();
    if (statusLower === "active") return "status-green";
    if (statusLower === "suspended") return "status-yellow";
    if (statusLower === "disabled") return "status-red";
    return "status-gray";
  };

  const columns = [
    { key: "enterpriseid", label: "Enterprise ID" },
    { key: "enterprise", label: "Enterprise" },
    { key: "domain", label: "Domain" },
    { key: "revenueShare", label: "Revenue Share" },
    { key: "qcRequired", label: "QC Required" },
    {
      key: "status",
      label: "Status",
      render: (item) => {
        const currentStatus = item.status || "Activess";
        const pillClass = getStatusPillClass(currentStatus);
        
        if (actualRole === "SuperAdmin") {
          const statusOptions = ["Active", "Suspended", "Disabled"];
          const isOpen = openStatusDropdown === item.id;
          
          return (
            <div className="status-dropdown-wrapper" style={{ position: "relative" }}>
              <div
                className={`status-pill ${pillClass}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenStatusDropdown(isOpen ? null : item.id);
                }}
                style={{
                  cursor: updatingStatus === item.id ? "wait" : "pointer",
                  opacity: updatingStatus === item.id ? 0.6 : 1,
                  userSelect: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {currentStatus}
                <span style={{ fontSize: "10px", marginLeft: "4px" }}>▼</span>
              </div>
              
              {isOpen && (
                <>
                  <div
                    className="status-dropdown-overlay"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenStatusDropdown(null);
                    }}
                  />
                  <div className="status-dropdown-menu">
                    {statusOptions.map((status) => {
                      const optionPillClass = getStatusPillClass(status);
                      const isSelected = status === currentStatus;
                      
                      return (
                        <div
                          key={status}
                          className={`status-dropdown-option ${isSelected ? "selected" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (status !== currentStatus) {
                              handleStatusUpdate(item.id, status);
                            } else {
                              setOpenStatusDropdown(null);
                            }
                          }}
                          style={{
                            cursor: updatingStatus === item.id ? "wait" : "pointer",
                            opacity: updatingStatus === item.id ? 0.6 : 1,
                          }}
                        >
                          <span className={`status-pill ${optionPillClass}`}>
                            {status}
                          </span>
                          {isSelected && (
                            <span style={{ marginLeft: "8px", color: "#1278bb" }}>✓</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        }
        
        return (
          <span className={`status-pill ${pillClass}`}>
            {currentStatus}
          </span>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="tab-content">
        <div className="loading-container">Loading enterprises...</div>
        <ToastContainer position="bottom-center" transition={Slide} />
      </div>
    );
  }

  return (
    <>
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
      
    </>
  );
}

export default Enterprises;
