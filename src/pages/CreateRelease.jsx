// // // /* eslint-disable no-unused-vars */
// // // import "../styles/CreateRelease.css";
// // // import { useNavigate } from "react-router-dom";
// // // import { useState, useEffect } from "react";
// // // import DustbinIcon from "../assets/Dustbin.svg";
// // // import iIcon from "../assets/material-symbols_info-outline.png";
// // // import cloud from "../assets/Vector@3x.png";
// // // import dot from "../assets/Component 22.png";
// // // import axios from "axios";

// // // function CreateRelease() {
// // //   const navigate = useNavigate();
// // //   const [fileUploaded, setFileUploaded] = useState(null);
// // //   const [showArtistModal, setShowArtistModal] = useState(false);
// // //   const [artistImage, setArtistImage] = useState(null);
// // //   const [showLocalizeModal, setShowLocalizeModal] = useState(false);

// // //   const [showLinkProfileModal, setShowLinkProfileModal] = useState(false);
// // //   const [selectedProfile, setSelectedProfile] = useState("");
// // //   const [artistProfileId, setArtistProfileId] = useState("");

// // //   const [showAddArtistModal, setShowAddArtistModal] = useState(false);
// // //   const [showPerformer, setShowPerformer] = useState(false);
// // //   const [showProducer, setShowProducer] = useState(false);
// // //   const [artist, setArtist] = useState(false);
// // //   const [showicons, seticons] = useState(true);
// // //   //const [artistRole, setArtistRole] = useState("");
// // //   //const [artistName, setArtistName] = useState("");
// // //   const [mainArtist, setMainArtist] = useState("");
// // //   const [artistDropDownRole, setArtistDropDownRole] = useState("");
// // //   const [producerDropDownRole, setproducerDropDownRole] = useState("");
// // //   const [performerDropDownRole, setperformerDropDownRole] = useState("");
// // //   // State to control second dropdown visibility
// // //   const [showSecondDropdown, setShowSecondDropdown] = useState(false);
// // //   const [showthirdDropdown, setthirdDropDown] = useState(false);

// // //   const [contributors, setContributors] = useState([]);
// // //   const [artistdropDownName, setArtistdropDownName] = useState("");
// // //   const [linkedProfiles, setLinkedProfiles] = useState({
// // //     Spotify: "",
// // //     AppleMusic: "",
// // //     SoundCloud: "",
// // //   });

// // //   //back-end states for input fileds

// // //   //   const languages = ["Ahirani",
// // //   // "Arabic",
// // //   // "Assamese",
// // //   // "Bengali",
// // //   // "Awadhi",
// // //   // "Burmese",
// // //   // "Chhattisgarhi",
// // //   // "Chinese",
// // //   // "Dogri",
// // //   // "English",
// // //   // "French",
// // //   // "Garhwali",
// // //   // "Garo",
// // //   // "Gujarati",
// // //   // "Haryanvi",
// // //   // "Himachali",
// // //   // "Hindi",
// // //   // "Iban",
// // //   // "Indonesian",
// // //   // "Instrumental",
// // //   // "Italian",
// // //   // "Japanese",
// // //   // "Javanese",
// // //   // "Kannada",
// // //   // "Kashmiri",
// // //   // "Khasi",
// // //   // "Kokborok",
// // //   // "Konkani",
// // //   // "Korean",
// // //   // "Kumauni",
// // //   // "Latin",
// // //   // "Maithili",
// // //   // "Malay",
// // //   // "Malayalam",
// // //   // "Mandarin",
// // //   // "Manipuri",
// // //   // "Bhojpuri",
// // //   // "Marathi",
// // //   // "Banjara",
// // //   // "Marwari",
// // //   // "Naga",
// // //   // "Nagpuri",
// // //   // "Nepali",
// // //   // "Odia",
// // //   // "Pali",
// // //   // "Persian",
// // //   // "Punjabi",
// // //   // "Rajasthani",
// // //   // "Sainthili",
// // //   // "Sambalpuri",
// // //   // "Sanskrit",
// // //   // "Santali",
// // //   // "Sindhi",
// // //   // "Sinhala",
// // //   // "Spanish",
// // //   // "Swahili",
// // //   // "Tamil",
// // //   // "Telugu",
// // //   // "Thai",
// // //   // "Tibetan",
// // //   // "Tulu",
// // //   // "Turkish",
// // //   // "Ukrainian",
// // //   // "Urdu","Zxx"]

// // //   //backend -data -passed
// // //   const [releaseTitle, setReleaseTitle] = useState("");
// // //   const [titleVersion, setTitleVersion] = useState("");
// // //   const [localizations, setLocalizations] = useState([
// // //     { language: "", localizedTitle: "", titleVersion: "" },
// // //   ]);

// // //   // Step 2: Cover Artwork
// // //   const [coverArtwork, setCoverArtwork] = useState(null); // File object
// // //   const [fileError, setFileError] = useState("");

// // //   // Step 4: Genres
// // //   const [primaryGenre, setPrimaryGenre] = useState("");
// // //   const [secondaryGenre, setSecondaryGenre] = useState("");

// // //   // Step 5: Dates
// // //   const [digitalReleaseDate, setDigitalReleaseDate] = useState("");
// // //   const [originalReleaseDate, setOriginalReleaseDate] = useState("");

// // //   // Step 6: UPC
// // //   const [hasUPC, setHasUPC] = useState(null); // 'yes' or 'no'
// // //   const [upcCode, setUpcCode] = useState("");
// // //   const [profile, setProfileModel] = useState("");

// // //   // Example: adding/updating a contributor
// // //   const addContributor = (contributor) => {
// // //     setContributors([...contributors, contributor]);
// // //   };

// // //   const openLinkProfileModal = (a) => {
// // //     setProfileModel(e);
// // //   };

// // //   // Step 7: Form submission
// // //   const handleSubmit = async () => {
// // //     const formData = new FormData();
// // //     formData.append("releaseTitle", releaseTitle);
// // //     formData.append("titleVersion", titleVersion);
// // //     formData.append("digitalReleaseDate", digitalReleaseDate);
// // //     formData.append("originalReleaseDate", originalReleaseDate);
// // //     formData.append("primaryGenre", primaryGenre);
// // //     formData.append("secondaryGenre", secondaryGenre);
// // //     formData.append("hasUPC", hasUPC);
// // //     if (coverArtwork) {
// // //       formData.append("coverArtwork", coverArtwork); // <--- File object goes here
// // //     }
// // //     if (hasUPC === "yes") formData.append("upcCode", upcCode);
// // //     if (coverArtwork) formData.append("coverArtwork", coverArtwork);

// // //     // Convert arrays/objects to JSON string if sending via FormData
// // //     formData.append("localizations", JSON.stringify(localizations));
// // //     formData.append("contributors", JSON.stringify(contributors));

// // //     const openLinkProfileModal = (profile) => {
// // //       setSelectedProfile(profile);
// // //       setArtistProfileId("");
// // //       setShowLinkProfileModal(true);
// // //     };

// // //     const object = {};
// // //     formData.forEach((value, key) => {
// // //       object[key] = value;
// // //     });

// // //     const collectionPayload = {
// // //       collection: {
// // //         info: {
// // //           name: object.releaseTitle || "New Collection",
// // //           schema:
// // //             "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
// // //         },
// // //         item: [
// // //           {
// // //             name: "Sample Request", // Give a request name
// // //             request: {
// // //               method: "POST",
// // //               header: [],
// // //               body: {
// // //                 mode: "raw",
// // //                 raw: JSON.stringify({
// // //                   form_id: 1,
// // //                   releaseTitle,
// // //                   titleVersion,
// // //                   digitalReleaseDate,
// // //                   originalReleaseDate,
// // //                   coverArtwork,
// // //                   primaryGenre,
// // //                   secondaryGenre,
// // //                   hasUPC,
// // //                   upcCode: hasUPC === "yes" ? upcCode : "",
// // //                   localizations,
// // //                   contributors,
// // //                 }),
// // //               },
// // //               url: {
// // //                 raw: "https://your-api-endpoint.com",
// // //                 protocol: "https",
// // //                 host: ["your-api-endpoint", "com"],
// // //               },
// // //             },
// // //           },
// // //         ], // You can add requests here if needed
// // //       },
// // //     };

// // //     // eslint-disable-next-line no-undef

// // //     try {
// // //       const response = await axios.post(
// // //         "/wp/wp-json/gf/v2/entries",
// // //         collectionPayload,
// // //         {
// // //           headers: {
// // //            Authorization: `Basic ${btoa("ck_23e474a3a4a15b8460b78f01bc60d565dd7f94c5:cs_84ee6ec3c485d7727560ad9103ed3311d2afb088")}`,
// // //             "Content-type": "application/json",
// // //           },
// // //         }
// // //       );

// // //       console.log("Postman API Response:", response.data);
// // //     } catch (error) {
// // //       console.error(
// // //         "Error posting to Postman API:",
// // //         error.response?.data || error.message
// // //       );
// // //     }
// // //   };

// // //   const saveContributor = () => {
// // //     kk;
// // //     if (!artistdropDownName) return;

// // //     const newContributor = {
// // //       type: "Main Primary Artist",
// // //       name: artistdropDownName,
// // //       linkedProfiles,
// // //     };

// // //     setContributors([...contributors, newContributor]); // ✅ store contributor
// // //     setArtistdropDownName("");
// // //     setLinkedProfiles({ Spotify: "", AppleMusic: "", SoundCloud: "" });
// // //     setShowArtistModal(false);
// // //   };

// // //   //https://api.getpostman.com/collections

// // //   // const token = localStorage.getItem("jwtToken");

// // //   // const fetchDetails =  async ()=>{
// // //   //    try {
// // //   //       const response = await fetch("https://api.getpostman.com/collections", {
// // //   //       });

// // //   //       if (!response.ok) {
// // //   //         throw new Error("Failed to fetch collections");
// // //   //       }

// // //   //       const data = await response.json();
// // //   //       console.log(data)
// // //   //     } catch (error) {
// // //   //       console.error("Error fetching Postman collections:", error);
// // //   //     }

// // //   // }

// // //   // useEffect(()=>{

// // //   //   fetchDetails()

// // //   // },[])

// // //   const handleFileChange = (e) => {
// // //     const file = e.target.files[0];
// // //     if (!file) return;

// // //     const img = new window.Image();
// // //     img.src = URL.createObjectURL(file);
// // //     img.onload = function () {
// // //       if (img.width === 3000 && img.height === 3000) {
// // //         setCoverArtwork(file);
// // //         setFileUploaded(file);
// // //         setFileError("");
// // //       } else {
// // //         setCoverArtwork(null);
// // //         setFileError("Image must be exactly 3000px by 3000px.");
// // //       }
// // //       URL.revokeObjectURL(img.src);
// // //     };
// // //   };

// // //   return (
// // //     <div className="create-release-page">
// // //       <h2 className="page-title">Create A New Release</h2>

// // //       {/* Step 1 */}
// // //       <div className="section">
// // //         <h3>Enter Release Details</h3>

// // //         <div className="input-group">
// // //           <label htmlFor="title">
// // //             Release Title <span style={{ color: "red" }}>*</span>{" "}
// // //           </label>
// // //           <input
// // //             type="text"
// // //             id="title"
// // //             placeholder="e.g., I got my summer"
// // //             className="input-field"
// // //             onChange={(e) => setReleaseTitle(e.target.value)}
// // //             value={releaseTitle}
// // //             style={{ width: "50%" }}
// // //           />
// // //         </div>
// // //         <br />

// // //         <div className="input-group">
// // //           <label htmlFor="titleversion">Title Version</label>
// // //           <input
// // //             type="text"
// // //             id="titleversion"
// // //             placeholder="e.g., Live, Remix, Remastered"
// // //             className="input-field"
// // //             onChange={(e) => setTitleVersion(e.target.value)}
// // //             value={titleVersion}
// // //             style={{ width: "50%" }}
// // //           />
// // //         </div>
// // //         <br />

// // //         <span></span>

// // //         <button
// // //           className="btn-secondary"
// // //           style={{ marginLeft: "140px" }}
// // //           onClick={() => setShowLocalizeModal(true)}
// // //         >
// // //           Localize Your Release
// // //         </button>

// // //         <br />

// // //         <div className="box-i-showdow">
// // //           <div className="box-i">
// // //             <p className="field-tip">
// // //               ℹ️ Apple does not allow changes to Artist Name and Artist ID after
// // //               initial submission.
// // //             </p>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Localize Your Release Modal Popup */}
// // //       {showLocalizeModal && (
// // //         <div className="modal-overlay">
// // //           <div className="modal-container">
// // //             <h2>Localize Your Release</h2>

// // //             <label>Language *</label>
// // //             <input
// // //               type="text"
// // //               placeholder="e.g., English, French"
// // //               className="input-field"
// // //               value={localizations[0].language} // bind to state
// // //               onChange={(e) => {
// // //                 const newLocalizations = [...localizations];
// // //                 newLocalizations[0].language = e.target.value;
// // //                 setLocalizations(newLocalizations);
// // //               }}
// // //             />

// // //             <label>Localized Title *</label>
// // //             <input
// // //               type="text"
// // //               placeholder="Localized Title"
// // //               className="input-field"
// // //               value={localizations[0].localizedTitle}
// // //               onChange={(e) => {
// // //                 const newLocalizations = [...localizations];
// // //                 newLocalizations[0].localizedTitle = e.target.value;
// // //                 setLocalizations(newLocalizations);
// // //               }}
// // //             />

// // //             <label>Title Version</label>
// // //             <input
// // //               type="text"
// // //               placeholder="Optional"
// // //               className="input-field"
// // //               value={localizations[0].titleVersion}
// // //               onChange={(e) => {
// // //                 const newLocalizations = [...localizations];
// // //                 newLocalizations[0].titleVersion = e.target.value;
// // //                 setLocalizations(newLocalizations);
// // //               }}
// // //             />

// // //             <div className="button-group">
// // //               <button
// // //                 className="btn-secondary"
// // //                 onClick={() => setShowLocalizeModal(false)}
// // //               >
// // //                 Cancel
// // //               </button>
// // //               <button
// // //                 className="new-release-button"
// // //                 onClick={() => setShowLocalizeModal(false)}
// // //               >
// // //                 Apply
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Step 2 */}
// // //       <div className="section upload-section">
// // //         <h3>Upload Cover Artwork</h3>
// // //         <div className="form-grid">
// // //           <div
// // //             className="upload-box"
// // //             onClick={() => document.getElementById("fileInput").click()}
// // //           >
// // //             <input
// // //               type="file"
// // //               id="fileInput"
// // //               style={{ display: "none" }}
// // //               accept="image/png, image/jpeg, image/jpg, image/jfif"
// // //               onChange={handleFileChange} // <-- use new handler
// // //             />
// // //             {fileUploaded ? (
// // //               <img
// // //                 src={URL.createObjectURL(fileUploaded)}
// // //                 alt="Preview"
// // //                 className="upload-preview"
// // //               />
// // //             ) : (
// // //               <div className="text">
// // //                 <p>
// // //                   <img src={cloud} className="could-img" alt="could-image" />
// // //                   Drag here or click to browse a file
// // //                 </p>
// // //                 <p className="file-types">
// // //                   Supported: JPG, JPEG, PNG, JFIF (Must be exactly 3000px x
// // //                   3000px, Max 10MB)
// // //                 </p>
// // //                 {fileError && <p style={{ color: "red" }}>{fileError}</p>}
// // //               </div>
// // //             )}
// // //           </div>

