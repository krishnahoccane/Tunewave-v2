import React, { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import { useRole } from "../context/RoleContext";
import * as ReleasesService from "../services/releases";
import * as AuthService from "../services/auth";
// top of src/pages/Home.jsx
// import { getFileById } from "../services/files";
// import * as TracksService from "../services/tracks";


//styles
import "../styles/Home.css";
import "../styles/style.css";

//assets
import SampleIcon from "../assets/samplIcon.png";

import live from "../assets/Live.svg";
function Home() {
  const [userdata, setUserData] = useState({});
  const [userId, setUserId] = useState("");
  const [releases, setReleases] = useState([]);
  const [loadingReleases, setLoadingReleases] = useState(true);
  const { actualRole } = useRole();

  const navigate = useNavigate();
  
  // Check if user can create releases (LabelAdmin or Artist/ArtistAdmin only)
  const canCreateRelease = () => {
    const role = actualRole?.toLowerCase() || "";
    return role === "labeladmin" || role === "artist" || role === "artistadmin" || role === "artist admin";
  };

  //jwt token
  // const token = localStorage.getItem("jwtToken");

  const fetchUserDetails = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      console.error("No JWT token found");
      return;
    }

    try {
      const response = await fetch("/api/users/me", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Error fetching user details:", response.status, response.statusText);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        console.error("Error fetching user details:", data.message || data);
        return;
      }

      setUserId(String(data.id || data.userId || ""));
      // store id in local storage in base64 (guard against encoding errors)
      const userIdValue = data?.id || data?.userId;
      if (userIdValue !== undefined) {
        try {
          const encoded = btoa(String(userIdValue));
          localStorage.setItem("userId", encoded);
        } catch (e) {
          // If encoding fails, fall back to plain string
          console.warn("btoa failed, storing plain id", e);
          localStorage.setItem("userId", String(userIdValue));
        }
      }
      console.log("User Details:", data);
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Fetch releases for the logged-in artist
  useEffect(() => {
    const fetchReleases = async () => {
      try {
        setLoadingReleases(true);
        
        // Get artistId from localStorage (stored during login)
        let artistId = null;
        let labelId = null;
        let enterpriseId = null;
        
        try {
          const storedArtistId = localStorage.getItem("artistId");
          if (storedArtistId) {
            // Try to decode if it's base64 encoded
            try {
              artistId = parseInt(atob(storedArtistId));
            } catch (e) {
              // If decoding fails, try parsing directly
              artistId = parseInt(storedArtistId);
            }
          }
        } catch (e) {
          console.warn("[Home] Failed to get artistId from localStorage:", e);
        }

        // If artistId not found in localStorage, try to get from user entities
        if (!artistId || isNaN(artistId)) {
          try {
            const userEntities = await AuthService.getUserEntities();
            console.log("[Home] User entities:", userEntities);
            
            // Check for artists - try both direct property and memberships
            const artists = userEntities?.artists || userEntities?.memberships?.artists || [];
            if (Array.isArray(artists) && artists.length > 0) {
              const artist = artists[0];
              const foundArtistId = artist.artistId || artist.artistID || artist.id;
              if (foundArtistId) {
                artistId = parseInt(foundArtistId);
                console.log("[Home] Found artistId from user entities:", artistId);
              }
              // Try to get labelId from artist if available
              if (artist.labelId || artist.labelID) {
                labelId = parseInt(artist.labelId || artist.labelID);
              }
            }
            
            // Check for labels - try both direct property and memberships
            const labels = userEntities?.labels || userEntities?.memberships?.labels || [];
            if (Array.isArray(labels) && labels.length > 0) {
              const label = labels[0];
              const foundLabelId = label.labelId || label.labelID || label.id;
              if (foundLabelId && !labelId) {
                labelId = parseInt(foundLabelId);
                console.log("[Home] Found labelId from user entities:", labelId);
              }
              // Try to get enterpriseId from label if available
              if (label.enterpriseId || label.enterpriseID) {
                enterpriseId = parseInt(label.enterpriseId || label.enterpriseID);
              }
            }
            
            // Check for enterprises - try both direct property and memberships
            const enterprises = userEntities?.enterprises || userEntities?.memberships?.enterprises || [];
            if (Array.isArray(enterprises) && enterprises.length > 0) {
              const enterprise = enterprises[0];
              const foundEnterpriseId = enterprise.enterpriseId || enterprise.enterpriseID || enterprise.id;
              if (foundEnterpriseId && !enterpriseId) {
                enterpriseId = parseInt(foundEnterpriseId);
                console.log("[Home] Found enterpriseId from user entities:", enterpriseId);
              }
            }
          } catch (error) {
            console.warn("[Home] Failed to get user entities:", error);
          }
        }

        console.log("[Home] Identified IDs - artistId:", artistId, "labelId:", labelId, "enterpriseId:", enterpriseId);

        let releasesData = [];
        
        // Try multiple approaches to fetch releases
        // Approach 1: Fetch by ArtistId
        if (artistId && !isNaN(artistId)) {
          try {
            console.log("[Home] Attempting to fetch releases by ArtistId:", artistId);
            releasesData = await ReleasesService.getReleasesByArtistId(artistId);
            console.log("[Home] Releases fetched by ArtistId:", releasesData);
          } catch (error) {
            console.warn("[Home] Failed to fetch by ArtistId:", error);
          }
        }
        
        // Approach 2: If no releases found, try fetching by LabelId
        if (releasesData.length === 0 && labelId && !isNaN(labelId)) {
          try {
            console.log("[Home] Attempting to fetch releases by LabelId:", labelId);
            const labelReleases = await ReleasesService.getReleases({ LabelId: labelId });
            console.log("[Home] Releases fetched by LabelId:", labelReleases);
            
            // Filter releases where artistId is in contributors
            if (artistId && labelReleases.length > 0) {
              const beforeFilter = labelReleases.length;
              const filtered = labelReleases.filter((release) => {
                const contributors = release.contributors || [];
                // Check multiple possible formats: {artistId}, {artistID}, {id}, or nested artist object
                return contributors.some((contrib) => {
                  const contribArtistId = contrib.artistId || 
                                          contrib.artistID || 
                                          contrib.id ||
                                          contrib.artist?.artistId ||
                                          contrib.artist?.artistID ||
                                          contrib.artist?.id;
                  return contribArtistId === artistId || contribArtistId === String(artistId);
                });
              });
              console.log(`[Home] Filtered ${beforeFilter} releases to ${filtered.length} by artistId in contributors`);
              
              // If filtering removed all releases, show all label releases anyway
              if (filtered.length === 0 && labelReleases.length > 0) {
                console.log("[Home] No releases found for artist, showing all label releases");
                releasesData = labelReleases;
              } else {
                releasesData = filtered;
              }
            } else {
              // If no artistId, show all releases from the label
              releasesData = labelReleases;
              console.log("[Home] No artistId available, showing all releases from label");
            }
          } catch (error) {
            console.warn("[Home] Failed to fetch by LabelId:", error);
          }
        }
        
        // Approach 3: If still no releases, try fetching all releases and filter
        if (releasesData.length === 0 && (labelId || enterpriseId)) {
          try {
            console.log("[Home] Attempting to fetch all releases");
            const allReleases = await ReleasesService.getReleases({
              ...(labelId && { LabelId: labelId }),
              ...(enterpriseId && { EnterpriseId: enterpriseId }),
            });
            console.log("[Home] All releases fetched:", allReleases);
            
            // Filter by artistId in contributors
            if (artistId && allReleases.length > 0) {
              const beforeFilter = allReleases.length;
              releasesData = allReleases.filter((release) => {
                const contributors = release.contributors || [];
                // Check multiple possible formats: {artistId}, {artistID}, {id}, or nested artist object
                return contributors.some((contrib) => {
                  const contribArtistId = contrib.artistId || 
                                          contrib.artistID || 
                                          contrib.id ||
                                          contrib.artist?.artistId ||
                                          contrib.artist?.artistID ||
                                          contrib.artist?.id;
                  return contribArtistId === artistId || contribArtistId === String(artistId);
                });
              });
              console.log(`[Home] Filtered ${beforeFilter} releases to ${releasesData.length} by artistId`);
            } else {
              releasesData = allReleases;
              console.log("[Home] No artistId filter applied, showing all releases");
            }
          } catch (error) {
            console.warn("[Home] Failed to fetch all releases:", error);
          }
        }

        console.log("[Home] Final releases data:", releasesData);
        console.log("[Home] Number of releases found:", releasesData.length);

        // Fetch full details for each release to get cover art and audio URLs
        const mappedReleasesPromises = releasesData.map(async (release) => {
          const releaseId = release.releaseId || release.id;
          
          // Fetch full release details to get tracks with audio URLs and cover art
          let fullReleaseData = release;
          if (releaseId) {
            try {
              console.log(`[Home] Fetching full details for release ${releaseId}`);
              const fullRelease = await ReleasesService.getReleaseById(releaseId);
              fullReleaseData = fullRelease.release || fullRelease;
              console.log(`[Home] Full release data for ${releaseId}:`, fullReleaseData);
            } catch (error) {
              console.warn(`[Home] Failed to fetch full details for release ${releaseId}:`, error);
              // Use original release data if fetch fails
            }
          }

          // Get cover art URL - check multiple sources
          let coverArtUrl = fullReleaseData.coverArtUrl || 
                           fullReleaseData.coverArt || 
                           SampleIcon;
          
          // Check if coverArtUrl is an example/invalid URL
          const isExampleUrl = coverArtUrl && (
            coverArtUrl.includes("example.com") || 
            coverArtUrl.includes("placeholder") ||
            coverArtUrl === SampleIcon
          );
          
          // If coverArtFileId exists, try to fetch file details (especially if URL is example)
          if ((isExampleUrl || !coverArtUrl || coverArtUrl === SampleIcon) 
              && fullReleaseData.coverArtFileId && fullReleaseData.coverArtFileId > 0) {
            try {
              const { getFileById } = await import("../services/files");
              const coverFile = await getFileById(fullReleaseData.coverArtFileId);
              if (coverFile?.cloudfrontUrl) {
                coverArtUrl = coverFile.cloudfrontUrl;
                console.log(`[Home] Fetched cover art URL from file:`, coverArtUrl);
              }
            } catch (error) {
              console.warn(`[Home] Failed to fetch cover art file:`, error);
              // Keep example URL or fallback to SampleIcon
              if (isExampleUrl) {
                coverArtUrl = SampleIcon;
              }
            }
          } else if (coverArtUrl && !isExampleUrl && coverArtUrl !== SampleIcon) {
            console.log(`[Home] Using cover art URL from release:`, coverArtUrl);
          } else if (isExampleUrl) {
            console.log(`[Home] Cover art URL is example/placeholder, using default icon`);
            coverArtUrl = SampleIcon;
          }
          
          // Get first track's audio URL - check multiple sources
          let audioUrl = "";
          let tracks = fullReleaseData.tracks || [];
          
          // If tracks not in release data, fetch them using trackIds
          if (tracks.length === 0 && fullReleaseData.trackIds && fullReleaseData.trackIds.length > 0) {
            try {
              console.log(`[Home] Fetching tracks for release ${releaseId}, trackIds:`, fullReleaseData.trackIds);
              const { getTracksByReleaseId } = await import("../services/tracks");
              tracks = await getTracksByReleaseId(releaseId);
              console.log(`[Home] Fetched ${tracks.length} tracks for release ${releaseId}:`, tracks);
            } catch (error) {
              console.warn(`[Home] Failed to fetch tracks for release ${releaseId}:`, error);
              // Try fetching individual tracks by trackId
              try {
                const { getTrackById } = await import("../services/tracks");
                const trackPromises = fullReleaseData.trackIds.map(trackId => 
                  getTrackById(trackId).catch(() => null)
                );
                tracks = (await Promise.all(trackPromises)).filter(t => t !== null);
                console.log(`[Home] Fetched ${tracks.length} tracks individually:`, tracks);
              } catch (individualError) {
                console.warn(`[Home] Failed to fetch tracks individually:`, individualError);
              }
            }
          }
          
          if (tracks.length > 0) {
            const firstTrack = tracks[0];
            // Check multiple possible audio URL fields
            audioUrl = firstTrack.audioUrl || 
                      firstTrack.audioFileUrl || 
                      firstTrack.fileUrl || 
                      firstTrack.url ||
                      firstTrack.audioFile?.url ||
                      "";
            
            // If no audioUrl in track, try fetching by audioFileId
            if (!audioUrl && firstTrack.audioFileId && firstTrack.audioFileId > 0) {
              try {
                const { getFileById } = await import("../services/files");
                const audioFile = await getFileById(firstTrack.audioFileId);
                if (audioFile?.cloudfrontUrl) {
                  audioUrl = audioFile.cloudfrontUrl;
                  console.log(`[Home] Fetched audio URL from file:`, audioUrl);
                }
              } catch (error) {
                console.warn(`[Home] Failed to fetch audio file:`, error);
              }
            }
          }

          // Format release date
          const releaseDate = fullReleaseData.digitalReleaseDate || 
                            fullReleaseData.originalReleaseDate || 
                            fullReleaseData.releaseDate || 
                            fullReleaseData.createdAt || 
                            "";
          const formattedDate = releaseDate 
            ? new Date(releaseDate).getFullYear() 
            : "";

          // Get artist name from contributors
          let artistName = "Artist";
          const contributors = fullReleaseData.contributors || [];
          if (contributors.length > 0) {
            const primaryArtist = contributors.find(
              c => c.role === "Main Primary Artist" || c.type === "Main Primary Artist"
            );
            if (primaryArtist) {
              artistName = primaryArtist.artistName || primaryArtist.name || "Artist";
            } else {
              artistName = contributors[0].artistName || contributors[0].name || "Artist";
            }
          } else if (fullReleaseData.artistName) {
            artistName = fullReleaseData.artistName;
          }

          // Determine release type (Single, Album, EP)
          const trackCount = tracks.length || fullReleaseData.trackIds?.length || 0;
          let releaseType = "Single";
          if (trackCount > 1 && trackCount <= 6) {
            releaseType = "EP";
          } else if (trackCount > 6) {
            releaseType = "Album";
          }

          return {
            id: releaseId || fullReleaseData.releaseId || fullReleaseData.id,
            title: fullReleaseData.title || "Untitled",
            album: releaseType,
            artist: artistName,
            subtitle: formattedDate ? `${formattedDate} – ${releaseType}` : releaseType,
            img: coverArtUrl,
            audio: audioUrl,
            release: fullReleaseData, // Store full release object for navigation
          };
        });

        // Wait for all release details to be fetched
        const mappedReleases = await Promise.all(mappedReleasesPromises);
        console.log("[Home] Mapped releases with cover art and audio:", mappedReleases);

        // Sort by date (most recent first) and limit to 12 for display
        const sortedReleases = mappedReleases
          .sort((a, b) => {
            const dateA = new Date(a.release?.digitalReleaseDate || a.release?.createdAt || 0);
            const dateB = new Date(b.release?.digitalReleaseDate || b.release?.createdAt || 0);
            return dateB - dateA;
          })
          .slice(0, 12); // Show only 12 most recent releases

        setReleases(sortedReleases);
      } catch (error) {
        console.error("[Home] Error fetching releases:", error);
        // On error, show empty array (no releases)
        setReleases([]);
      } finally {
        setLoadingReleases(false);
      }
    };

    fetchReleases();
    
    // Refresh releases when component becomes visible (user navigates back)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("[Home] Page became visible, refreshing releases...");
        fetchReleases();
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [userId, userdata]);

  // Dynamic User
  const user = {
    name: userdata?.name || localStorage.getItem("displayName") || "User",
    role: "Artist",
    profilePic: SampleIcon,
  };

  // Dynamic Cards Data
  const cardsData = [
    {
      heading: "Account Balance",
      value: "$300.29",
      meta: "Account Balance <br/> Approx ₹25,093.12",
    },
    {
      heading: "Last Statement",
      value: "$300.29",
      meta: "May 2024 <br/> Orpin Music",
    },
    {
      heading: "Last Payout",
      value: "$300.29",
      meta: "May 23, 2024 <br/> ₹25,093.12",
    },
  ];

  // Releases are now fetched from API (see useEffect above)

  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const handlePlay = (release) => {
    // If clicking the same track again → toggle play/pause
    if (currentTrack?.title === release.title) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
      return;
    }

    // Stop and cleanup previous audio
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.src = "";
    }

    // Create new audio instance
    const newAudio = new Audio(release.audio);

    // Event listeners for metadata and progress
    newAudio.addEventListener("loadedmetadata", () => {
      setDuration(newAudio.duration);
    });

    newAudio.addEventListener("timeupdate", () => {
      setCurrentTime(newAudio.currentTime);
    });

    //  When song ends, reset player state
    newAudio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    // Start playback
    newAudio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.error("Audio play failed:", err);
        setIsPlaying(false);
      });

    // Save references in state
    setAudio(newAudio);
    setCurrentTrack(release);
  };

  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.src = "";
      }
    };
  }, [audio]);

  return (
    <div className="home-container" style={{ position: "fixed" }}>
      {" "}
      {/* Change position to fixed if page size inc remove it*/}
      {/* Greeting Card */}
      <div className="greeting-card">
        <img
          src={user.profilePic}
          alt="Profile"
          style={{ cursor: "pointer" }}
          className="profile-card-pic"
          onClick={() => navigate("/settings")}
        />
        <div className="greeting-info">
          <h1
            className="greeting-name"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/settings")}
          >
            {user.name}
          </h1>
          <p className="greeting-role">{user.role}</p>
        </div>
        {canCreateRelease() && (
          <button
            className="btn-gradient"
            onClick={() => navigate("/create-release")}
          >
            Create Release
          </button>
        )}
      </div>
      {/* Dynamic Cards Section */}
      <div className="cards">
        {cardsData.map((card, idx) => (
          <div key={idx} className="card">
            {/* <h5>{card.heading}</h5> */}
            <p>{card.heading}</p>
            <div className="second-card">
              <div className="value">
                <h3>{card.value}</h3>
              </div>
              <div
                className="meta"
                dangerouslySetInnerHTML={{ __html: card.meta }}
              />
            </div>
          </div>
        ))}
      </div>
      {/* Releases Section */}
      <div className="releases-header">
        <h2>Recent Releases</h2>
        <button
          className="btn-gradient"
          onClick={() => navigate("/catalog?tab=releases")}
        >
          View All
        </button>
      </div>
      <div className="releases-container">
        {releases.map((release, i) => (
          <div
            key={release.id || i}
            className="release-card"
            onClick={() => {
              // Navigate to release detail page if releaseId exists
              if (release.id) {
                navigate(`/qc-detail/${release.id}`);
              } else {
                navigate("/catalog?tab=releases");
              }
            }}
          >
            <div className="album-art">
              <div className="live-tag">
                <img
                  style={{
                    height: "10px",
                    width: "11px",
                    marginRight: "5px",
                    marginTop: "1px",
                  }}
                  src={live}
                />
                Live
              </div>
              <img src={release.img} alt={release.title} />
              <div className="overlay">
                <button
                  className="btn-gradient"
                  onClick={(e) => {
                    e.stopPropagation(); // ❌ Prevents routing
                    handlePlay(release); // ✅ Play the audio
                  }}
                >
                  {currentTrack?.title === release.title && isPlaying
                    ? "⏸"
                    : "▶"}
                </button>
              </div>
            </div>
            <div
              className="title"
              style={{ textAlign: "left", paddingLeft: "10px" }}
            >
              {release.title}
            </div>
            <div
              className="subtitle"
              style={{ textAlign: "left", paddingLeft: "10px" }}
            >
              {release.subtitle}
            </div>
          </div>
        ))}
      </div>
      {/*   ------------------------------------------------Music Player------------------------------  */}
      {currentTrack && (
        <div className="music-player">
          {/* Main Player Content */}
          <div className="player-content">
            {/* Left: Album Art */}
            <div className="player-left">
              <div className="album-art-wrapper">
                <img
                  src={currentTrack.img}
                  alt={currentTrack.title}
                  className="player-img"
                />
                <button
                  className="img-play-btn"
                  onClick={() => {
                    if (isPlaying) audio.pause();
                    else audio.play();
                    setIsPlaying(!isPlaying);
                  }}
                >
                  {isPlaying ? "⏸" : "▶"}
                </button>
              </div>
            </div>

            {/* Middle: Progress + Track Info */}
            <div className="player-middle">
              <div className="player-progress-container">
                <span className="time">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min={0}
                  max={duration}
                  value={currentTime}
                  onChange={(e) => {
                    const newTime = e.target.value;
                    audio.currentTime = newTime;
                    setCurrentTime(newTime);
                  }}
                  className="progress-bar"
                  style={{ "--progress": `${(currentTime / duration) * 100}%` }}
                />
                <span className="time">{formatTime(duration)}</span>
              </div>

              <div className="track-info">
                <div className="music-track-title">{currentTrack.title}</div>
                <div className="music-track-subtitle">{currentTrack.album}</div>
                <div className="music-track-title">{currentTrack.artist}</div>
              </div>
            </div>

            {/* Right: Volume + Close */}

            <button
              className="mute-btn"
              onClick={() => {
                if (audio) audio.muted = !audio.muted;
                setIsPlaying((prev) => prev); // optional, to trigger re-render if needed
              }}
            >
              {audio?.muted ? "🔇" : "🔊"}
            </button>
            <div className="player-right">
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={audio?.volume || 1}
                onChange={(e) => {
                  audio.volume = e.target.value;
                }}
                className="volume-bar"
              />

              <button
                className="close-play"
                onClick={() => {
                  audio.pause();
                  audio.currentTime = 0;
                  setAudio(null);
                  setCurrentTrack(null);
                  setIsPlaying(false);
                  setCurrentTime(0);
                  setDuration(0);
                }}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ----------------------------------------------------------------------------------- */}
    </div>
  );
}

export default Home;
