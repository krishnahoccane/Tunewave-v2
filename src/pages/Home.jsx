import React, { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import "../styles/Home.css";
import "../styles/style.css";
import SampleIcon from "../assets/samplIcon.png";
import live from "../assets/Live.svg";
function Home() {
  const [userdata, setUserData] = useState({});
  const [userId, setUserId] = useState("");

  const navigate = useNavigate();

  //jwt token
  // const token = localStorage.getItem("jwtToken");

  const fetchUserDetails = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      console.error("No JWT token found");
      return;
    }

    try {
      const response = await fetch("/main/wp-json/wp/v2/users/me", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error fetching user details:", data.message || data);
        return;
      }

      setUserId(String(data.id));
      // store id in local storage in base64 (guard against encoding errors)
      if (data?.id !== undefined) {
        try {
          const encoded = btoa(String(data.id));
          localStorage.setItem("userId", encoded);
        } catch (e) {
          // If encoding fails, fall back to plain string
          console.warn("btoa failed, storing plain id", e);
          localStorage.setItem("userId", String(data.id));
        }
      }
      console.log("User Details:", data);
      setUserData(data);
    } catch (error) {
      console.error("Network error:", error);
    }
    
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

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

  // Dynamic Releases
  // const releases = [
  //   { title: "Dangerous Days", subtitle: "2014 – Single", img: SampleIcon, audio: "/audio.wav", },
  //   { title: "Night Sky", subtitle: "2020 – Album", img: SampleIcon, audio: "/audio.wav", },
  //   { title: "Lost Dreams", subtitle: "2019 – EP", img: SampleIcon, audio: "/audio.wav", },
  //   { title: "Ocean Waves", subtitle: "2022 – Single", img: SampleIcon, audio: "/audio.wav", },
  //   { title: "Skyline", subtitle: "2023 – Album", img: SampleIcon, audio: "/audio.wav", },
  // ];
const releases = [
  { 
    title: "Dangerous Days", 
    album: "Single", 
    artist: "Artist", 
    subtitle: "2014 – Single",
    img: SampleIcon, 
    audio: "/audio.wav" 
  },
  { 
    title: "Night Sky", 
    album: "Album", 
    artist: "Artist", 
    subtitle: "2014 – Single",
    img: SampleIcon, 
    audio: "/audio.wav" 
  },
  { 
    title: "Lost Dreams", 
    album: "EP", 
    artist: "Artist", 
    subtitle: "2014 – Single",
    img: SampleIcon, 
    audio: "/audio.wav" 
  },
  { 
    title: "Ocean Waves", 
    album: "Single", 
    artist: "Artist", 
    subtitle: "2014 – Single",
    img: SampleIcon, 
    audio: "/audio.wav" 
  },
  { 
    title: "Skyline", 
    album: "Album", 
    artist: "Artist", 
    subtitle: "2014 – Single",
    img: SampleIcon, 
    audio: "/audio.wav" 
  },
  { 
    title: "Abdi Abdi", 
    album: "EP", 
    artist: "Artist", 
    subtitle: "2014 – Single",
    img: SampleIcon, 
    audio: "/audio.wav" 
  },
  { 
    title: "org gngstr", 
    album: "Single", 
    artist: "Artist", 
    subtitle: "2014 – Single",
    img: SampleIcon, 
    audio: "/audio.wav" 
  },
  
];

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

  // ✅ When song ends, reset player state
 newAudio.addEventListener("ended", () => {
    setIsPlaying(false);
    setCurrentTime(0);
  });

  // Start playback
  newAudio.play().then(() => {
    setIsPlaying(true);
  }).catch(err => {
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
    <div className="home-container">
      {/* Greeting Card */}
      <div className="greeting-card">
        <img src={user.profilePic} alt="Profile" style={{cursor: "pointer"}} className="profile-card-pic" onClick={() => navigate("/settings")} />
        <div className="greeting-info">
          <h1 className="greeting-name" style={{cursor: "pointer"}} onClick={() => navigate("/settings") } >{user.name}</h1>
          <p className="greeting-role">{user.role}</p>
        </div>
        <button
          className="btn-gradient"
          onClick={() => navigate("/create-release")}
        >
          Create Release
        </button>
      </div>

      {/* Dynamic Cards Section */}
      <div className="cards">
        {cardsData.map((card, idx) => (
          <div key={idx} className="card">
            <h3>{card.heading}</h3>
            <div className="second-card">
              <div className="value">{card.value}</div>
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
                              key={i}
                              className="release-card"
                              onClick={() => navigate("/preview-distribute")}
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
                                    {currentTrack?.title === release.title && isPlaying ? "⏸" : "▶"}
                                  </button>
                                </div>
                              </div>
                              <div className="title" style={{ textAlign: "left", paddingLeft: "10px" }}>
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
                                  <img src={currentTrack.img} alt={currentTrack.title} className="player-img" />
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