// // //           <div className="tips-box">
// // //             <h4>Tips:</h4>
// // //             <p>
// // //               Please ensure your cover art is square, less than 10 MB and a
// // //               minimum of 3000px wide (3000px width is recommended for best
// // //               results).
// // //             </p>
// // //             <br />
// // //             <h3>Your cover art cannot contain:</h3>
// // //             <ul>
// // //               <li>
// // //                 <img src={dot} />
// // //                 Any text other than the release title and/or artist name
// // //               </li>
// // //               <li>
// // //                 <img src={dot} />
// // //                 Third-party logos or trademarks without express written consent
// // //                 from the trademark holder
// // //               </li>
// // //               <li>
// // //                 <img src={dot} />
// // //                 Sexually explicit imagery
// // //               </li>
// // //               <li>
// // //                 <img src={dot} />
// // //                 Supported: JPG, JPEG, PNG, JFIF
// // //               </li>
// // //             </ul>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Step 3 */}
// // //       <div className="section">
// // //         <h3>Contributors</h3>

// // //         {showicons && (
// // //           <div className="contributors-buttons">
// // //             <button
// // //               className="btn-secondary"
// // //               onClick={() => {
// // //                 setShowArtistModal(true);
// // //                 setArtistDropDownRole("");
// // //                 setShowSecondDropdown(false);
// // //                 setthirdDropDown(false);
// // //               }}
// // //             >
// // //               + Add Main Primary Artist
// // //             </button>

// // //             <button
// // //               className="btn-secondary"
// // //               onClick={() => {
// // //                 setShowAddArtistModal(true);
// // //                 setArtistDropDownRole("");
// // //                 setShowSecondDropdown(false);
// // //                 setthirdDropDown(false);
// // //               }}
// // //             >
// // //               + Add Artist
// // //             </button>

// // //             <button
// // //               className="btn-secondary"
// // //               onClick={() => {
// // //                 setShowPerformer(true);
// // //                 setperformerDropDownRole("");
// // //                 setShowSecondDropdown(false);
// // //                 setthirdDropDown(false);
// // //               }}
// // //             >
// // //               + Add Performer
// // //             </button>

// // //             <button
// // //               className="btn-secondary"
// // //               onClick={() => {
// // //                 setShowProducer(true);
// // //                 setproducerDropDownRole("");
// // //                 setShowSecondDropdown(false);
// // //                 setthirdDropDown(false);
// // //               }}
// // //             >
// // //               + Add Credit
// // //             </button>
// // //           </div>
// // //         )}

// // //         <div className="box-i-showdow">
// // //           <div className="box-i">
// // //             <p className="field-tip">
// // //               ℹ️ Apple does not allow changes to Artist Name and Artist ID after
// // //               initial submission.
// // //             </p>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Artist Modal new Popup */}

// // //       {showArtistModal && (
// // //         <div className="modal-overlay">
// // //           <div className="modal-content">
// // //             <h3>Add Main Primary Artist</h3>

// // //             {/* Artist selection */}
// // //             <div className="second-dropdown">
// // //               <label className="input-label">
// // //                 Artist Name <span style={{ color: "red" }}>*</span>
// // //               </label>
// // //               <select
// // //                 className="input-field"
// // //                 style={{ width: "100%" }}
// // //                 id="DropDownArtistName"
// // //                 required
// // //                 value={artistdropDownName}
// // //                 onChange={(e) => {
// // //                   setArtistdropDownName(e.target.value);
// // //                   setthirdDropDown(!!e.target.value);
// // //                 }}
// // //               >
// // //                 <option value="" disabled>
// // //                   Select Artist
// // //                 </option>
// // //                 <option value="Kavya">Kavya</option>
// // //                 <option value="Venala">Venala</option>
// // //                 <option value="Isha">Isha</option>
// // //                 <option value="Krishna">Krishna</option>
// // //               </select>
// // //             </div>

// // //             {showthirdDropdown && (
// // //               <div>
// // //                 {/* Localization button */}
// // //                 <div style={{ marginTop: "30px", marginLeft: "35%" }}>
// // //                   <button
// // //                     className="btn-secondary localize-btn"
// // //                     onClick={() => {
// // //                       setShowLocalizeModal(true);
// // //                       setShowArtistModal(false);
// // //                     }}
// // //                   >
// // //                     Localize Your Release
// // //                   </button>
// // //                 </div>

// // //                 {/* Info section */}
// // //                 <p className="field-tip">
// // //                   Select the services where the artist has previously
// // //                   distributed...
// // //                 </p>
// // //                 <div className="box-i-showdow">
// // //                   <div className="box-i">
// // //                     <img src={iIcon} />
// // //                     <p>
// // //                       In order for your release to appear on the updated
// // //                       profile, please redeliver
// // //                     </p>
// // //                   </div>
// // //                 </div>

// // //                 {/* Link profile buttons */}
// // //                 <div className="profile-buttons-box">
// // //                   {["SoundCloud", "Spotify", "AppleMusic"].map((platform) => (
// // //                     <div key={platform} className="profile-button">
// // //                       <span>{platform}</span>
// // //                       <button
// // //                         className="link-btn"
// // //                         onClick={() => {
// // //                           const link = prompt(`Enter ${platform} profile URL`);
// // //                           if (link) {
// // //                             setLinkedProfiles((prev) => ({
// // //                               ...prev,
// // //                               [platform]: link,
// // //                             }));
// // //                           }
// // //                         }}
// // //                       >
// // //                         Link Profile
// // //                       </button>
// // //                     </div>
// // //                   ))}
// // //                 </div>

// // //                 {/* Save contributor */}
// // //                 <div style={{ marginTop: "20px", textAlign: "right" }}>
// // //                   <button
// // //                     className="btn-secondary"
// // //                     onClick={() => setShowArtistModal(false)}
// // //                   >
// // //                     Cancel
// // //                   </button>
// // //                   <button
// // //                     className="new-release-button"
// // //                     onClick={saveContributor}
// // //                   >
// // //                     Save Artist
// // //                   </button>
// // //                 </div>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Artist Modal Popup */}
// // //       {artist && (
// // //         <div className="modal-overlay">
// // //           <div className="modal-content">
// // //             <h3>Create a new Main Primary Artist</h3>

// // //             <div className="artist-image-box">
// // //               <input
// // //                 type="file"
// // //                 id="artistImageInput"
// // //                 style={{ display: "none" }}
// // //                 accept="image/png, image/jpeg, image/jpg, image/jfif"
// // //                 onChange={(e) => setArtistImage(e.target.files[0])}
// // //               />

// // //               {artistImage ? (
// // //                 <div
// // //                   style={{
// // //                     position: "relative",
// // //                     width: "140px",
// // //                     height: "140px",
// // //                   }}
// // //                 >
// // //                   <img
// // //                     src={URL.createObjectURL(artistImage)}
// // //                     alt="Artist Preview"
// // //                     style={{
// // //                       width: "100%",
// // //                       height: "100%",
// // //                       borderRadius: "50%",
// // //                       objectFit: "cover",
// // //                     }}
// // //                   />
// // //                   <button
// // //                     type="button"
// // //                     className="btn-reselect-icon"
// // //                     onClick={() =>
// // //                       document.getElementById("artistImageInput").click()
// // //                     }
// // //                     style={{
// // //                       position: "absolute",
// // //                       bottom: "5px",
// // //                       right: "5px",
// // //                       width: "30px",
// // //                       height: "30px",
// // //                       borderRadius: "50%",
// // //                       backgroundColor: "#2563eb",
// // //                       color: "#fff",
// // //                       border: "none",
// // //                       fontWeight: "bold",
// // //                       cursor: "pointer",
// // //                     }}
// // //                   >
// // //                     +
// // //                   </button>
// // //                 </div>
// // //               ) : (
// // //                 <div
// // //                   className="placeholder-icon"
// // //                   onClick={() =>
// // //                     document.getElementById("artistImageInput").click()
// // //                   }
// // //                   style={{
// // //                     width: "140px",
// // //                     height: "140px",
// // //                     borderRadius: "50%",
// // //                     backgroundColor: "#f3f4f6",
// // //                     display: "flex",
// // //                     justifyContent: "center",
// // //                     alignItems: "center",
// // //                     fontSize: "50px",
// // //                     color: "#2563eb",
// // //                     cursor: "pointer",
// // //                   }}
// // //                 >
// // //                   +
// // //                 </div>
// // //               )}
// // //             </div>

// // //             <p className="image-support-text">
// // //               We Support PNG, JFIF, JPEG, Or JPG Images.
// // //             </p>

// // //             <div className="input-group">
// // //               <label className="input-label">enter your name</label>
// // //               <input
// // //                 type="text"
// // //                 placeholder="Your Name Here"
// // //                 className="input-field"
// // //               />
// // //             </div>

// // //             <div style={{ marginTop: "30px" }}>
// // //               {" "}
// // //               {/* Add spacing before button */}
// // //               <button className="btn-secondary ">Localize Your Release</button>
// // //             </div>

// // //             <p className="field-tip">
// // //               Enter the name exactly as you want it to appear on platforms like
// // //               Spotify, Apple Music, etc.
// // //             </p>

// // //             <div className="profile-buttons-box">
// // //               <div className="profile-button">
// // //                 <i className="fab fa-soundcloud"></i>
// // //                 <span>SoundCloud</span>
// // //                 <button
// // //                   className="link-btn"
// // //                   onClick={() => openLinkProfileModal("SoundCloud")}
// // //                 >
// // //                   Link Profile
// // //                 </button>
// // //               </div>

// // //               <div className="profile-button">
// // //                 <i className="fab fa-spotify"></i>
// // //                 <span>Spotify</span>
// // //                 <button
// // //                   className="link-btn"
// // //                   onClick={() => openLinkProfileModal("Spotify")}
// // //                 >
// // //                   Link Profile
// // //                 </button>
// // //               </div>

// // //               <div className="profile-button">
// // //                 <i className="fab fa-apple"></i>
// // //                 <span>Apple Music</span>
// // //                 <button
// // //                   className="link-btn"
// // //                   onClick={() => openLinkProfileModal("Apple Music")}
// // //                 >
// // //                   Link Profile
// // //                 </button>
// // //               </div>
// // //             </div>

// // //             <div className="modal-actions">
// // //               <button
// // //                 className="btn-secondary"
// // //                 onClick={() => {
// // //                   setShowArtistModal(false);
// // //                 }}
// // //               >
// // //                 Cancel
// // //               </button>
// // //               <button className="btn-primary">Create</button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* show add artist model */}
// // //       {showAddArtistModal && (
// // //         <div className="modal-overlay">
// // //           <div className="modal-content">
// // //             <h3>Add Key Artist</h3>
// // //             <label className="input-label">
// // //               Role<span style={{ color: "red" }}>*</span>
// // //             </label>
// // //             <select
// // //               name="myDropdown"
// // //               className="input-field"
// // //               style={{ width: "100%" }}
// // //               id="myDropdown"
// // //               required
// // //               value={artistDropDownRole}
// // //               onChange={(e) => {
// // //                 setArtistDropDownRole(e.target.value);
// // //                 setShowSecondDropdown(!!e.target.value); // Show if any value is selected
// // //               }}
// // //             >
// // //               <option value="" disabled>
// // //                 Select Artist
// // //               </option>
// // //               <option value="option1">Featuring</option>
// // //               <option value="option2">Primary Artist</option>
// // //               <option value="option3">Remixer</option>
// // //               <option value="option4">With</option>
// // //             </select>

// // //             {showSecondDropdown && (
// // //               <div className="second-dropdown">
// // //                 <label className="input-label">
// // //                   Artist Name <span style={{ color: "red" }}>*</span>{" "}
// // //                 </label>
// // //                 <select
// // //                   className="input-field"
// // //                   style={{ width: "100%" }}
// // //                   id="DropDownArtistName"
// // //                   required
// // //                   value={artistdropDownName}
// // //                   onChange={(e) => {
// // //                     setArtistdropDownName(e.target.value);
// // //                     setthirdDropDown(!!e.target.value); // Show if any value is selected
// // //                   }}
// // //                 >
// // //                   <option value="" disabled>
// // //                     Select Artist
// // //                   </option>
// // //                   <option value="a">kavya</option>
// // //                   <option value="b">venala</option>
// // //                   <option value="c">isha</option>
// // //                   <option value="d">krishna</option>
// // //                 </select>
// // //               </div>
// // //             )}

// // //             {showthirdDropdown && (
// // //               <div>
// // //                 <div style={{ marginTop: "30px", marginLeft: "35%" }}>
// // //                   {" "}
// // //                   {/* Add spacing before button */}
// // //                   <button
// // //                     className="btn-secondary localize-btn"
// // //                     onClick={() => {
// // //                       setShowLocalizeModal(true);
// // //                       setShowAddArtistModal(false);
// // //                     }}
// // //                   >
// // //                     Localize Your Release
// // //                   </button>
// // //                 </div>

// // //                 <p className="field-tip">
// // //                   Select the services where the artist has previously
// // //                   distributed and link their artist profiles. If no profile
// // //                   exists, new profiles will automatically be created for Spotify
// // //                   and Apple Music upon their first release.
// // //                 </p>
// // //                 <div className="box-i-showdow">
// // //                   <div className="box-i">
// // //                     <img src={iIcon} />
// // //                     <p>
// // //                       In order for your release to appear on the updated
// // //                       profile, please redeliver
// // //                     </p>
// // //                   </div>
// // //                 </div>

// // //                 <div className="profile-buttons-box">
// // //                   <div className="profile-button">
// // //                     <i className="fab fa-soundcloud"></i>
// // //                     <span>SoundCloud</span>
// // //                     <button
// // //                       className="link-btn"
// // //                       onClick={() => openLinkProfileModal("SoundCloud")}
// // //                     >
// // //                       Link Profile
// // //                     </button>
// // //                   </div>

// // //                   <div className="profile-button">
// // //                     <i className="fab fa-spotify"></i>
// // //                     <span>Spotify</span>
// // //                     <button
// // //                       className="link-btn"
// // //                       onClick={() => openLinkProfileModal("Spotify")}
// // //                     >
// // //                       Link Profile
// // //                     </button>
// // //                   </div>

// // //                   <div className="profile-button">
// // //                     <i className="fab fa-apple"></i>
// // //                     <span>Apple Music</span>
// // //                     <button
// // //                       className="link-btn"
// // //                       onClick={() => openLinkProfileModal("Apple Music")}
// // //                     >
// // //                       Link Profile
// // //                     </button>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             )}

// // //             <hr className="line" />
// // //             <div className="modal-actions">
// // //               <button
// // //                 className="btn-secondary"
// // //                 onClick={() => {
// // //                   setShowAddArtistModal(false);
// // //                   setArtistDropDownRole("");
// // //                   setArtistdropDownName("");
// // //                   setShowSecondDropdown(false);
// // //                   setthirdDropDown(false);
// // //                 }}
// // //               >
// // //                 Cancel
// // //               </button>
// // //               <button className="new-release-button">Add Artist</button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* performer popup */}
// // //       {showPerformer && (
// // //         <div className="modal-overlay">
// // //           <div className="modal-content">
// // //             <h3>Add Performer</h3>
// // //             <label className="input-label">
// // //               Role<span style={{ color: "red" }}>*</span>
// // //             </label>
// // //             <select
// // //               name="myDropdown"
// // //               className="input-field"
// // //               style={{ width: "100%" }}
// // //               id="myPerformerDropdown"
// // //               required
// // //               value={performerDropDownRole}
// // //               onChange={(e) => {
// // //                 setperformerDropDownRole(e.target.value);
// // //                 setShowSecondDropdown(!!e.target.value); // Show if any value is selected
// // //               }}
// // //             >
// // //               <option value="" disabled>
// // //                 Select Role
// // //               </option>
// // //               <option value="option1">Acccordion</option>
// // //               <option value="option2">Acoustic Baritone Guitar</option>
// // //               <option value="option3">Acoustic Bass Guiter</option>
// // //               <option value="option4">Acoustic Fretless Guiter</option>
// // //               <option value="option5"> Acoustic Fretless Guiter</option>
// // //               <option value="option6"> Acoustic Guitar</option>
// // //               <option value="option7"> Actor</option>
// // //             </select>

