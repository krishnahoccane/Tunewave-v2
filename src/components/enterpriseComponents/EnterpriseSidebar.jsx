
import { useNavigate } from "react-router-dom";
import "../../styles/CatalogSidebar.css";

function EnterpriseSidebar({ activeTab, setActiveTab, currentSection, tab }) {
  const navigate = useNavigate();

  // Section-wise sidebar menus
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
    navigate(`/enterprise-catalog?tab=${tab}&section=${itemId}`);
  };

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
