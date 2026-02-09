import React, { useState, useEffect } from "react";
import "../styles/s.css";
import { FaSoundcloud, FaSpotify, FaMusic } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { FcApproval } from "react-icons/fc";
import { toast, ToastContainer, Slide } from "react-toastify";
import { createArtist as createArtistApi } from "../services/artists";

// Primary Artist: min 1, max 4. Same artist cannot be added twice to the same role.
const MAX_PRIMARY_ARTISTS = 4;

const CONTRIBUTOR_CATEGORIES = [
  "primaryArtist",
  "featuredArtist",
  "producer",
  "director",
  "composer",
  "lyricist",
];
const CATEGORY_LABELS = {
  primaryArtist: "Primary Artist",
  featuredArtist: "Featured Artist",
  producer: "Producer",
  director: "Director",
  composer: "Composer",
  lyricist: "Lyricist",
};

/** Ensure value is a string safe for React (never render objects in <option>) */
const toDisplayString = (v) => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  return "";
};

/** Normalize artist so artistId and artistName are always primitives for rendering */
const normalizeArtist = (a) => {
  if (a == null || typeof a !== "object") return null;
  const artistId = a.artistId ?? a.artistID;
  const rawName = a.artistName ?? a.stageName ?? a.name;
  const artistName = toDisplayString(rawName) || "Unnamed Artist";
  if (artistId == null) return null;
  return {
    artistId: typeof artistId === "object" ? String(artistId) : artistId,
    artistName,
  };
};