// // //             {showSecondDropdown && (
// // //               <div className="second-dropdown">
// // //                 <label className="input-label">
// // //                   Artist Name <span style={{ color: "red" }}>*</span>{" "}
// // //                 </label>
// // //                 <select
// // //                   className="input-field"
// // //                   style={{ width: "100%" }}
// // //                   id="DropDownperformerName"
// // //                   required
// // //                   value={artistdropDownName}
// // //                   onChange={(e) => {
// // //                     setArtistdropDownName(e.target.value);
// // //                     setthirdDropDown(!!e.target.value); // Show if any value is selected
// // //                   }}
// // //                 >
// // //                   <option value="" disabled>
// // //                     Select Artist
// // //                   </option>
// // //                   <option value="a">kavya</option>
// // //                   <option value="b">venala</option>
// // //                   <option value="c">isha</option>
// // //                   <option value="d">krishna</option>
// // //                 </select>
// // //               </div>
// // //             )}

// // //             {showthirdDropdown && (
// // //               <div>
// // //                 <div style={{ marginTop: "30px", marginLeft: "35%" }}>
// // //                   {" "}
// // //                   {/* Add spacing before button */}
// // //                   <button
// // //                     className="btn-secondary localize-btn"
// // //                     onClick={() => {
// // //                       setShowLocalizeModal(true);
// // //                       setShowPerformer(false);
// // //                     }}
// // //                   >
// // //                     Localize Your Release
// // //                   </button>
// // //                 </div>

// // //                 <p className="field-tip">
// // //                   Select the services where the artist has previously
// // //                   distributed and link their artist profiles. If no profile
// // //                   exists, new profiles will automatically be created for Spotify
// // //                   and Apple Music upon their first release.
// // //                 </p>
// // //                 <div className="box-i-showdow">
// // //                   <div className="box-i">
// // //                     <img src={iIcon} />
// // //                     <p>
// // //                       In order for your release to appear on the updated
// // //                       profile, please redeliver
// // //                     </p>
// // //                   </div>
// // //                 </div>

// // //                 <div className="profile-buttons-box">
// // //                   <div className="profile-button">
// // //                     <i className="fab fa-soundcloud"></i>
// // //                     <span>SoundCloud</span>
// // //                     <button
// // //                       className="link-btn"
// // //                       onClick={() => openLinkProfileModal("SoundCloud")}
// // //                     >
// // //                       Link Profile
// // //                     </button>
// // //                   </div>

// // //                   <div className="profile-button">
// // //                     <i className="fab fa-spotify"></i>
// // //                     <span>Spotify</span>
// // //                     <button
// // //                       className="link-btn"
// // //                       onClick={() => openLinkProfileModal("Spotify")}
// // //                     >
// // //                       Link Profile
// // //                     </button>
// // //                   </div>

// // //                   <div className="profile-button">
// // //                     <i className="fab fa-apple"></i>
// // //                     <span>Apple Music</span>
// // //                     <button
// // //                       className="link-btn"
// // //                       onClick={() => openLinkProfileModal("Apple Music")}
// // //                     >
// // //                       Link Profile
// // //                     </button>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             )}

// // //             <hr className="line" />
// // //             <div className="modal-actions">
// // //               <button
// // //                 className="btn-secondary"
// // //                 onClick={() => {
// // //                   setShowPerformer(false),
// // //                     setArtistDropDownRole(""),
// // //                     setArtistdropDownName(""),
// // //                     showSecondDropdown(false),
// // //                     showthirdDropdown(false);
// // //                 }}
// // //               >
// // //                 Cancel
// // //               </button>
// // //               <button className="new-release-button">Add Artist</button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* producer popup */}
// // //       {showProducer && (
// // //         <div className="modal-overlay">
// // //           <div className="modal-content">
// // //             <h3>Add Producer & Engineer Credits</h3>
// // //             <label className="input-label">
// // //               Role<span style={{ color: "red" }}>*</span>
// // //             </label>
// // //             <select
// // //               name="myDropdown"
// // //               className="input-field"
// // //               style={{ width: "100%" }}
// // //               id="myProducerDropdown"
// // //               required
// // //               value={producerDropDownRole}
// // //               onChange={(e) => {
// // //                 setproducerDropDownRole(e.target.value);
// // //                 setShowSecondDropdown(!!e.target.value); // Show if any value is selected
// // //               }}
// // //             >
// // //               <option value="" disabled de>
// // //                 Select Artist
// // //               </option>
// // //               <option value="option1">Art Director</option>
// // //               <option value="option2">Producer</option>
// // //               <option value="option3">Art Work</option>
// // //               <option value="option4">Acoustic Fretless Guiter</option>
// // //               <option value="option5"> Acoustic Fretless Guiter</option>
// // //               <option value="option6"> Acoustic Guitar</option>
// // //               <option value="option7"> Actor</option>
// // //             </select>

// // //             {showSecondDropdown && (
// // //               <div className="second-dropdown">
// // //                 <label className="input-label">
// // //                   Artist Name <span style={{ color: "red" }}>*</span>{" "}
// // //                 </label>
// // //                 <select
// // //                   className="input-field"
// // //                   style={{ width: "100%" }}
// // //                   id="DropDownArtistName"
// // //                   required
// // //                   value={artistdropDownName}
// // //                   onChange={(e) => {
// // //                     setArtistdropDownName(e.target.value);
// // //                     setthirdDropDown(!!e.target.value); // Show if any value is selected
// // //                   }}
// // //                 >
// // //                   <option value="" disabled>
// // //                     Select Artist
// // //                   </option>
// // //                   <option value="a">kavya</option>
// // //                   <option value="b">venala</option>
// // //                   <option value="c">isha</option>
// // //                   <option value="d">krishna</option>
// // //                 </select>
// // //               </div>
// // //             )}

// // //             {showthirdDropdown && (
// // //               <div>
// // //                 <div style={{ marginTop: "30px", marginLeft: "35%" }}>
// // //                   {" "}
// // //                   {/* Add spacing before button */}
// // //                   <button
// // //                     className="btn-secondary localize-btn"
// // //                     onClick={() => {
// // //                       setShowLocalizeModal(true);
// // //                       setShowProducer(false);
// // //                     }}
// // //                   >
// // //                     Localize Your Release
// // //                   </button>
// // //                 </div>

// // //                 <p className="field-tip">
// // //                   Select the services where the artist has previously
// // //                   distributed and link their artist profiles. If no profile
// // //                   exists, new profiles will automatically be created for Spotify
// // //                   and Apple Music upon their first release.
// // //                 </p>
// // //                 <div className="box-i-showdow">
// // //                   <div className="box-i">
// // //                     <img src={iIcon} />
// // //                     <p>
// // //                       In order for your release to appear on the updated
// // //                       profile, please redeliver
// // //                     </p>
// // //                   </div>
// // //                 </div>

// // //                 <div className="profile-buttons-box">
// // //                   <div className="profile-button">
// // //                     <i className="fab fa-soundcloud"></i>
// // //                     <span>SoundCloud</span>
// // //                     <button
// // //                       className="link-btn"
// // //                       onClick={() => openLinkProfileModal("SoundCloud")}
// // //                     >
// // //                       Link Profile
// // //                     </button>
// // //                   </div>

// // //                   <div className="profile-button">
// // //                     <i className="fab fa-spotify"></i>
// // //                     <span>Spotify</span>
// // //                     <button
// // //                       className="link-btn"
// // //                       onClick={() => openLinkProfileModal("Spotify")}
// // //                     >
// // //                       Link Profile
// // //                     </button>
// // //                   </div>

// // //                   <div className="profile-button">
// // //                     <i className="fab fa-apple"></i>
// // //                     <span>Apple Music</span>
// // //                     <button
// // //                       className="link-btn"
// // //                       onClick={() => openLinkProfileModal("Apple Music")}
// // //                     >
// // //                       Link Profile
// // //                     </button>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             )}

// // //             <hr className="line" />
// // //             <div className="modal-actions">
// // //               <button
// // //                 className="btn-secondary"
// // //                 onClick={() => {
// // //                   setShowProducer(false);
// // //                   setproducerDropDownRole("");
// // //                   setShowSecondDropdown(false);
// // //                   setthirdDropDown(false);
// // //                 }}
// // //               >
// // //                 Cancel
// // //               </button>
// // //               <button className="new-release-button">Add Artist</button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Link Profile Modal Popup */}
// // //       {showLinkProfileModal && (
// // //         <div className="modal-overlay">
// // //           <div className="modal-container">
// // //             <h2>Link your Artist Profile - {selectedProfile}</h2>

// // //             <label>Artist {selectedProfile} ID *</label>
// // //             <input
// // //               type="text"
// // //               placeholder={`Enter your ${selectedProfile} ID`}
// // //               className="input-field"
// // //               value={artistProfileId}
// // //               onChange={(e) => setArtistProfileId(e.target.value)}
// // //             />

// // //             <p className="helper-text">
// // //               {selectedProfile === "Spotify" &&
// // //                 "Open your artist page on Spotify and copy only the numeric/ID part of the URL (e.g., 22bE4uQ6baNwSHPVcDxLCe)."}
// // //               {selectedProfile === "Apple Music" &&
// // //                 "Open your artist page on Apple Music and copy only the ID part of the URL (e.g., 552010757)."}
// // //               {selectedProfile === "SoundCloud" &&
// // //                 "Enter your SoundCloud username from your profile URL. For example, if your URL is https://soundcloud.com/artistname123, enter only artistname123 (not the full link).\n\nNote: SoundCloud maps each ISRC to a single profile, so only the Main Primary Artist’s profile URL will be sent."}
// // //             </p>

// // //             <div className="button-group">
// // //               <button
// // //                 className="btn-secondary"
// // //                 onClick={() => setShowLinkProfileModal(false)}
// // //               >
// // //                 Cancel
// // //               </button>
// // //               <button
// // //                 className="new-release-button"
// // //                 onClick={() => setShowLinkProfileModal(false)}
// // //               >
// // //                 Apply
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Step 4 */}
// // //       <div className="section">
// // //         <h3>Genres</h3>

// // //         <div className="genres-grid">
// // //           <div>
// // //             <label className="label-name" htmlFor="primary-genre">
// // //               Primary Genre <span style={{ color: "red" }}>*</span>
// // //             </label>
// // //             <br />
// // //             <select
// // //               className="input-field"
// // //               style={{ width: "100%" }}
// // //               id="primary-genre"
// // //               onChange={(e) => setPrimaryGenre(e.target.value)}
// // //             >
// // //               <option>Select Primary Genre</option>
// // //               <option>Pop</option>
// // //               <option>Rock</option>
// // //               <option>Hip-Hop</option>
// // //             </select>
// // //           </div>
// // //           <div>
// // //             <label className="label-name" htmlFor="second-genre">
// // //               Secondary Genre <span style={{ color: "red" }}>*</span>
// // //             </label>
// // //             <br />
// // //             <select
// // //               className="input-field"
// // //               style={{ width: "100%" }}
// // //               id="second-genre"
// // //               onChange={(e) => setSecondaryGenre(e.target.value)}
// // //             >
// // //               <option>Select Secondary Genre</option>
// // //               <option>Pop</option>
// // //               <option>Rock</option>
// // //               <option>Hip-Hop</option>
// // //             </select>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* {step :5} */}

// // //       <div className="section">
// // //         <h3>Date</h3>
// // //         <div style={{ display: "flex", gap: "30px", marginLeft: "10%" }}>
// // //           <div className="date-box">
// // //             <label>
// // //               Digital Release Date <span style={{ color: "red" }}>*</span>
// // //             </label>
// // //             <input
// // //               type="date"
// // //               placeholder="DD/MM/YYYY"
// // //               value={digitalReleaseDate}
// // //               style={{ width: "300px" }}
// // //               onChange={(e) => setDigitalReleaseDate(e.target.value)}
// // //             />
// // //           </div>

// // //           <div className="date-box">
// // //             <label>
// // //               Original Release Date <span style={{ color: "red" }}>*</span>
// // //             </label>
// // //             <input
// // //               type="date"
// // //               placeholder="DD/MM/YYYY"
// // //               value={originalReleaseDate}
// // //               style={{ width: "300px" }}
// // //               onChange={(e) => setOriginalReleaseDate(e.target.value)}
// // //             />
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* {step:6} */}
// // //       <div className="section">
// // //         <h3>UPC</h3>
// // //         <div className="input-group">
// // //           <label htmlFor="upc">
// // //             Do you have a UPC Code? <span style={{ color: "red" }}>*</span>
// // //           </label>
// // //           <div style={{ display: "flex", gap: "30px", marginTop: "8px" }}>
// // //             <label
// // //               style={{ display: "flex", alignItems: "center", gap: "6px" }}
// // //             >
// // //               <input
// // //                 type="radio"
// // //                 name="upcOption"
// // //                 value="yes"
// // //                 onChange={() => setHasUPC("yes")}
// // //                 checked={hasUPC === "yes"}
// // //               />
// // //               <span>Yes</span>
// // //             </label>
// // //             <label
// // //               style={{ display: "flex", alignItems: "center", gap: "6px" }}
// // //             >
// // //               <input
// // //                 type="radio"
// // //                 name="upcOption"
// // //                 value="no"
// // //                 onChange={() => setHasUPC("no")}
// // //                 checked={hasUPC === "no"}
// // //               />
// // //               <span>No</span>
// // //             </label>
// // //           </div>
// // //         </div>

// // //         {hasUPC === "yes" && (
// // //           <div className="input-group" style={{ marginTop: "15px" }}>
// // //             <label htmlFor="upcCode">
// // //               UPC Code <span style={{ color: "red" }}>*</span>
// // //             </label>
// // //             <input
// // //               type="text"
// // //               id="upcCode"
// // //               placeholder="Enter Your UPC Code"
// // //               className="input-field"
// // //               style={{ width: "50%" }}
// // //               value={upcCode}
// // //               onChange={(e) => setUpcCode(e.target.value)}
// // //             />
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* Action Buttons */}
// // //       <div className="form-actions">
// // //         <button className="btn-secondary" onClick={() => navigate("/")}>
// // //           Cancel
// // //         </button>
// // //         <button
// // //           className="new-release-button"
// // //           onClick={() => {
// // //             navigate("/upload-tracks");
// // //             handleSubmit();
// // //           }}
// // //         >
// // //           Next
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default CreateRelease;
// // import "../styles/CreateRelease.css";
// // import { useNavigate } from "react-router-dom";
// // import { useState, useEffect } from "react";
// // import DustbinIcon from "../assets/Dustbin.svg";
// // import iIcon from "../assets/material-symbols_info-outline.png";
// // import cloud from "../assets/Vector@3x.png";
// // import dot from "../assets/Component 22.png";
// // import axios from "axios";

