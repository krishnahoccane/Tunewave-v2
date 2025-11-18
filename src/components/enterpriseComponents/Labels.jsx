import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import DataTable from "../DataTable";
import GridView from "../GridView";
import "../../styles/TabComponents.css";
import "../../styles/TableShared.css";

function Labels({ searchItem, showMode, setTable, onSelectionChange, selectedFilter }) {
  const [filteredData, setFilteredData] = useState([]);
  const [labelsData, setLabelsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const toastShownRef = useRef(false);
  const lastFilterRef = useRef("");

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
            
            return {
              id: label.labelId || 0,
              labelid: `LAB-${String(label.labelId || 0).padStart(3, '0')}`,
              label: label.labelName || "",
              domain: label.domain || "",
              planType: label.planType || "",
              revenueShare: label.revenueShare ? `${label.revenueShare}%` : "",
              qcRequired: label.qcRequired ? "Required" : "Not required",
              enterprise: label.enterprise?.enterpriseName || "",
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

  const columns = [
    { key: "labelid", label: "Label ID" },
    { key: "label", label: "Label Name" },
    { key: "domain", label: "Domain" },
    { key: "enterprise", label: "Enterprise" },
    { key: "planType", label: "Plan Type" },
    { key: "revenueShare", label: "Revenue Share" },
    { key: "qcRequired", label: "QC Required" },
    { key: "status", label: "Status" },
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

