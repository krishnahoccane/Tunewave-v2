import React, { useEffect } from "react";
import DataTable from "./DataTable";
import GridView from "./GridView";
import "../styles/TabComponents.css";
import "../styles/TableShared.css";

function ProducersTab({ searchTerm, showMode, setTableData, onSelectionChange }) {
  const producersData = [
    { id: 1, name: "Pritam", producerId: "PROD001", country: "India", image: "/src/assets/samplIcon.png" },
    { id: 2, name: "Max Martin", producerId: "PROD002", country: "Sweden", image: "/src/assets/samplIcon.png" }
  ];

  const columns = [
    {
      key: "name",
      label: "NAME",
      sortable: true,
      render: (item) => (
        <div className="title-cell">
          <img src={item.image} alt={item.name} className="release-image" />
          <span>{item.name}</span>
        </div>
      )
    },
    { key: "producerId", label: "PRODUCER ID", sortable: true },
    { key: "country", label: "COUNTRY", sortable: true }
  ];

  useEffect(() => {
    const filteredData = producersData.filter((item) =>
      item.name.toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
      item.country.toLowerCase().includes(searchTerm?.toLowerCase() || "")
    );
    setTableData(filteredData);
  }, [searchTerm, setTableData]);

  const filteredData = producersData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
    item.country.toLowerCase().includes(searchTerm?.toLowerCase() || "")
  );

  return (
    <div className="producers-tab">
      {showMode === "grid" ? (
        <GridView data={filteredData} />
      ) : (
        <DataTable data={filteredData} columns={columns} onSelectionChange={onSelectionChange} />
      )}
    </div>
  );
}

export default ProducersTab;
