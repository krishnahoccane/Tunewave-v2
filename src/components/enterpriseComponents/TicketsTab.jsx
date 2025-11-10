import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataTable from "../DataTable";
import GridView from "../GridView";
import "../../styles/TabComponents.css";
import "../../styles/TableShared.css";

function TicketsTab({ searchTerm, showMode, setTableData, onSelectionChange, selectedFilter }) {
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  const ticketsData = useMemo(
    () => [
      { id: 1, ticketId: "TCK1001", subject: "Login Issue", status: "Closed" },
      { id: 2, ticketId: "TCK1002", subject: "Payment Failed", status: "Open" },
      { id: 3, ticketId: "TCK1003", subject: "Account Setup", status: "In Progress" },
      { id: 4, ticketId: "TCK1004", subject: "Feature Request", status: "Open" },
      { id: 5, ticketId: "TCK1005", subject: "Bug Report", status: "Closed" },
    ],
    []
  );

  useEffect(() => {
    let filtered = ticketsData;

    // ✅ Apply sidebar filter (map filter IDs to status values)
    if (selectedFilter && selectedFilter.toLowerCase() !== "all") {
      const filterMap = {
        "open": "Open",
        "in-progress": "In Progress",
        "closed": "Closed",
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
        item.subject.toLowerCase().includes(searchTerm.toLowerCase())
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
        navigate("/enterprise-catalog?tab=tickets&section=open");
      }, 2600);
    }
  }, [searchTerm, selectedFilter, ticketsData, setTableData, navigate]);

  const columns = [
    { key: "ticketId", label: "TICKET ID" },
    { key: "subject", label: "SUBJECT" },
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

export default TicketsTab;
