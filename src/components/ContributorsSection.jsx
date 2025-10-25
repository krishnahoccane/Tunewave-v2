import React, { useState } from "react";
import "../styles/Contributors.css";
import { FaSoundcloud, FaSpotify, FaMusic } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { FcApproval } from "react-icons/fc";
import { toast, ToastContainer, Slide } from "react-toastify";
const initialOptions = {
  primaryArtist: ["Kavya", "Venala", "Isha", "Krishna"],
  producer: ["Producer1", "Producer2", "Producer3"],
  director: ["Director1", "Director2"],
  composer: ["Composer1", "Composer2", "Composer3"],
  lyricist: ["Lyricist1", "Lyricist2"],
};

const ContributorsSection = () => {
  const [contributors, setContributors] = useState({
    primaryArtist: [],
    producer: [],
    director: [],
    composer: [],
    lyricist: [],
  });

  const [platformBeingEdited, setPlatformBeingEdited] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [isNew, setIsNew] = useState(false);

  // linkedProfiles now stores both url and linked status
  const [linkedProfiles, setLinkedProfiles] = useState({});
  // e.g., { SoundCloud: { url: "", linked: false }, Spotify: {...} }

  const openAddModal = (cat) => {
    setCurrentCategory(cat);
    setSelectedName("");
    setIsNew(false);
    setPlatformBeingEdited(null);
    setLinkedProfiles({});
    setShowModal(true);
  };

  const addContributor = () => {
    if (isNew && !selectedName.trim()) {
      toast.dark(`Please enter a new ${currentCategory} name!`, {
        transition: Slide,
      });
      return;
    }
    if (!selectedName.trim()) return;

    const exists = contributors[currentCategory].some(
      (c) => c.name.toLowerCase() === selectedName.toLowerCase()
    );

    if (exists) {
      toast.dark("Contributor already added!", { transition: Slide });
      return;
    }

    setContributors((prev) => ({
      ...prev,
      [currentCategory]: [
        ...prev[currentCategory],
        {
          name: selectedName.trim(),
          profiles: linkedProfiles,
        },
      ],
    }));

    // Reset modal state
    setSelectedName("");
    setIsNew(false);
    setLinkedProfiles({});
    setPlatformBeingEdited(null);
    setShowModal(false);
  };

  const removeContributor = (category, name) => {
    setContributors((prev) => ({
      ...prev,
      [category]: prev[category].filter((c) => c.name !== name),
    }));
  };


  const hasContributors = Object.values(contributors).some(
  (list) => list.length > 0
);

  return (
    <div className="contributors-section section">
      <h3>Contributors</h3>

      <div className="contributors-options-row">
        {["primaryArtist", "producer", "director", "composer", "lyricist"].map(
          (cat) => (
            <button
              key={cat}
              className="btn-cancel"
              onClick={() => openAddModal(cat)}
            >
              + Add {cat === "primaryArtist" ? "Main Primary Artist" : cat}
            </button>
          )
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add {currentCategory}</h3>

            {/* Existing Dropdown */}
            <select
              value={isNew ? "" : selectedName}
              onChange={(e) => {
                setIsNew(false);
                setSelectedName(e.target.value);
              }}
              className="dropdown-select"
            >
              <option value="">Select Existing</option>
              {initialOptions[currentCategory].map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            {/* Add New */}
            <button
              className="btn-gradient"
              onClick={() => {
                setIsNew(true);
                setSelectedName("");
                setLinkedProfiles({});
                setPlatformBeingEdited(null);
              }}
            >
              + Add New
            </button>

            {/* New Contributor Input */}
            {isNew && (
              <>
                <div className="input-container section">
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-start",
                    }}
                  >
                    Enter new {currentCategory} Name{" "}
                    <span className="required">*</span>
                  </label>

                  <input
                    type="text"
                    className="dropdown-input"
                    placeholder={`Enter new ${currentCategory} Name`} // optional placeholder
                    value={selectedName}
                    onChange={(e) => setSelectedName(e.target.value)}
                  />
                </div>
                <div className="profile-box">
                  <p
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-start",
                    }}
                  >
                    Artist Profiles
                  </p>

                  {[
                    {
                      name: "SoundCloud",
                      icon: <FaSoundcloud color="#ff7700" size={22} />,
                    },
                    {
                      name: "Spotify",
                      icon: <FaSpotify color="#1DB954" size={22} />,
                    },
                    {
                      name: "Apple Music",
                      icon: <FaMusic color="#ff0066" size={22} />,
                    },
                  ].map(({ name, icon }) => {
                    const platformData = linkedProfiles[name] || {
                      url: "",
                      linked: false,
                    };
                    const isLinked = platformData.linked;

                    return (
                      <div key={name} className="profile-row">
                        <div className="profile-header">
                          <div className="profile-left">
                            {icon}
                            <span className="profile-label">{name}</span>
                          </div>

                          <button
                            className={`btn-link-profile ${
                              isLinked ? "linked" : ""
                            }`}
                            onClick={() => setPlatformBeingEdited(name)}
                          >
                            {isLinked ? (
                              <>
                                <FcApproval style={{ marginRight: "6px" }} />{" "}
                                Linked
                              </>
                            ) : (
                              "Link Profile"
                            )}
                          </button>
                        </div>

                        {platformBeingEdited === name && (
                          <div className="profile-input-row">
                            <input
                              type="text"
                              className="profile-url-input"
                              placeholder={`Enter ${name} URL`}
                              value={platformData.url}
                              onChange={(e) =>
                                setLinkedProfiles((prev) => ({
                                  ...prev,
                                  [name]: {
                                    ...prev[name],
                                    url: e.target.value,
                                    linked: prev[name]?.linked || false,
                                  },
                                }))
                              }
                              onKeyDown={(e) => {
                                if (
                                  e.key === "Enter" &&
                                  platformData.url.trim() !== ""
                                ) {
                                  setLinkedProfiles((prev) => ({
                                    ...prev,
                                    [name]: { ...prev[name], linked: true },
                                  }));
                                  setPlatformBeingEdited(null);
                                }
                              }}
                            />

                            <button
                              className="btn-gradient"
                              onClick={() => {
                                if (platformData.url.trim() !== "") {
                                  setLinkedProfiles((prev) => ({
                                    ...prev,
                                    [name]: { ...prev[name], linked: true },
                                  }));
                                  setPlatformBeingEdited(null);
                                }
                              }}
                              style={{
                                fontSize: "12px",
                                fontWeight: 500,
                                padding: "4px 8px",
                                minWidth: "60px",
                                // height: "28px",
                              }}
                            >
                              link
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            <div className="form-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="btn-gradient" onClick={addContributor}>
                Add {currentCategory}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Display Selected Contributors */}
      {hasContributors && (
      <div 
      // style={{border: "1px solid black"}}
      
      className="selected-contributors"
      >
        {Object.keys(contributors).map(
          (cat) =>
            contributors[cat].length > 0 && (
              <div key={cat}>
                <span
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <strong>
                    {/* {cat} : */}
                    {cat.charAt(0).toUpperCase() + cat.slice(1)} :
                    </strong>
                  <div className="pill-container">
                    {contributors[cat].map((c) => (
                      <span key={c.name} className="contributor-pill">
                        {/* {c.name} */}
                        {c.name.charAt(0).toUpperCase() + c.name.slice(1)}
                        <button
                          onClick={() => removeContributor(cat, c.name)}
                          className="required"
                          // style={{justifyContent: "center", alignItems: "center"}}
                        >
                          <FaXmark />
                        </button>
                      </span>
                    ))}
                  </div>
                </span>
              </div>
            )
        )}
      </div>
      )}

      <ToastContainer position="bottom-center" autoClose={3000} />
    </div>
  );
};

export default ContributorsSection;