// // function CreateRelease() {
// //   const navigate = useNavigate();
// //   const [fileUploaded, setFileUploaded] = useState(null);
// //   const [showArtistModal, setShowArtistModal] = useState(false);
// //   const [artistImage, setArtistImage] = useState(null);
// //   const [showLocalizeModal, setShowLocalizeModal] = useState(false);

// //   const [showLinkProfileModal, setShowLinkProfileModal] = useState(false);
// //   const [selectedProfile, setSelectedProfile] = useState("");
// //   const [artistProfileId, setArtistProfileId] = useState("");

// //   const [showAddArtistModal, setShowAddArtistModal] = useState(false);
// //   const [showPerformer, setShowPerformer] = useState(false);
// //   const [showProducer, setShowProducer] = useState(false);
// //   const [artist, setArtist] = useState(false);
// //   const [showicons, seticons] = useState(true);
// //   const [mainArtist, setMainArtist] = useState("");
// //   const [artistDropDownRole, setArtistDropDownRole] = useState("");
// //   const [producerDropDownRole, setproducerDropDownRole] = useState("");
// //   const [performerDropDownRole, setperformerDropDownRole] = useState("");
// //   // State to control second dropdown visibility
// //   const [showSecondDropdown, setShowSecondDropdown] = useState(false);
// //   const [showthirdDropdown, setthirdDropDown] = useState(false);

// //   const [contributors, setContributors] = useState([]);
// //   const [artistdropDownName, setArtistdropDownName] = useState("");
// //   const [linkedProfiles, setLinkedProfiles] = useState({
// //     Spotify: "",
// //     AppleMusic: "",
// //     SoundCloud: "",
// //   });

// //   //back-end states for input fileds

// //   //   const languages = ["Ahirani",
// //   // "Arabic",
// //   // "Assamese",
// //   // "Bengali",
// //   // "Awadhi",
// //   // "Burmese",
// //   // "Chhattisgarhi",
// //   // "Chinese",
// //   // "Dogri",
// //   // "English",
// //   // "French",
// //   // "Garhwali",
// //   // "Garo",
// //   // "Gujarati",
// //   // "Haryanvi",
// //   // "Himachali",
// //   // "Hindi",
// //   // "Iban",
// //   // "Indonesian",
// //   // "Instrumental",
// //   // "Italian",
// //   // "Japanese",
// //   // "Javanese",
// //   // "Kannada",
// //   // "Kashmiri",
// //   // "Khasi",
// //   // "Kokborok",
// //   // "Konkani",
// //   // "Korean",
// //   // "Kumauni",
// //   // "Latin",
// //   // "Maithili",
// //   // "Malay",
// //   // "Malayalam",
// //   // "Mandarin",
// //   // "Manipuri",
// //   // "Bhojpuri",
// //   // "Marathi",
// //   // "Banjara",
// //   // "Marwari",
// //   // "Naga",
// //   // "Nagpuri",
// //   // "Nepali",
// //   // "Odia",
// //   // "Pali",
// //   // "Persian",
// //   // "Punjabi",
// //   // "Rajasthani",
// //   // "Sainthili",
// //   // "Sambalpuri",
// //   // "Sanskrit",
// //   // "Santali",
// //   // "Sindhi",
// //   // "Sinhala",
// //   // "Spanish",
// //   // "Swahili",
// //   // "Tamil",
// //   // "Telugu",
// //   // "Thai",
// //   // "Tibetan",
// //   // "Tulu",
// //   // "Turkish",
// //   // "Ukrainian",
// //   // "Urdu","Zxx"]

// //   //backend -data -passed



// //   const genres = {
// //   Film: [
// //     "Devotional", "Dialogue", "Ghazal", "Hip-Hop/ Rap", "Instrumental",
// //     "Patriotic", "Remix", "Romantic", "Sad", "Unplugged"
// //   ],
// //   Pop: [
// //     "Acoustic Pop", "Band Songs", "Bedroom Pop", "Chill Pop", "Contemporary Pop",
// //     "Country Pop/ Regional Pop", "Dance Pop", "Electro Pop", "Lo-Fi Pop",
// //     "Love Songs", "Pop Rap", "Pop Singer-Songwriter", "Sad Songs", "Soft Pop"
// //   ],
// //   Indie: [
// //     "Indian Indie", "Indie Dance", "Indie Folk", "Indie Hip-Hop", "Indie Lo-Fi",
// //     "Indie Pop", "Indie Rock", "Indie Singer -Songwriter"
// //   ],
// //   "Hip-Hop/Rap": [
// //     "Alternative Hip-Hop", "Concious Hip-Hop", "Country Rap", "Emo Rap", "Hip-Hop",
// //     "Jazz Rap", "Pop Rap", "Trap", "Trap Beats"
// //   ],
// //   Folk: [
// //     "Ainchaliyan", "Alha", "Atulprasadi", "Baalgeet/ Children Song", "Banvarh",
// //     "Barhamasa", "Basant Geet", "Baul Geet", "Bhadu Gaan", "Bhangra", "Bhatiali",
// //     "Bhavageete", "Bhawaiya", "Bihugeet", "Birha", "Borgeet", "Dandiya Raas", "Garba",
// //     "Lavani", "Lokgeet", "Rasiya", "Tappa", "Tusu Gaan", "Villu Pattu"
// //   ],
// //   Devotional: [
// //     "Aarti", "Bhajan", "Carol", "Chalisa", "Chant", "Geet", "Gospel",
// //     "Gurbani", "Hymn", "Kirtan", "Mantra", "Paath", "Qawwals", "Shabd"
// //   ],
// //   "Hindustani Classical": ["Instrumental", "Vocal"],
// //   "Carnatic Classical": ["Instrumental", "Vocal"],
// //   "Ambient / Instrumental": ["Soft", "Easy Listening", "Electronic", "Fusion", "Lounge"]
// // };

// //   const [releaseTitle, setReleaseTitle] = useState("");
// //   const [titleVersion, setTitleVersion] = useState("");
// //   const [localizations, setLocalizations] = useState([
// //     { language: "", localizedTitle: "", titleVersion: "" },
// //   ]);

// //   // Step 2: Cover Artwork
// //   const [coverArtwork, setCoverArtwork] = useState(null); // File object
// //   const [fileError, setFileError] = useState("");

// //   // Step 4: Genres
// //   const [primaryGenre, setPrimaryGenre] = useState("");
// //   const [secondaryGenre, setSecondaryGenre] = useState("");

// //   // Step 5: Dates
// //   const [digitalReleaseDate, setDigitalReleaseDate] = useState("");
// //   const [originalReleaseDate, setOriginalReleaseDate] = useState("");

// //   // Step 6: UPC
// //   const [hasUPC, setHasUPC] = useState(null); // 'yes' or 'no'
// //   const [upcCode, setUpcCode] = useState("");
// //   const [profile, setProfileModel] = useState("");

// //   // Example: adding/updating a contributor
// //   const addContributor = (contributor) => {
// //     setContributors([...contributors, contributor]);
// //   };

// //   const openLinkProfileModal = (a) => {
// //     setProfileModel(e);
// //   };

// //   // Step 7: Form submission
// //   const handleSubmit = async () => {
// //     const formData = new FormData();
// //     formData.append("releaseTitle", releaseTitle);
// //     formData.append("titleVersion", titleVersion);
// //     formData.append("digitalReleaseDate", digitalReleaseDate);
// //     formData.append("originalReleaseDate", originalReleaseDate);
// //     formData.append("primaryGenre", primaryGenre);
// //     formData.append("secondaryGenre", secondaryGenre);
// //     formData.append("hasUPC", hasUPC);
// //     if (coverArtwork) {
// //       formData.append("coverArtwork", coverArtwork); // <--- File object goes here
// //     }
// //     if (hasUPC === "yes") formData.append("upcCode", upcCode);
// //     if (coverArtwork) formData.append("coverArtwork", coverArtwork);

// //     // Convert arrays/objects to JSON string if sending via FormData
// //     formData.append("localizations", JSON.stringify(localizations));
// //     formData.append("contributors", JSON.stringify(contributors));

// //     const openLinkProfileModal = (profile) => {
// //       setSelectedProfile(profile);
// //       setArtistProfileId("");
// //       setShowLinkProfileModal(true);
// //     };

// //     const object = {};
// //     formData.forEach((value, key) => {
// //       object[key] = value;
// //     });

// //     const collectionPayload = {
// //       collection: {
// //         info: {
// //           name: object.releaseTitle || "New Collection",
// //           schema:
// //             "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
// //         },
// //         item: [
// //           {
// //             name: "Sample Request", // Give a request name
// //             request: {
// //               method: "POST",
// //               header: [],
// //               body: {
// //                 mode: "raw",
// //                 raw: JSON.stringify({
// //                   form_id: 1,
// //                   releaseTitle,
// //                   titleVersion,
// //                   digitalReleaseDate,
// //                   originalReleaseDate,
// //                   coverArtwork,
// //                   primaryGenre,
// //                   secondaryGenre,
// //                   hasUPC,
// //                   upcCode: hasUPC === "yes" ? upcCode : "",
// //                   localizations,
// //                   contributors,
// //                 }),
// //               },
// //               url: {
// //                 raw: "https://your-api-endpoint.com",
// //                 protocol: "https",
// //                 host: ["your-api-endpoint", "com"],
// //               },
// //             },
// //           },
// //         ], // You can add requests here if needed
// //       },
// //     };

// //     // eslint-disable-next-line no-undef

// //     try {
// //       const response = await axios.post(
// //         "/wp/wp-json/gf/v2/entries",
// //         collectionPayload,
// //         {
// //           headers: {
// //            Authorization: `Basic ${btoa("ck_23e474a3a4a15b8460b78f01bc60d565dd7f94c5:cs_84ee6ec3c485d7727560ad9103ed3311d2afb088")}`,
// //             "Content-type": "application/json",
// //           },
// //         }
// //       );

// //       console.log("Postman API Response:", response.data);
// //     } catch (error) {
// //       console.error(
// //         "Error posting to Postman API:",
// //         error.response?.data || error.message
// //       );
// //     }
// //   };

// //   const saveContributor = () => {
// //     kk;
// //     if (!artistdropDownName) return;

// //     const newContributor = {
// //       type: "Main Primary Artist",
// //       name: artistdropDownName,
// //       linkedProfiles,
// //     };

// //     setContributors([...contributors, newContributor]); // ✅ store contributor
// //     setArtistdropDownName("");
// //     setLinkedProfiles({ Spotify: "", AppleMusic: "", SoundCloud: "" });
// //     setShowArtistModal(false);
// //   };

// //   //https://api.getpostman.com/collections

// //   // const token = localStorage.getItem("jwtToken");

// //   // const fetchDetails =  async ()=>{
// //   //    try {
// //   //       const response = await fetch("https://api.getpostman.com/collections", {
// //   //       });

// //   //       if (!response.ok) {
// //   //         throw new Error("Failed to fetch collections");
// //   //       }

// //   //       const data = await response.json();
// //   //       console.log(data)
// //   //     } catch (error) {
// //   //       console.error("Error fetching Postman collections:", error);
// //   //     }

// //   // }

// //   // useEffect(()=>{

// //   //   fetchDetails()

// //   // },[])

// //   const handleFileChange = (e) => {
// //     const file = e.target.files[0];
// //     if (!file) return;

// //     const img = new window.Image();
// //     img.src = URL.createObjectURL(file);
// //     img.onload = function () {
// //       if (img.width === 3000 && img.height === 3000) {
// //         setCoverArtwork(file);
// //         setFileUploaded(file);
// //         setFileError("");
// //       } else {
// //         setCoverArtwork(null);
// //         setFileError("Image must be exactly 3000px by 3000px.");
// //       }
// //       URL.revokeObjectURL(img.src);
// //     };
// //   };

// //   return (
// //     <div className="create-release-page">
// //       <h2 className="page-title">Create A New Release</h2>

// //       {/* Step 1 */}
// //       <div className="section">
// //         <h3>Enter Release Details</h3>

// //         <div className="input-group">
// //           <label htmlFor="title">
// //              Title name <span style={{ color: "red" }}>*</span>{" "}
// //           </label>
// //           <input
// //             type="text"
// //             id="title"
// //             placeholder="e.g., come on baby"
// //             className="input-field"
// //             onChange={(e) => setReleaseTitle(e.target.value)}
// //             value={releaseTitle}
// //             style={{ width: "50%" }}
// //           />
// //         </div>
// //         <br />

// //         <div className="input-group">
// //           <label htmlFor="title">
// //             Release Title <span style={{ color: "red" }}>*</span>{" "}
// //           </label>
// //           <input
// //             type="text"
// //             id="title"
// //             placeholder="e.g., I got my summer"
// //             className="input-field"
// //             onChange={(e) => setReleaseTitle(e.target.value)}
// //             value={releaseTitle}
// //             style={{ width: "50%" }}
// //           />
// //         </div>

// //         <div className="input-group">
// //           <label htmlFor="titleversion">Title Version</label>
// //           <input
// //             type="text"
// //             id="titleversion"
// //             placeholder="e.g., Live, Remix, Remastered"
// //             className="input-field"
// //             onChange={(e) => setTitleVersion(e.target.value)}
// //             value={titleVersion}
// //             style={{ width: "50%" }}
// //           />
// //         </div>
// //         <br />

// //         <span></span>

// //         <br />
// //       </div>

    
// //       {/* Step 2 */}
// //       <div className="section upload-section">
// //         <h3>Upload Cover Artwork</h3>
// //         <div className="form-grid">
// //           <div
// //             className="upload-box"
// //             onClick={() => document.getElementById("fileInput").click()}
// //           >
// //             <input
// //               type="file"
// //               id="fileInput"
// //               style={{ display: "none" }}
// //               accept="image/png, image/jpeg, image/jpg, image/jfif"
// //               onChange={handleFileChange} // <-- use new handler
// //             />
// //             {fileUploaded ? (
// //               <img
// //                 src={URL.createObjectURL(fileUploaded)}
// //                 alt="Preview"
// //                 className="upload-preview"
// //               />
// //             ) : (
// //               <div className="text">
// //                 <p>
// //                   <img src={cloud} className="could-img" alt="could-image" />
// //                   Drag here or click to browse a file
// //                 </p>
// //                 <p className="file-types">
// //                   Supported: JPG, JPEG, PNG, JFIF (Must be exactly 3000px x
// //                   3000px, Max 10MB)
// //                 </p>
// //                 {fileError && <p style={{ color: "red" }}>{fileError}</p>}
// //               </div>
// //             )}
// //           </div>

// //           <div className="tips-box">
// //             <h4>Tips:</h4>
// //             <p>
// //               Please ensure your cover art is square, less than 10 MB and a
// //               minimum of 3000px wide (3000px width is recommended for best
// //               results).
// //             </p>
// //             <br />
// //             <h3>Your cover art cannot contain:</h3>
// //             <ul>
// //               <li>
// //                 <img src={dot} />
// //                 Any text other than the release title and/or artist name
// //               </li>
// //               <li>
// //                 <img src={dot} />
// //                 Third-party logos or trademarks without express written consent
// //                 from the trademark holder
// //               </li>
// //               <li>
// //                 <img src={dot} />
// //                 Sexually explicit imagery
// //               </li>
// //               <li>
// //                 <img src={dot} />
// //                 Supported: JPG, JPEG, PNG, JFIF
// //               </li>
// //             </ul>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Step 3 */}
// //       <div className="section">
// //         <h3>Contributors</h3>

