import React from "react";
import TunewaveLogoutImage from "../assets/tunewave.in.png";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        background: "#fff",
      }}
    >
      <img
        src={TunewaveLogoutImage}
        alt="TuneWave"
        style={{ width: "300px", marginBottom: "20px" }}
      />
      <button
        onClick={() => navigate("/login")}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Go to Login
      </button>
    </div>
  );
};

export default LogoutPage;
