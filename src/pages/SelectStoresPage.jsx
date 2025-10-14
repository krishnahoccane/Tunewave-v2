import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/SelectStoresPage.css";

const SelectStoresPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const releaseData = location.state || {};

  const storesList = [
    "Spotify",
    "Apple Music",
    "Amazon Music",
    "Tidal",
    "Deezer",
    "YouTube Music",
  ];

  const [distributionOption, setDistributionOption] = useState("");
  const [selectedStores, setSelectedStores] = useState([]);

  const handleRadioChange = (option) => {
    setDistributionOption(option);
    if (option !== "manual") {
      if (option === "only-youtube") {
        setSelectedStores(["YouTube Music"]);
      } else if (option === "including") {
        setSelectedStores(storesList);
      } else if (option === "excluding") {
        setSelectedStores(storesList.filter((s) => s !== "YouTube Music"));
      }
    } else {
      setSelectedStores([]);
    }
  };

  const handleStoreToggle = (store) => {
    if (selectedStores.includes(store)) {
      setSelectedStores(selectedStores.filter((s) => s !== store));
    } else {
      setSelectedStores([...selectedStores, store]);
    }
  };

  const handleBack = () => navigate(-1);

  const handleNext = () => {
    if (!distributionOption) {
      alert("Please select a distribution option.");
      return;
    }
    if (distributionOption === "manual" && selectedStores.length === 0) {
      alert("Please select at least one store.");
      return;
    }
    navigate("/preview-distribute", {
      state: {
        ...releaseData,
        distribution: distributionOption,
        selectedStores,
      },
    });
  };

  return (
    <div className="stores-container">
      <div className="stores-card">
        <h2 className="page-title">Select Distribution / Stores</h2>

        <div className="stores-options">
          <label>
            <input
              type="radio"
              name="distribution"
              checked={distributionOption === "only-youtube"}
              onChange={() => handleRadioChange("only-youtube")}
            />
            Only YouTube
          </label>

          <label>
            <input
              type="radio"
              name="distribution"
              checked={distributionOption === "including"}
              onChange={() => handleRadioChange("including")}
            />
            Stores including YouTube
          </label>

          <label>
            <input
              type="radio"
              name="distribution"
              checked={distributionOption === "excluding"}
              onChange={() => handleRadioChange("excluding")}
            />
            Stores excluding YouTube
          </label>

          <label>
            <input
              type="radio"
              name="distribution"
              checked={distributionOption === "manual"}
              onChange={() => handleRadioChange("manual")}
            />
            Select Manually
          </label>
        </div>

        {distributionOption === "manual" && (
          <div className="stores-options manual-options">
            {storesList.map((store, idx) => (
              <label key={idx}>
                <input
                  type="checkbox"
                  checked={selectedStores.includes(store)}
                  onChange={() => handleStoreToggle(store)}
                />
                {store}
              </label>
            ))}
          </div>
        )}

        <div className="action-buttons">
          <button className="btn-secondary" onClick={handleBack}>
            Back
          </button>
          <button className="btn-secondary" onClick={handleNext}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectStoresPage;