// //         {showicons && (
// //           <div className="contributors-buttons">
// //             <button
// //               className="btn-secondary"
// //               onClick={() => {
// //                 setShowArtistModal(true);
// //                 setArtistDropDownRole("");
// //                 setShowSecondDropdown(false);
// //                 setthirdDropDown(false);
// //               }}
// //             >
// //               + Add Main Primary Artist
// //             </button>

// //             <button
// //               className="btn-secondary"
// //               onClick={() => {
// //                 setShowAddArtistModal(true);
// //                 setArtistDropDownRole("");
// //                 setShowSecondDropdown(false);
// //                 setthirdDropDown(false);
// //               }}
// //             >
// //               + Add Artist
// //             </button>

// //             <button
// //               className="btn-secondary"
// //               onClick={() => {
// //                 setShowPerformer(true);
// //                 setperformerDropDownRole("");
// //                 setShowSecondDropdown(false);
// //                 setthirdDropDown(false);
// //               }}
// //             >
// //               + Add Performer
// //             </button>

// //             <button
// //               className="btn-secondary"
// //               onClick={() => {
// //                 setShowProducer(true);
// //                 setproducerDropDownRole("");
// //                 setShowSecondDropdown(false);
// //                 setthirdDropDown(false);
// //               }}
// //             >
// //               + Add Credit
// //             </button>
// //           </div>
// //         )}

        
// //       </div>

// //       {/* Artist Modal new Popup */}

// //       {showArtistModal && (
// //         <div className="modal-overlay">
// //           <div className="modal-content">
// //             <h3>Add Main Primary Artist</h3>

// //             {/* Artist selection */}
// //             <div className="second-dropdown">
// //               <label className="input-label">
// //                 Artist Name <span style={{ color: "red" }}>*</span>
// //               </label>
// //               <select
// //                 className="input-field"
// //                 style={{ width: "100%" }}
// //                 id="DropDownArtistName"
// //                 required
// //                 value={artistdropDownName}
// //                 onChange={(e) => {
// //                   setArtistdropDownName(e.target.value);
// //                   setthirdDropDown(!!e.target.value);
// //                 }}
// //               >
// //                 <option value="" disabled>
// //                   Select Artist
// //                 </option>
// //                 <option value="Kavya">Kavya</option>
// //                 <option value="Venala">Venala</option>
// //                 <option value="Isha">Isha</option>
// //                 <option value="Krishna">Krishna</option>
// //               </select>
// //             </div>

// //             {showthirdDropdown && (
// //               <div>
// //                 {/* Localization button */}
// //                 <div style={{ marginTop: "30px", marginLeft: "35%" }}>
// //                   <button
// //                     className="btn-secondary localize-btn"
// //                     onClick={() => {
// //                       setShowLocalizeModal(true);
// //                       setShowArtistModal(false);
// //                     }}
// //                   >
// //                     Localize Your Release
// //                   </button>
// //                 </div>

// //                 {/* Info section */}
// //                 <p className="field-tip">
// //                   Select the services where the artist has previously
// //                   distributed...
// //                 </p>
// //                 <div className="box-i-showdow">
// //                   <div className="box-i">
// //                     <img src={iIcon} />
// //                     <p>
// //                       In order for your release to appear on the updated
// //                       profile, please redeliver
// //                     </p>
// //                   </div>
// //                 </div>

// //                 {/* Link profile buttons */}
// //                 <div className="profile-buttons-box">
// //                   {["SoundCloud", "Spotify", "AppleMusic"].map((platform) => (
// //                     <div key={platform} className="profile-button">
// //                       <span>{platform}</span>
// //                       <button
// //                         className="link-btn"
// //                         onClick={() => {
// //                           const link = prompt(`Enter ${platform} profile URL`);
// //                           if (link) {
// //                             setLinkedProfiles((prev) => ({
// //                               ...prev,
// //                               [platform]: link,
// //                             }));
// //                           }
// //                         }}
// //                       >
// //                         Link Profile
// //                       </button>
// //                     </div>
// //                   ))}
// //                 </div>

// //                 {/* Save contributor */}
// //                 <div style={{ marginTop: "20px", textAlign: "right" }}>
// //                   <button
// //                     className="btn-secondary"
// //                     onClick={() => setShowArtistModal(false)}
// //                   >
// //                     Cancel
// //                   </button>
// //                   <button
// //                     className="new-release-button"
// //                     onClick={saveContributor}
// //                   >
// //                     Save Artist
// //                   </button>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       )}

// //       {/* Artist Modal Popup */}
// //       {artist && (
// //         <div className="modal-overlay">
// //           <div className="modal-content">
// //             <h3>Create a new Main Primary Artist</h3>

// //             <div className="artist-image-box">
// //               <input
// //                 type="file"
// //                 id="artistImageInput"
// //                 style={{ display: "none" }}
// //                 accept="image/png, image/jpeg, image/jpg, image/jfif"
// //                 onChange={(e) => setArtistImage(e.target.files[0])}
// //               />

// //               {artistImage ? (
// //                 <div
// //                   style={{
// //                     position: "relative",
// //                     width: "140px",
// //                     height: "140px",
// //                   }}
// //                 >
// //                   <img
// //                     src={URL.createObjectURL(artistImage)}
// //                     alt="Artist Preview"
// //                     style={{
// //                       width: "100%",
// //                       height: "100%",
// //                       borderRadius: "50%",
// //                       objectFit: "cover",
// //                     }}
// //                   />
// //                   <button
// //                     type="button"
// //                     className="btn-reselect-icon"
// //                     onClick={() =>
// //                       document.getElementById("artistImageInput").click()
// //                     }
// //                     style={{
// //                       position: "absolute",
// //                       bottom: "5px",
// //                       right: "5px",
// //                       width: "30px",
// //                       height: "30px",
// //                       borderRadius: "50%",
// //                       backgroundColor: "#2563eb",
// //                       color: "#fff",
// //                       border: "none",
// //                       fontWeight: "bold",
// //                       cursor: "pointer",
// //                     }}
// //                   >
// //                     +
// //                   </button>
// //                 </div>
// //               ) : (
// //                 <div
// //                   className="placeholder-icon"
// //                   onClick={() =>
// //                     document.getElementById("artistImageInput").click()
// //                   }
// //                   style={{
// //                     width: "140px",
// //                     height: "140px",
// //                     borderRadius: "50%",
// //                     backgroundColor: "#f3f4f6",
// //                     display: "flex",
// //                     justifyContent: "center",
// //                     alignItems: "center",
// //                     fontSize: "50px",
// //                     color: "#2563eb",
// //                     cursor: "pointer",
// //                   }}
// //                 >
// //                   +
// //                 </div>
// //               )}
// //             </div>

// //             <p className="image-support-text">
// //               We Support PNG, JFIF, JPEG, Or JPG Images.
// //             </p>

// //             <div className="input-group">
// //               <label className="input-label">enter your name</label>
// //               <input
// //                 type="text"
// //                 placeholder="Your Name Here"
// //                 className="input-field"
// //               />
// //             </div>

// //             <div style={{ marginTop: "30px" }}>
// //               {" "}
// //               {/* Add spacing before button */}
// //               <button className="btn-secondary ">Localize Your Release</button>
// //             </div>

// //             <p className="field-tip">
// //               Enter the name exactly as you want it to appear on platforms like
// //               Spotify, Apple Music, etc.
// //             </p>

// //             <div className="profile-buttons-box">
// //               <div className="profile-button">
// //                 <i className="fab fa-soundcloud"></i>
// //                 <span>SoundCloud</span>
// //                 <button
// //                   className="link-btn"
// //                   onClick={() => openLinkProfileModal("SoundCloud")}
// //                 >
// //                   Link Profile
// //                 </button>
// //               </div>

// //               <div className="profile-button">
// //                 <i className="fab fa-spotify"></i>
// //                 <span>Spotify</span>
// //                 <button
// //                   className="link-btn"
// //                   onClick={() => openLinkProfileModal("Spotify")}
// //                 >
// //                   Link Profile
// //                 </button>
// //               </div>

// //               <div className="profile-button">
// //                 <i className="fab fa-apple"></i>
// //                 <span>Apple Music</span>
// //                 <button
// //                   className="link-btn"
// //                   onClick={() => openLinkProfileModal("Apple Music")}
// //                 >
// //                   Link Profile
// //                 </button>
// //               </div>
// //             </div>

// //             <div className="modal-actions">
// //               <button
// //                 className="btn-secondary"
// //                 onClick={() => {
// //                   setShowArtistModal(false);
// //                 }}
// //               >
// //                 Cancel
// //               </button>
// //               <button className="btn-primary">Create</button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* show add artist model */}
// //       {showAddArtistModal && (
// //         <div className="modal-overlay">
// //           <div className="modal-content">
// //             <h3>Add Key Artist</h3>
// //             <label className="input-label">
// //               Role<span style={{ color: "red" }}>*</span>
// //             </label>
// //             <select
// //               name="myDropdown"
// //               className="input-field"
// //               style={{ width: "100%" }}
// //               id="myDropdown"
// //               required
// //               value={artistDropDownRole}
// //               onChange={(e) => {
// //                 setArtistDropDownRole(e.target.value);
// //                 setShowSecondDropdown(!!e.target.value); // Show if any value is selected
// //               }}
// //             >
// //               <option value="" disabled>
// //                 Select Artist
// //               </option>
// //               <option value="option1">Featuring</option>
// //               <option value="option2">Primary Artist</option>
// //               <option value="option3">Remixer</option>
// //               <option value="option4">With</option>
// //             </select>

// //             {showSecondDropdown && (
// //               <div className="second-dropdown">
// //                 <label className="input-label">
// //                   Artist Name <span style={{ color: "red" }}>*</span>{" "}
// //                 </label>
// //                 <select
// //                   className="input-field"
// //                   style={{ width: "100%" }}
// //                   id="DropDownArtistName"
// //                   required
// //                   value={artistdropDownName}
// //                   onChange={(e) => {
// //                     setArtistdropDownName(e.target.value);
// //                     setthirdDropDown(!!e.target.value); // Show if any value is selected
// //                   }}
// //                 >
// //                   <option value="" disabled>
// //                     Select Artist
// //                   </option>
// //                   <option value="a">kavya</option>
// //                   <option value="b">venala</option>
// //                   <option value="c">isha</option>
// //                   <option value="d">krishna</option>
// //                 </select>
// //               </div>
// //             )}

// //             {showthirdDropdown && (
// //               <div>
// //                 <div style={{ marginTop: "30px", marginLeft: "35%" }}>
// //                   {" "}
// //                   {/* Add spacing before button */}
// //                   <button
// //                     className="btn-secondary localize-btn"
// //                     onClick={() => {
// //                       setShowLocalizeModal(true);
// //                       setShowAddArtistModal(false);
// //                     }}
// //                   >
// //                     Localize Your Release
// //                   </button>
// //                 </div>

// //                 <p className="field-tip">
// //                   Select the services where the artist has previously
// //                   distributed and link their artist profiles. If no profile
// //                   exists, new profiles will automatically be created for Spotify
// //                   and Apple Music upon their first release.
// //                 </p>
// //                 <div className="box-i-showdow">
// //                   <div className="box-i">
// //                     <img src={iIcon} />
// //                     <p>
// //                       In order for your release to appear on the updated
// //                       profile, please redeliver
// //                     </p>
// //                   </div>
// //                 </div>

// //                 <div className="profile-buttons-box">
// //                   <div className="profile-button">
// //                     <i className="fab fa-soundcloud"></i>
// //                     <span>SoundCloud</span>
// //                     <button
// //                       className="link-btn"
// //                       onClick={() => openLinkProfileModal("SoundCloud")}
// //                     >
// //                       Link Profile
// //                     </button>
// //                   </div>

// //                   <div className="profile-button">
// //                     <i className="fab fa-spotify"></i>
// //                     <span>Spotify</span>
// //                     <button
// //                       className="link-btn"
// //                       onClick={() => openLinkProfileModal("Spotify")}
// //                     >
// //                       Link Profile
// //                     </button>
// //                   </div>

// //                   <div className="profile-button">
// //                     <i className="fab fa-apple"></i>
// //                     <span>Apple Music</span>
// //                     <button
// //                       className="link-btn"
// //                       onClick={() => openLinkProfileModal("Apple Music")}
// //                     >
// //                       Link Profile
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}

// //             <hr className="line" />
// //             <div className="modal-actions">
// //               <button
// //                 className="btn-secondary"
// //                 onClick={() => {
// //                   setShowAddArtistModal(false);
// //                   setArtistDropDownRole("");
// //                   setArtistdropDownName("");
// //                   setShowSecondDropdown(false);
// //                   setthirdDropDown(false);
// //                 }}
// //               >
// //                 Cancel
// //               </button>
// //               <button className="new-release-button">Add Artist</button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* performer popup */}
// //       {showPerformer && (
// //         <div className="modal-overlay">
// //           <div className="modal-content">
// //             <h3>Add Performer</h3>
// //             <label className="input-label">
// //               Role<span style={{ color: "red" }}>*</span>
// //             </label>
// //             <select
// //               name="myDropdown"
// //               className="input-field"
// //               style={{ width: "100%" }}
// //               id="myPerformerDropdown"
// //               required
// //               value={performerDropDownRole}
// //               onChange={(e) => {
// //                 setperformerDropDownRole(e.target.value);
// //                 setShowSecondDropdown(!!e.target.value); // Show if any value is selected
// //               }}
// //             >
// //               <option value="" disabled>
// //                 Select Role
// //               </option>
// //               <option value="option1">Acccordion</option>
// //               <option value="option2">Acoustic Baritone Guitar</option>
// //               <option value="option3">Acoustic Bass Guiter</option>
// //               <option value="option4">Acoustic Fretless Guiter</option>
// //               <option value="option5"> Acoustic Fretless Guiter</option>
// //               <option value="option6"> Acoustic Guitar</option>
// //               <option value="option7"> Actor</option>
// //             </select>

// //             {showSecondDropdown && (
// //               <div className="second-dropdown">
// //                 <label className="input-label">
// //                   Artist Name <span style={{ color: "red" }}>*</span>{" "}
// //                 </label>
// //                 <select
// //                   className="input-field"
// //                   style={{ width: "100%" }}
// //                   id="DropDownperformerName"
// //                   required
// //                   value={artistdropDownName}
// //                   onChange={(e) => {
// //                     setArtistdropDownName(e.target.value);
// //                     setthirdDropDown(!!e.target.value); // Show if any value is selected
// //                   }}
// //                 >
// //                   <option value="" disabled>
// //                     Select Artist
// //                   </option>
// //                   <option value="a">kavya</option>
// //                   <option value="b">venala</option>
// //                   <option value="c">isha</option>
// //                   <option value="d">krishna</option>
// //                 </select>
// //               </div>
// //             )}

// //             {showthirdDropdown && (
// //               <div>
// //                 <div style={{ marginTop: "30px", marginLeft: "35%" }}>
// //                   {" "}
// //                   {/* Add spacing before button */}
// //                   <button
// //                     className="btn-secondary localize-btn"
// //                     onClick={() => {
// //                       setShowLocalizeModal(true);
// //                       setShowPerformer(false);
// //                     }}
// //                   >
// //                     Localize Your Release
// //                   </button>
// //                 </div>

