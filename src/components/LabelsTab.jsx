import React, { useEffect } from "react";
import DataTable from "./DataTable";
import GridView from "./GridView";
import "../styles/TabComponents.css";
import "../styles/TableShared.css";

function LabelsTab({searchTerm, showMode, setTableData, onSelectionChange}) {

  const labelsData = [
    { id: 1, name: "Sony Music", labelId: "LAB001", country: "Japan", image: "/src/assets/samplIcon.png" },
    { id: 2, name: "Universal Music", labelId: "LAB002", country: "USA", image: "/src/assets/samplIcon.png" },
    { id: 3, name: "Warner Music", labelId: "LAB003", country: "UK", image: "/src/assets/samplIcon.png" }
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
    { key: "labelId", label: "LABEL ID", sortable: true },
    { key: "country", label: "COUNTRY", sortable: true }
  ];

  useEffect(() => {
    const filtered = labelsData.filter((item) =>
      item.name.toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
      item.country.toLowerCase().includes(searchTerm?.toLowerCase() || "")
    );
    setTableData(filtered);
  }, [searchTerm, setTableData]);

  const filteredData = labelsData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
    item.country.toLowerCase().includes(searchTerm?.toLowerCase() || "")
  );

  return (
    <div className="labels-tab">
      {
        showMode === "grid"
          ? <GridView data={filteredData} />
          : <DataTable data={filteredData} columns={columns} onSelectionChange={onSelectionChange} />
      }
    </div>
  );
}

export default LabelsTab;
