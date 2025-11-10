import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataTable from "../DataTable";
import GridView from "../GridView";
import "../../styles/TabComponents.css";
import "../../styles/TableShared.css";

function UsersTab({ searchTerm, showMode, setTableData, onSelectionChange, selectedFilter }) {
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  const usersData = useMemo(
    () => [
       { id: 4, name: "Priya", role: "Editor", status: "Active" },
      { id: 5, name: "Amit", role: "Viewer", status: "Inactive" },
    { id: 1, name: "Shiva", role: "Admin", status: "Active" },
      { id: 2, name: "Kavya", role: "Editor", status: "Inactive" },
      { id: 3, name: "Rahul", role: "Viewer", status: "Active" },
     ],
    []
  );

  useEffect(() => {
    let filtered = usersData;

    // ✅ Apply sidebar filter (map filter IDs to status values)
    if (selectedFilter && selectedFilter.toLowerCase() !== "all" && selectedFilter.toLowerCase() !== "all-users") {
      const filterMap = {
        "active-users": "Active",
        "inactive-users": "Inactive",
      };
      
      const statusToMatch = filterMap[selectedFilter.toLowerCase()];
      if (statusToMatch) {
        filtered = filtered.filter((item) => 
          item.status.toLowerCase() === statusToMatch.toLowerCase()
        );
      }
    }

    // ✅ Apply search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setTableData(filtered);

    // ✅ Toast + redirect if no results
    if (
      filtered.length === 0 &&
      selectedFilter &&
      selectedFilter.toLowerCase() !== "all" &&
      selectedFilter.toLowerCase() !== "all-users"
    ) {
      toast.dark(`No records found under "${selectedFilter}"`, {
        position: "bottom-center",
        autoClose: 2500,
      });

      setTimeout(() => {
        navigate("/enterprise-catalog?tab=users&section=all-users");
      }, 2600);
    }
  }, [searchTerm, selectedFilter, usersData, setTableData, navigate]);

  const columns = [
    { key: "name", label: "NAME" },
    { key: "role", label: "ROLE" },
    { key: "status", label: "STATUS" },
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

export default UsersTab;
