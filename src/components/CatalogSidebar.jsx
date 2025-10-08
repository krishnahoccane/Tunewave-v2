
import React from "react";
import "../styles/CatalogSidebar.css";

function CatalogSidebar({ activeTab, setActiveTab }) {
  const sidebarItems = [
    { 
      id: "releases", 
      label: "Releases", 
      icon: "/src/assets/Releases.png" 
    },
    { 
      id: "tracks", 
      label: "Tracks", 
      icon: "/src/assets/Tracks.png" 
    },
    { 
      id: "videos", 
      label: "Videos", 
      icon: "/src/assets/Vector.png" 
    }
  ];

  const contributionItems = [
    { 
      id: "artists", 
      label: "Artists", 
      icon: "/src/assets/Artists.png" 
    },
    { 
      id: "performers", 
      label: "Performers", 
      icon: "/src/assets/Artists.png" 
    },
    { 
      id: "producers", 
      label: "Producers & Engineers", 
      icon: "/src/assets/Artists.png" 
    },
    { 
      id: "writers", 
      label: "Writers", 
      icon: "/src/assets/Artists.png" 
    },
    { 
      id: "publishers", 
      label: "Publishers", 
      icon: "/src/assets/Artists.png" 
    },
    { 
      id: "labels", 
      label: "Labels", 
      icon: "/src/assets/Labels.png" 
    }
  ];

  return (
    <div className="catalog-sidebar">
      <h3>ASSETS</h3>
      <ul className="sidebar-list">
        {sidebarItems.map((item) => (
          <li
            key={item.id}
            className={activeTab === item.id ? "active" : ""}
            onClick={() => setActiveTab(item.id)}
          >
            {/* <img src={item.icon} alt={item.label} className="sidebar-icon" /> */}
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
            {/* <img src={item.icon} alt={item.label} className="sidebar-icon" /> */}
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CatalogSidebar;