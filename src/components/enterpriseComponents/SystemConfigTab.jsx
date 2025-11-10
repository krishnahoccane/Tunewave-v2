// import React, { useEffect, useMemo } from "react";
// import DataTable from "../DataTable";
// import GridView from "../GridView";
// import CopyButton from "../CopyButton";
// import "../../styles/TabComponents.css";
// import "../../styles/TableShared.css";

// function SystemConfigTab({ searchTerm, showMode, setTableData, onSelectionChange }) {
//   const sysConfigData = useMemo(
//     () => [
//       { id: 1, setting: "Theme", value: "Dark", updatedBy: "Admin" },
//       { id: 2, setting: "Auto Sync", value: "Enabled", updatedBy: "System" },
//       { id: 3, setting: "Backup Interval", value: "Every 6 Hours", updatedBy: "Admin" },
//       { id: 4, setting: "Language", value: "English (US)", updatedBy: "Admin" },
//     ],
//     []
//   );

//   // Filtering logic (like in QCTab)
//   const filteredData = sysConfigData.filter((item) =>
//     item.setting.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Update table data in parent when filtered data changes
//   useEffect(() => {
//     setTableData(filteredData);
//   }, [filteredData, setTableData]);

//   const columns = [
//     { key: "setting", label: "SETTING" },
//     { key: "value", label: "VALUE" },
//     {
//       key: "updatedBy",
//       label: "UPDATED BY",
//       render: (item) => (
//         <div className="copy-cell">
//           <span>{item.updatedBy}</span>
//           <CopyButton text={item.updatedBy} />
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="tab-content">
//       {showMode === "grid" ? (
//         <GridView data={filteredData} />
//       ) : (
//         <DataTable
//           data={filteredData}
//           columns={columns}
//           onSelectionChange={onSelectionChange}
//         />
//       )}
//     </div>
//   );
// }

// export default SystemConfigTab;
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import DataTable from "../DataTable";
import GridView from "../GridView";
import CopyButton from "../CopyButton";
import "../../styles/TabComponents.css";
import "../../styles/TableShared.css";

function SystemConfigTab({ searchTerm, showMode, setTableData, onSelectionChange, selectedFilter }) {
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  const sysConfigData = useMemo(
    () => [
      { id: 1, setting: "Theme", value: "Dark", status: "Active", category: "settings", updatedBy: "Admin" },
      { id: 2, setting: "Auto Sync", value: "Enabled", status: "Active", category: "settings", updatedBy: "System" },
      { id: 3, setting: "Backup Interval", value: "Every 6 Hours", status: "Active", category: "settings", updatedBy: "Admin" },
      { id: 4, setting: "Language", value: "English (US)", status: "Active", category: "settings", updatedBy: "Admin" },
      { id: 5, setting: "User Roles", value: "Admin, Editor, Viewer", status: "Active", category: "permissions", updatedBy: "Admin" },
      { id: 6, setting: "Access Control", value: "Enabled", status: "Active", category: "permissions", updatedBy: "Admin" },
      { id: 7, setting: "API Keys", value: "3 Active", status: "Active", category: "permissions", updatedBy: "Admin" },
      { id: 8, setting: "Audit Logs", value: "Enabled", status: "Active", category: "logs", updatedBy: "System" },
      { id: 9, setting: "Error Logs", value: "Enabled", status: "Active", category: "logs", updatedBy: "System" },
      { id: 10, setting: "Activity Logs", value: "Last 30 days", status: "Active", category: "logs", updatedBy: "System" },
    ],
    []
  );

  useEffect(() => {
    let filtered = sysConfigData;

    // ✅ Apply filter by category (settings, permissions, logs)
    if (selectedFilter && selectedFilter.toLowerCase() !== "all") {
      filtered = filtered.filter(
        (item) => item.category.toLowerCase() === selectedFilter.toLowerCase()
      );
    }

    // ✅ Apply search term on "setting"
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.setting.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setTableData(filtered);

    // ✅ Toast + redirect if no results
    if (filtered.length === 0 && selectedFilter && selectedFilter.toLowerCase() !== "all") {
      toast.dark(`No records found under "${selectedFilter}"`, {
        position: "bottom-center",
        autoClose: 2500,
      });

      setTimeout(() => {
        navigate("/enterprise-catalog?tab=system-config&section=settings");
      }, 2600);
    }
  }, [searchTerm, selectedFilter, sysConfigData, setTableData, navigate]);

  const columns = [
    { key: "setting", label: "SETTING" },
    { key: "value", label: "VALUE" },
    { key: "status", label: "STATUS" },
    {
      key: "updatedBy",
      label: "UPDATED BY",
      render: (item) => (
        <div className="copy-cell">
          <span>{item.updatedBy}</span>
          <CopyButton text={item.updatedBy} />
        </div>
      ),
    },
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

export default SystemConfigTab;
