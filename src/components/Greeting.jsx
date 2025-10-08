import React from "react";

const Greeting = ({ userName }) => {
  return (
    <div style={{ padding: "20px", fontSize: "1.2rem" }}>
      Hello, {userName}!
    </div>
  );
};

export default Greeting;
