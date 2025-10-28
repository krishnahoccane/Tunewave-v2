import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Wallet.css";

function Wallet() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [activeRow, setActiveRow] = useState(null);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const handleCloseClick = () => setShowConfirm(true);
  const handleYes = () => navigate("/");
  const handleNo = () => setShowConfirm(false);

  const handleMonthChange = (e) => setSelectedMonth(e.target.value);

  const transactions = [
    {
      date: "15/09/2025",
      id: "#123456",
      type: "Withdrawal",
      amount: "$1000",
      status: "Completed",
    },
    {
      date: "10/09/2025",
      id: "#123457",
      type: "Earnings",
      amount: "$500",
      status: "Pending",
    },
  ];

  const handleMenuToggle = (index) => {
    setActiveRow(activeRow === index ? null : index);
  };

  const handleAction = (transaction) => {
    if (transaction.status === "Completed") {
      const link = document.createElement("a");
      link.href = "/sample-report.pdf"; // Replace with actual file URL
      link.download = `${transaction.id}.pdf`;
      link.click();
    } else {
      navigate("/analytics");
    }
    setActiveRow(null);
  };

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveRow(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="pages-layout-container">
      {/* Top Bar */}
      <div className="pages-main-title">
        <h2>Wallet</h2>
        {/* <button className="close-btn" onClick={handleCloseClick}>X</button> */}
      </div>

      {/* Info Message */}
      <div className="wallet-info-message">
        Withdrawals are moving to TuneWave Pay — stay tuned!
      </div>

      {/* Info Cards */}
      <div className="wallet-info section">
        <div className="card-details">
          <h3>Card Details</h3>
          <div className="detail-row">
            <span>Beneficiary Name</span>
            <span>Prashanth Varma</span>
          </div>
          <div className="detail-row">
            <span>Bank Name</span>
            <span>ABC *****</span>
          </div>
          <div className="detail-row">
            <span>Account Number</span>
            <span>ABC0******</span>
          </div>
          <div className="detail-row">
            <span>IFSC Code</span>
            <span>ABC******</span>
          </div>
          <div className="detail-row">
            <span>PAN Number</span>
            <span>ABCDE1234F</span>
          </div>
        </div>

        {/* Wallet Balance + Withdraw */}
        <div className="wallet-balance">
          <h3>TuneWave Wallet</h3>
          <div className="balance-row">
            <p>$45,500.12</p>
            <button
              className="withdraw-btn"
              onClick={() =>
                // navigate("/wallet/withdraw")}
                navigate("/wallet")
              }
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Graph and Transactions */}
      <div className="wallet-main section">
        <div className="wallet-graph">
          <div className="graph-header">
            <h3>Overview Balance</h3>
            <div className="graph-controls">
              <select value={selectedMonth} onChange={handleMonthChange}>
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <small className="graph-help-text">
            Revenue generated from your releases on TuneWave
          </small>
          <div className="bar-graph">
            <div
              className="bar"
              style={{ height: "50px" }}
              title="$5,000"
            ></div>
            <div
              className="bar"
              style={{ height: "65px" }}
              title="$6,500"
            ></div>
            <div
              className="bar"
              style={{ height: "42px" }}
              title="$4,200"
            ></div>
            <div
              className="bar"
              style={{ height: "70px" }}
              title="$7,000"
            ></div>
            <div
              className="bar"
              style={{ height: "85px" }}
              title="$8,500"
            ></div>
            <div
              className="bar"
              style={{ height: "90px" }}
              title="$9,000"
            ></div>
          </div>
          <div className="bar-labels">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="wallet-table">
          <h3>Transactions</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Transaction ID</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index}>
                  <td>{tx.date}</td>
                  <td>{tx.id}</td>
                  <td>{tx.type}</td>
                  <td>{tx.amount}</td>
                  <td>{tx.status}</td>
                  <td style={{ position: "relative" }}>
                    <span
                      className="three-dots"
                      onClick={() => handleMenuToggle(index)}
                    >
                      ⋮
                    </span>
                    {activeRow === index && (
                      <div className="dropdown-menu" ref={menuRef}>
                        <button
                          className="dropdown-btn"
                          onClick={() => handleAction(tx)}
                        >
                          {tx.status === "Completed" ? "Download" : "Visualize"}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* </div> */}

      {/* Confirmation Popup */}
      {showConfirm && (
        <div className="confirm-popup">
          <div className="confirm-content">
            <p>Do you want to exit?</p>
            <div className="confirm-buttons">
              <button className="yes-btn" onClick={handleYes}>
                Yes
              </button>
              <button className="no-btn" onClick={handleNo}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="form-actions">
        <button className="btn-cancel" onClick={() => navigate("/")}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default Wallet;
