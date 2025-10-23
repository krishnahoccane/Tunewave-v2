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
    <div className="pages-layout-container">
      <h2 className="pages-main-title">Beneficiary’s Details - (Withdraw Request)</h2>
      {/* Withdraw Request Title with Close Symbol */}

      {/* <div className="withdraw-content"> */}

        {/* Confirmation Popup */}
        

        {/* Beneficiary Details Card */}
        {/* <div className="beneficiary-details-card"> */}
           <div className="wallet-info-message">
          <p>Please provide the correct bank details to ensure the withdrawal reaches the right account.</p>

        </div>
          
          <form onSubmit={handleSubmit} className="withdraw-form ">
            <div className="input-group section">
              <label>Beneficiary’s Account Number <span className="required">*</span></label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
                placeholder="Account number"
              />
            </div>

            <div className="input-group section">
              <label>Re-enter Bank Account Number <span className="required">*</span></label>
              <input
                type="text"
                value={reAccountNumber}
                onChange={(e) => setReAccountNumber(e.target.value)}
                required
                placeholder="Re-enter Account Number"
              />
            </div>

            <div className="input-group section">
              <label>Beneficiary Name <span className="required">*</span></label>
              <input
                type="text"
                value={beneficiaryName}
                onChange={(e) => setBeneficiaryName(e.target.value)}
                required
                placeholder="Enter Beneficiary Name"
              />
            </div>

            <div className="input-group section">
              <label>IFSC Code <span className="required">*</span></label>
              <input
                type="text"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                required
                placeholder="Enter IFSC Code"
              />
            </div>

            <div className="input-group section" >
              <label>PAN Number <span className="required">*</span></label>
              <input
                type="text"
                value={pan}
                onChange={(e) => setPan(e.target.value)}
                required
                placeholder="Enter PAN"
              />
            </div>



              {showConfirmPopup && (
                                <div className="confirm-popup">
                                  <div className="confirm-content">
                                    <p>Do you want to confirm exit?</p>
                                    <div className="popup-actions">
                                      <button 
                                        className="btn-gradient" 
                                        onClick={() => navigate("/dashboard")}
                                      >
                                        Yes
                                      </button>
                                      <button 
                                        className="btn-cancel" 
                                        onClick={() => setShowConfirmPopup(false)}
                                      >
                                        No
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}

            
          </form><div className="popup-actions">
              
              <button 
                      type="button" 
                      className="btn-cancel" 
                      // onClick={() => navigate("/dashboard")}
                        onClick={() => setShowConfirmPopup(true)}
                      >
                      Cancel
              </button>


              <button 
                    type="button" 
                    // className="submit-btn"
                    className="btn-gradient"
                    >
                      Submit
              </button>
            </div>
        </div>

      // </div>
    // </div>
  );
};

export default WithdrawPage;
