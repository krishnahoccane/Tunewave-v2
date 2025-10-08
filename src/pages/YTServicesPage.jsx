import React, { useState } from "react";
import "../styles/YTServicesPage.css";

const YTServicesPage = () => {
  const [activeTab, setActiveTab] = useState("claim");
  const [showClaimPopup, setShowClaimPopup] = useState(false);
  const [showOacPopup, setShowOacPopup] = useState(false);

  const [topicChannels, setTopicChannels] = useState([""]);
  const [vevo, setVevo] = useState(""); // Vevo radio state

  const addTopicChannel = () => setTopicChannels([...topicChannels, ""]);
  const removeTopicChannel = (index) => {
    const updated = [...topicChannels];
    updated.splice(index, 1);
    setTopicChannels(updated);
  };
  const handleTopicChange = (index, value) => {
    const updated = [...topicChannels];
    updated[index] = value;
    setTopicChannels(updated);
  };

  return (
    <div className="ytservices-page">
      <div className="ytservices-container">
        {/* Header */}
        <div className="ytservices-header">
          <h2>Youtube Requests</h2>
          <button
            className="close-btn"
            onClick={() => (window.location.href = "/dashboard")}
          >
            ×
          </button>
        </div>

        {/* Tabs + Add New */}
        <div className="tabs-add-container">
          <div className="tabs">
            <button
              className={activeTab === "claim" ? "active" : ""}
              onClick={() => setActiveTab("claim")}
            >
              Claim List
            </button>
            <button
              className={activeTab === "oac" ? "active" : ""}
              onClick={() => setActiveTab("oac")}
            >
              OAC Upgrade
            </button>
          </div>
          <button
            className="new-release-button"
            onClick={() =>
              activeTab === "claim"
                ? setShowClaimPopup(true)
                : setShowOacPopup(true)
            }
          >
            + Add new
          </button>
        </div>

        {/* Claim List Table */}
        {activeTab === "claim" && (
          <div className="ytservices-table">
            <table>
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Type</th>
                  <th>ISRC</th>
                  <th>Status</th>
                  <th>Credited at</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Tunewave.com</td>
                  <td>Add</td>
                  <td>REWAVE00004313</td>
                  <td>Pending</td>
                  <td>15.9.2025</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* OAC Upgrade Table */}
        {activeTab === "oac" && (
          <div className="ytservices-table">
            <table>
              <thead>
                <tr>
                  <th>Artist</th>
                  <th>Official Channel</th>
                  <th>Topic Channels</th>
                  <th>Vevo Channel</th>
                  <th>Status</th>
                  <th>Credited at</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Kavya Balagiri</td>
                  <td>in/kavyaballagiri04/</td>
                  <td>in/kavyaballagiri04/</td>
                  <td>in/kavyaballagiri04/</td>
                  <td>Pending</td>
                  <td>15.9.2025</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Claim Popup */}
      {showClaimPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Add New Claim</h3>
            <label>
              Type*
              <select>
                <option>Add</option>
              </select>
            </label>
            <label>
              URL*
              <input type="text" placeholder="Enter URL" />
            </label>
            <label>
              ISRC*
              <input type="text" placeholder="Enter ISRC" />
            </label>
            <div className="popup-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowClaimPopup(false)}
              >
                Cancel
              </button>
              <button className="new-release-button">Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* OAC Upgrade Popup */}
      {showOacPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Add New OAC Upgrade Request</h3>
            <label>
              Select Artist*
              <select>
                <option>Select Artist from your catalog</option>
              </select>
            </label>
            <label>
              Official Channel Link*
              <input type="text" placeholder="Enter Official Channel Link" />
            </label>

            {/* Dynamic Topic Channels */}
            <label>Topic Channels*</label>
            {topicChannels.map((channel, index) => (
              <div key={index} className="topic-channel-row">
                <input
                  type="text"
                  placeholder={`Enter Topic Channel ${index + 1} link`}
                  value={channel}
                  onChange={(e) => handleTopicChange(index, e.target.value)}
                />
                {index > 0 && (
                  <button
                    className="remove-topic"
                    onClick={() => removeTopicChannel(index)}
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}
            <button className="add-topic" onClick={addTopicChannel}>
              + Add Another Topic Channel
            </button>

            {/* Vevo Channel Section */}
            <div className="vevo-container">
              <p className="vevo-label">Has a Vevo Channel?</p>
              <div className="radio-inline">
                <div style={{display:"flex"}}>
                <input
                  type="radio"
                  id="vevo-yes"
                  name="vevo"
                  value="yes"
                  checked={vevo === "yes"}
                  onChange={(e) => setVevo(e.target.value)}
                />
                <label htmlFor="vevo-yes" style={{textAlign:"center"}}>Yes</label>
                </div>
                <div style={{display:"flex"}}>

                <input
                  type="radio"
                  id="vevo-no"
                  name="vevo"
                  value="no"
                  checked={vevo === "no"}
                  onChange={(e) => setVevo(e.target.value)}
                />
                <label htmlFor="vevo-no">No</label>
                </div>
              </div>

              {vevo === "yes" && (
                <textarea
                  className="vevo-link"
                  placeholder="Enter your Vevo channel link"
                ></textarea>
              )}
            </div>

            <div className="popup-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowOacPopup(false)}
              >
                Cancel
              </button>
              <button className="new-release-button">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YTServicesPage;
