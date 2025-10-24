import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import "../styles/AnalyticsPage.css";

const AnalyticsPage = () => {
  const [showExitPopup, setShowExitPopup] = useState(false);

  // Multi-DSP Line Chart Data
  const lineData = [
    { month: "Jan", youtube: 200, spotify: 150, apple: 100 },
    { month: "Feb", youtube: 400, spotify: 300, apple: 200 },
    { month: "Mar", youtube: 300, spotify: 250, apple: 150 },
    { month: "Apr", youtube: 500, spotify: 350, apple: 200 },
    { month: "May", youtube: 450, spotify: 400, apple: 250 },
  ];

  // Weekly Bar Chart Data
  const weeklyData = [
    { day: "Mon", revenue: 250000 },
    { day: "Tue", revenue: 50000 },
    { day: "Wed", revenue: 10000 },
    { day: "Thu", revenue: 2000 },
    { day: "Fri", revenue: 0 },
  ];

  return (
    <div className="analytics-page">
      {/* Close Button */}
      {/* <button className="close-btn" onClick={() => setShowExitPopup(true)}>
        ×
      </button> */}

      <h2>Analytics</h2>

      {/* Filters */}
      <div className="filters">
        <select className="small-dropdown">
          <option>Sort By: DSP</option>
          <option>Revenue</option>
          <option>Territory</option>
          <option>Asset</option>
          <option>Product</option>
          <option>Artist</option>
        </select>
        <input type="date" placeholder="Start Date" />
        <input type="date" placeholder="End Date" />
      </div>

      {/* Total Streams */}
      <div className="total-streams">
        <h3>Total Streams</h3>
        <p>25,430</p>
      </div>

      {/* Multi-DSP Line Chart */}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="youtube"
              stroke="#FF0000"
              name="YouTube Music"
            />
            <Line
              type="monotone"
              dataKey="spotify"
              stroke="#1DB954"
              name="Spotify Music"
            />
            <Line
              type="monotone"
              dataKey="apple"
              stroke="#000000"
              name="Apple Music"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* DSP Table */}
      <div className="table-container">
        <h3>DSP</h3>
        <table>
          <thead>
            <tr>
              <th>DSP</th>
              <th>Streams</th>
              <th>Downloads</th>
              <th>Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>YouTube Music</td>
              <td>888,678</td>
              <td>-</td>
              <td>$88.68</td>
            </tr>
            <tr>
              <td>Spotify Music</td>
              <td>888,678</td>
              <td>-</td>
              <td>$88.68</td>
            </tr>
            <tr>
              <td>Apple Music</td>
              <td>888,678</td>
              <td>-</td>
              <td>$88.68</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Top Tracks Table */}
      <div className="table-container">
        <h3>Top Tracks</h3>
        <table>
          <thead>
            <tr>
              <th>Track</th>
              <th>Artist</th>
              <th>Revenue</th>
              <th>% Share</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Lucid Dreams</td>
              <td>Kavya</td>
              <td>$160.00</td>
              <td>57.8%</td>
            </tr>
            <tr>
              <td>Lucid Dreams</td>
              <td>Kavya</td>
              <td>$160.00</td>
              <td>57.8%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Top Releases Table */}
      <div className="table-container">
        <h3>Top Releases</h3>
        <table>
          <thead>
            <tr>
              <th>Track</th>
              <th>Artist</th>
              <th>Revenue</th>
              <th>% Share</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Lucid Dreams</td>
              <td>Kavya</td>
              <td>$160.00</td>
              <td>57.8%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Top Artists Table */}
      <div className="table-container">
        <h3>Top Artists</h3>
        <table>
          <thead>
            <tr>
              <th>Artist</th>
              <th>Revenue</th>
              <th>% Share</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Post Malone</td>
              <td>$160.00</td>
              <td>57.8%</td>
            </tr>
            <tr>
              <td>Astrix</td>
              <td>$160.00</td>
              <td>57.8%</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Statistics Section with Bar Chart */}
      <div className="chart-container">
        <h3>Statistics</h3>
        <h4>Weekly Comparison</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={[
              { period: "Last Day", revenue: 50000 },
              { period: "Today", revenue: 250000 },
            ]}
            barGap={20} // Gap between bars in the same group
            barCategoryGap="40%" // Gap between categories
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Bar dataKey="revenue" fill="#1278BB" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Exit Popup */}
      {showExitPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <p>Are you sure you want to exit Analytics?</p>
            <div className="popup-actions">
              <button onClick={() => setShowExitPopup(false)}>Cancel</button>
              <button
                className="confirm"
                onClick={() => (window.location.href = "/dashboard")}
              >
                Yes, Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
