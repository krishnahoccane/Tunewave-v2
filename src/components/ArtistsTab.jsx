import React, { useState, useEffect } from "react";
import DataTable from "./DataTable";
import GridView from "./GridView";
import CopyButton from "./CopyButton";
import "../styles/ArtistsTab.css";
import "../styles/TabComponents.css";
import "../styles/TableShared.css";


function ArtistsTab({searchTerm, showMode, setTableData, onSelectionChange}) {


  // Sample data for artists
  const artistsData = [
    {
      id: 1,
      name: "Krishna Das",
      legalName: "Krishna Das Sharma",
      artistId: "ART001",
      isni: "0000000123456789",
      releases: 12,
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 2,
      name: "Anita Sharma",
      legalName: "Anita Sharma Patel",
      artistId: "ART002",
      isni: "0000000123456790",
      releases: 8,
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 3,
      name: "Raj Patel",
      legalName: "Rajesh Kumar Patel",
      artistId: "ART003",
      isni: "0000000123456791",
      releases: 5,
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 4,
      name: "Maya Singh",
      legalName: "Maya Singh Rajput",
      artistId: "ART004",
      isni: "0000000123456792",
      releases: 15,
      image: "/src/assets/samplIcon.png"
    },
    {
      id: 5,
      name: "Ahmed Khan",
      legalName: "Ahmed Ali Khan",
      artistId: "ART005",
      isni: "0000000123456793",
      releases: 7,
      image: "/src/assets/samplIcon.png"
    },
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
    {
      key: "legalName",
      label: "LEGAL NAME",
      sortable: true
    },
    {
      key: "artistId",
      label: "ARTIST ID",
      sortable: true
    },
    {
      key: "isni",
      label: "ISNI",
      sortable: true,
      render: (item) => (
        <div className="copy-cell">
          <span>{item.isni}</span>
          <CopyButton text={item.isni} />
        </div>
      )
    },
    {
      key: "releases",
      label: "RELEASES",
      sortable: true,
      render: (item) => (
        <span>{item.releases} release{item.releases !== 1 ? "s" : ""}</span>
      )
    }
  ];

  useEffect(() => {
  const filtered = artistsData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
      item.legalName.toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
      item.artistId.toLowerCase().includes(searchTerm?.toLowerCase() || "")
  );
  setTableData(filtered);
}, [searchTerm, setTableData]);

const filteredData = artistsData.filter(
  (item) =>
    item.name.toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
    item.legalName.toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
    item.artistId.toLowerCase().includes(searchTerm?.toLowerCase() || "")
);


  return (
    <div className="artists-tab">
      {
       showMode==="grid" ? <GridView data={filteredData} /> :  <DataTable data={filteredData} columns={columns} onSelectionChange={onSelectionChange} />
      } 
    </div>
  );
}

export default ArtistsTab;