// //                 <p className="field-tip">
// //                   Select the services where the artist has previously
// //                   distributed and link their artist profiles. If no profile
// //                   exists, new profiles will automatically be created for Spotify
// //                   and Apple Music upon their first release.
// //                 </p>
// //                 <div className="box-i-showdow">
// //                   <div className="box-i">
// //                     <img src={iIcon} />
// //                     <p>
// //                       In order for your release to appear on the updated
// //                       profile, please redeliver
// //                     </p>
// //                   </div>
// //                 </div>

// //                 <div className="profile-buttons-box">
// //                   <div className="profile-button">
// //                     <i className="fab fa-soundcloud"></i>
// //                     <span>SoundCloud</span>
// //                     <button
// //                       className="link-btn"
// //                       onClick={() => openLinkProfileModal("SoundCloud")}
// //                     >
// //                       Link Profile
// //                     </button>
// //                   </div>

// //                   <div className="profile-button">
// //                     <i className="fab fa-spotify"></i>
// //                     <span>Spotify</span>
// //                     <button
// //                       className="link-btn"
// //                       onClick={() => openLinkProfileModal("Spotify")}
// //                     >
// //                       Link Profile
// //                     </button>
// //                   </div>

// //                   <div className="profile-button">
// //                     <i className="fab fa-apple"></i>
// //                     <span>Apple Music</span>
// //                     <button
// //                       className="link-btn"
// //                       onClick={() => openLinkProfileModal("Apple Music")}
// //                     >
// //                       Link Profile
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}

// //             <hr className="line" />
// //             <div className="modal-actions">
// //               <button
// //                 className="btn-secondary"
// //                 onClick={() => {
// //                   setShowPerformer(false),
// //                     setArtistDropDownRole(""),
// //                     setArtistdropDownName(""),
// //                     showSecondDropdown(false),
// //                     showthirdDropdown(false);
// //                 }}
// //               >
// //                 Cancel
// //               </button>
// //               <button className="new-release-button">Add Artist</button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* producer popup */}
// //       {showProducer && (
// //         <div className="modal-overlay">
// //           <div className="modal-content">
// //             <h3>Add Producer & Engineer Credits</h3>
// //             <label className="input-label">
// //               Role<span style={{ color: "red" }}>*</span>
// //             </label>
// //             <select
// //               name="myDropdown"
// //               className="input-field"
// //               style={{ width: "100%" }}
// //               id="myProducerDropdown"
// //               required
// //               value={producerDropDownRole}
// //               onChange={(e) => {
// //                 setproducerDropDownRole(e.target.value);
// //                 setShowSecondDropdown(!!e.target.value); // Show if any value is selected
// //               }}
// //             >
// //               <option value="" disabled de>
// //                 Select Artist
// //               </option>
// //               <option value="option1">Art Director</option>
// //               <option value="option2">Producer</option>
// //               <option value="option3">Art Work</option>
// //               <option value="option4">Acoustic Fretless Guiter</option>
// //               <option value="option5"> Acoustic Fretless Guiter</option>
// //               <option value="option6"> Acoustic Guitar</option>
// //               <option value="option7"> Actor</option>
// //             </select>

// //             {showSecondDropdown && (
// //               <div className="second-dropdown">
// //                 <label className="input-label">
// //                   Artist Name <span style={{ color: "red" }}>*</span>{" "}
// //                 </label>
// //                 <select
// //                   className="input-field"
// //                   style={{ width: "100%" }}
// //                   id="DropDownArtistName"
// //                   required
// //                   value={artistdropDownName}
// //                   onChange={(e) => {
// //                     setArtistdropDownName(e.target.value);
// //                     setthirdDropDown(!!e.target.value); // Show if any value is selected
// //                   }}
// //                 >
// //                   <option value="" disabled>
// //                     Select Artist
// //                   </option>
// //                   <option value="a">kavya</option>
// //                   <option value="b">venala</option>
// //                   <option value="c">isha</option>
// //                   <option value="d">krishna</option>
// //                 </select>
// //               </div>
// //             )}

// //             {showthirdDropdown && (
// //               <div>
// //                 <div style={{ marginTop: "30px", marginLeft: "35%" }}>
// //                   {" "}
// //                   {/* Add spacing before button */}
// //                   <button
// //                     className="btn-secondary localize-btn"
// //                     onClick={() => {
// //                       setShowLocalizeModal(true);
// //                       setShowProducer(false);
// //                     }}
// //                   >
// //                     Localize Your Release
// //                   </button>
// //                 </div>

// //                 <p className="field-tip">
// //                   Select the services where the artist has previously
// //                   distributed and link their artist profiles. If no profile
// //                   exists, new profiles will automatically be created for Spotify
// //                   and Apple Music upon their first release.
// //                 </p>
// //                 <div className="box-i-showdow">
// //                   <div className="box-i">
// //                     <img src={iIcon} />
// //                     <p>
// //                       In order for your release to appear on the updated
// //                       profile, please redeliver
// //                     </p>
// //                   </div>
// //                 </div>

// //                 <div className="profile-buttons-box">
// //                   <div className="profile-button">
// //                     <i className="fab fa-soundcloud"></i>
// //                     <span>SoundCloud</span>
// //                     <button
// //                       className="link-btn"
// //                       onClick={() => openLinkProfileModal("SoundCloud")}
// //                     >
// //                       Link Profile
// //                     </button>
// //                   </div>

// //                   <div className="profile-button">
// //                     <i className="fab fa-spotify"></i>
// //                     <span>Spotify</span>
// //                     <button
// //                       className="link-btn"
// //                       onClick={() => openLinkProfileModal("Spotify")}
// //                     >
// //                       Link Profile
// //                     </button>
// //                   </div>

// //                   <div className="profile-button">
// //                     <i className="fab fa-apple"></i>
// //                     <span>Apple Music</span>
// //                     <button
// //                       className="link-btn"
// //                       onClick={() => openLinkProfileModal("Apple Music")}
// //                     >
// //                       Link Profile
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}

// //             <hr className="line" />
// //             <div className="modal-actions">
// //               <button
// //                 className="btn-secondary"
// //                 onClick={() => {
// //                   setShowProducer(false);
// //                   setproducerDropDownRole("");
// //                   setShowSecondDropdown(false);
// //                   setthirdDropDown(false);
// //                 }}
// //               >
// //                 Cancel
// //               </button>
// //               <button className="new-release-button">Add Artist</button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Link Profile Modal Popup */}
// //       {showLinkProfileModal && (
// //         <div className="modal-overlay">
// //           <div className="modal-container">
// //             <h2>Link your Artist Profile - {selectedProfile}</h2>

// //             <label>Artist {selectedProfile} ID *</label>
// //             <input
// //               type="text"
// //               placeholder={`Enter your ${selectedProfile} ID`}
// //               className="input-field"
// //               value={artistProfileId}
// //               onChange={(e) => setArtistProfileId(e.target.value)}
// //             />

// //             <p className="helper-text">
// //               {selectedProfile === "Spotify" &&
// //                 "Open your artist page on Spotify and copy only the numeric/ID part of the URL (e.g., 22bE4uQ6baNwSHPVcDxLCe)."}
// //               {selectedProfile === "Apple Music" &&
// //                 "Open your artist page on Apple Music and copy only the ID part of the URL (e.g., 552010757)."}
// //               {selectedProfile === "SoundCloud" &&
// //                 "Enter your SoundCloud username from your profile URL. For example, if your URL is https://soundcloud.com/artistname123, enter only artistname123 (not the full link).\n\nNote: SoundCloud maps each ISRC to a single profile, so only the Main Primary Artist’s profile URL will be sent."}
// //             </p>

// //             <div className="button-group">
// //               <button
// //                 className="btn-secondary"
// //                 onClick={() => setShowLinkProfileModal(false)}
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 className="new-release-button"
// //                 onClick={() => setShowLinkProfileModal(false)}
// //               >
// //                 Apply
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

  
// //      {/* Step 4 */}
// // <div className="section">
// //   <h3>Genres</h3>

// //   <div className="genres-grid">
// //     {/* Primary Genre */}
// //     <div>
// //       <label className="label-name" htmlFor="primary-genre">
// //         Primary Genre <span style={{ color: "red" }}>*</span>
// //       </label>
// //       <br />
// //       <select
// //         className="input-field"
// //         style={{ width: "100%" }}
// //         id="primary-genre"
// //         value={primaryGenre}
// //         onChange={(e) => {
// //           setPrimaryGenre(e.target.value);
// //           setSecondaryGenre(""); // Reset secondary genre when main changes
// //         }}
// //       >
// //         <option value="">Select Primary Genre</option>
// //         {Object.keys(genres).map((genre) => (
// //           <option key={genre} value={genre}>
// //             {genre}
// //           </option>
// //         ))}
// //       </select>
// //     </div>

// //     {/* Secondary Genre */}
// //     <div>
// //       <label className="label-name" htmlFor="second-genre">
// //         Secondary Genre <span style={{ color: "red" }}>*</span>
// //       </label>
// //       <br />
// //       <select
// //         className="input-field"
// //         style={{ width: "100%" }}
// //         id="second-genre"
// //         value={secondaryGenre}
// //         onChange={(e) => setSecondaryGenre(e.target.value)}
// //         disabled={!primaryGenre}
// //       >
// //         <option value="">Select Secondary Genre</option>
// //         {primaryGenre &&
// //           genres[primaryGenre]?.map((sub) => (
// //             <option key={sub} value={sub}>
// //               {sub}
// //             </option>
// //           ))}
// //       </select>
// //     </div>
// //   </div>
// // </div>

// //       {/* {step :5} */}

// //       <div className="section">
// //         <h3>Date</h3>
// //         <div style={{ display: "flex", gap: "30px", marginLeft: "10%" }}>
// //           <div className="date-box">
// //             <label>
// //               Digital Release Date <span style={{ color: "red" }}>*</span>
// //             </label>
// //             <input
// //               type="date"
// //               placeholder="DD/MM/YYYY"
// //               value={digitalReleaseDate}
// //               style={{ width: "300px" }}
// //               onChange={(e) => setDigitalReleaseDate(e.target.value)}
// //             />
// //           </div>

// //           <div className="date-box">
// //             <label>
// //               Original Release Date <span style={{ color: "red" }}>*</span>
// //             </label>
// //             <input
// //               type="date"
// //               placeholder="DD/MM/YYYY"
// //               value={originalReleaseDate}
// //               style={{ width: "300px" }}
// //               onChange={(e) => setOriginalReleaseDate(e.target.value)}
// //             />
// //           </div>
// //         </div>
// //       </div>

// //       {/* {step:6} */}
// //       <div className="section">
// //         <h3>UPC</h3>
// //         <div className="input-group">
// //           <label htmlFor="upc">
// //             Do you have a UPC Code? <span style={{ color: "red" }}>*</span>
// //           </label>
// //           <div style={{ display: "flex", gap: "30px", marginTop: "8px" }}>
// //             <label
// //               style={{ display: "flex", alignItems: "center", gap: "6px" }}
// //             >
// //               <input
// //                 type="radio"
// //                 name="upcOption"
// //                 value="yes"
// //                 onChange={() => setHasUPC("yes")}
// //                 checked={hasUPC === "yes"}
// //               />
// //               <span>Yes</span>
// //             </label>
// //             <label
// //               style={{ display: "flex", alignItems: "center", gap: "6px" }}
// //             >
// //               <input
// //                 type="radio"
// //                 name="upcOption"
// //                 value="no"
// //                 onChange={() => setHasUPC("no")}
// //                 checked={hasUPC === "no"}
// //               />
// //               <span>No</span>
// //             </label>
// //           </div>
// //         </div>

// //         {hasUPC === "yes" && (
// //           <div className="input-group" style={{ marginTop: "15px" }}>
// //             <label htmlFor="upcCode">
// //               UPC Code <span style={{ color: "red" }}>*</span>
// //             </label>
// //             <input
// //               type="text"
// //               id="upcCode"
// //               placeholder="Enter Your UPC Code"
// //               className="input-field"
// //               style={{ width: "50%" }}
// //               value={upcCode}
// //               onChange={(e) => setUpcCode(e.target.value)}
// //             />
// //           </div>
// //         )}
// //       </div>

// //       {/* Action Buttons */}
// //       <div className="form-actions">
// //         <button className="btn-secondary" onClick={() => navigate("/")}>
// //           Cancel
// //         </button>
// //         <button
// //           className="new-release-button"
// //           onClick={() => {
// //             navigate("/upload-tracks");
// //             handleSubmit();
// //           }}
// //         >
// //           Next
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // export default CreateRelease;

























import "../styles/CreateRelease.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import iIcon from "../assets/material-symbols_info-outline.png";
import cloud from "../assets/Vector@3x.png";
import dot from "../assets/Component 22.png";
import axios from "axios";

