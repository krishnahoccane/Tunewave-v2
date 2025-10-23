// src/pages/WithdrawRequest.jsx
import React, { useState } from "react";
import "../styles/WithdrawPage.css";

const WithdrawRequest = () => {
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
    console.log({ accountNumber, beneficiaryName, ifsc, pan });
    alert("Withdrawal request submitted successfully!");
    // Reset form
    setAccountNumber("");
    setReAccountNumber("");
    setBeneficiaryName("");
    setIfsc("");
    setPan("");
  };

  return (
    <div className="withdraw-page">
      <div className="withdraw-container">
        <h2 className="withdraw-title">Withdraw Request</h2>
        <p className="withdraw-subtitle">
          Please provide the correct bank details to ensure the withdrawal reaches the right account.
        </p>

        <form onSubmit={handleSubmit} className="withdraw-form">
          <div className="input-group">
            <label>Beneficiary’s Account Number *</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Re-enter Bank Account Number *</label>
            <input
              type="text"
              value={reAccountNumber}
              onChange={(e) => setReAccountNumber(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Beneficiary Name *</label>
            <input
              type="text"
              value={beneficiaryName}
              onChange={(e) => setBeneficiaryName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>IFSC Code *</label>
            <input
              type="text"
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>PAN Number *</label>
            <input
              type="text"
              value={pan}
              onChange={(e) => setPan(e.target.value)}
              required
            />
          </div>

          <div className="button-group">
            
            <button
              type="reset"
              onClick={() => {
                setAccountNumber("");
                setReAccountNumber("");
                setBeneficiaryName("");
                setIfsc("");
                setPan("");
              }}
              className="cancel-button"
            >
              Cancel
            </button>
            <button type="submit" className="submit-button">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawRequest;
