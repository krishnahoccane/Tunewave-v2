import React, { useContext } from "react";
import "../styles/CatalogSidebar.css";
// import { RoleContext } from "../context/RoleContext";
import { useRole } from "../context/RoleContext";
function CatalogSidebar({ activeTab, setActiveTab }) {
  // const { role } = useContext(RoleContext);

  const { role } = useRole();
  const sidebarItems = [
    { id: "releases", label: "Releases", icon: "/src/assets/Releases.png" },
    { id: "tracks", label: "Tracks", icon: "/src/assets/Tracks.png" },
    { id: "videos", label: "Videos", icon: "/src/assets/Vector.png" },
  ];

  const contributionItems = [
    { id: "artists", label: "Artists", icon: "/src/assets/Artists.png" },
    { id: "performers", label: "Performers", icon: "/src/assets/Artists.png" },
    { id: "producers", label: "Producers & Engineers", icon: "/src/assets/Artists.png" },
    { id: "writers", label: "Writers", icon: "/src/assets/Artists.png" },
    { id: "publishers", label: "Publishers", icon: "/src/assets/Artists.png" },
    { id: "labels", label: "Labels", icon: "/src/assets/Labels.png" },
  ];

  //  Enterprise-only sections
  const enterpriseSections = [
    {
      title: "Enterprise",
      items: [
        { id: "create-new", label: "Create New" },
        { id: "approvals", label: "Approvals" },
      ],
    },
    {
      title: "QC",
      items: [
        { id: "qc1", label: "QC 1" },
        { id: "qc2", label: "QC 2" },
      ],
    },
    {
      title: "Billing",
      items: [
        { id: "billing1", label: "Billing 1" },
        { id: "billing2", label: "Billing 2" },
      ],
    },
    {
      title: "Analytics",
      items: [
        { id: "analytics1", label: "Analytics 1" },
        { id: "analytics2", label: "Analytics 2" },
      ],
    },
    {
      title: "System Config",
      items: [
        { id: "sysconfig1", label: "System Config 1" },
        { id: "sysconfig2", label: "System Config 2" },
      ],
    },
  ];

  return (
    <div className="catalog-sidebar">
      {/* ================= NORMAL USER SIDEBAR ================= */}
      {role === "normal" && (
        <>
          <h3>ASSETS</h3>
          <ul className="sidebar-list">
            {sidebarItems.map((item) => (
              <li
                key={item.id}
                className={activeTab === item.id ? "active" : ""}
                onClick={() => setActiveTab(item.id)}
              >
                {item.label}
              </li>
            ))}
          </ul>

          <h3>CONTRIBUTIONS</h3>
          <ul className="sidebar-list">
            {contributionItems.map((item) => (
              <li
                key={item.id}
                className={activeTab === item.id ? "active" : ""}
                onClick={() => setActiveTab(item.id)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* ================= ENTERPRISE USER SIDEBAR ================= */}
      {role === "enterprise" && (
        <>
          {enterpriseSections.map((section) => (
            <div key={section.title} className="enterprise-section">
              <h3>{section.title}</h3>
              <ul className="sidebar-list">
                {section.items.map((item) => (
                  <li
                    key={item.id}
                    className={activeTab === item.id ? "active" : ""}
                    onClick={() => setActiveTab(item.id)}
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default CatalogSidebar;