const ContributorsSection = ({
  artistsList = [],
  loadingArtists = false,
  contributors: externalContributors,
  onContributorsChange,
  onRefreshArtists,
  onCreateArtist,
}) => {
  const [internalContributors, setInternalContributors] = useState({
    primaryArtist: [],
    featuredArtist: [],
    producer: [],
    director: [],
    composer: [],
    lyricist: [],
  });

  const contributors = externalContributors || internalContributors;

  const setContributors = (newContributors) => {
    if (onContributorsChange) {
      onContributorsChange(newContributors);
    } else {
      setInternalContributors(newContributors);
    }
  };

  useEffect(() => {
    if (externalContributors) {
      setInternalContributors(externalContributors);
    }
  }, [externalContributors]);

  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");
  const [selectedArtistId, setSelectedArtistId] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [newStageName, setNewStageName] = useState("");
  const [linkedProfiles, setLinkedProfiles] = useState({});
  const [platformBeingEdited, setPlatformBeingEdited] = useState(null);

  const primaryArtistCount = (contributors.primaryArtist || []).length;
  const primaryArtistAtMax = primaryArtistCount >= MAX_PRIMARY_ARTISTS;

  const openAddModal = (cat) => {
    if (cat === "primaryArtist" && primaryArtistAtMax) return;
    setCurrentCategory(cat);
    setSelectedArtistId("");
    setIsNew(false);
    setNewStageName("");
    setLinkedProfiles({});
    setPlatformBeingEdited(null);
    setShowModal(true);
  };

  const isDuplicateInCategory = (category, artistId) =>
    (contributors[category] || []).some(
      (c) => String(c.artistId ?? c.artistID) === String(artistId)
    );

  const addContributor = async () => {
    if (isNew) {
      const name = newStageName.trim();
      if (!name) {
        toast.dark("Please enter a stage name for the new artist.", { transition: Slide });
        return;
      }
      // Build profile URLs for artist creation (optional; saved in background with artist)
      const profileUrls = {
        soundCloudUrl: (linkedProfiles["SoundCloud"]?.url || "").trim() || undefined,
        spotifyUrl: (linkedProfiles["Spotify"]?.url || "").trim() || undefined,
        appleMusicUrl: (linkedProfiles["Apple Music"]?.url || "").trim() || undefined,
      };

      const doAddCreatedArtist = (created) => {
        const artistId = created?.artistId ?? created?.artistID;
        const artistName = toDisplayString(created?.artistName ?? created?.stageName ?? name) || name;
        if (artistId == null) return;
        if (isDuplicateInCategory(currentCategory, artistId)) {
          toast.dark("This artist is already added to this role.", { transition: Slide });
          return;
        }
        setContributors((prev) => {
          const list = prev[currentCategory] || [];
          if (currentCategory === "primaryArtist" && list.length >= MAX_PRIMARY_ARTISTS) return prev;
          return {
            ...prev,
            [currentCategory]: [...list, { artistId, artistName }],
          };
        });
        setShowModal(false);
      };

      if (onCreateArtist) {
        // Parent-provided handler (e.g. Create Release): optimistic UI, background API
        onCreateArtist(name, profileUrls)
          .then(doAddCreatedArtist)
          .catch((e) => {
            toast.dark(e?.message || "Failed to create artist.", { transition: Slide });
          });
      } else {
        // Default: call API directly (e.g. Track modal) – same UX, non-blocking
        createArtistApi({ publicProfileName: name, ...profileUrls })
          .then(doAddCreatedArtist)
          .catch((e) => {
            toast.dark(e?.message || "Failed to create artist.", { transition: Slide });
          });
      }
      return;
    }

    const artistId = selectedArtistId !== "" && selectedArtistId != null ? selectedArtistId : null;
    if (artistId == null) {
      toast.dark("Please select an artist.", { transition: Slide });
      return;
    }
    const safeArtist = safeArtists.find((a) => String(a.artistId) === String(artistId));
    const artistName = safeArtist ? safeArtist.artistName : toDisplayString(artistsList?.find((a) => String(a.artistId ?? a.artistID) === String(artistId))?.artistName ?? "") || "Unnamed Artist";

    if (isDuplicateInCategory(currentCategory, artistId)) {
      toast.dark("This artist is already added to this role.", { transition: Slide });
      return;
    }

    setContributors((prev) => {
      const list = prev[currentCategory] || [];
      if (currentCategory === "primaryArtist" && list.length >= MAX_PRIMARY_ARTISTS) return prev;
      return {
        ...prev,
        [currentCategory]: [...list, { artistId, artistName }],
      };
    });

    setSelectedArtistId("");
    setLinkedProfiles({});
    setPlatformBeingEdited(null);
    setShowModal(false);
  };

  const removeContributor = (category, item) => {
    const id = item.artistId ?? item.artistID;
    const name = item.artistName ?? item.name;
    setContributors((prev) => ({
      ...prev,
      [category]: (prev[category] || []).filter(
        (c) => String(c.artistId ?? c.artistID) !== String(id) || (c.artistName ?? c.name) !== name
      ),
    }));
  };

  const hasContributors = CONTRIBUTOR_CATEGORIES.some(
    (cat) => (contributors[cat] || []).length > 0
  );

  // Normalize artists so <option> never receives objects (prevents "Objects are not valid as a React child")
  const artistsArray = Array.isArray(artistsList) ? artistsList : [];
  const safeArtists = artistsArray
    .map(normalizeArtist)
    .filter((a) => a != null);

  return (
    <div className="contributors-section section">
      <h3>Contributors <span className="required">*</span></h3>

      {/* Add contributor buttons – same UX; Primary Artist max 4 */}
      <div className="contributors-options-row">
        {CONTRIBUTOR_CATEGORIES.map((cat) => (
          <span key={cat} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => openAddModal(cat)}
              disabled={loadingArtists || (cat === "primaryArtist" && primaryArtistAtMax)}
              title={cat === "primaryArtist" && primaryArtistAtMax ? "You can add up to 4 Primary Artists only." : undefined}
            >
              + Add {CATEGORY_LABELS[cat]}
              {cat === "primaryArtist" ? " *" : ""}
            </button>
            {cat === "primaryArtist" && primaryArtistAtMax && (
              <span style={{ fontSize: 12, color: "#666" }}>You can add up to 4 Primary Artists only.</span>
            )}
          </span>
        ))}
      </div>

      {showModal && (
        <div className="contributors-modal-overlay">
          <div className="contributors-modal-content">
            <h3>Add {CATEGORY_LABELS[currentCategory]}{currentCategory === "primaryArtist" ? " *" : ""}</h3>

            {!isNew ? (
              <>
                <select
                  className="dropdown-select"
                  value={selectedArtistId}
                  onChange={(e) => setSelectedArtistId(e.target.value)}
                >
                  <option value="">Select artist</option>
                  {safeArtists.map((a) => (
                    <option
                      key={String(a.artistId)}
                      value={String(a.artistId)}
                    >
                      {a.artistName}
                    </option>
                  ))}
                </select>
                {safeArtists.length === 0 && (
                  <p style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
                    No artists yet. Create one below.
                  </p>
                )}
              </>
            ) : (
              <div className="input-container section">
                <label>New artist stage name <span className="required">*</span></label>
                <input
                  type="text"
                  className="dropdown-input"
                  placeholder="Enter stage name"
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                />
              </div>
            )}

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              {!isNew ? (
                <button
                  type="button"
                  className="btn-gradient"
                  onClick={() => {
                    setIsNew(true);
                    setSelectedArtistId("");
                    setNewStageName("");
                  }}
                >
                  + Add New Artist
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setIsNew(false);
                    setNewStageName("");
                    setLinkedProfiles({});
                    setPlatformBeingEdited(null);
                  }}
                >
                  Choose existing
                </button>
              )}
            </div>

            {/* Artist Profiles: ONLY when creating a new artist (Add New Artist flow) */}
            {isNew && (
              <div className="profile-box" style={{ marginTop: 16 }}>
                <p>Artist Profiles (optional)</p>
                {[
                  { name: "SoundCloud", icon: <FaSoundcloud color="#ff7700" size={22} /> },
                  { name: "Spotify", icon: <FaSpotify color="#1DB954" size={22} /> },
                  { name: "Apple Music", icon: <FaMusic color="#ff0066" size={22} /> },
                ].map(({ name, icon }) => {
                  const platformData = linkedProfiles[name] || { url: "", linked: false };
                  return (
                    <div key={name} className="profile-row">
                      <div className="profile-header">
                        <div className="profile-left">
                          {icon}
                          <span className="profile-label">{name}</span>
                        </div>
                        <button
                          type="button"
                          className={`contributors-btn-link-profile ${platformData.linked ? "linked" : ""}`}
                          onClick={() => setPlatformBeingEdited(platformBeingEdited === name ? null : name)}
                        >
                          {platformData.linked ? <><FcApproval style={{ marginRight: 6 }} /> Linked</> : "Link Profile"}
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
                                [name]: { ...prev[name], url: e.target.value, linked: prev[name]?.linked || false },
                              }))
                            }
                          />
                          <button
                            type="button"
                            className="btn-gradient"
                            onClick={() =>
                              setLinkedProfiles((prev) => ({
                                ...prev,
                                [name]: { ...prev[name], linked: true },
                              }))
                            }
                          >
                            link
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="form-actions" style={{ marginTop: 16 }}>
              <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-gradient"
                onClick={addContributor}
                disabled={(!isNew && !selectedArtistId) || (isNew && !newStageName.trim())}
              >
                {`Add ${CATEGORY_LABELS[currentCategory]}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Display: all contributors (same chip UX for Primary Artist and others) */}
      {hasContributors && (
        <div className="selected-contributors">
          {CONTRIBUTOR_CATEGORIES.map(
            (cat) =>
              (contributors[cat] || []).length > 0 && (
                <div key={cat} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <strong>{CATEGORY_LABELS[cat]}{cat === "primaryArtist" ? " *" : ""}:</strong>
                  <div className="pill-container">
                    {(contributors[cat] || []).map((c) => {
                      const name = toDisplayString(c.artistName ?? c.name) || "—";
                      return (
                        <span key={`${cat}-${c.artistId ?? c.artistID}-${name}`} className="contributor-pill">
                          {name}
                          <button
                            type="button"
                            onClick={() => removeContributor(cat, c)}
                            className="required"
                          >
                            <FaXmark />
                          </button>
                        </span>
                      );
                    })}
                  </div>
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
