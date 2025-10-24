import { useLocation, useNavigate } from "react-router-dom";
import "../styles/NewReleasePage.css";
const NewReleasePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleSaveNext = () => {
    navigate("/preview-distribute"); // route to next page
  };

  return (
    <div className="new-release-container">
      <div className="new-release-card">
        <h2 className="page-title">Create a New Release</h2>

        <div className="platforms-container">
          <label className="platform-checkbox">
            <input
              type="checkbox"
              className="platform-btn"
              name="platform"
              value="Zing MP3"
            />
            Zing MP3
          </label>
          <label className="platform-checkbox">
            <input
              type="checkbox"
              name="platform"
              value="Tiktok"
              className="platform-btn"
            />
            Tiktok
          </label>
          <label className="platform-checkbox">
            <input type="checkbox" name="platform" value="Spotify" />
            Spotify
          </label>
          <label className="platform-checkbox">
            <input type="checkbox" name="platform" value="Soundcloud" />
            Soundcloud
          </label>
          <label className="platform-checkbox">
            <input type="checkbox" name="platform" value="Resso" />
            Resso
          </label>
        </div>

        <button className="save-next-btn" onClick={handleSaveNext}>
          Save & Next
        </button>
      </div>
    </div>
  );
};

export default NewReleasePage;
