import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/WithdrawPage.css";

const WithdrawPage = () => {
  const navigate = useNavigate();
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [reAccountNumber, setReAccountNumber] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [pan, setPan] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (accountNumber !== reAccountNumber) {
      alert("Account numbers do not match!");
      return;
    }
    alert("Withdrawal request submitted successfully!");
    navigate("/dashboard");
  };

  return (
    <div className="withdraw-modal">
      
      {/* Withdraw Request Title with Close Symbol */}
      <div className="withdraw-header">
        <h2>Withdraw Request</h2>
        <button
          className="close-btn"
          onClick={() => setShowConfirmPopup(true)}
        >
          ×
        </button>
      </div>

      <div className="withdraw-content">

        {/* Confirmation Popup */}
        {showConfirmPopup && (
  <div className="confirm-popup">
    <div className="confirm-content">
      <p>Do you want to confirm exit?</p>
      <div className="confirm-buttons">
        <button className="yes-btn" onClick={() => navigate("/dashboard")}>Yes</button>
        <button className="no-btn" onClick={() => setShowConfirmPopup(false)}>No</button>
      </div>
    </div>
  </div>
)}

        {/* Beneficiary Details Card */}
        <div className="beneficiary-details-card">
          <h3>🏠 Beneficiary’s Details</h3>
          <p>Please provide the correct bank details to ensure the withdrawal reaches the right account.</p>

          <form onSubmit={handleSubmit} className="withdraw-form">
            <div className="input-group">
              <label>Beneficiary’s Account Number *</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
                placeholder="Account number"
              />
            </div>

            <div className="input-group">
              <label>Re-enter Bank Account Number *</label>
              <input
                type="text"
                value={reAccountNumber}
                onChange={(e) => setReAccountNumber(e.target.value)}
                required
                placeholder="Re-enter Account Number"
              />
            </div>

            <div className="input-group">
              <label>Beneficiary Name *</label>
              <input
                type="text"
                value={beneficiaryName}
                onChange={(e) => setBeneficiaryName(e.target.value)}
                required
                placeholder="Enter Beneficiary Name"
              />
            </div>

            <div className="input-group">
              <label>IFSC Code *</label>
              <input
                type="text"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                required
                placeholder="Enter IFSC Code"
              />
            </div>

            <div className="input-group">
              <label>PAN Number *</label>
              <input
                type="text"
                value={pan}
                onChange={(e) => setPan(e.target.value)}
                required
                placeholder="Enter PAN"
              />
            </div>

            <div className="button-group">
              <button 
                    type="submit" 
                    // className="submit-btn"
                    className="new-release-button "
                    >
                      Submit
              </button>
              <button type="button" className="btn-secondary" onClick={() => navigate("/dashboard")}>Cancel</button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default WithdrawPage;
