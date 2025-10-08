import React, { useEffect, useState } from "react";
import TunewaveLogoutImage from "../assets/tunewave.in.png"; // make sure path is correct

const LogoutPage = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in after mount
    setVisible(true);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        background: "#fff",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <img
        src={TunewaveLogoutImage}
        alt="TuneWave"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          opacity: visible ? 1 : 0,
          transition: "opacity 1s ease-in-out",
        }}
      />
    </div>
  );
};

export default LogoutPage;
