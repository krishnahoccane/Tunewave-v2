import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TicketRaisePage.css";

const TicketPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("raise");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDetail, setShowDetail] = useState(false); // controls detail view

  const tickets = [
    {
      ticketNo: "TW12342025",
      issueType: "High Priority",
      description:
        "Unable to upload my song – the site keeps rejecting my WAV file saying unsupported format, even though it meets the required specs.",
      status: "Pending",
      dateTime: "15/09/2025 - 10:00 AM",
    },
    {
      ticketNo: "TW12342026",
      issueType: "Normal",
      description: "Minor issue with metadata",
      status: "Solved",
      dateTime: "15/09/2025 - 10:00 AM",
    },
  ];

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.ticketNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.issueType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="ticket-page">
      <div className="ticket-container">
        {/* Top-left back symbol */}
        <span
          className="back-button"
          onClick={() => {
            if (showDetail) {
              setShowDetail(false); // go back to ticket selection
              setSelectedTicket(null); // deselect ticket
            } else {
              navigate(-1); // go back to previous page (front page)
            }
          }}
          style={{
            position: "absolute",
            left: "20px",
            top: "20px",
            cursor: "pointer",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          ⏴
        </span>

        <h2 style={{textAlign:"center"}}>Tickets</h2>

        {/* Tabs */}
        <div className="ticket-tabs">
          <button
            type="button"
            className={activeTab === "raise" ? "active" : ""}
            onClick={() => setActiveTab("raise")}
          >
            Raise Ticket
          </button>
          <button
            type="button"
            className={activeTab === "myTickets" ? "active" : ""}
            onClick={() => setActiveTab("myTickets")}
          >
            My Tickets
          </button>
        </div>

        {/* Raise Ticket Form */}
        {activeTab === "raise" && (
          <form className="ticket-form" onSubmit={(e) => e.preventDefault()}>
            <label>
              <div>
                Issue Type <span className="required">*</span>
                </div>
              <select required>
                <option value="" disabled>
                  Select issue type
                </option>
                <option value="emergency">Emergency</option>
                <option value="high">High Priority</option>
                <option value="support">Support Request</option>
                <option value="normal">Normal</option>
              </select>
            </label>

            <label>
              <div>
                 Description <span className="required">*</span>

              </div>
             
              <textarea placeholder="Enter your issue" required />
            </label>

            <label>
              Upload File
              <input type="file" />
            </label>

            <button type="submit" className="new-release-button" style={{ width:"100Px" , marginLeft:"40%" }}>
              Submit
            </button>
          </form>
        )}

        {/* My Tickets Table */}
        {activeTab === "myTickets" && !showDetail && (
          <div className="tickets-list">
            {/* Search Bar */}
            <div className="ticket-search">
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <table>
              <thead>
                <tr>
                  <th>Ticket No</th>
                  <th>Issue Type</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Date & Time</th>
                  <th>Select</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket, index) => (
                    <tr key={index}>
                      <td>{ticket.ticketNo}</td>
                      <td>{ticket.issueType}</td>
                      <td>{ticket.description.slice(0, 30)}...</td>
                      <td>{ticket.status}</td>
                      <td>{ticket.dateTime}</td>
                      <td>
                        <input
                          type="radio"
                          name="selectedTicket"
                          onChange={() => setSelectedTicket(ticket)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                      No tickets found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Next Button appears only when a ticket is selected */}
            {selectedTicket && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                <button
                  className="new-release-button" style={{ width:"100Px"  }}
                  onClick={() => setShowDetail(true)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Ticket Detail View */}
        {activeTab === "myTickets" && showDetail && selectedTicket && (
          <div className="ticket-detail">
            <h3>Ticket Detail</h3>
            <div className="detail-row">
              <span>Ticket No:</span>
              <span>{selectedTicket.ticketNo}</span>
            </div>
            <div className="detail-row">
              <span>Date & Time:</span>
              <span>{selectedTicket.dateTime}</span>
            </div>
            <div className="detail-row">
              <span>Issue Type:</span>
              <span>{selectedTicket.issueType}</span>
            </div>
            <div className="detail-row">
              <span>Description:</span>
              <span>{selectedTicket.description}</span>
            </div>
            <div className="detail-row">
              <span>Status:</span>
              <span>{selectedTicket.status}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                className="new-release-button" style={{ width:"100Px"  }}
                onClick={() => {
                  setShowDetail(false);
                  setSelectedTicket(null);
                  navigate("/") 
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketPage;
