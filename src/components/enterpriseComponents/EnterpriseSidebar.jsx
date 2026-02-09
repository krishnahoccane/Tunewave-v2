
import { useNavigate } from "react-router-dom";
import "../../styles/CatalogSidebar.css";

function EnterpriseSidebar({ activeTab, setActiveTab, currentSection, tab }) {
  const navigate = useNavigate();

  // Section-wise sidebar menus (Releases is shown only inside Artists page, not as top-level tab)
  const enterpriseSections = {
    Enterprises: [
      { id: "all-enterprises", label: "All Enterprises" },
      { id: "active-enterprises", label: "Active Enterprises" },
      { id: "suspended-enterprises", label: "Suspended Enterprises" },
      { id: "disabled-enterprises", label: "Disabled Enterprises" },
    ],
    Labels: [
      { id: "all-labels", label: "All Labels" },
      { id: "active-labels", label: "Active Labels" },
      { id: "suspended-labels", label: "Suspended Labels" },
      { id: "disabled-labels", label: "Disabled Labels" },
    ],
    Artists: [
      { id: "all-artists", label: "All Artists" },
      { id: "active-artists", label: "Active Artists" },
      { id: "suspended-artists", label: "Suspended Artists" },
      { id: "disabled-artists", label: "Disabled Artists" },
    ],
    Releases: [
      { id: "all-releases", label: "All Releases" },
      { id: "drafts", label: "Drafts" },
      { id: "pending", label: "Pending" },
      { id: "live", label: "Live" },
      { id: "taken-down", label: "Taken Down" },
      { id: "rejected", label: "Rejected" },
    ],
    QC: [
      { id: "all", label: "All" },
      { id: "pending", label: "Pending" },
      { id: "reverted", label: "Reverted" },
      { id: "drafts", label: "Drafts" },
      { id: "rejected", label: "Rejected" },
      { id: "metadata-issue", label: "Metadata Issue" },
      { id: "artwork-issue", label: "Artwork Issue" },
      { id: "audio-issue", label: "Audio Issue" },
      { id: "copyright-conflict", label: "Copyright Conflict" },
    ],
    Billing: [
      { id: "all-invoices", label: "All Invoices" },
      { id: "pending-payments", label: "Pending Payments" },
      { id: "completed", label: "Completed" },
    ],
    "System Config": [
      { id: "settings", label: "Settings" },
      { id: "permissions", label: "Permissions" },
      { id: "logs", label: "Logs" },
    ],
    Tickets: [
      { id: "open", label: "Open Tickets" },
      { id: "in-progress", label: "In Progress" },
      { id: "closed", label: "Closed" },
    ],
    Users: [
      { id: "all-users", label: "All Users" },
      { id: "active-users", label: "Active Users" },
      { id: "inactive-users", label: "Inactive Users" },
    ],
    "DSP Config": [
      { id: "platforms", label: "Platforms" },
      { id: "integrations", label: "Integrations" },
      { id: "status", label: "Status" },
    ],
  };

  const menuItems = enterpriseSections[currentSection] || [];

  const handleTabClick = (itemId) => {
    setActiveTab(itemId);
    // When on Artists page, section stays under tab=artists (no route change to "releases" tab)
    const targetTab = tab === "artists" ? "artists" : tab;
    navigate(`/enterprise-catalog?tab=${targetTab}&section=${itemId}`);
  };

  // Artists page: show both ARTISTS and RELEASES sections in the left menu (no separate nav)
  if (tab === "artists") {
    const artistsItems = enterpriseSections.Artists || [];
    const releasesItems = enterpriseSections.Releases || [];
    return (
      <div className="catalog-sidebar">
        <div className="enterprise-section">
          <h3>ARTISTS</h3>
          <ul className="sidebar-list">
            {artistsItems.map((item) => (
              <li
                key={item.id}
                className={activeTab === item.id ? "active" : ""}
                onClick={() => handleTabClick(item.id)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="enterprise-section">
          <h3>RELEASES</h3>
          <ul className="sidebar-list">
            {releasesItems.map((item) => (
              <li
                key={item.id}
                className={activeTab === item.id ? "active" : ""}
                onClick={() => handleTabClick(item.id)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="catalog-sidebar">
      <div className="enterprise-section">
        <h3>{currentSection?.toUpperCase()}</h3>
        <ul className="sidebar-list">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={activeTab === item.id ? "active" : ""}
              onClick={() => handleTabClick(item.id)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EnterpriseSidebar;
