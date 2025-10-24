import React, { useState } from "react";
import "../styles/ReleaseForm.css";
import { useNavigate } from "react-router-dom";

const ReleaseForm = () => {
  const [selectedStores, setSelectedStores] = useState([]);
  const [showPopup, setShowPopup] = useState(false); // Add popup state
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();

  const stores = ["Zing MP3", "Tiktok", "Spotify", "Soundcloud", "Resso"];

  const handleCheckboxChange = (store) => {
    if (selectedStores.includes(store)) {
      setSelectedStores(selectedStores.filter((s) => s !== store));
    } else {
      setSelectedStores([...selectedStores, store]);
    }
  };

  const handleChange = (event) => {
    setSelected(event.target.value);
  };
  const handleSaveNext = () => {
    setShowPopup(true); // Show popup
  };

  return (
    <div className="release-container">
      <h2 className="title">Create A Store</h2>

      <div className="card">
        <h3 className="stores-title">Stores</h3>
        <div className="stores-list">
          {stores.map((store, index) => (
            <label key={index} className="store-option">
              <input
                type="checkbox"
                checked={selectedStores.includes(store)}
                onChange={() => handleCheckboxChange(store)}
              />
              {store}
            </label>
          ))}
        </div>

        <button
          className="new-release-button"
          style={{ marginLeft: "30%" }}
          onClick={handleSaveNext}
        >
          Save & Next
        </button>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div
            className="popup-content"
            style={{ width: "800px", height: "350px" }}
          >
            <h3>Select Release Platforms</h3>
            <label className="radio-label i">
              <input
                type="radio"
                name="choice"
                value="exculding youtube"
                checked={selected === "exculding youtube"}
                onChange={handleChange}
              />
              <span className="custom-radio"></span>
              All Platforms * excluding Youtube
            </label>

            <label className="radio-label i">
              <input
                type="radio"
                name="choice"
                value="including youtube"
                checked={selected === "including youtube"}
                onChange={handleChange}
              />
              <span className="custom-radio"></span>
              All Platforms* including Youtube
            </label>
            <label className="radio-label i">
              <input
                type="radio"
                name="choice"
                value="only on youtube"
                checked={selected === "only on youtube"}
                onChange={handleChange}
              />
              <span className="custom-radio"></span>
              Only on Youtube
            </label>

            <div className="btn-container">
              <button
                onClick={() => setShowPopup(!showPopup)}
                className="btn-secondary"
              >
                cancel
              </button>
              <button
                onClick={() => navigate("/preview-distribute")}
                className="new-release-button"
              >
                submit
              </button>
            </div>
            <br />
            <p className="label-p">
              * All Platforms for which rights have been provided
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReleaseForm;
