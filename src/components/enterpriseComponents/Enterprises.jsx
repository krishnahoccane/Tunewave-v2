import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import DataTable from "../DataTable";
import GridView from "../GridView";
import "../../styles/TabComponents.css";
import "../../styles/TableShared.css";

function Enterprises({ searchItem, showMode, setTable, onSelectionChange, selectedFilter }) {
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  // ✅ Mock enterprise data (matching API structure)
  const enterprisesData = useMemo(
    () => [
      { 
        id: 1, 
        enterpriseid: "ENT-001", 
        enterprise: "Shiva Pvt Ltd", 
        domain: "shiva.com",
        revenueShare: "70%",
        qcRequired: "Required",
        status: "Active" 
      },
      { 
        id: 2, 
        enterpriseid: "ENT-002", 
        enterprise: "Deepu Industries", 
        domain: "deepu.com",
        revenueShare: "65%",
        qcRequired: "Not required",
        status: "Inactive" 
      },
      { 
        id: 3, 
        enterpriseid: "ENT-003", 
        enterprise: "Ram Solutions", 
        domain: "ram.com",
        revenueShare: "75%",
        qcRequired: "Required",
        status: "Active" 
      },
      { 
        id: 4, 
        enterpriseid: "ENT-004", 
        enterprise: "Priya Enterprises", 
        domain: "priya.com",
        revenueShare: "80%",
        qcRequired: "Required",
        status: "Active" 
      },
      { 
        id: 5, 
        enterpriseid: "ENT-005", 
        enterprise: "Venn Labs", 
        domain: "venn.com",
        revenueShare: "60%",
        qcRequired: "Not required",
        status: "Inactive" 
      },
      { 
        id: 6, 
        enterpriseid: "ENT-006", 
        enterprise: "gp Enterprises", 
        domain: "gp.com",
        revenueShare: "55%",
        qcRequired: "Required",
        status: "Suspended" 
      },
      { 
        id: 7, 
        enterpriseid: "ENT-007", 
        enterprise: "xyz Labs", 
        domain: "xyz.com",
        revenueShare: "50%",
        qcRequired: "Not required",
        status: "Suspended" 
      },
    ],
    []
  );

  // TODO: Uncomment below to fetch from API instead of using mock data
  // useEffect(() => {
  //   const fetchEnterprises = async () => {
  //     const token = localStorage.getItem("jwtToken");
  //     
  //     try {
  //       const response = await fetch("https://spacestation.tunewave.in/api/Enterprise", {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           ...(token && { Authorization: `Bearer ${token}` }),
  //         },
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         
  //         // Map API response to component format
  //         const mappedData = Array.isArray(data) ? data.map((enterprise, index) => ({
  //           id: enterprise.enterpriseID || index + 1,
  //           enterpriseid: `ENT-${String(enterprise.enterpriseID || index + 1).padStart(3, '0')}`,
  //           enterprise: enterprise.enterpriseName || "",
  //           domain: enterprise.domain || "",
  //           revenueShare: enterprise.revenueShare ? `${enterprise.revenueShare}%` : "0%",
  //           qcRequired: enterprise.qcRequired ? "Required" : "Not required",
  //           status: enterprise.status || "Active",
  //           createdBy: enterprise.createdBy || 0,
  //           createdAt: enterprise.createdAt || "",
  //           updatedAt: enterprise.updatedAt || "",
  //         })) : [];
  //         
  //         setEnterprisesData(mappedData);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching enterprises:", error);
  //     }
  //   };

  //   fetchEnterprises();
  // }, []);

  useEffect(() => {
    let filtered = enterprisesData;

    // ✅ Sidebar filter handling
    if (
      selectedFilter &&
      selectedFilter.toLowerCase() !== "all" &&
      selectedFilter.toLowerCase() !== "all-enterprises"
    ) {
      if (selectedFilter.toLowerCase() === "active-enterprises") {
        filtered = filtered.filter((item) => item.status.toLowerCase() === "active");
      } else if (selectedFilter.toLowerCase() === "inactive-enterprises") {
        filtered = filtered.filter((item) => item.status.toLowerCase() === "inactive");
      } else if(selectedFilter.toLowerCase() === "suspended-enterprises"){
        filtered = filtered.filter((item) => item.status.toLowerCase() === "suspended");
      }
    }

    // ✅ Apply search filter
    if (searchItem?.trim()) {
      filtered = filtered.filter((item) =>
        item.enterprise.toLowerCase().includes(searchItem.toLowerCase()) ||
        item.enterpriseid.toLowerCase().includes(searchItem.toLowerCase()) ||
        (item.domain && item.domain.toLowerCase().includes(searchItem.toLowerCase()))
      );
    }

    setFilteredData(filtered);
    setTable(filtered);

    // ✅ Toast + redirect if no results
    if (
      filtered.length === 0 &&
      selectedFilter &&
      selectedFilter.toLowerCase() !== "all" &&
      selectedFilter.toLowerCase() !== "all-enterprises"
    ) {
      toast.dark(`No records found under "${selectedFilter}"`, {
        position: "bottom-center",
        autoClose: 2500,
      });

      setTimeout(() => {
        navigate("/enterprise-catalog?tab=enterprise&section=all-enterprises");
      }, 2600);
    }
  }, [searchItem, selectedFilter, enterprisesData, setTable, navigate]);

  const columns = [
    { key: "enterpriseid", label: "Enterprise ID" },
    { key: "enterprise", label: "Enterprise" },
    { key: "domain", label: "Domain" },
    { key: "revenueShare", label: "Revenue Share" },
    { key: "qcRequired", label: "QC Required" },
    { key: "status", label: "Status" },
  ];

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
      <ToastContainer />
    </div>
  );
}

export default Enterprises;
