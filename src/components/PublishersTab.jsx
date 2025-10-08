import React, { useEffect } from "react";
import DataTable from "./DataTable";
import GridView from "./GridView";
import CopyButton from "./CopyButton";
import "../styles/TabComponents.css";
import "../styles/TableShared.css";

function PublishersTab({searchTerm, showMode, setTableData, onSelectionChange}) {

  const publishersData = [
    {
      id: 1,
      name: "Universal Music Publishing",
      publisherId: "PUB001",
      country: "United States",
      ipiCae: "00123456789",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 2,
      name: "Sony Music Publishing",
      publisherId: "PUB002",
      country: "Japan",
      ipiCae: "00123456790",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 3,
      name: "Warner Chappell Music",
      publisherId: "PUB003",
      country: "United Kingdom",
      ipiCae: "00123456791",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 4,
      name: "EMI Music Publishing",
      publisherId: "PUB004",
      country: "Canada",
      ipiCae: "00123456792",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 5,
      name: "BMG Rights Management",
      publisherId: "PUB005",
      country: "Germany",
      ipiCae: "00123456793",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 6,
      name: "Universal Music Publishing",
      publisherId: "PUB001",
      country: "United States",
      ipiCae: "00123456789",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 7,
      name: "Sony Music Publishing",
      publisherId: "PUB002",
      country: "Japan",
      ipiCae: "00123456790",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 8,
      name: "Warner Chappell Music",
      publisherId: "PUB003",
      country: "United Kingdom",
      ipiCae: "00123456791",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 9,
      name: "EMI Music Publishing",
      publisherId: "PUB004",
      country: "Canada",
      ipiCae: "00123456792",
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 10,
      name: "BMG Rights Management",
      publisherId: "PUB005",
      country: "Germany",
      ipiCae: "00123456793",
      image: "/src/assets/samplIcon.png"
    }
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
    { key: "publisherId", label: "PUBLISHER ID", sortable: true },
    { key: "country", label: "COUNTRY", sortable: true },
    {
      key: "ipiCae",
      label: "IPI/CAE",
      sortable: true,
      render: (item) => (
        <div className="copy-cell">
          <span>{item.ipiCae}</span>
          <CopyButton text={item.ipiCae} />
        </div>
      )
    }
  ];

  useEffect(() => {
    const filtered = publishersData.filter((item) =>
      item.name.toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
      item.country.toLowerCase().includes(searchTerm?.toLowerCase() || "")
    );
    setTableData(filtered);
  }, [searchTerm, setTableData]);

  const filteredData = publishersData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
    item.country.toLowerCase().includes(searchTerm?.toLowerCase() || "")
  );

  return (
    <div className="publishers-tab">
      {showMode === "grid" ? (
        <GridView data={filteredData} />
      ) : (
        <DataTable data={filteredData} columns={columns} onSelectionChange={onSelectionChange} />
      )}
    </div>
  );
}

export default PublishersTab;
