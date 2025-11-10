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

  // ✅ Mock enterprise data
  const enterprisesData = useMemo(
    () => [
      { id: 1, enterpriseid: "ENT-001", enterprise: "Shiva Pvt Ltd", status: "Active" },
      { id: 2, enterpriseid: "ENT-002", enterprise: "Deepu Industries", status: "Inactive" },
      { id: 3, enterpriseid: "ENT-003", enterprise: "Ram Solutions", status: "Active" },
      { id: 4, enterpriseid: "ENT-004", enterprise: "Priya Enterprises", status: "Active" },
      { id: 5, enterpriseid: "ENT-005", enterprise: "Venn Labs", status: "Inactive" },
    ],
    []
  );

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
      }
    }

    // ✅ Apply search filter
    if (searchItem?.trim()) {
      filtered = filtered.filter((item) =>
        item.enterprise.toLowerCase().includes(searchItem.toLowerCase())
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