function CreateRelease() {
  const navigate = useNavigate();
  const [fileUploaded, setFileUploaded] = useState(null);
  const [showArtistModal, setShowArtistModal] = useState(false);
  const [artistImage, setArtistImage] = useState(null);
  const [showLocalizeModal, setShowLocalizeModal] = useState(false);

  const [showLinkProfileModal, setShowLinkProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [artistProfileId, setArtistProfileId] = useState("");

  const [showAddArtistModal, setShowAddArtistModal] = useState(false);
  const [showPerformer, setShowPerformer] = useState(false);
  const [showProducer, setShowProducer] = useState(false);
  const [artist, setArtist] = useState(false);
  const [showicons, seticons] = useState(true);
  const [mainArtist, setMainArtist] = useState("");
  const [artistDropDownRole, setArtistDropDownRole] = useState("");
  const [producerDropDownRole, setproducerDropDownRole] = useState("");
  const [performerDropDownRole, setperformerDropDownRole] = useState("");
  // State to control second dropdown visibility
  const [showSecondDropdown, setShowSecondDropdown] = useState(false);
  const [showthirdDropdown, setthirdDropDown] = useState(false);

  const [contributors, setContributors] = useState([]);
  const [artistdropDownName, setArtistdropDownName] = useState("");
  const [linkedProfiles, setLinkedProfiles] = useState({
    Spotify: "",
    AppleMusic: "",
    SoundCloud: "",
  });

  
  const genres = {
  Film: [
    "Devotional", "Dialogue", "Ghazal", "Hip-Hop/ Rap", "Instrumental",
    "Patriotic", "Remix", "Romantic", "Sad", "Unplugged"
  ],
  Pop: [
    "Acoustic Pop", "Band Songs", "Bedroom Pop", "Chill Pop", "Contemporary Pop",
    "Country Pop/ Regional Pop", "Dance Pop", "Electro Pop", "Lo-Fi Pop",
    "Love Songs", "Pop Rap", "Pop Singer-Songwriter", "Sad Songs", "Soft Pop"
  ],
  Indie: [
    "Indian Indie", "Indie Dance", "Indie Folk", "Indie Hip-Hop", "Indie Lo-Fi",
    "Indie Pop", "Indie Rock", "Indie Singer -Songwriter"
  ],
  "Hip-Hop/Rap": [
    "Alternative Hip-Hop", "Concious Hip-Hop", "Country Rap", "Emo Rap", "Hip-Hop",
    "Jazz Rap", "Pop Rap", "Trap", "Trap Beats"
  ],
  Folk: [
    "Ainchaliyan", "Alha", "Atulprasadi", "Baalgeet/ Children Song", "Banvarh",
    "Barhamasa", "Basant Geet", "Baul Geet", "Bhadu Gaan", "Bhangra", "Bhatiali",
    "Bhavageete", "Bhawaiya", "Bihugeet", "Birha", "Borgeet", "Dandiya Raas", "Garba",
    "Lavani", "Lokgeet", "Rasiya", "Tappa", "Tusu Gaan", "Villu Pattu"
  ],
  Devotional: [
    "Aarti", "Bhajan", "Carol", "Chalisa", "Chant", "Geet", "Gospel",
    "Gurbani", "Hymn", "Kirtan", "Mantra", "Paath", "Qawwals", "Shabd"
  ],
  "Hindustani Classical": ["Instrumental", "Vocal"],
  "Carnatic Classical": ["Instrumental", "Vocal"],
  "Ambient / Instrumental": ["Soft", "Easy Listening", "Electronic", "Fusion", "Lounge"]
};

 const [titleName, setTitleName] = useState("");
  const [releaseTitle, setReleaseTitle] = useState("");
  const [titleVersion, setTitleVersion] = useState("");
  const [localizations, setLocalizations] = useState([
    { language: "", localizedTitle: "", titleVersion: "" },
  ]);

  // Step 2: Cover Artwork
  const [coverArtwork, setCoverArtwork] = useState(null); // File object
  const [fileError, setFileError] = useState("");

  // Step 4: Genres
  const [primaryGenre, setPrimaryGenre] = useState("");
  const [secondaryGenre, setSecondaryGenre] = useState("");

  // Step 5: Dates
  const [digitalReleaseDate, setDigitalReleaseDate] = useState("");
  const [originalReleaseDate, setOriginalReleaseDate] = useState("");

  // Step 6: UPC
  const [hasUPC, setHasUPC] = useState(null); // 'yes' or 'no'
  const [upcCode, setUpcCode] = useState("");
  const [profile, setProfileModel] = useState("");

  // Example: adding/updating a contributor
  const addContributor = (contributor) => {
    setContributors([...contributors, contributor]);
  };

  const openLinkProfileModal = (a) => {
    setProfileModel(e);
  };

  // Step 7: Form submission
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("releaseTitle", releaseTitle);
    formData.append("titleVersion", titleVersion);
    formData.append("digitalReleaseDate", digitalReleaseDate);
    formData.append("originalReleaseDate", originalReleaseDate);
    formData.append("primaryGenre", primaryGenre);
    formData.append("secondaryGenre", secondaryGenre);
    formData.append("hasUPC", hasUPC);
    if (coverArtwork) {
      formData.append("coverArtwork", coverArtwork); // <--- File object goes here
    }
    if (hasUPC === "yes") formData.append("upcCode", upcCode);
    if (coverArtwork) formData.append("coverArtwork", coverArtwork);

    // Convert arrays/objects to JSON string if sending via FormData
    formData.append("localizations", JSON.stringify(localizations));
    formData.append("contributors", JSON.stringify(contributors));

    const openLinkProfileModal = (profile) => {
      setSelectedProfile(profile);
      setArtistProfileId("");
      setShowLinkProfileModal(true);
    };

    const object = {};
    formData.forEach((value, key) => {
      object[key] = value;
    });

    const collectionPayload = {
      collection: {
        info: {
          name: object.releaseTitle || "New Collection",
          schema:
            "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
        },
        item: [
          {
            name: "Sample Request", // Give a request name
            request: {
              method: "POST",
              header: [],
              body: {
                mode: "raw",
                raw: JSON.stringify({
                  form_id: 1,
                  releaseTitle,
                  titleVersion,
                  digitalReleaseDate,
                  originalReleaseDate,
                  coverArtwork,
                  primaryGenre,
                  secondaryGenre,
                  hasUPC,
                  upcCode: hasUPC === "yes" ? upcCode : "",
                  localizations,
                  contributors,
                }),
              },
              url: {
                raw: "https://your-api-endpoint.com",
                protocol: "https",
                host: ["your-api-endpoint", "com"],
              },
            },
          },
        ], // You can add requests here if needed
      },
    };

    // eslint-disable-next-line no-undef

    try {
      const response = await axios.post(
        "/wp/wp-json/gf/v2/entries",
        collectionPayload,
        {
          headers: {
           Authorization: `Basic ${btoa("ck_23e474a3a4a15b8460b78f01bc60d565dd7f94c5:cs_84ee6ec3c485d7727560ad9103ed3311d2afb088")}`,
            "Content-type": "application/json",
          },
        }
      );

      console.log("Postman API Response:", response.data);
    } catch (error) {
      console.error(
        "Error posting to Postman API:",
        error.response?.data || error.message
      );
    }
  };

  const saveContributor = () => {
    
    if (!artistdropDownName) return;

    const newContributor = {
      type: "Main Primary Artist",
      name: artistdropDownName,
      linkedProfiles,
    };

    setContributors([...contributors, newContributor]); // ✅ store contributor
    setArtistdropDownName("");
    setLinkedProfiles({ Spotify: "", AppleMusic: "", SoundCloud: "" });
    setShowArtistModal(false);
  };

  //https://api.getpostman.com/collections

  // const token = localStorage.getItem("jwtToken");

  // const fetchDetails =  async ()=>{
  //    try {
  //       const response = await fetch("https://api.getpostman.com/collections", {
  //       });

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch collections");
  //       }

  //       const data = await response.json();
  //       console.log(data)
  //     } catch (error) {
  //       console.error("Error fetching Postman collections:", error);
  //     }

  // }

  // useEffect(()=>{

  //   fetchDetails()

  // },[])

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new window.Image();
    img.src = URL.createObjectURL(file);
    img.onload = function () {
      if (img.width === 3000 && img.height === 3000) {
        setCoverArtwork(file);
        setFileUploaded(file);
        setFileError("");
      } else {
        setCoverArtwork(null);
        setFileError("Image must be exactly 3000px by 3000px.");
      }
      URL.revokeObjectURL(img.src);
    };
  };

  return (
    <div className="create-release-page">
      <h2 className="page-title">Create A New Release</h2>

      {/* Step 1 */}
      <div className="section">
        <h3>Enter Release Details</h3>

        <div className="input-group">
          <label htmlFor="titleName">
             Title name <span style={{ color: "red" }}>*</span>{" "}
          </label>
          <input
            type="text"
            id="titleName"
            placeholder="e.g., come on baby"
            className="input-field"
            onChange={(e) => setTitleName(e.target.value)}
            value={titleName}
            style={{ width: "50%" }}
          />
        </div>
        <br />

        <div className="input-group">
          <label htmlFor="title">
            Release Title <span style={{ color: "red" }}>*</span>{" "}
          </label>
          <input
            type="text"
            id="title"
            placeholder="e.g., I got my summer"
            className="input-field"
            onChange={(e) => setReleaseTitle(e.target.value)}
            value={releaseTitle}
            style={{ width: "50%" }}
          />
        </div>

        <div className="input-group">
          <label htmlFor="titleversion">Title Version</label>
          <input
            type="text"
            id="titleversion"
            placeholder="e.g., Live, Remix, Remastered"
            className="input-field"
            onChange={(e) => setTitleVersion(e.target.value)}
            value={titleVersion}
            style={{ width: "50%" }}
          />
        </div>
        <br />

        <span></span>

        <br />
      </div>

    
      {/* Step 2 */}
      <div className="section upload-section">
        <h3>Upload Cover Artwork</h3>
        <div className="form-grid">
          <div
            className="upload-box"
            onClick={() => document.getElementById("fileInput").click()}
          >
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              accept="image/png, image/jpeg, image/jpg, image/jfif"
              onChange={handleFileChange} // <-- use new handler
            />
            {fileUploaded ? (
              <img
                src={URL.createObjectURL(fileUploaded)}
                alt="Preview"
                className="upload-preview"
              />
            ) : (
              <div className="text">
                <p>
                  <img src={cloud} className="could-img" alt="could-image" />
                  Drag here or click to browse a file
                </p>
                <p className="file-types">
                  Supported: JPG, JPEG, PNG, JFIF (Must be exactly 3000px x
                  3000px, Max 10MB)
                </p>
                {fileError && <p style={{ color: "red" }}>{fileError}</p>}
              </div>
            )}
          </div>

          <div className="tips-box">
            <h4>Tips:</h4>
            <p>
              Please ensure your cover art is square, less than 10 MB and a
              minimum of 3000px wide (3000px width is recommended for best
              results).
            </p>
            <br />
            <h3>Your cover art cannot contain:</h3>
            <ul>
              <li>
                <img src={dot} />
                Any text other than the release title and/or artist name
              </li>
              <li>
                <img src={dot} />
                Third-party logos or trademarks without express written consent
                from the trademark holder
              </li>
              <li>
                <img src={dot} />
                Sexually explicit imagery
              </li>
              <li>
                <img src={dot} />
                Supported: JPG, JPEG, PNG, JFIF
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Step 3 */}


      {/* ----------------------------------------------------------------Now---------------------------------- */}
      <div className="section">


        <h3>Contributors</h3>

        {showicons && (
          <div className="contributors-buttons">
            <button
              className="btn-secondary"
              onClick={() => {
                setShowArtistModal(true);
                setArtistDropDownRole("");
                setShowSecondDropdown(false);
                setthirdDropDown(false);
              }}
            >
              + Add Main Primary Artist
            </button>
          

            <button
              className="btn-secondary"
              onClick={() => {
                setShowAddArtistModal(true);
                setArtistDropDownRole("");
                setShowSecondDropdown(false);
                setthirdDropDown(false);
              }}
            >
              + Add Producer
            </button>

            <button
              className="btn-secondary"
              onClick={() => {
                setShowPerformer(true);
                setperformerDropDownRole("");
                setShowSecondDropdown(false);
                setthirdDropDown(false);
              }}
            >
              + Add Director
            </button>

            <button
              className="btn-secondary"
              onClick={() => {
                setShowProducer(true);
                setproducerDropDownRole("");
                setShowSecondDropdown(false);
                setthirdDropDown(false);
              }}
            >
              + Add Composer
            </button>


             <button
              className="btn-secondary"
              onClick={() => {
                setShowProducer(true);
                setproducerDropDownRole("");
                setShowSecondDropdown(false);
                setthirdDropDown(false);
              }}
            >
              + Add Lyricist
            </button>

          </div>
        )}

        
      </div>

      {/* Artist Modal new Popup */}

      {showArtistModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Main Primary Artist</h3>

            {/* Artist selection */}
            <div className="second-dropdown">
              <label className="input-label">
                Artist Name <span style={{ color: "red" }}>*</span>
              </label>
              <select
                className="input-field"
                style={{ width: "100%" }}
                id="DropDownArtistName"
                required
                value={artistdropDownName}
                onChange={(e) => {
                  setArtistdropDownName(e.target.value);
                  setthirdDropDown(!!e.target.value);
                }}
              >
                <option value="" disabled>
                  Select Artist
                </option>
                
                <option value="Kavya">Kavya</option>
                <option value="Venala">Venala</option>
                <option value="Isha">Isha</option>
                <option value="Krishna">Krishna</option>
                </select>
                <button
                  value={"new"}
                    type="button"
                    className="new-release-button"
                    style={{ width: "100%", marginTop: "10px" }}
                    onClick={() => {setShowLinkProfileModal(true);
                      setthirdDropDown("");
                    } // open your modal
                  }
                    
                >
                    + Create New Artist
                 </button>
            </div>




            {showthirdDropdown && (
              <div>
                {/* Localization button */}
                {/* <div style={{ marginTop: "30px", marginLeft: "35%" }}>
                  <button
                    className="btn-secondary localize-btn"
                    onClick={() => {
                      setShowLocalizeModal(true);
                      setShowArtistModal(false);
                    }}
                  >
                    Localize Your Release
                  </button>
                </div> */}

                {/* Info section */}
                <p className="field-tip">
                  Select the services where the artist has previously
                  distributed...
                </p>
                <div className="box-i-showdow">
                  <div className="box-i">
                    <img src={iIcon} />
                    <p>
                      In order for your release to appear on the updated
                      profile, please redeliver
                    </p>
                  </div>
                </div>

                {/* Link profile buttons */}
                <div className="profile-buttons-box">
                  {["SoundCloud", "Spotify", "AppleMusic"].map((platform) => (
                    <div key={platform} className="profile-button">
                      <span>{platform}</span>
                      <button
                        className="link-btn"
                        onClick={() => {
                          const link = prompt(`Enter ${platform} profile URL`);
                          if (link) {
                            setLinkedProfiles((prev) => ({
                              ...prev,
                              [platform]: link,
                            }));
                          }
                        }}
                      >
                        Link Profile
                      </button>
                    </div>
                  ))}
                </div>

                {/* Save contributor */}
                <div style={{ marginTop: "20px", textAlign: "right" }}>
                  <button
                    className="btn-secondary"
                    onClick={() => setShowArtistModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="new-release-button"
                    onClick={saveContributor}
                  >
                    Save Artist
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Artist Modal Popup */}
      {artist && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create a new Main Primary Artist</h3>

            <div className="artist-image-box">
              <input
                type="file"
                id="artistImageInput"
                style={{ display: "none" }}
                accept="image/png, image/jpeg, image/jpg, image/jfif"
                onChange={(e) => setArtistImage(e.target.files[0])}
              />

              {artistImage ? (
                <div
                  style={{
                    position: "relative",
                    width: "140px",
                    height: "140px",
                  }}
                >
                  <img
                    src={URL.createObjectURL(artistImage)}
                    alt="Artist Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <button
                    type="button"
                    className="btn-reselect-icon"
                    onClick={() =>
                      document.getElementById("artistImageInput").click()
                    }
                    style={{
                      position: "absolute",
                      bottom: "5px",
                      right: "5px",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      backgroundColor: "#2563eb",
                      color: "#fff",
                      border: "none",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    +
                  </button>
                </div>
              ) : (
                <div
                  className="placeholder-icon"
                  onClick={() =>
                    document.getElementById("artistImageInput").click()
                  }
                  style={{
                    width: "140px",
                    height: "140px",
                    borderRadius: "50%",
                    backgroundColor: "#f3f4f6",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "50px",
                    color: "#2563eb",
                    cursor: "pointer",
                  }}
                >
                  +
                </div>
              )}
            </div>

            <p className="image-support-text">
              We Support PNG, JFIF, JPEG, Or JPG Images.
            </p>

            <div className="input-group">
              <label className="input-label">enter your name</label>
              <input
                type="text"
                placeholder="Your Name Here"
                className="input-field"
              />
            </div>

            <div style={{ marginTop: "30px" }}>
              {" "}
              {/* Add spacing before button */}
              <button className="btn-secondary ">Localize Your Release</button>
            </div>

            <p className="field-tip">
              Enter the name exactly as you want it to appear on platforms like
              Spotify, Apple Music, etc.
            </p>

            <div className="profile-buttons-box">
              <div className="profile-button">
                <i className="fab fa-soundcloud"></i>
                <span>SoundCloud</span>
                <button
                  className="link-btn"
                  onClick={() => openLinkProfileModal("SoundCloud")}
                >
                  Link Profile
                </button>
              </div>

              <div className="profile-button">
                <i className="fab fa-spotify"></i>
                <span>Spotify</span>
                <button
                  className="link-btn"
                  onClick={() => openLinkProfileModal("Spotify")}
                >
                  Link Profile
                </button>
              </div>

              <div className="profile-button">
                <i className="fab fa-apple"></i>
                <span>Apple Music</span>
                <button
                  className="link-btn"
                  onClick={() => openLinkProfileModal("Apple Music")}
                >
                  Link Profile
                </button>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowArtistModal(false);
                }}
              >
                Cancel
              </button>
              <button className="btn-primary">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* show add artist model */}
      {showAddArtistModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Key Artist</h3>
            <label className="input-label">
              Role<span style={{ color: "red" }}>*</span>
            </label>
            <select
              name="myDropdown"
              className="input-field"
              style={{ width: "100%" }}
              id="myDropdown"
              required
              value={artistDropDownRole}
              onChange={(e) => {
                setArtistDropDownRole(e.target.value);
                setShowSecondDropdown(!!e.target.value); // Show if any value is selected
              }}
            >
              <option value="" disabled>
                Select Artist
              </option>
              <option value="option1">Featuring</option>
              <option value="option2">Primary Artist</option>
              <option value="option3">Remixer</option>
              <option value="option4">With</option>
            </select>
            <button
                    type="button"
                    className="new-release-button"
                    style={{ width: "100%", marginTop: "10px" }}
                    onClick={() => setShowLinkProfileModal(true)} // open your modal
                >
                    + Create New Artist
                 </button>

            {showSecondDropdown && (
              <div className="second-dropdown">
                <label className="input-label">
                  Artist Name <span style={{ color: "red" }}>*</span>{" "}
                </label>
                <select
                  className="input-field"
                  style={{ width: "100%" }}
                  id="DropDownArtistName"
                  required
                  value={artistdropDownName}
                  onChange={(e) => {
                    setArtistdropDownName(e.target.value);
                    setthirdDropDown(!!e.target.value); // Show if any value is selected
                  }}
                >
                  <option value="" disabled>
                    Select Artist
                  </option>
                  <option value="a">kavya</option>
                  <option value="b">venala</option>
                  <option value="c">isha</option>
                  <option value="d">krishna</option>
                </select>
              </div>
            )}

            {showthirdDropdown && (
              <div>
                <div style={{ marginTop: "30px", marginLeft: "35%" }}>
                  {" "}
                  {/* Add spacing before button */}
                  <button
                    className="btn-secondary localize-btn"
                    onClick={() => {
                      setShowLocalizeModal(true);
                      setShowAddArtistModal(false);
                    }}
                  >
                    Localize Your Release
                  </button>
                </div>

                <p className="field-tip">
                  Select the services where the artist has previously
                  distributed and link their artist profiles. If no profile
                  exists, new profiles will automatically be created for Spotify
                  and Apple Music upon their first release.
                </p>
                <div className="box-i-showdow">
                  <div className="box-i">
                    <img src={iIcon} />
                    <p>
                      In order for your release to appear on the updated
                      profile, please redeliver
                    </p>
                  </div>
                </div>

                <div className="profile-buttons-box">
                  <div className="profile-button">
                    <i className="fab fa-soundcloud"></i>
                    <span>SoundCloud</span>
                    <button
                      className="link-btn"
                      onClick={() => openLinkProfileModal("SoundCloud")}
                    >
                      Link Profile
                    </button>
                  </div>

                  <div className="profile-button">
                    <i className="fab fa-spotify"></i>
                    <span>Spotify</span>
                    <button
                      className="link-btn"
                      onClick={() => openLinkProfileModal("Spotify")}
                    >
                      Link Profile
                    </button>
                  </div>

                  <div className="profile-button">
                    <i className="fab fa-apple"></i>
                    <span>Apple Music</span>
                    <button
                      className="link-btn"
                      onClick={() => openLinkProfileModal("Apple Music")}
                    >
                      Link Profile
                    </button>
                  </div>
                </div>
              </div>
            )}

            <hr className="line" />
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowAddArtistModal(false);
                  setArtistDropDownRole("");
                  setArtistdropDownName("");
                  setShowSecondDropdown(false);
                  setthirdDropDown(false);
                }}
              >
                Cancel
              </button>
              <button className="new-release-button">Add Artist</button>
            </div>
          </div>
        </div>
      )}

      {/* performer popup */}
      {showPerformer && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Performer</h3>
            <label className="input-label">
              Role<span style={{ color: "red" }}>*</span>
            </label>
            <select
              name="myDropdown"
              className="input-field"
              style={{ width: "100%" }}
              id="myPerformerDropdown"
              required
              value={performerDropDownRole}
              onChange={(e) => {
                setperformerDropDownRole(e.target.value);
                setShowSecondDropdown(!!e.target.value); // Show if any value is selected
              }}
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="option1">Acccordion</option>
              <option value="option2">Acoustic Baritone Guitar</option>
              <option value="option3">Acoustic Bass Guiter</option>
              <option value="option4">Acoustic Fretless Guiter</option>
              <option value="option5"> Acoustic Fretless Guiter</option>
              <option value="option6"> Acoustic Guitar</option>
              <option value="option7"> Actor</option>
            </select>

            {showSecondDropdown && (
              <div className="second-dropdown">
                <label className="input-label">
                  Artist Name <span style={{ color: "red" }}>*</span>{" "}
                </label>
                <select
                  className="input-field"
                  style={{ width: "100%" }}
                  id="DropDownperformerName"
                  required
                  value={artistdropDownName}
                  onChange={(e) => {
                    setArtistdropDownName(e.target.value);
                    setthirdDropDown(!!e.target.value); // Show if any value is selected
                  }}
                >
                  <option value="" disabled>
                    Select Artist
                  </option>
                  <option value="a">kavya</option>
                  <option value="b">venala</option>
                  <option value="c">isha</option>
                  <option value="d">krishna</option>
                </select>
              </div>
            )}

            {showthirdDropdown && (
              <div>
                <div style={{ marginTop: "30px", marginLeft: "35%" }}>
                  {" "}
                  {/* Add spacing before button */}
                  <button
                    className="btn-secondary localize-btn"
                    onClick={() => {
                      setShowLocalizeModal(true);
                      setShowPerformer(false);
                    }}
                  >
                    Localize Your Release
                  </button>
                </div>

                <p className="field-tip">
                  Select the services where the artist has previously
                  distributed and link their artist profiles. If no profile
                  exists, new profiles will automatically be created for Spotify
                  and Apple Music upon their first release.
                </p>
                <div className="box-i-showdow">
                  <div className="box-i">
                    <img src={iIcon} />
                    <p>
                      In order for your release to appear on the updated
                      profile, please redeliver
                    </p>
                  </div>
                </div>

                <div className="profile-buttons-box">
                  <div className="profile-button">
                    <i className="fab fa-soundcloud"></i>
                    <span>SoundCloud</span>
                    <button
                      className="link-btn"
                      onClick={() => openLinkProfileModal("SoundCloud")}
                    >
                      Link Profile
                    </button>
                  </div>

                  <div className="profile-button">
                    <i className="fab fa-spotify"></i>
                    <span>Spotify</span>
                    <button
                      className="link-btn"
                      onClick={() => openLinkProfileModal("Spotify")}
                    >
                      Link Profile
                    </button>
                  </div>

                  <div className="profile-button">
                    <i className="fab fa-apple"></i>
                    <span>Apple Music</span>
                    <button
                      className="link-btn"
                      onClick={() => openLinkProfileModal("Apple Music")}
                    >
                      Link Profile
                    </button>
                  </div>
                </div>
              </div>
            )}

            <hr className="line" />
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowPerformer(false),
                    setArtistDropDownRole(""),
                    setArtistdropDownName(""),
                    showSecondDropdown(false),
                    showthirdDropdown(false);
                }}
              >
                Cancel
              </button>
              <button className="new-release-button">Add Artist</button>
            </div>
          </div>
        </div>
      )}

      {/* producer popup */}
      {showProducer && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Producer & Engineer Credits</h3>
            <label className="input-label">
              Role<span style={{ color: "red" }}>*</span>
            </label>
            <select
              name="myDropdown"
              className="input-field"
              style={{ width: "100%" }}
              id="myProducerDropdown"
              required
              value={producerDropDownRole}
              onChange={(e) => {
                setproducerDropDownRole(e.target.value);
                setShowSecondDropdown(!!e.target.value); // Show if any value is selected
              }}
            >
              <option value="" disabled de>
                Select Artist
              </option>
              <option value="option1">Art Director</option>
              <option value="option2">Producer</option>
              <option value="option3">Art Work</option>
              <option value="option4">Acoustic Fretless Guiter</option>
              <option value="option5"> Acoustic Fretless Guiter</option>
              <option value="option6"> Acoustic Guitar</option>
              <option value="option7"> Actor</option>
            </select>

            {showSecondDropdown && (
              <div className="second-dropdown">
                <label className="input-label">
                  Artist Name <span style={{ color: "red" }}>*</span>{" "}
                </label>
                <select
                  className="input-field"
                  style={{ width: "100%" }}
                  id="DropDownArtistName"
                  required
                  value={artistdropDownName}
                  onChange={(e) => {
                    setArtistdropDownName(e.target.value);
                    setthirdDropDown(!!e.target.value); // Show if any value is selected
                  }}
                >
                  <option value="" disabled>
                    Select Artist
                  </option>
                  <option value="a">kavya</option>
                  <option value="b">venala</option>
                  <option value="c">isha</option>
                  <option value="d">krishna</option>
                  <option> create new </option>
                </select>
              </div>
            )}

            {showthirdDropdown && (
              <div>
                <div style={{ marginTop: "30px", marginLeft: "35%" }}>
                  {" "}
                  {/* Add spacing before button */}
                  <button
                    className="btn-secondary localize-btn"
                    onClick={() => {
                      setShowLocalizeModal(true);
                      setShowProducer(false);
                    }}
                  >
                    Localize Your Release
                  </button>
                </div>

                <p className="field-tip">
                  Select the services where the artist has previously
                  distributed and link their artist profiles. If no profile
                  exists, new profiles will automatically be created for Spotify
                  and Apple Music upon their first release.
                </p>
                <div className="box-i-showdow">
                  <div className="box-i">
                    <img src={iIcon} />
                    <p>
                      In order for your release to appear on the updated
                      profile, please redeliver
                    </p>
                  </div>
                </div>

                <div className="profile-buttons-box">
                  <div className="profile-button">
                    <i className="fab fa-soundcloud"></i>
                    <span>SoundCloud</span>
                    <button
                      className="link-btn"
                      onClick={() => openLinkProfileModal("SoundCloud")}
                    >
                      Link Profile
                    </button>
                  </div>

                  <div className="profile-button">
                    <i className="fab fa-spotify"></i>
                    <span>Spotify</span>
                    <button
                      className="link-btn"
                      onClick={() => openLinkProfileModal("Spotify")}
                    >
                      Link Profile
                    </button>
                  </div>

                  <div className="profile-button">
                    <i className="fab fa-apple"></i>
                    <span>Apple Music</span>
                    <button
                      className="link-btn"
                      onClick={() => openLinkProfileModal("Apple Music")}
                    >
                      Link Profile
                    </button>
                  </div>
                </div>
              </div>
            )}

            <hr className="line" />
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowProducer(false);
                  setproducerDropDownRole("");
                  setShowSecondDropdown(false);
                  setthirdDropDown(false);
                }}
              >
                Cancel
              </button>
              <button className="new-release-button">Add Artist</button>
            </div>
          </div>
        </div>
      )}

      {/* Link Profile Modal Popup */}
      {showLinkProfileModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2>Link your Artist Profile - {selectedProfile}</h2>

            <label>Artist {selectedProfile} ID *</label>
            <input
              type="text"
              placeholder={`Enter your ${selectedProfile} ID`}
              className="input-field"
              value={artistProfileId}
              onChange={(e) => setArtistProfileId(e.target.value)}
            />

            <p className="helper-text">
              {selectedProfile === "Spotify" &&
                "Open your artist page on Spotify and copy only the numeric/ID part of the URL (e.g., 22bE4uQ6baNwSHPVcDxLCe)."}
              {selectedProfile === "Apple Music" &&
                "Open your artist page on Apple Music and copy only the ID part of the URL (e.g., 552010757)."}
              {selectedProfile === "SoundCloud" &&
                "Enter your SoundCloud username from your profile URL. For example, if your URL is https://soundcloud.com/artistname123, enter only artistname123 (not the full link).\n\nNote: SoundCloud maps each ISRC to a single profile, so only the Main Primary Artist’s profile URL will be sent."}
            </p>

            <div className="button-group">
              <button
                className="btn-secondary"
                onClick={() => setShowLinkProfileModal(false)}
              >
                Cancel
              </button>
              <button
                className="new-release-button"
                onClick={() => setShowLinkProfileModal(false)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

  {/* ---------------------------------------------------------------------------------------------------------------------------------- */}
     {/* Step 4 */}
<div className="section">
  <h3>Genres</h3>

  <div className="genres-grid">
    {/* Primary Genre */}
    <div>
      <label className="label-name" htmlFor="primary-genre">
        Primary Genre <span style={{ color: "red" }}>*</span>
      </label>
      <br />
      <select
        className="input-field"
        style={{ width: "100%" }}
        id="primary-genre"
        value={primaryGenre}
        onChange={(e) => {
          setPrimaryGenre(e.target.value);
          setSecondaryGenre(""); // Reset secondary genre when main changes
        }}
      >
        <option value="">Select Primary Genre</option>
        {Object.keys(genres).map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
    </div>

    {/* Secondary Genre */}
    <div>
      <label className="label-name" htmlFor="second-genre">
        Secondary Genre <span style={{ color: "red" }}>*</span>
      </label>
      <br />
      <select
        className="input-field"
        style={{ width: "100%" }}
        id="second-genre"
        value={secondaryGenre}
        onChange={(e) => setSecondaryGenre(e.target.value)}
        disabled={!primaryGenre}
      >
        <option value="">Select Secondary Genre</option>
        {primaryGenre &&
          genres[primaryGenre]?.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
      </select>
    </div>
  </div>
</div>

      {/* {step :5} */}

      <div className="section">
        <h3>Date</h3>
        <div style={{ display: "flex", gap: "30px", marginLeft: "10%" }}>
          <div className="date-box">
            <label>
              Digital Release Date <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="date"
              placeholder="DD/MM/YYYY"
              value={digitalReleaseDate}
              style={{ width: "300px" }}
              onChange={(e) => setDigitalReleaseDate(e.target.value)}
            />
          </div>

          <div className="date-box">
            <label>
              Original Release Date <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="date"
              placeholder="DD/MM/YYYY"
              value={originalReleaseDate}
              style={{ width: "300px" }}
              onChange={(e) => setOriginalReleaseDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* {step:6} */}
      <div className="section">
        <h3>UPC</h3>
        <div className="input-group">
          <label htmlFor="upc">
            Do you have a UPC Code? <span style={{ color: "red" }}>*</span>
          </label>
          <div style={{ display: "flex", gap: "30px", marginTop: "8px" }}>
            <label
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <input
                type="radio"
                name="upcOption"
                value="yes"
                onChange={() => setHasUPC("yes")}
                checked={hasUPC === "yes"}
              />
              <span>Yes</span>
            </label>
            <label
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <input
                type="radio"
                name="upcOption"
                value="no"
                onChange={() => setHasUPC("no")}
                checked={hasUPC === "no"}
              />
              <span>No</span>
            </label>
          </div>
        </div>

        {hasUPC === "yes" && (
          <div className="input-group" style={{ marginTop: "15px" }}>
            <label htmlFor="upcCode">
              UPC Code <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              id="upcCode"
              placeholder="Enter Your UPC Code"
              className="input-field"
              style={{ width: "50%" }}
              value={upcCode}
              onChange={(e) => setUpcCode(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="form-actions">
        <button className="btn-secondary" onClick={() => navigate("/")}>
          Cancel
        </button>
        <button
          className="new-release-button"
          onClick={() => {
            navigate("/upload-tracks");
            handleSubmit();
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default CreateRelease;




