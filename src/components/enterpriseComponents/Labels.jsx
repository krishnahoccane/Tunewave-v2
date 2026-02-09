import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRole } from "../../context/RoleContext";
import * as LabelsService from "../../services/labels";

import DataTable from "../DataTable";
import GridView from "../GridView";
import "../../styles/TabComponents.css";
import "../../styles/TableShared.css";

function Labels({ searchItem, showMode, setTable, onSelectionChange, selectedFilter }) {
  const [filteredData, setFilteredData] = useState([]);
  const [labelsData, setLabelsData] = useState([]);
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

  // Fetch labels from API
  useEffect(() => {
    const fetchLabels = async () => {
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
        if (selectedFilter && selectedFilter.toLowerCase() !== "all" && selectedFilter.toLowerCase() !== "all-labels") {
          if (selectedFilter.toLowerCase() === "active-labels") {
            params.status = "active";
          } else if (selectedFilter.toLowerCase() === "suspended-labels") {
            params.status = "suspend";
          } else if (selectedFilter.toLowerCase() === "disabled-labels") {
            params.status = "disable";
          }
        }
        
        // Add search filter if provided
        if (searchItem?.trim()) {
          params.search = searchItem.trim();
        }

        const responseData = await LabelsService.getLabels(params);
        
        // Debug logging
        console.log("[Labels] API Response:", responseData);
        console.log("[Labels] Response type:", typeof responseData);
        console.log("[Labels] Is array:", Array.isArray(responseData));

      // Handle different response formats
      // API might return: array directly, or object with data/labels/items property
      let labelsArray = null;
      
      try {
        if (Array.isArray(responseData)) {
          labelsArray = responseData;
        } else if (responseData && typeof responseData === 'object') {
          // Try common property names
          labelsArray = responseData.labels || 
                       responseData.data || 
                       responseData.items || 
                       responseData.results ||
                       null;
        }
      } catch (error) {
        console.error("[Labels] Error parsing API response:", error, responseData);
        labelsArray = null;
      }

      if (labelsArray && Array.isArray(labelsArray) && labelsArray.length > 0) {
          // Map API status to display format
          const statusDisplayMap = {
            "active": "Active",
            "suspend": "Suspended",
            "disable": "Disabled",
            "pending_domain_verification": "Pending Domain Verification",
            "Active": "Active",
            "Suspended": "Suspended",
            "Disabled": "Disabled",
            "Pending Domain Verification": "Pending Domain Verification",
          };
          
          // Map API response to component format with defensive checks
          const formatDate = (dateString) => {
            if (!dateString) return "";
            try {
              const date = new Date(dateString);
              if (isNaN(date.getTime())) return "";
              return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            } catch {
              return "";
            }
          };
          
          const mappedData = labelsArray
            .filter((label) => label != null) // Filter out null/undefined labels
            .map((label) => {
              try {
                const apiStatus = label?.status || "active";
                const displayStatus = statusDisplayMap[apiStatus] || apiStatus || "Active";
                
                // Display Enterprise Name if available, otherwise Enterprise ID
                let enterpriseDisplay = "";
                try {
                  if (label?.enterprise?.enterpriseName) {
                    enterpriseDisplay = String(label.enterprise.enterpriseName);
                  } else if (label?.enterpriseId) {
                    enterpriseDisplay = `ENT-${String(label.enterpriseId).padStart(3, '0')}`;
                  } else if (label?.enterprise?.enterpriseId) {
                    enterpriseDisplay = `ENT-${String(label.enterprise.enterpriseId).padStart(3, '0')}`;
                  }
                } catch (error) {
                  console.warn("[Labels] Error processing enterprise display:", error, label);
                  enterpriseDisplay = "";
                }
                
                const labelId = label?.labelId || 0;
                const labelName = String(label?.labelName || "");
                
                return {
                  id: labelId,
                  labelId: labelId,
                  labelid: `LAB-${String(labelId).padStart(3, '0')}`,
                  labelName: labelName,
                  label: labelName,
                  domain: String(label?.domain || ""),
                  enterpriseId: label?.enterpriseId || 0,
                  enterprise: enterpriseDisplay,
                  planTypeId: label?.planTypeId || 0,
                  planType: String(label?.planType || label?.planTypeId || ""),
                  revenueSharePercent: label?.revenueSharePercent ?? label?.revenueShare ?? 0,
                  revenueShare: (label?.revenueSharePercent || label?.revenueShare) ? `${label?.revenueSharePercent || label?.revenueShare}%` : "",
                  qcRequired: label?.qcRequired ? "Required" : "Not required",
                  agreementStartDate: String(label?.agreementStartDate || ""),
                  agreementEndDate: String(label?.agreementEndDate || ""),
                  agreementStartDateFormatted: formatDate(label?.agreementStartDate),
                  agreementEndDateFormatted: formatDate(label?.agreementEndDate),
                  status: displayStatus,
                  createdAt: String(label?.createdAt || ""),
                  createdAtFormatted: formatDate(label?.createdAt),
                };
              } catch (error) {
                console.error("[Labels] Error mapping label:", error, label);
                // Return a safe default object
                return {
                  id: 0,
                  labelId: 0,
                  labelid: "LAB-000",
                  labelName: "",
                  label: "",
                  domain: "",
                  enterpriseId: 0,
                  enterprise: "",
                  planTypeId: 0,
                  planType: "",
                  revenueSharePercent: 0,
                  revenueShare: "",
                  qcRequired: "Not required",
                  agreementStartDate: "",
                  agreementEndDate: "",
                  agreementStartDateFormatted: "",
                  agreementEndDateFormatted: "",
                  status: "Active",
                  createdAt: "",
                  createdAtFormatted: "",
                };
              }
            });
          
          setLabelsData(Array.isArray(mappedData) ? mappedData : []);
        } else {
          // Handle empty array or null response gracefully
          if (labelsArray && Array.isArray(labelsArray) && labelsArray.length === 0) {
            console.log("[Labels] API returned empty array - no labels found");
            setLabelsData([]);
          } else {
            console.warn("[Labels] Unexpected API response format:", responseData);
            console.warn("[Labels] Labels array:", labelsArray);
            setLabelsData([]);
          }
        }
      } catch (error) {
        // Log error details for debugging
        console.error("Error fetching labels:", error);
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url,
          request: error.request,
        });
        
        const status = error.response?.status || error.status;
        const errorData = error.response?.data || error.data || {};
        
        let errorMessage = "Failed to fetch labels.";
        
        if (status === 404) {
          errorMessage = "Labels endpoint not found. Please contact support.";
        } else if (status === 401 || status === 403) {
          errorMessage = "Unauthorized. Please login again.";
          setTimeout(() => {
            localStorage.removeItem("jwtToken");
            navigate("/login");
          }, 2000);
        } else if (status >= 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (error.request && !error.response) {
          errorMessage = "Network error: Unable to reach the server. Please check your connection.";
        } else {
          errorMessage = errorData?.message || 
                        errorData?.error || 
                        errorData?.title ||
                        error.message || 
                        `Failed to fetch labels (${status || "Unknown"})`;
        }
        
        toast.dark(errorMessage, {
          transition: Slide,
          autoClose: status === 404 || status >= 500 ? 5000 : 3000,
        });
        setLabelsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLabels();
  }, [selectedFilter, searchItem, location.key, navigate]);

  useEffect(() => {
    try {
      // Ensure labelsData is an array
      let filtered = Array.isArray(labelsData) ? labelsData : [];

      // Apply client-side status filter as fallback
      const currentFilter = selectedFilter?.toLowerCase() || "";
      if (currentFilter && currentFilter !== "all" && currentFilter !== "all-labels") {
        const statusFilterMap = {
          "active-labels": "Active",
          "suspended-labels": "Suspended",
          "disabled-labels": "Disabled",
        };
        const targetStatus = statusFilterMap[currentFilter];
        if (targetStatus) {
          filtered = filtered.filter((item) => {
            try {
              return item && item.status === targetStatus;
            } catch (error) {
              console.warn("[Labels] Error filtering by status:", error, item);
              return false;
            }
          });
        }
      }

    // Apply client-side search filter if API doesn't handle it
    if (searchItem?.trim() && !searchItem.includes("?")) {
      const searchTerm = searchItem.toLowerCase();
      filtered = filtered.filter((item) => {
        if (!item) return false;
        try {
          return (
            (item.label && String(item.label).toLowerCase().includes(searchTerm)) ||
            (item.labelid && String(item.labelid).toLowerCase().includes(searchTerm)) ||
            (item.labelName && String(item.labelName).toLowerCase().includes(searchTerm)) ||
            (item.domain && String(item.domain).toLowerCase().includes(searchTerm)) ||
            (item.enterprise && String(item.enterprise).toLowerCase().includes(searchTerm))
          );
        } catch (error) {
          console.warn("[Labels] Error filtering item:", error, item);
          return false;
        }
      });
    }

    setFilteredData(filtered || []);
    // Safely call setTable if it's a function
    if (typeof setTable === 'function') {
      try {
        setTable(filtered || []);
      } catch (error) {
        console.warn("[Labels] Error calling setTable:", error);
      }
    }

      // Toast + redirect if no results (only show once per filter)
      if (
        !loading &&
        filtered.length === 0 &&
        selectedFilter &&
        currentFilter !== "all" &&
        currentFilter !== "all-labels" &&
        !toastShownRef.current
      ) {
        toastShownRef.current = true;
        
        // Map filter IDs to display labels
        const filterLabelMap = {
          "active-labels": "Active Labels",
          "suspended-labels": "Suspended Labels",
          "disabled-labels": "Disabled Labels",
        };
        const displayLabel = filterLabelMap[currentFilter] || selectedFilter;
        
        toast.dark(`No records found under "${displayLabel}"`, {
          autoClose: 2500,
          transition: Slide,
        });

        setTimeout(() => {
          try {
            navigate("/enterprise-catalog?tab=labels&section=all-labels");
          } catch (error) {
            console.warn("[Labels] Error navigating:", error);
          }
        }, 2600);
      }
    } catch (error) {
      console.error("[Labels] Error in filter useEffect:", error);
      // Set safe defaults on error
      setFilteredData([]);
      if (typeof setTable === 'function') {
        try {
          setTable([]);
        } catch (setTableError) {
          console.warn("[Labels] Error calling setTable in error handler:", setTableError);
        }
      }
    }
  }, [searchItem, selectedFilter, labelsData, setTable, navigate, loading]);

  // Handle status update from dropdown
  const handleStatusUpdate = async (labelId, newDisplayStatus) => {
    if (!labelId || !newDisplayStatus) return;

    const statusMap = {
      "Active": "active",
      "Suspended": "suspend",
      "Disabled": "disable",
    };
    
    const apiStatus = statusMap[newDisplayStatus] || "active";

    setUpdatingStatus(labelId);

    try {
      const responseData = await LabelsService.changeLabelStatus(labelId, apiStatus);

      // Handle response - API might return empty body or different structure
      const isSuccess = responseData !== undefined;
      
      if (isSuccess) {
        // Map API status back to display format if provided
        const statusDisplayMap = {
          "active": "Active",
          "suspend": "Suspended",
          "disable": "Disabled",
          "pending_domain_verification": "Pending Domain Verification",
        };
        
        // If response has status, use it; otherwise use the status we sent
        const apiStatusValue = responseData.status || apiStatus;
        const displayStatus = statusDisplayMap[apiStatusValue] || statusDisplayMap[apiStatus] || newDisplayStatus;
        
        // Update local state
        setLabelsData((prev) =>
          prev.map((label) =>
            label.id === labelId
              ? { ...label, status: displayStatus }
              : label
          )
        );

        toast.dark(responseData.message || "Label status updated successfully", {
          transition: Slide,
        });

        // Close dropdown
        setOpenStatusDropdown(null);

        // Refetch to ensure data is in sync
        setTimeout(() => {
          const fetchLabels = async () => {
            try {
              const params = {};
              if (selectedFilter && selectedFilter.toLowerCase() !== "all" && selectedFilter.toLowerCase() !== "all-labels") {
                if (selectedFilter.toLowerCase() === "active-labels") {
                  params.status = "active";
                } else if (selectedFilter.toLowerCase() === "suspended-labels") {
                  params.status = "suspend";
                } else if (selectedFilter.toLowerCase() === "disabled-labels") {
                  params.status = "disable";
                }
              }
              if (searchItem?.trim()) {
                params.search = searchItem.trim();
              }
              const responseData = await LabelsService.getLabels(params);
              
              // Handle different response formats
              let labelsArray = null;
              
              if (Array.isArray(responseData)) {
                labelsArray = responseData;
              } else if (responseData && typeof responseData === 'object') {
                labelsArray = responseData.labels || 
                             responseData.data || 
                             responseData.items || 
                             responseData.results ||
                             (Array.isArray(responseData) ? responseData : null);
              }

              if (labelsArray && Array.isArray(labelsArray)) {
                const statusDisplayMap = {
                  "active": "Active",
                  "suspend": "Suspended",
                  "disable": "Disabled",
                  "pending_domain_verification": "Pending Domain Verification",
                  "Active": "Active",
                  "Suspended": "Suspended",
                  "Disabled": "Disabled",
                  "Pending Domain Verification": "Pending Domain Verification",
                };
                
                const formatDateRefetch = (dateString) => {
                  if (!dateString) return "";
                  try {
                    const date = new Date(dateString);
                    if (isNaN(date.getTime())) return "";
                    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                  } catch {
                    return "";
                  }
                };
                
                const mappedData = labelsArray
                  .filter((label) => label != null)
                  .map((label) => {
                    try {
                      const apiStatus = label?.status || "active";
                      const displayStatus = statusDisplayMap[apiStatus] || apiStatus || "Active";
                      
                      // Display Enterprise Name if available, otherwise Enterprise ID
                      let enterpriseDisplay = "";
                      try {
                        if (label?.enterprise?.enterpriseName) {
                          enterpriseDisplay = String(label.enterprise.enterpriseName);
                        } else if (label?.enterpriseId) {
                          enterpriseDisplay = `ENT-${String(label.enterpriseId).padStart(3, '0')}`;
                        } else if (label?.enterprise?.enterpriseId) {
                          enterpriseDisplay = `ENT-${String(label.enterprise.enterpriseId).padStart(3, '0')}`;
                        }
                      } catch (error) {
                        console.warn("[Labels] Error processing enterprise display in refetch:", error, label);
                        enterpriseDisplay = "";
                      }
                      
                      const labelId = label?.labelId || 0;
                      const labelName = String(label?.labelName || "");
                      
                      return {
                        id: labelId,
                        labelId: labelId,
                        labelid: `LAB-${String(labelId).padStart(3, '0')}`,
                        labelName: labelName,
                        label: labelName,
                        domain: String(label?.domain || ""),
                        enterpriseId: label?.enterpriseId || 0,
                        enterprise: enterpriseDisplay,
                        planTypeId: label?.planTypeId || 0,
                        planType: String(label?.planType || label?.planTypeId || ""),
                        revenueSharePercent: label?.revenueSharePercent ?? label?.revenueShare ?? 0,
                        revenueShare: (label?.revenueSharePercent || label?.revenueShare) ? `${label?.revenueSharePercent || label?.revenueShare}%` : "",
                        qcRequired: label?.qcRequired ? "Required" : "Not required",
                        agreementStartDate: String(label?.agreementStartDate || ""),
                        agreementEndDate: String(label?.agreementEndDate || ""),
                        agreementStartDateFormatted: formatDateRefetch(label?.agreementStartDate),
                        agreementEndDateFormatted: formatDateRefetch(label?.agreementEndDate),
                        status: displayStatus,
                        createdAt: String(label?.createdAt || ""),
                        createdAtFormatted: formatDateRefetch(label?.createdAt),
                      };
                    } catch (error) {
                      console.error("[Labels] Error mapping label in refetch:", error, label);
                      return {
                        id: 0,
                        labelId: 0,
                        labelid: "LAB-000",
                        labelName: "",
                        label: "",
                        domain: "",
                        enterpriseId: 0,
                        enterprise: "",
                        planTypeId: 0,
                        planType: "",
                        revenueSharePercent: 0,
                        revenueShare: "",
                        qcRequired: "Not required",
                        agreementStartDate: "",
                        agreementEndDate: "",
                        agreementStartDateFormatted: "",
                        agreementEndDateFormatted: "",
                        status: "Active",
                        createdAt: "",
                        createdAtFormatted: "",
                      };
                    }
                  });
                setLabelsData(Array.isArray(mappedData) ? mappedData : []);
              } else {
                console.warn("[Labels] Refetch: Unexpected response format or empty array");
                setLabelsData([]);
              }
            } catch (error) {
              console.error("Error refetching labels:", error);
              setLabelsData([]);
            }
          };
          fetchLabels();
        }, 500);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      const errorData = error.response?.data || error.data || {};
      const errorMessage = errorData?.message || 
                          error.message || 
                          `Failed to update status: ${error.response?.statusText || "Unknown error"}`;
      toast.dark(errorMessage, { transition: Slide });
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
    if (statusLower === "pending domain verification" || statusLower === "pending_domain_verification") return "status-yellow";
    return "status-gray";
  };

  const columns = [
    { key: "labelid", label: "Label ID" },
    { key: "label", label: "Label Name" },
    { key: "domain", label: "Domain" },
    { key: "enterprise", label: "Enterprise" },
    { key: "revenueShare", label: "Revenue Share" },
    { key: "qcRequired", label: "QC Required" },
    {
      key: "status",
      label: "Status",
      render: (item) => {
        const currentStatus = item.status || "Active";
        const pillClass = getStatusPillClass(currentStatus);
        
        if (actualRole && (actualRole === "SuperAdmin" || actualRole === "EnterpriseAdmin")) {
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
        <div className="loading-container">Loading labels...</div>
        <ToastContainer position="bottom-center" transition={Slide} />
      </div>
    );
  }

  // Ensure filteredData is always an array
  const safeFilteredData = Array.isArray(filteredData) ? filteredData : [];
  
  // Error boundary - if something goes wrong, show error message instead of blank page
  try {
    return (
      <div className="tab-content">
        {showMode === "grid" ? (
          <GridView data={safeFilteredData} />
        ) : (
          <DataTable
            data={safeFilteredData}
            columns={columns}
            onSelectionChange={onSelectionChange}
          />
        )}
        <ToastContainer position="bottom-center" transition={Slide} />
      </div>
    );
  } catch (error) {
    console.error("[Labels] Render error:", error);
    return (
      <div className="tab-content">
        <div className="loading-container" style={{ color: "#e74c3c" }}>
          <p>Error loading labels. Please refresh the page.</p>
          <p style={{ fontSize: "12px", marginTop: "8px" }}>{error.message}</p>
        </div>
        <ToastContainer position="bottom-center" transition={Slide} />
      </div>
    );
  }
}

export default Labels;

