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
        const params = new URLSearchParams();
        
        // Add status filter if selected (using API status values)
        if (selectedFilter && selectedFilter.toLowerCase() !== "all" && selectedFilter.toLowerCase() !== "all-labels") {
          if (selectedFilter.toLowerCase() === "active-labels") {
            params.append("status", "active");
          } else if (selectedFilter.toLowerCase() === "suspended-labels") {
            params.append("status", "suspend");
          } else if (selectedFilter.toLowerCase() === "disabled-labels") {
            params.append("status", "disable");
          }
        }
        
        // Add search filter if provided
        if (searchItem?.trim()) {
          params.append("search", searchItem.trim());
        }

        const url = `/api/labels${params.toString() ? `?${params.toString()}` : ""}`;
        
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        // Handle new API response structure: { total: number, labels: array }
        const responseData = response.data || {};
        const labelsArray = responseData.labels || response.data || [];
        
        if (Array.isArray(labelsArray)) {
          // Map API status to display format
          const statusDisplayMap = {
            "active": "Active",
            "suspend": "Suspended",
            "disable": "Disabled",
            "Active": "Active",
            "Suspended": "Suspended",
            "Disabled": "Disabled",
          };
          
          // Map API response to component format
          const mappedData = labelsArray.map((label) => {
            const apiStatus = label.status || "active";
            const displayStatus = statusDisplayMap[apiStatus] || "Active";
            
            // Display Enterprise Name if available, otherwise Enterprise ID
            let enterpriseDisplay = "";
            if (label.enterprise?.enterpriseName) {
              enterpriseDisplay = label.enterprise.enterpriseName;
            } else if (label.enterpriseId) {
              enterpriseDisplay = `ENT-${String(label.enterpriseId).padStart(3, '0')}`;
            } else if (label.enterprise?.enterpriseId) {
              enterpriseDisplay = `ENT-${String(label.enterprise.enterpriseId).padStart(3, '0')}`;
            }
            
            return {
              id: label.labelId || 0,
              labelid: `LAB-${String(label.labelId || 0).padStart(3, '0')}`,
              label: label.labelName || "",
              domain: label.domain || "",
              planType: label.planType || "",
              revenueShare: label.revenueShare ? `${label.revenueShare}%` : "",
              qcRequired: label.qcRequired ? "Required" : "Not required",
              enterprise: enterpriseDisplay,
              status: displayStatus,
              createdAt: label.createdAt || "",
            };
          });
          
          setLabelsData(mappedData);
        } else {
          console.warn("Unexpected API response format:", response.data);
          setLabelsData([]);
        }
      } catch (error) {
        // Only log error details in development
        if (process.env.NODE_ENV === 'development') {
          console.error("Error fetching labels:", error);
        }
        
        if (error.response) {
          const status = error.response.status;
          const errorData = error.response.data;
          
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
          } else {
            errorMessage = errorData?.message || 
                          errorData?.error || 
                          error.response.statusText || 
                          `Failed to fetch labels (${status})`;
          }
          
          toast.dark(errorMessage, {
            transition: Slide,
            autoClose: status === 404 || status >= 500 ? 5000 : 3000,
          });
        } else if (error.request) {
          toast.dark("Network error: Unable to reach the server. Please check your connection.", {
            transition: Slide,
          });
        } else {
          toast.dark(`Error: ${error.message || "Failed to fetch labels. Please try again."}`, {
            transition: Slide,
          });
        }
        setLabelsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLabels();
  }, [selectedFilter, searchItem, location.key, navigate]);

  useEffect(() => {
    let filtered = labelsData;

    // Apply client-side search filter if API doesn't handle it
    if (searchItem?.trim() && !searchItem.includes("?")) {
      filtered = filtered.filter((item) =>
        item.label.toLowerCase().includes(searchItem.toLowerCase()) ||
        item.labelid.toLowerCase().includes(searchItem.toLowerCase()) ||
        (item.domain && item.domain.toLowerCase().includes(searchItem.toLowerCase())) ||
        (item.enterprise && item.enterprise.toLowerCase().includes(searchItem.toLowerCase()))
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
        navigate("/enterprise-catalog?tab=labels&section=all-labels");
      }, 2600);
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
    const token = localStorage.getItem("jwtToken");

    try {
      const response = await axios.post(
        `/api/labels/status?id=${labelId}&status=${apiStatus}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      // Handle response - API might return empty body or different structure
      const responseData = response.data || {};
      const isSuccess = response.status >= 200 && response.status < 300;
      
      if (isSuccess) {
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
              const params = new URLSearchParams();
              if (selectedFilter && selectedFilter.toLowerCase() !== "all" && selectedFilter.toLowerCase() !== "all-labels") {
                if (selectedFilter.toLowerCase() === "active-labels") {
                  params.append("status", "active");
                } else if (selectedFilter.toLowerCase() === "suspended-labels") {
                  params.append("status", "suspend");
                } else if (selectedFilter.toLowerCase() === "disabled-labels") {
                  params.append("status", "disable");
                }
              }
              if (searchItem?.trim()) {
                params.append("search", searchItem.trim());
              }
              const url = `/api/labels${params.toString() ? `?${params.toString()}` : ""}`;
              const res = await axios.get(url, {
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
                },
              });
              const responseData = res.data || {};
              const labelsArray = responseData.labels || res.data || [];
              if (Array.isArray(labelsArray)) {
                const statusDisplayMap = {
                  "active": "Active",
                  "suspend": "Suspended",
                  "disable": "Disabled",
                  "Active": "Active",
                  "Suspended": "Suspended",
                  "Disabled": "Disabled",
                };
                
                const mappedData = labelsArray.map((label) => {
                  const apiStatus = label.status || "active";
                  const displayStatus = statusDisplayMap[apiStatus] || "Active";
                  
                  // Display Enterprise Name if available, otherwise Enterprise ID
                  let enterpriseDisplay = "";
                  if (label.enterprise?.enterpriseName) {
                    enterpriseDisplay = label.enterprise.enterpriseName;
                  } else if (label.enterpriseId) {
                    enterpriseDisplay = `ENT-${String(label.enterpriseId).padStart(3, '0')}`;
                  } else if (label.enterprise?.enterpriseId) {
                    enterpriseDisplay = `ENT-${String(label.enterprise.enterpriseId).padStart(3, '0')}`;
                  }
                  
                  return {
                    id: label.labelId || 0,
                    labelid: `LAB-${String(label.labelId || 0).padStart(3, '0')}`,
                    label: label.labelName || "",
                    domain: label.domain || "",
                    planType: label.planType || "",
                    revenueShare: label.revenueShare ? `${label.revenueShare}%` : "",
                    qcRequired: label.qcRequired ? "Required" : "Not required",
                    enterprise: enterpriseDisplay,
                    status: displayStatus,
                    createdAt: label.createdAt || "",
                  };
                });
                setLabelsData(mappedData);
              }
            } catch (error) {
              console.error("Error refetching labels:", error);
            }
          };
          fetchLabels();
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
    { key: "labelid", label: "Label ID" },
    { key: "label", label: "Label Name" },
    { key: "domain", label: "Domain" },
    { key: "enterprise", label: "Enterprise" },
    { key: "planType", label: "Plan Type" },
    { key: "revenueShare", label: "Revenue Share" },
    { key: "qcRequired", label: "QC Required" },
    {
      key: "status",
      label: "Status",
      render: (item) => {
        const currentStatus = item.status || "Active";
        const pillClass = getStatusPillClass(currentStatus);
        
        if (actualRole === "SuperAdmin" || actualRole === "EnterpriseAdmin") {
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

export default Labels;

