
import React, { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import "../styles/Home.css";
import SampleIcon from "../assets/samplIcon.png";
import live from "../assets/Live.svg"
function Home() {
  const [userdata,setUserData] = useState([])

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
    const response = await fetch(
      "https://webhook.site/f3a7c048-3612-489f-af72-edfbc9c14744",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Pass JWT token here
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Error fetching user details:", data.message || data);
      return;
    }

    console.log("User Details:", data);
    setUserData(data)
  } catch (error) {
    console.error("Network error:", error);
  }
};

useEffect(()=>{

  fetchUserDetails()
},[])




  // Dynamic User
  const user = {
    name: "prea",
    role: "Artist",
    profilePic: SampleIcon,
  };

  // Dynamic Cards Data
  const cardsData = [
    {
      heading:"Account Balance",
      value: "$300.29",
      meta: "Account Balance <br/> Approx ₹25,093.12",
    },
    {
      heading:"Last Statement",
      value: "$300.29",
      meta: "May 2024 <br/> Orpin Music",
    },
    {
      heading:"Last Payout",
      value: "$300.29",
      meta: "May 23, 2024 <br/> ₹25,093.12",
    },
  ];

  // Dynamic Releases
  const releases = [
    { title: "Dangerous Days", subtitle: "2014 – Single", img: SampleIcon },
    { title: "Night Sky", subtitle: "2020 – Album", img: SampleIcon },
    { title: "Lost Dreams", subtitle: "2019 – EP", img: SampleIcon },
    { title: "Ocean Waves", subtitle: "2022 – Single", img: SampleIcon },
    { title: "Skyline", subtitle: "2023 – Album", img: SampleIcon },
  ];

  return (
    <div className="home-container">
      {/* Greeting Card */}
      <div className="greeting-card">
          <img src={user.profilePic} alt="Profile" className="profile-card-pic" />
          <div className="greeting-info">
            <h1 className="greeting-name">{userdata.name}</h1>
            <p className="greeting-role">{user.role}</p>
          </div>
        <button
        className="new-release-button"
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
            className="view-all-btn"
            onClick={() => navigate("/catalog?tab=releases")}
          >
            View All
          </button>
      </div>

      <div className="releases-container" onClick={()=>navigate("/preview-distribute")}>
        {releases.map((release, i) => (
          <div key={i} className="release-card">
            <div className="album-art">
              <div className="live-tag"><img style={{height:"10px",width:"11px",marginRight:"5px",marginTop:"1px"}} src={live}/>Live</div>
              <img src={release.img} alt={release.title} />
              <div className="overlay">
                <button className="play-btn">▶</button>
              </div>
            </div>
            <div className="title" style={{textAlign:"left",paddingLeft:"10px"}}>{release.title}</div>
            <div className="subtitle" style={{textAlign:"left",paddingLeft:"10px"}}>{release.subtitle}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
