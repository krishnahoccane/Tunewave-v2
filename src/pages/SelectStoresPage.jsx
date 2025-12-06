import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";


// import "../styles/SelectStoresPage.css";

import youtubeIcon from "../assets/stores/youtube.svg";
import allStoresIcon from "../assets/stores/allStores.svg";
import noYoutubeIcon from "../assets/stores/noYoutube.svg";
import manualIcon from "../assets/stores/manual.svg";

import {
  ToastContainer,
  toast,
  Slide,
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  // Load store selection from localStorage on mount
  useEffect(() => {
    try {
      const savedStoreData = localStorage.getItem("selectStoresFormData");
      if (savedStoreData) {
        const storeData = JSON.parse(savedStoreData);
        if (storeData.distributionOption) {
          setDistributionOption(storeData.distributionOption);
        }
        if (storeData.selectedStores && Array.isArray(storeData.selectedStores)) {
          setSelectedStores(storeData.selectedStores);
        }
        console.log("✅ Restored store selection from localStorage");
      }
    } catch (error) {
      console.warn("Failed to load store selection from localStorage:", error);
    }
  }, []);

  // Save store selection to localStorage whenever it changes
  useEffect(() => {
    const saveStoreData = () => {
      try {
        const storeDataToSave = {
          distributionOption,
          selectedStores,
        };
        localStorage.setItem("selectStoresFormData", JSON.stringify(storeDataToSave));
        console.log("💾 Auto-saved store selection to localStorage");
      } catch (error) {
        console.warn("Failed to save store selection to localStorage:", error);
      }
    };

    // Debounce saves
    const timeoutId = setTimeout(saveStoreData, 500);
    return () => clearTimeout(timeoutId);
  }, [distributionOption, JSON.stringify(selectedStores)]);

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
      toast.dark("Please select a distribution option.", { transition: Slide });
      return;
    }
    if (distributionOption === "manual" && selectedStores.length === 0) {
      toast.dark("Please select at least one store.", { transition: Slide });
      return;
    }

    // Save to localStorage before navigation (redundant but ensures it's saved)
    try {
      const storeDataToSave = {
        distributionOption,
        selectedStores,
      };
      localStorage.setItem("selectStoresFormData", JSON.stringify(storeDataToSave));
      console.log("✅ Saved store selection to localStorage before navigation");
    } catch (error) {
      console.warn("Failed to save store selection:", error);
    }

    navigate("/preview-distribute", {
      state: {
        ...releaseData,
        distribution: distributionOption,
        selectedStores,
      },
    });
  };

  const handleSelectAllToggle = () => {
    if (selectedStores.length === storesList.length) {
      setSelectedStores([]); // Unselect all
    } else {
      setSelectedStores(storesList); // Select all
    }
  };

  return (
    <div className="pages-layout-container pages-layout-container-full-height">
      <div class="content">
        <h2 className="pages-main-title">Select Distribution / Stores</h2>
        <div className="stores-card">
          <div className="stores-options">
            <label>
              <input
                type="radio"
                name="distribution"
                checked={distributionOption === "only-youtube"}
                onChange={() => handleRadioChange("only-youtube")}
              />
              Only YouTube
              <img src={youtubeIcon} alt="YouTube" className="stores-icon" />
            </label>

            <label>
              <input
                type="radio"
                name="distribution"
                checked={distributionOption === "including"}
                onChange={() => handleRadioChange("including")}
              />
              All Stores including YouTube
              <img
                src={allStoresIcon}
                alt="allStores"
                className="stores-icon"
              />
              <img src={youtubeIcon} alt="YouTube" className="stores-icon" />
            </label>

            <label>
              <input
                type="radio"
                name="distribution"
                checked={distributionOption === "excluding"}
                onChange={() => handleRadioChange("excluding")}
              />
              All Stores excluding YouTube
              <img
                src={allStoresIcon}
                alt="allStores"
                className="stores-icon"
              />
              <img
                src={noYoutubeIcon}
                alt="Excluding YouTube"
                className="stores-icon"
              />
            </label>

            <label>
              <input
                type="radio"
                name="distribution"
                checked={distributionOption === "manual"}
                onChange={() => handleRadioChange("manual")}
              />
              Select Manually{" "}
              <img
                src={manualIcon}
                alt="Manual Select"
                className="stores-icon"
              />
            </label>
          </div>

          {distributionOption === "manual" && (
            <div className="stores-options manual-options">
              <label className="select-all">
                <input
                  type="checkbox"
                  checked={selectedStores.length === storesList.length}
                  onChange={handleSelectAllToggle}
                />
                Select All
              </label>
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
        </div>
        <ToastContainer
          position="bottom-center"
          limit={1}
          autoClose={3000}
          hideProgressBar={false}
        />

        <div className="btn-actions">
          <button className="btn-cancel" onClick={handleBack}>
            Back
          </button>
          <button className="btn-gradient" onClick={handleNext}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectStoresPage;
