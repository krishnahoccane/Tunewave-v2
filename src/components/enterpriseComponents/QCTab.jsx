
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRole } from "../../context/RoleContext";
import axios from "axios";

import DataTable from "../DataTable";
import GridView from "../GridView";
import CopyButton from "../CopyButton";
import "../../styles/TabComponents.css";

function QCTab({ searchTerm, showMode, setTableData, onSelectionChange, selectedFilter }) {
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { actualRole } = useRole();

  // Get authentication headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("jwtToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // Get QC API endpoint based on role
  const getQCEndpoint = () => {
    if (actualRole === "SuperAdmin" || actualRole?.toLowerCase() === "superadmin") {
      return "/api/qc/queue/tunewave";
    } else if (actualRole === "EnterpriseAdmin" || actualRole?.toLowerCase() === "enterpriseadmin") {
      return "/api/qc/queue/Enterprise";
    } else if (actualRole === "LabelAdmin" || actualRole?.toLowerCase() === "labeladmin") {
      return "/api/qc/queue/label";
    }
    return "/api/qc/queue/label"; // Default fallback
  };

  // Fetch QC data from API
  useEffect(() => {
    const fetchQCData = async () => {
      try {
        setLoading(true);
        const endpoint = getQCEndpoint();
        const response = await axios.get(endpoint, {
          headers: getAuthHeaders(),
        });
        
        // Handle API response structure: { queue: [...], count: number, labelId/enterpriseId?: number }
        const responseData = response.data || {};
        const qcData = responseData.queue || responseData.data || (Array.isArray(response.data) ? response.data : []);
        
        console.log("QC API Response:", responseData);
        console.log("QC Data Array:", qcData);
        console.log("QC Data Length:", qcData?.length);
        console.log("First item sample:", qcData[0]);
        
        // If no data, set empty arrays and return early
        if (!qcData || qcData.length === 0) {
          console.log("No QC data found in API response");
          setFilteredData([]);
          setOriginalData([]);
          setTableData([]);
          setLoading(false);
          return;
        }
        
        // Transform API response to match expected format
        const transformedData = qcData.map((item, index) => {
          // Normalize status - check various possible field names and values
          let statusValue = item.status || item.qcStatus || item.releaseStatus || "Pending";
          
          // Normalize status value (handle case variations)
          if (statusValue) {
            statusValue = String(statusValue).trim();
            // Map common variations to standard values
            const statusLower = statusValue.toLowerCase();
            if (statusLower === "pending" || statusLower === "pending label" || statusLower === "pendinglabel") {
              statusValue = "Pending";
            } else if (statusLower === "approved" || statusLower === "approve") {
              statusValue = "Approved";
            } else if (statusLower === "rejected" || statusLower === "reject") {
              statusValue = "Rejected";
            } else {
              // Capitalize first letter
              statusValue = statusValue.charAt(0).toUpperCase() + statusValue.slice(1).toLowerCase();
            }
          } else {
            statusValue = "Pending";
          }
          
          // Create unique ID by combining releaseId and submittedAt (or index as fallback)
          // This ensures uniqueness even when multiple QC entries exist for the same release
          const uniqueId = item.submittedAt 
            ? `${item.releaseId || item.id || index}_${item.submittedAt}`
            : `${item.releaseId || item.id || index}_${index}`;
          
          return {
            // Include all other fields from API first
            ...item,
            // Then override with transformed values
            id: uniqueId, // Use unique ID to prevent duplicate keys
            releaseId: item.releaseId || item.id,
            report: item.title || item.report || item.name || `QC Report ${index + 1}`,
            qcId: item.qcId || `QC${String(item.releaseId || item.id || index + 1).padStart(4, "0")}`,
            status: statusValue, // Use normalized status
            reviewer: item.reviewer || item.reviewedBy || item.reviewerName || "N/A",
            submittedAt: item.submittedAt || item.submittedDate || item.createdAt || "",
            aiScore: item.aiScore,
            flagsSummary: item.flagsSummary,
          };
        });
        
        console.log("Transformed QC Data:", transformedData);
        console.log("Status values found:", transformedData.map(item => item.status));
        
        setFilteredData(transformedData);
        setOriginalData(transformedData);
        setTableData(transformedData);
      } catch (error) {
        console.error("Error fetching QC data:", error);
        const errorMessage = error.response?.data?.message || error.message || "Failed to load QC data";
        toast.error(errorMessage, {
          position: "bottom-center",
          autoClose: 3000,
        });
        // Set empty data on error - no mock data fallback
        setFilteredData([]);
        setOriginalData([]);
        setTableData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQCData();
  }, [actualRole, setTableData]);

  // Store original data separately for filtering
  const [originalData, setOriginalData] = useState([]);

  useEffect(() => {
    if (loading || originalData.length === 0) return;
    
    let filtered = [...originalData];

    // ✅ Apply filter only if not "All"
    if (selectedFilter && selectedFilter.toLowerCase() !== "all") {
      filtered = filtered.filter(
        (item) =>
          item.status.toLowerCase() === selectedFilter.toLowerCase()
      );
    }

    // ✅ Apply search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.report.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setTableData(filtered);

    // ✅ Toast + redirect if no results
    if (filtered.length === 0 && selectedFilter && selectedFilter.toLowerCase() !== "all" &&
      selectedFilter.toLowerCase() !== "all-invoices" &&
      selectedFilter.toLowerCase() !== "all-enterprises") {
      toast.dark(`No records found under "${selectedFilter}"`, {
        position: "bottom-center",
        autoClose: 2500,
      });

      setTimeout(() => {
        navigate("/enterprise-catalog?tab=qc");
      }, 2600);
    }
  }, [searchTerm, selectedFilter, originalData, loading, setTableData, navigate]);

  const handleRowClick = (item) => {
    // Pass the full item data to the detail page
    // The detail page will use the API data or transform it as needed
    navigate("/qc-detail", {
      state: {
        trackData: item, // Pass the full QC item data
        qcItem: item,
        releaseId: item.releaseId || item.id,
      },
    });
  };

  const columns = [
    { 
      key: "report", 
      label: "REPORT NAME",
      render: (item) => <span>{item.report || item.title || "N/A"}</span>
    },
    { 
      key: "qcId", 
      label: "QC ID",
      render: (item) => (
        <div className="copy-cell">
          <span>{item.qcId || `QC${String(item.releaseId || item.id || 0).padStart(4, "0")}`}</span>
          <CopyButton text={item.qcId || `QC${String(item.releaseId || item.id || 0).padStart(4, "0")}`} />
        </div>
      )
    },
    { 
      key: "status", 
      label: "STATUS",
      render: (item) => <span>{item.status || "Pending"}</span>
    },
    {
      key: "submittedAt",
      label: "SUBMITTED AT",
      render: (item) => {
        if (!item.submittedAt) return <span>N/A</span>;
        try {
          const date = new Date(item.submittedAt);
          return <span>{date.toLocaleDateString()} {date.toLocaleTimeString()}</span>;
        } catch {
          return <span>{item.submittedAt}</span>;
        }
      }
    },
    {
      key: "reviewer",
      label: "REVIEWER",
      render: (item) => (
        <div className="copy-cell">
          <span>{item.reviewer || item.reviewedBy || "N/A"}</span>
          {item.reviewer && <CopyButton text={item.reviewer} />}
        </div>
      ),
    },
  ];

  return (
    <div className="tab-content">
      {loading ? (
        <div className="loading-container">Loading QC data...</div>
      ) : showMode === "grid" ? (
        <GridView data={filteredData} />
      ) : filteredData.length === 0 ? (
        // Show table structure with "No Queue" message - same as SuperAdmin
        <div className="data-table-container">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.key}>
                      <span>{column.label}</span>
                    </th>
                  ))}
                  <th />
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={columns.length + 1} style={{ textAlign: "center", padding: "40px 20px" }}>
                    <div style={{ fontSize: "16px", color: "#666" }}>No Queue</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <DataTable
          data={filteredData}
          columns={columns}
          onSelectionChange={onSelectionChange}
          onRowClick={handleRowClick}
        />
      )}

      <ToastContainer />
    </div>
  );
}

export default QCTab;
