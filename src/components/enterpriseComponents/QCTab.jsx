
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import DataTable from "../DataTable";
import GridView from "../GridView";
import CopyButton from "../CopyButton";
import "../../styles/TabComponents.css";

function QCTab({ searchTerm, showMode, setTableData, onSelectionChange, selectedFilter }) {
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  const qcData = useMemo(
    () => [
      { id: 1, report: "QC Report 1", qcId: "QC001", status: "Pending", reviewer: "John" },
      { id: 2, report: "QC Report 2", qcId: "QC002", status: "Reverted", reviewer: "Emma" },
      { id: 3, report: "QC Report 3", qcId: "QC003", status: "Drafts", reviewer: "Noah" },
      { id: 4, report: "QC Report 4", qcId: "QC004", status: "Rejected", reviewer: "Ava" },
      { id: 5, report: "QC Report 5", qcId: "QC005", status: "Metadata Issue", reviewer: "Liam" },
      { id: 6, report: "QC Report 6", qcId: "QC006", status: "Artwork Issue", reviewer: "Mia" },
      { id: 7, report: "QC Report 7", qcId: "QC007", status: "Audio Issue", reviewer: "Sophia" },
      { id: 8, report: "QC Report 8", qcId: "QC008", status: "Copyright Conflict", reviewer: "Ethan" },
    ],
    []
  );

  useEffect(() => {
    let filtered = qcData;

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
    if (filtered.length === 0 && selectedFilter && selectedFilter.toLowerCase() !== "all") {
      toast.dark(`No records found under "${selectedFilter}"`, {
        position: "bottom-center",
        autoClose: 2500,
      });

      setTimeout(() => {
        navigate("/enterprise-catalog?tab=qc");
      }, 2600);
    }
  }, [searchTerm, selectedFilter, qcData, setTableData, navigate]);

  const columns = [
    { key: "report", label: "REPORT NAME" },
    { key: "qcId", label: "QC ID" },
    { key: "status", label: "STATUS" },
    {
      key: "reviewer",
      label: "REVIEWER",
      render: (item) => (
        <div className="copy-cell">
          <span>{item.reviewer}</span>
          <CopyButton text={item.reviewer} />
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

export default QCTab;
