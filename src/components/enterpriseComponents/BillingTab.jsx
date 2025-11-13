

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import DataTable from "../DataTable";
import GridView from "../GridView";
import "../../styles/TabComponents.css";
import "../../styles/TableShared.css";

function BillingTab({ searchTerm, showMode, setTableData, onSelectionChange, selectedFilter }) {
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  const billingData = useMemo(
    () => [
      {
        id: 1,
        invoice: "INV001",
        customer: "TechCorp",
        amount: "$1200",
        date: "2025-01-15",
        status: "Pending Payments",
      },
      {
        id: 2,
        invoice: "INV002",
        customer: "DataWorks",
        amount: "$980",
        date: "2025-02-10",
        status: "Completed",
      },
      {
        id: 3,
        invoice: "INV003",
        customer: "NextGen Labs",
        amount: "$2500",
        date: "2025-03-12",
        status: "Pending Payments",
      },
      {
        id: 4,
        invoice: "INV004",
        customer: "CodeSync",
        amount: "$1890",
        date: "2025-04-05",
        status: "Completed",
      },
    ],
    []
  );

  useEffect(() => {
    let filtered = billingData;

    // ✅ Apply sidebar filter (only if not "All" or "All Invoices")
    if (
      selectedFilter &&
      selectedFilter.toLowerCase() !== "all" &&
      selectedFilter.toLowerCase() !== "all-invoices"
    ) {
      // Map filter IDs to status values
      const filterMap = {
        "pending-payments": "Pending Payments",
        "completed": "Completed",
      };
      
      const statusToMatch = filterMap[selectedFilter.toLowerCase()];
      if (statusToMatch) {
        filtered = filtered.filter(
          (item) => item.status.toLowerCase() === statusToMatch.toLowerCase()
        );
      }
    }

    // ✅ Apply search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.customer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setTableData(filtered);

    // ✅ Toast + redirect if no results (just like QCTab)
    if (
      filtered.length === 0 &&
      selectedFilter &&
      selectedFilter.toLowerCase() !== "all" &&
      selectedFilter.toLowerCase() !== "all-invoices" &&
      selectedFilter.toLowerCase() !== "all-enterprises"

    ) {
      toast.dark(`No records found under "${selectedFilter}"`, {
        position: "bottom-center",
        autoClose: 2500,
      });

      setTimeout(() => {
        navigate("/enterprise-catalog?tab=billing&section=all-invoices");
      }, 2600);
    }
  }, [searchTerm, selectedFilter, billingData, setTableData, navigate]);

  const columns = [
    { key: "invoice", label: "INVOICE ID" },
    { key: "customer", label: "CUSTOMER" },
    { key: "amount", label: "AMOUNT" },
    { key: "date", label: "DATE" },
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

export default BillingTab;
