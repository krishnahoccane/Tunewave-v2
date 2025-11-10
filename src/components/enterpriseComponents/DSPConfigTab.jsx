import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataTable from "../DataTable";
import GridView from "../GridView";
import "../../styles/TabComponents.css";
import "../../styles/TableShared.css";

function DSPConfigTab({ searchTerm, showMode, setTableData, onSelectionChange, selectedFilter }) {
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  const dspConfigData = useMemo(
    () => [
      { id: 1, dsp: "Spotify", status: "Active", lastSync: "2025-11-01", type: "Platform" },
      { id: 2, dsp: "Apple Music", status: "Inactive", lastSync: "2025-10-29", type: "Platform" },
      { id: 3, dsp: "YouTube Music", status: "Active", lastSync: "2025-11-02", type: "Platform" },
      { id: 4, dsp: "Amazon Music API", status: "Active", lastSync: "2025-11-01", type: "Integration" },
      { id: 5, dsp: "Tidal", status: "Active", lastSync: "2025-11-02", type: "Platform" },
    ],
    []
  );

  useEffect(() => {
    let filtered = dspConfigData;

    // ✅ Apply sidebar filter
    if (selectedFilter && selectedFilter.toLowerCase() !== "all") {
      if (selectedFilter.toLowerCase() === "status") {
        // Filter by status (Active/Inactive) - show all for status filter
        // This could be expanded to show only active or only inactive
        filtered = filtered;
      } else if (selectedFilter.toLowerCase() === "platforms") {
        filtered = filtered.filter((item) => item.type === "Platform");
      } else if (selectedFilter.toLowerCase() === "integrations") {
        filtered = filtered.filter((item) => item.type === "Integration");
      }
    }

    // ✅ Apply search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.dsp.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setTableData(filtered);

    // ✅ Toast + redirect if no results
    if (
      filtered.length === 0 &&
      selectedFilter &&
      selectedFilter.toLowerCase() !== "all"
    ) {
      toast.dark(`No records found under "${selectedFilter}"`, {
        position: "bottom-center",
        autoClose: 2500,
      });

      setTimeout(() => {
        navigate("/enterprise-catalog?tab=dsp-config&section=platforms");
      }, 2600);
    }
  }, [searchTerm, selectedFilter, dspConfigData, setTableData, navigate]);

  const columns = [
    { key: "dsp", label: "DSP NAME" },
    { key: "status", label: "STATUS" },
    { key: "lastSync", label: "LAST SYNC" },
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

export default DSPConfigTab;
