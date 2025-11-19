
import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EnterpriseSidebar from "../components/enterpriseComponents/EnterpriseSidebar";

import QCTab from "../components/enterpriseComponents/QCTab";
import BillingTab from "../components/enterpriseComponents/BillingTab";
import SystemConfigTab from "../components/enterpriseComponents/SystemConfigTab";
import Enterprises from "../components/enterpriseComponents/Enterprises";
import Labels from "../components/enterpriseComponents/Labels";
import Artists from "../components/enterpriseComponents/Artists";
import TicketsTab from "../components/enterpriseComponents/TicketsTab";
import UsersTab from "../components/enterpriseComponents/UsersTab";
import DSPConfigTab from "../components/enterpriseComponents/DSPConfigTab";
import { useRole } from "../context/RoleContext";

import "../styles/CatalogPage.css";
import SearchIcon from "../assets/Vector.png";

import Download from "../assets/Download.svg";
import DownloadFull from "../assets/DownloadFill.svg";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function EnterpriseCatalogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showMode, setShowMode] = useState("list");
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const { actualRole } = useRole();
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const tab = queryParams.get("tab") || (actualRole === "SuperAdmin" ? "enterprises" : actualRole === "LabelAdmin" ? "artists" : "labels");
  
  // Get default section for each tab (first option in sidebar)
  const getDefaultSection = (tabName) => {
    const defaults = {
      enterprise: "all-enterprises",
      enterprises: "all-enterprises",
      labels: "all-labels",
      artists: "all-artists",
      qc: "all",
      billing: "all-invoices",
      "system-config": "settings",
      tickets: "open",
      users: "all-users",
      "dsp-config": "platforms",
    };
    return defaults[tabName] || "all";
  };
  
  const section = queryParams.get("section") || getDefaultSection(tab);
  
  // Initialize activeTab from URL section param
  const [activeTab, setActiveTab] = useState(section);

  // Sync activeTab with URL section param when it changes
  useEffect(() => {
    setActiveTab(section);
  }, [section]);

  // Compute section name
  const currentSection = useMemo(() => {
    const mapping = {
      enterprise: "Enterprises",
      enterprises: "Enterprises",
      labels: "Labels",
      artists: "Artists",
      qc: "QC",
      billing: "Billing",
      "system-config": "System Config",
      tickets: "Tickets",
      users: "Users",
      "dsp-config": "DSP Config",
    };
    return mapping[tab] || "Enterprise Catalog";
  }, [tab]);
  
  // Update URL when tab changes to include default section if no section is provided
  useEffect(() => {
    const currentSectionParam = new URLSearchParams(location.search).get("section");
    if (!currentSectionParam) {
      const defaultSection = getDefaultSection(tab);
      navigate(`/enterprise-catalog?tab=${tab}&section=${defaultSection}`, { replace: true });
    }
  }, [tab, navigate, location.search]);

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    return `"${String(val).replace(/"/g, '""')}"`;
  };

  const handleDownload = (type, scope = "all") => {
    const source = scope === "selected" && selectedRows.length > 0 ? selectedRows : tableData;
    if (!source || source.length === 0) return;

    // Remove non-serializable or undesired fields like images/functions
    const sanitized = source.map((row) => {
      const copy = { ...row };
      Object.keys(copy).forEach((k) => {
        if (typeof copy[k] === "function") delete copy[k];
      });
      if ("image" in copy) delete copy.image;
      return copy;
    });

    if (type === "csv") {
      const header = Object.keys(sanitized[0]);
      const csvContent =
        header.join(",") +
        "\n" +
        sanitized.map((r) => header.map((h) => escapeCSV(r[h])).join(",")).join("\n");
      saveAs(new Blob([csvContent], { type: "text/csv;charset=utf-8;" }), `enterprise-${scope}.csv`);
    } else if (type === "xls") {
      const ws = XLSX.utils.json_to_sheet(sanitized);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(new Blob([wbout], { type: "application/octet-stream" }), `enterprise-${scope}.xlsx`);
    }

    setDownloadOpen(false);
  };

  return (
    <div className="catalog-page">
      {/* HEADER */}
      <div className="catalog-header">
        <h2 className="catalog-title">{currentSection}</h2>
        <div className="search-box">
          <img src={SearchIcon} alt="search" className="search-icon" />
          <input
            type="text"
            className="input-box"
            placeholder={`Search in ${currentSection}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="catalog-icons" style={{ position: "relative" }}>
          <div className="download-wrapper">
            <button
              className="btn-img round"
              onClick={() => setDownloadOpen((p) => !p)}
              aria-label="Download"
            >
              <img
                src={downloadOpen ? DownloadFull : Download}
                alt="download"
              />
            </button>
            {downloadOpen && (
              <div className="download-menu">
                {selectedRows.length > 0 && (
                  <>
                    <button onClick={() => handleDownload("csv", "selected")}>
                      Download Selected CSV
                    </button>
                    <button onClick={() => handleDownload("xls", "selected")}>
                      Download Selected XLS
                    </button>
                    <hr />
                  </>
                )}
                <button onClick={() => handleDownload("csv", "all")}>
                  Download Full CSV
                </button>
                <button onClick={() => handleDownload("xls", "all")}>
                  Download Full XLS
                </button>
              </div>
            )}
            
          </div>
          {/* <button className="btn-gradient">Create Enterprise</button> */}
          {currentSection === "Enterprises" && actualRole === "SuperAdmin" && 
        <button className="btn-gradient" onClick={() => navigate("/enterprise-catalog/create-enterprise")}>Create Enterprise</button>}
          {currentSection === "Labels" && (actualRole === "EnterpriseAdmin" || actualRole === "LabelAdmin") && 
        <button className="btn-gradient" onClick={() => navigate("/enterprise-catalog/create-label")}>Create Label</button>}
          {currentSection === "Artists" && actualRole === "LabelAdmin" && 
        <button className="btn-gradient" onClick={() => navigate("/enterprise-catalog/create-artist")}>Create Artist</button>}
        </div>
      </div>

      {/* SIDEBAR */}
      <EnterpriseSidebar
        currentSection={currentSection}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navigate={navigate}
        tab={tab}
      />

      {/* MAIN CONTENT */}
      <div className="catalog-content">
        {(tab === "enterprise" || tab === "enterprises") && actualRole === "SuperAdmin" && (
          <Enterprises
            searchItem={searchTerm}
            showMode={showMode}
            setTable={setTableData}
            onSelectionChange={setSelectedRows}
            selectedFilter={activeTab}
          />
        )}
        {tab === "labels" && (actualRole === "EnterpriseAdmin" || actualRole === "LabelAdmin") && (
          <Labels
            searchItem={searchTerm}
            showMode={showMode}
            setTable={setTableData}
            onSelectionChange={setSelectedRows}
            selectedFilter={activeTab}
          />
        )}
        {tab === "artists" && actualRole === "LabelAdmin" && (
          <Artists
            searchItem={searchTerm}
            showMode={showMode}
            setTable={setTableData}
            onSelectionChange={setSelectedRows}
            selectedFilter={activeTab}
          />
        )}
        {tab === "qc" && (
          <QCTab
            searchTerm={searchTerm}
            showMode={showMode}
            setTableData={setTableData}
            onSelectionChange={setSelectedRows}
            selectedFilter={activeTab}
          />
        )}
        {tab === "billing" && (
          <BillingTab
            searchTerm={searchTerm}
            showMode={showMode}
            setTableData={setTableData}
            onSelectionChange={setSelectedRows}
            selectedFilter={activeTab}
          />
        )}
        {tab === "system-config" && (
          <SystemConfigTab
            searchTerm={searchTerm}
            showMode={showMode}
            setTableData={setTableData}
            onSelectionChange={setSelectedRows}
            selectedFilter={activeTab}
          />
        )}
        {tab === "tickets" && (
          <TicketsTab
            searchTerm={searchTerm}
            showMode={showMode}
            setTableData={setTableData}
            onSelectionChange={setSelectedRows}
            selectedFilter={activeTab}
          />
        )}
        {tab === "users" && (
          <UsersTab
            searchTerm={searchTerm}
            showMode={showMode}
            setTableData={setTableData}
            onSelectionChange={setSelectedRows}
            selectedFilter={activeTab}
          />
        )}
        {tab === "dsp-config" && (
          <DSPConfigTab
            searchTerm={searchTerm}
            showMode={showMode}
            setTableData={setTableData}
            onSelectionChange={setSelectedRows}
            selectedFilter={activeTab}
          />
        )}
      </div>
    </div>
  );
}

export default EnterpriseCatalogPage;
