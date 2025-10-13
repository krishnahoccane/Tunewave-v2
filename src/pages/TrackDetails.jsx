// // import React, { useState, useRef, useEffect } from "react";
// // import { useNavigate, useLocation } from "react-router-dom";
// // import "../styles/TrackDetails.css";

// // const allLanguages = [
// //   "Ahirani","Arabic","Assamese","Awadhi","Banjara","Bengali","Bhojpuri","Burmese",
// //   "Chhattisgarhi","Chinese","Dogri","English","French","Garhwali","Garo","Gujarati",
// //   "Haryanvi","Himachali","Hindi","Iban","Indonesian","Instrumental","Italian",
// //   "Japanese","Javanese","Kannada","Kashmiri","Khasi","Kokborok","Konkani","Korean",
// //   "Kumauni","Latin","Maithili","Malay","Malayalam","Mandarin","Manipuri","Marathi",
// //   "Marwari","Naga","Nagpuri","Nepali","Odia","Pali","Persian","Punjabi","Rajasthani",
// //   "Sainthili","Sambalpuri","Sanskrit","Santali","Sindhi","Sinhala","Spanish","Swahili",
// //   "Tamil","Telugu","Thai","Tibetan","Tulu","Turkish","Ukrainian","Urdu","Zxx"
// // ];

// // const TrackDetails = () => {
// //   const location = useLocation();
// //   const navigate = useNavigate();
// //   const { track = {} } = location.state || {};

// //   // 🎯 State variables
// //   const [trackTitle, setTrackTitle] = useState(track.trackTitle || "");
// //   const [catalogId, setCatalogId] = useState(track.catalogId || "");
// //   const [primaryArtist, setPrimaryArtist] = useState(track.primaryArtist || "");
// //   const [composer, setComposer] = useState(track.composer || "");
// //   const [director, setDirector] = useState(track.director || "");
// //   const [producer, setProducer] = useState(track.producer || "");
// //   const [lyricist, setLyricist] = useState(track.lyricist || "");

// //   const [lyricsLanguage, setLyricsLanguage] = useState(track.lyricsLanguage || "");
// //   const [lyricsLanguageOption, setLyricsLanguageOption] = useState(track.lyricsLanguageOption || "Select Language");
// //   const [filteredLanguages, setFilteredLanguages] = useState(allLanguages);
// //   const [showDropdown, setShowDropdown] = useState(false);

// //   const dropdownRef = useRef(null);

// //   const [crbts, setCrbts] = useState(track.crbts || [{ name: "", time: "00:00:00" }]);
// //   const [isrcOption, setIsrcOption] = useState(track.isrcOption || "no");
// //   const [isrcCode, setIsrcCode] = useState(track.isrcCode || "");
// //   const [explicitStatus, setExplicitStatus] = useState(track.explicitStatus || "");

// //   const [isSaving, setIsSaving] = useState(false);

// //   // Close dropdown when clicking outside
// //   useEffect(() => {
// //     const handleClickOutside = (event) => {
// //       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
// //         setShowDropdown(false);
// //       }
// //     };
// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () => document.removeEventListener("mousedown", handleClickOutside);
// //   }, []);

// //   // Filter languages based on input
// //   const handleInputChange = (value) => {
// //     setLyricsLanguage(value);
// //     const filtered = allLanguages.filter(lang =>
// //       lang.toLowerCase().startsWith(value.toLowerCase())
// //     );
// //     setFilteredLanguages(filtered);
// //     setShowDropdown(true);
// //   };

// //   // CRBT handlers
// //   const handleAddCrbt = () => setCrbts([...crbts, { name: "", time: "00:00:00" }]);
// //   const handleDeleteCrbt = (index) => {
// //     if (crbts.length > 1) setCrbts(crbts.filter((_, i) => i !== index));
// //   };
// //   const handleCrbtChange = (index, field, value) => {
// //     const updatedCrbts = [...crbts];
// //     updatedCrbts[index][field] = value;
// //     setCrbts(updatedCrbts);
// //   };

// //   // Save track and send to webhook
// //   const handleSaveAndContinue = async () => {
// //     if (isSaving) return;
// //     setIsSaving(true);

// //     try {
// //       // Validation
// //       if (!trackTitle.trim()) { alert("Please enter track title."); setIsSaving(false); return; }
// //       if (!primaryArtist.trim()) { alert("Please enter primary artist."); setIsSaving(false); return; }
// //       if (lyricsLanguageOption === "Select Language" && !lyricsLanguage.trim()) { alert("Please select a language."); setIsSaving(false); return; }
// //       if (!explicitStatus.trim()) { alert("Please select explicit content status."); setIsSaving(false); return; }
// //       if (isrcOption === "yes" && !isrcCode.trim()) { alert("Please enter ISRC code."); setIsSaving(false); return; }

// //       const trackData = {
// //         created_by: atob(localStorage.getItem("userId")),
// //         trackTitle: trackTitle.trim(),
// //         catalogId: catalogId.trim(),
// //         primaryArtist: primaryArtist.trim(),
// //         composer: composer.trim(),
// //         director: director.trim(),
// //         producer: producer.trim(),
// //         lyricist: lyricist.trim(),
// //         lyricsLanguage,
// //         lyricsLanguageOption,
// //         crbts,
// //         isrcOption,
// //         isrcCode: isrcOption === "yes" ? isrcCode.trim() : "",
// //         explicitStatus,
// //       };

// //       // Save to localStorage safely
// //       let tracks = [];
// //       try {
// //         tracks = JSON.parse(localStorage.getItem("uploadedTracks") || "[]");
// //         if (!Array.isArray(tracks)) tracks = [];
// //       } catch (err) {
// //         console.error("Error parsing localStorage uploadedTracks:", err);
// //         tracks = [];
// //       }
// //       tracks.push({ ...trackData, detailsCompleted: true });
// //       localStorage.setItem("uploadedTracks", JSON.stringify(tracks));

// //       // Send to Webhook
// //       try {
// //         const res = await fetch("/api/53f9354c-859b-42c2-b569-c001fb8927f5", {
// //           method: "POST",
// //           headers: { "Content-type": "application/json" },
// //           body: JSON.stringify(trackData),
// //         });
// //         if (!res.ok) throw new Error(`Webhook error: ${res.status}`);
// //         console.log("Track data sent to Webhook!");
// //       } catch (err) {
// //         console.error("Error sending track data to webhook:", err);
// //         alert("Track saved locally, but failed to send to webhook.");
// //       }

// //       // Redirect to UploadTracks page
// //       navigate("/upload-tracks");

// //     } catch (err) {
// //       console.error("Error saving track:", err);
// //       alert("An unexpected error occurred while saving track.");
// //     } finally {
// //       setIsSaving(false);
// //     }
// //   };

// //   return (
// //     <div className="page-container">
// //       <div className="track-details-container">
// //         <h2 className="form-title">Track Details</h2>

// //         {/* Track Title */}
// //         <div className="form-section">
// //           <label className="section-title">Track Title <span className="required">*</span></label>
// //           <input type="text" placeholder="e.g. I got my summer" className="form-input" value={trackTitle} onChange={e => setTrackTitle(e.target.value)} />
// //         </div>

// //         {/* Version / Catalog ID */}
// //         <div className="form-section">
// //           <label className="section-title">Version</label>
// //           <input type="text" placeholder="e.g. 3.0" className="form-input" value={catalogId} onChange={e => setCatalogId(e.target.value)} />
// //         </div>

// //         {/* Artists */}
// //         <div className="form-section">
// //           <label className="section-title">Artists</label>
// //           {[ 
// //             { label: "Primary Artist *", value: primaryArtist, setter: setPrimaryArtist },
// //             { label: "Composer", value: composer, setter: setComposer },
// //             { label: "Director", value: director, setter: setDirector },
// //             { label: "Producer", value: producer, setter: setProducer },
// //             { label: "Lyricist", value: lyricist, setter: setLyricist }
// //           ].map((field, idx) => (
// //             <div className="form-subsection" key={idx} style={{ marginBottom: "10px" }}>
// //               <label className="subsection-title">{field.label}</label>
// //               <input type="text" placeholder={field.label} className="form-input" value={field.value} onChange={e => field.setter(e.target.value)} />
// //             </div>
// //           ))}
// //         </div>

// //         {/* Language of Lyrics */}
// //         <div className="form-section">
// //           <label className="section-title">Language of Lyrics</label>
// //           <div className="radio-group">
// //             <label>
// //               <input type="radio" name="lyricsOption" value="Select Language" checked={lyricsLanguageOption==="Select Language"} onChange={e => setLyricsLanguageOption(e.target.value)} />
// //               Select Language
// //             </label>
// //             <label>
// //               <input type="radio" name="lyricsOption" value="Instrumental" checked={lyricsLanguageOption==="Instrumental"} onChange={e => setLyricsLanguageOption(e.target.value)} />
// //               Instrumental
// //             </label>
// //           </div>
// //           {lyricsLanguageOption === "Select Language" && (
// //             <div ref={dropdownRef} style={{ position: "relative", marginTop: "10px" }}>
// //               <input type="text" placeholder="Select Language *" value={lyricsLanguage} onChange={e => handleInputChange(e.target.value)} className="form-input" />
// //               {showDropdown && filteredLanguages.length > 0 && (
// //                 <ul className="dropdown-list">
// //                   {filteredLanguages.map((lang, idx) => (
// //                     <li key={idx} onClick={() => { setLyricsLanguage(lang); setShowDropdown(false); }}>{lang}</li>
// //                   ))}
// //                 </ul>
// //               )}
// //             </div>
// //           )}
// //         </div>

// //         {/* Explicit Content */}
// //         {lyricsLanguageOption === "Select Language" && lyricsLanguage && (
// //           <div className="form-section">
// //             <label className="section-title">Explicit Content <span className="required">*</span></label>
// //             <div className="radio-group" style={{ flexDirection: "column" }}>
// //               {[ 
// //                 { label: "Explicit", help: "The track lyrics or title include explicit language (such as drug references, sexual, violent or discriminatory language, swearing etc.) not suitable for children." },
// //                 { label: "Not Explicit", help: "The track does NOT include any explicit language in lyrics or title." },
// //                 { label: "Cleaned", help: "It is cleaned." }
// //               ].map((option, idx) => (
// //                 <label key={idx} style={{ marginBottom: "8px" }}>
// //                   <input type="radio" value={option.label} checked={explicitStatus===option.label} onChange={() => setExplicitStatus(option.label)} />
// //                   {option.label}
// //                   {explicitStatus===option.label && <p className="help-text">{option.help}</p>}
// //                 </label>
// //               ))}
// //             </div>
// //           </div>
// //         )}

// //         {/* CRBT */}
// //         <div className="form-section">
// //           <label className="section-title">Add CRBT</label>
// //           {crbts.map((crbt, index) => (
// //             <div className="crbt-row" key={index}>
// //               <input type="text" value={crbt.time} className="form-input" onChange={e => handleCrbtChange(index,"time",e.target.value)} />
// //               {index>0 && <button type="button" className="add-btn" onClick={() => handleDeleteCrbt(index)}>🗑</button>}
// //             </div>
// //           ))}
// //         </div>

// //         {/* ISRC */}
// //         <div className="form-section">
// //           <label className="section-title">Do you have an ISRC? <span className="required">*</span></label>
// //           <div className="radio-group">
// //             <label>
// //               <input type="radio" name="isrc" value="no" checked={isrcOption==="no"} onChange={()=>setIsrcOption("no")} /> No
// //             </label>
// //             <label>
// //               <input type="radio" name="isrc" value="yes" checked={isrcOption==="yes"} onChange={()=>setIsrcOption("yes")} /> Yes
// //             </label>
// //           </div>

// //           {isrcOption === "yes" && (
// //             <input
// //               type="text"
// //               placeholder="Enter ISRC Code *"
// //               className="form-input"
// //               value={isrcCode}
// //               onChange={e => setIsrcCode(e.target.value)}
// //             />
// //           )}

// //           {isrcOption === "no" && (
// //             <>
// //               <textarea
// //                 className="form-input"
// //                 value="We'll generate one for you when we send your release."
// //                 readOnly
// //                 rows={3}
// //               />
// //               <p className="help-text">
// //                 Enter a code only if you already have one. Otherwise one will be generated when you distribute and it will be displayed on your track's info page.
// //               </p>
// //             </>
// //           )}
// //         </div>

// //         {/* Save Button */}
// //         <button
// //           type="button"
// //           className="btn-secondary"
// //           onClick={handleSaveAndContinue}
// //           disabled={isSaving}
// //         >
// //           {isSaving ? "Saving..." : "Save & Continue"}
// //         </button>

// //       </div>
// //     </div>
// //   );
// // };

// // export default TrackDetails;



// /* ------------------------------------ */
// /* PAGE CONTAINER - full width layout  */
// /* ------------------------------------ */

// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import "../styles/TrackDetails.css";

// const allLanguages = [
//   "Ahirani","Arabic","Assamese","Awadhi","Banjara","Bengali","Bhojpuri","Burmese",
//   "Chhattisgarhi","Chinese","Dogri","English","French","Garhwali","Garo","Gujarati",
//   "Haryanvi","Himachali","Hindi","Iban","Indonesian","Instrumental","Italian",
//   "Japanese","Javanese","Kannada","Kashmiri","Khasi","Kokborok","Konkani","Korean",
//   "Kumauni","Latin","Maithili","Malay","Malayalam","Mandarin","Manipuri","Marathi",
//   "Marwari","Naga","Nagpuri","Nepali","Odia","Pali","Persian","Punjabi","Rajasthani",
//   "Sainthili","Sambalpuri","Sanskrit","Santali","Sindhi","Sinhala","Spanish","Swahili",
//   "Tamil","Telugu","Thai","Tibetan","Tulu","Turkish","Ukrainian","Urdu","Zxx"
// ];

// const TrackDetails = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { track = {} } = location.state || {};

//   // 🎯 State variables
//   const [trackTitle, setTrackTitle] = useState(track.trackTitle || "");
//   const [catalogId, setCatalogId] = useState(track.catalogId || "");
//   const [primaryArtist, setPrimaryArtist] = useState(track.primaryArtist || "");
//   const [composer, setComposer] = useState(track.composer || "");
//   const [director, setDirector] = useState(track.director || "");
//   const [producer, setProducer] = useState(track.producer || "");
//   const [lyricist, setLyricist] = useState(track.lyricist || "");

//   const [lyricsLanguage, setLyricsLanguage] = useState(track.lyricsLanguage || "");
//   const [lyricsLanguageOption, setLyricsLanguageOption] = useState(track.lyricsLanguageOption || "Select Language");
//   const [filteredLanguages, setFilteredLanguages] = useState(allLanguages);
//   const [showDropdown, setShowDropdown] = useState(false);

//   const dropdownRef = useRef(null);

//   // const [crbts, setCrbts] = useState(track.crbts || [{ name: "", time: "00:00:00" }]);
//   const [crbts, setCrbts] = useState([{ name: "", hours: "00", minutes: "00", seconds: "00" }]);

//   const [isrcOption, setIsrcOption] = useState(track.isrcOption || "no");
//   const [isrcCode, setIsrcCode] = useState(track.isrcCode || "");
//   const [explicitStatus, setExplicitStatus] = useState(track.explicitStatus || "");

//   const [isSaving, setIsSaving] = useState(false);




//   const [activeClock, setActiveClock] = useState(null);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Filter languages based on input
//   const handleInputChange = (value) => {
//     setLyricsLanguage(value);
//     const filtered = allLanguages.filter(lang =>
//       lang.toLowerCase().startsWith(value.toLowerCase())
//     );
//     setFilteredLanguages(filtered);
//     setShowDropdown(true);
//   };

//   // CRBT handlers
//   const handleAddCrbt = () => setCrbts([...crbts, { name: "", time: "00:00:00" }]);
  
//   const handleDeleteCrbt = (index) => {
//     if (crbts.length > 1) setCrbts(crbts.filter((_, i) => i !== index));
//   };


//   const handleCrbtChange = (index, field, value) => {
//   const updatedCrbts = [...crbts];
//   updatedCrbts[index][field] = value;
//   setCrbts(updatedCrbts);
// };


//   // Save track and send to webhook
//   const handleSaveAndContinue = async () => {
//     if (isSaving) return;
//     setIsSaving(true);

//     try {
//       // Validation
//       if (!trackTitle.trim()) { alert("Please enter track title."); setIsSaving(false); return; }
//       if (!primaryArtist.trim()) { alert("Please enter primary artist."); setIsSaving(false); return; }
//       if (lyricsLanguageOption === "Select Language" && !lyricsLanguage.trim()) { alert("Please select a language."); setIsSaving(false); return; }
//       if (!explicitStatus.trim()) { alert("Please select explicit content status."); setIsSaving(false); return; }
//       if (isrcOption === "yes" && !isrcCode.trim()) { alert("Please enter ISRC code."); setIsSaving(false); return; }

//       const trackData = {
//         created_by: atob(localStorage.getItem("userId")),
//         trackTitle: trackTitle.trim(),
//         catalogId: catalogId.trim(),
//         primaryArtist: primaryArtist.trim(),
//         composer: composer.trim(),
//         director: director.trim(),
//         producer: producer.trim(),
//         lyricist: lyricist.trim(),
//         lyricsLanguage,
//         lyricsLanguageOption,
//         crbts,
//         isrcOption,
//         isrcCode: isrcOption === "yes" ? isrcCode.trim() : "",
//         explicitStatus,
//       };

//       // Save to localStorage safely
//       let tracks = [];
//       try {
//         tracks = JSON.parse(localStorage.getItem("uploadedTracks") || "[]");
//         if (!Array.isArray(tracks)) tracks = [];
//       } catch (err) {
//         console.error("Error parsing localStorage uploadedTracks:", err);
//         tracks = [];
//       }
//       tracks.push({ ...trackData, detailsCompleted: true });
//       localStorage.setItem("uploadedTracks", JSON.stringify(tracks));

//       // Send to Webhook
//       try {
//         const res = await fetch("/api/53f9354c-859b-42c2-b569-c001fb8927f5", {
//           method: "POST",
//           headers: { "Content-type": "application/json" },
//           body: JSON.stringify(trackData),
//         });
//         if (!res.ok) throw new Error(`Webhook error: ${res.status}`);
//         console.log("Track data sent to Webhook!");
//       } catch (err) {
//         console.error("Error sending track data to webhook:", err);
//         alert("Track saved locally, but failed to send to webhook.");
//       }

//       // Redirect to UploadTracks page
//       navigate("/upload-tracks");

//     } catch (err) {
//       console.error("Error saving track:", err);
//       alert("An unexpected error occurred while saving track.");
//     } finally {
//       setIsSaving(false);
//     }
//   };




//   const handleWheel = (e) => {
//   e.preventDefault(); // Prevent page scroll
//   const input = e.target;
//   const step = input.step ? parseInt(input.step) : 1;
//   let value = parseInt(input.value || 0);

//   if (e.deltaY < 0) {
//     // Scroll up → increment
//     value += step;
//   } else {
//     // Scroll down → decrement
//     value -= step;
//   }

//   // Clamp value based on min/max
//   const min = input.min ? parseInt(input.min) : Number.MIN_SAFE_INTEGER;
//   const max = input.max ? parseInt(input.max) : Number.MAX_SAFE_INTEGER;
//   if (value < min) value = min;
//   if (value > max) value = max;

//   input.value = String(value).padStart(2, "0");

//   // Trigger onChange manually
//   const event = new Event("input", { bubbles: true });
//   input.dispatchEvent(event);
// };


//   return (
//     <div className="page-container">
//       <div className="track-details-container">
//         <h2 className="form-title">Track Details</h2>

//         {/* Track Title */}
//         <div className="form-section">
//           <label className="section-title">Track Title <span className="required">*</span></label>
//           <input type="text" placeholder="e.g. I got my summer" className="form-input" value={trackTitle} onChange={e => setTrackTitle(e.target.value)} />
//         </div>

//         {/* Version / Catalog ID */}
//         <div className="form-section">
//           <label className="section-title">Version</label>
//           <input type="text" placeholder="e.g. 3.0" className="form-input" value={catalogId} onChange={e => setCatalogId(e.target.value)} />
//         </div>

//         {/* Artists */}
//         <div className="form-section">
//           <label className="section-title">Artists</label>
//           {[ 
//             { label: "Primary Artist *", value: primaryArtist, setter: setPrimaryArtist },
//             { label: "Composer", value: composer, setter: setComposer },
//             { label: "Director", value: director, setter: setDirector },
//             { label: "Producer", value: producer, setter: setProducer },
//             { label: "Lyricist", value: lyricist, setter: setLyricist }
//           ].map((field, idx) => (
//             <div className="form-subsection" key={idx} style={{ marginBottom: "10px" }}>
//               <label className="subsection-title ">{field.label}</label>
//               <input type="text" placeholder={field.label} className="form-input" value={field.value} onChange={e => field.setter(e.target.value)} />
//             </div>
//           ))}
//         </div>

//         {/* Language of Lyrics */}
//         <div className="form-section">
//           <label className="section-title">Language of Lyrics</label>
//           <div className="radio-group">
//             <label>
//               <input type="radio" name="lyricsOption" value="Select Language" checked={lyricsLanguageOption==="Select Language"} onChange={e => setLyricsLanguageOption(e.target.value)} />
//               Select Language
//             </label>
//             <label>
//               <input type="radio" name="lyricsOption" value="Instrumental" checked={lyricsLanguageOption==="Instrumental"} onChange={e => setLyricsLanguageOption(e.target.value)} />
//               Instrumental
//             </label>
//           </div>
//           {/* {lyricsLanguageOption === "Select Language" && (
//             <div ref={dropdownRef} style={{ position: "relative", marginTop: "10px" }}>
//               <input type="text" placeholder="Select Language *" value={lyricsLanguage} onChange={e => handleInputChange(e.target.value)} className="form-input" />
//               {showDropdown && filteredLanguages.length > 0 && (
//                 <ul className="dropdown-list">
//                   {filteredLanguages.map((lang, idx) => (
//                     <li key={idx} onClick={() => { setLyricsLanguage(lang); setShowDropdown(false); }}>{lang}</li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           )} */}
//           {lyricsLanguageOption === "Select Language" && (
//   <div ref={dropdownRef} className="dropdown-container">
//     <input
//       type="text"
//       placeholder="Select Language *"
//       className="form-input"
//       value={lyricsLanguage}
//       onChange={e => handleInputChange(e.target.value)}
//       onFocus={() => setShowDropdown(true)}
//     />
//     {showDropdown && filteredLanguages.length > 0 && (
//       <ul className="dropdown-list">
//         {filteredLanguages.map((lang, idx) => (
//           <li
//             key={idx}
//             onClick={() => {
//               setLyricsLanguage(lang);
//               setShowDropdown(false);
//             }}
//           >
//             {lang}
//           </li>
//         ))}
//       </ul>
//     )}
//   </div>
// )}

//         </div>

//         {/* Explicit Content */}
//         {lyricsLanguageOption === "Select Language" && lyricsLanguage && (
//           <div className="form-section">
//             <label className="section-title">Explicit Content <span className="required">*</span></label>
//             <div className="radio-group" style={{ flexDirection: "column" }}>
//               {[ 
//                 { label: "Explicit", help: "The track lyrics or title include explicit language (such as drug references, sexual, violent or discriminatory language, swearing etc.) not suitable for children." },
//                 { label: "Not Explicit", help: "The track does NOT include any explicit language in lyrics or title." },
//                 { label: "Cleaned", help: "It is cleaned." }
//               ].map((option, idx) => (
//                 <label key={idx} style={{ marginBottom: "8px" }}>
//                   <input type="radio" value={option.label} checked={explicitStatus===option.label} onChange={() => setExplicitStatus(option.label)} />
//                   {option.label}
//                   {explicitStatus===option.label && <p className="help-text">{option.help}</p>}
//                 </label>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* CRBT */}
//         {/* <div className="form-section">
//           <label className="section-title">Add CRBT</label>
//           {crbts.map((crbt, index) => (
//             <div className="crbt-row" key={index}>
//               <input type="text" value={crbt.time} className="form-input" onChange={e => handleCrbtChange(index,"time",e.target.value)} />
//               {index>0 && <button type="button" className="add-btn" onClick={() => handleDeleteCrbt(index)}>🗑</button>}
//             </div>
//           ))}
//         </div> */}
// <div className="form-section">
//   <label className="section-title">Add CRBT</label>

//   {crbts.map((crbt, index) => (
//     <div className="crbt-row" key={index} style={{ alignItems: "center", gap: "8px" }}>
//       <div className="time-display" onClick={() => setActiveClock(index)}>
//         {`${crbt.hours.padStart(2, "0")}:${crbt.minutes.padStart(2, "0")}:${crbt.seconds.padStart(2, "0")}`}
//       </div>

//       {index > 0 && (
//         <button
//           type="button"
//           className="add-btn"
//           onClick={() => handleDeleteCrbt(index)}
//         >
//           🗑
//         </button>
//       )}

//       {activeClock === index && (
//         <div className="clock-popup">
//           <div className="clock-selectors">
//             <div>
//               <label>HH</label>
//               <select
//                 value={crbt.hours}
//                 onChange={(e) => handleCrbtChange(index, "hours", e.target.value)}
//               >
//                 {Array.from({ length: 24 }, (_, i) => (
//                   <option key={i} value={String(i).padStart(2, "0")}>
//                     {String(i).padStart(2, "0")}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label>MM</label>
//               <select
//                 value={crbt.minutes}
//                 onChange={(e) => handleCrbtChange(index, "minutes", e.target.value)}
//               >
//                 {Array.from({ length: 60 }, (_, i) => (
//                   <option key={i} value={String(i).padStart(2, "0")}>
//                     {String(i).padStart(2, "0")}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label>SS</label>
//               <select
//                 value={crbt.seconds}
//                 onChange={(e) => handleCrbtChange(index, "seconds", e.target.value)}
//               >
//                 {Array.from({ length: 60 }, (_, i) => (
//                   <option key={i} value={String(i).padStart(2, "0")}>
//                     {String(i).padStart(2, "0")}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className="clock-actions">
//             <button onClick={() => setActiveClock(null)}>Cancel</button>
//             <button
//               onClick={() => {
//                 setActiveClock(null);
//               }}
//             >
//               OK
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   ))}
// </div>



//         {/* ISRC */}
//         <div className="form-section">
//           <label className="section-title">Do you have an ISRC? <span className="required">*</span></label>
//           <div className="radio-group">
//             <label>
//               <input type="radio" name="isrc" value="no" checked={isrcOption==="no"} onChange={()=>setIsrcOption("no")} /> No
//             </label>
//             <label>
//               <input type="radio" name="isrc" value="yes" checked={isrcOption==="yes"} onChange={()=>setIsrcOption("yes")} /> Yes
//             </label>
//           </div>

//           {isrcOption === "yes" && (
//             <input
//               type="text"
//               placeholder="Enter ISRC Code *"
//               className="form-input"
//               value={isrcCode}
//               onChange={e => setIsrcCode(e.target.value)}
//             />
//           )}

//           {isrcOption === "no" && (
//             <>
              
//               <p className="help-text">
//                 Enter a code only if you already have one. Otherwise one will be generated when you distribute and it will be displayed on your track's info page.
//               </p>
//             </>
//           )}
//         </div>

//         {/* Save Button */}
//         <button
//           type="button"
//           className="btn-secondary"
//           onClick={handleSaveAndContinue}
//           disabled={isSaving}
//         >
//           {isSaving ? "Saving..." : "Save & Continue"}
//         </button>

//       </div>
//     </div>
//   );
// };

// export default TrackDetails;
























// // import React, { useState, useRef, useEffect } from "react";
// // import { useNavigate, useLocation } from "react-router-dom";
// // import "../styles/TrackDetails.css";

// // const allLanguages = [
// //   "Ahirani","Arabic","Assamese","Awadhi","Banjara","Bengali","Bhojpuri","Burmese",
// //   "Chhattisgarhi","Chinese","Dogri","English","French","Garhwali","Garo","Gujarati",
// //   "Haryanvi","Himachali","Hindi","Iban","Indonesian","Instrumental","Italian",
// //   "Japanese","Javanese","Kannada","Kashmiri","Khasi","Kokborok","Konkani","Korean",
// //   "Kumauni","Latin","Maithili","Malay","Malayalam","Mandarin","Manipuri","Marathi",
// //   "Marwari","Naga","Nagpuri","Nepali","Odia","Pali","Persian","Punjabi","Rajasthani",
// //   "Sainthili","Sambalpuri","Sanskrit","Santali","Sindhi","Sinhala","Spanish","Swahili",
// //   "Tamil","Telugu","Thai","Tibetan","Tulu","Turkish","Ukrainian","Urdu","Zxx"
// // ];

// // const TrackDetails = () => {
// //   const location = useLocation();
// //   const navigate = useNavigate();
// //   const { track = {} } = location.state || {};

// //   // 🎯 State variables
// //   const [trackTitle, setTrackTitle] = useState(track.trackTitle || "");
// //   const [catalogId, setCatalogId] = useState(track.catalogId || "");
// //   const [primaryArtist, setPrimaryArtist] = useState(track.primaryArtist || "");
// //   const [composer, setComposer] = useState(track.composer || "");
// //   const [director, setDirector] = useState(track.director || "");
// //   const [producer, setProducer] = useState(track.producer || "");
// //   const [lyricist, setLyricist] = useState(track.lyricist || "");

// //   const [lyricsLanguage, setLyricsLanguage] = useState(track.lyricsLanguage || "");
// //   const [lyricsLanguageOption, setLyricsLanguageOption] = useState(track.lyricsLanguageOption || "Select Language");
// //   const [filteredLanguages, setFilteredLanguages] = useState(allLanguages);
// //   const [showDropdown, setShowDropdown] = useState(false);

// //   const dropdownRef = useRef(null);

// //   const [crbts, setCrbts] = useState(track.crbts || [{ name: "", time: "00:00:00" }]);
// //   const [isrcOption, setIsrcOption] = useState(track.isrcOption || "no");
// //   const [isrcCode, setIsrcCode] = useState(track.isrcCode || "");
// //   const [explicitStatus, setExplicitStatus] = useState(track.explicitStatus || "");

// //   const [isSaving, setIsSaving] = useState(false);

// //   // Close dropdown when clicking outside
// //   useEffect(() => {
// //     const handleClickOutside = (event) => {
// //       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
// //         setShowDropdown(false);
// //       }
// //     };
// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () => document.removeEventListener("mousedown", handleClickOutside);
// //   }, []);

// //   // Filter languages based on input
// //   const handleInputChange = (value) => {
// //     setLyricsLanguage(value);
// //     const filtered = allLanguages.filter(lang =>
// //       lang.toLowerCase().startsWith(value.toLowerCase())
// //     );
// //     setFilteredLanguages(filtered);
// //     setShowDropdown(true);
// //   };

// //   // CRBT handlers
// //   const handleAddCrbt = () => setCrbts([...crbts, { name: "", time: "00:00:00" }]);
// //   const handleDeleteCrbt = (index) => {
// //     if (crbts.length > 1) setCrbts(crbts.filter((_, i) => i !== index));
// //   };
// //   const handleCrbtChange = (index, field, value) => {
// //     const updatedCrbts = [...crbts];
// //     updatedCrbts[index][field] = value;
// //     setCrbts(updatedCrbts);
// //   };

// //   // Save track and send to webhook
// //   const handleSaveAndContinue = async () => {
// //     if (isSaving) return;
// //     setIsSaving(true);

// //     try {
// //       // Validation
// //       if (!trackTitle.trim()) { alert("Please enter track title."); setIsSaving(false); return; }
// //       if (!primaryArtist.trim()) { alert("Please enter primary artist."); setIsSaving(false); return; }
// //       if (lyricsLanguageOption === "Select Language" && !lyricsLanguage.trim()) { alert("Please select a language."); setIsSaving(false); return; }
// //       if (!explicitStatus.trim()) { alert("Please select explicit content status."); setIsSaving(false); return; }
// //       if (isrcOption === "yes" && !isrcCode.trim()) { alert("Please enter ISRC code."); setIsSaving(false); return; }

// //       const trackData = {
// //         created_by: atob(localStorage.getItem("userId")),
// //         trackTitle: trackTitle.trim(),
// //         catalogId: catalogId.trim(),
// //         primaryArtist: primaryArtist.trim(),
// //         composer: composer.trim(),
// //         director: director.trim(),
// //         producer: producer.trim(),
// //         lyricist: lyricist.trim(),
// //         lyricsLanguage,
// //         lyricsLanguageOption,
// //         crbts,
// //         isrcOption,
// //         isrcCode: isrcOption === "yes" ? isrcCode.trim() : "",
// //         explicitStatus,
// //       };

// //       // Save to localStorage safely
// //       let tracks = [];
// //       try {
// //         tracks = JSON.parse(localStorage.getItem("uploadedTracks") || "[]");
// //         if (!Array.isArray(tracks)) tracks = [];
// //       } catch (err) {
// //         console.error("Error parsing localStorage uploadedTracks:", err);
// //         tracks = [];
// //       }
// //       tracks.push({ ...trackData, detailsCompleted: true });
// //       localStorage.setItem("uploadedTracks", JSON.stringify(tracks));

// //       // Send to Webhook
// //       try {
// //         const res = await fetch("/api/53f9354c-859b-42c2-b569-c001fb8927f5", {
// //           method: "POST",
// //           headers: { "Content-type": "application/json" },
// //           body: JSON.stringify(trackData),
// //         });
// //         if (!res.ok) throw new Error(`Webhook error: ${res.status}`);
// //         console.log("Track data sent to Webhook!");
// //       } catch (err) {
// //         console.error("Error sending track data to webhook:", err);
// //         alert("Track saved locally, but failed to send to webhook.");
// //       }

// //       // Redirect to UploadTracks page
// //       navigate("/upload-tracks");

// //     } catch (err) {
// //       console.error("Error saving track:", err);
// //       alert("An unexpected error occurred while saving track.");
// //     } finally {
// //       setIsSaving(false);
// //     }
// //   };

// //   return (
// //     <div className="page-container">
// //       <div className="track-details-container">
// //         <h2 className="form-title">Track Details</h2>

// //         {/* Track Title */}
// //         <div className="form-section">
// //           <label className="section-title">Track Title <span className="required">*</span></label>
// //           <input type="text" placeholder="e.g. I got my summer" className="form-input" value={trackTitle} onChange={e => setTrackTitle(e.target.value)} />
// //         </div>

// //         {/* Version / Catalog ID */}
// //         <div className="form-section">
// //           <label className="section-title">Version</label>
// //           <input type="text" placeholder="e.g. 3.0" className="form-input" value={catalogId} onChange={e => setCatalogId(e.target.value)} />
// //         </div>

// //         {/* Artists */}
// //         <div className="form-section">
// //           <label className="section-title">Artists</label>
// //           {[ 
// //             { label: "Primary Artist *", value: primaryArtist, setter: setPrimaryArtist },
// //             { label: "Composer", value: composer, setter: setComposer },
// //             { label: "Director", value: director, setter: setDirector },
// //             { label: "Producer", value: producer, setter: setProducer },
// //             { label: "Lyricist", value: lyricist, setter: setLyricist }
// //           ].map((field, idx) => (
// //             <div className="form-subsection" key={idx} style={{ marginBottom: "10px" }}>
// //               <label className="subsection-title">{field.label}</label>
// //               <input type="text" placeholder={field.label} className="form-input" value={field.value} onChange={e => field.setter(e.target.value)} />
// //             </div>
// //           ))}
// //         </div>

// //         {/* Language of Lyrics */}
// //         <div className="form-section">
// //           <label className="section-title">Language of Lyrics</label>
// //           <div className="radio-group">
// //             <label>
// //               <input type="radio" name="lyricsOption" value="Select Language" checked={lyricsLanguageOption==="Select Language"} onChange={e => setLyricsLanguageOption(e.target.value)} />
// //               Select Language
// //             </label>
// //             <label>
// //               <input type="radio" name="lyricsOption" value="Instrumental" checked={lyricsLanguageOption==="Instrumental"} onChange={e => setLyricsLanguageOption(e.target.value)} />
// //               Instrumental
// //             </label>
// //           </div>
// //           {lyricsLanguageOption === "Select Language" && (
// //             <div ref={dropdownRef} style={{ position: "relative", marginTop: "10px" }}>
// //               <input type="text" placeholder="Select Language *" value={lyricsLanguage} onChange={e => handleInputChange(e.target.value)} className="form-input" />
// //               {showDropdown && filteredLanguages.length > 0 && (
// //                 <ul className="dropdown-list">
// //                   {filteredLanguages.map((lang, idx) => (
// //                     <li key={idx} onClick={() => { setLyricsLanguage(lang); setShowDropdown(false); }}>{lang}</li>
// //                   ))}
// //                 </ul>
// //               )}
// //             </div>
// //           )}
// //         </div>

// //         {/* Explicit Content */}
// //         {lyricsLanguageOption === "Select Language" && lyricsLanguage && (
// //           <div className="form-section">
// //             <label className="section-title">Explicit Content <span className="required">*</span></label>
// //             <div className="radio-group" style={{ flexDirection: "column" }}>
// //               {[ 
// //                 { label: "Explicit", help: "The track lyrics or title include explicit language (such as drug references, sexual, violent or discriminatory language, swearing etc.) not suitable for children." },
// //                 { label: "Not Explicit", help: "The track does NOT include any explicit language in lyrics or title." },
// //                 { label: "Cleaned", help: "It is cleaned." }
// //               ].map((option, idx) => (
// //                 <label key={idx} style={{ marginBottom: "8px" }}>
// //                   <input type="radio" value={option.label} checked={explicitStatus===option.label} onChange={() => setExplicitStatus(option.label)} />
// //                   {option.label}
// //                   {explicitStatus===option.label && <p className="help-text">{option.help}</p>}
// //                 </label>
// //               ))}
// //             </div>
// //           </div>
// //         )}

// //         {/* CRBT */}
// //         <div className="form-section">
// //           <label className="section-title">Add CRBT</label>
// //           {crbts.map((crbt, index) => (
// //             <div className="crbt-row" key={index}>
// //               <input type="text" value={crbt.time} className="form-input" onChange={e => handleCrbtChange(index,"time",e.target.value)} />
// //               {index>0 && <button type="button" className="add-btn" onClick={() => handleDeleteCrbt(index)}>🗑</button>}
// //             </div>
// //           ))}
// //         </div>

// //         {/* ISRC */}
// //         <div className="form-section">
// //           <label className="section-title">Do you have an ISRC? <span className="required">*</span></label>
// //           <div className="radio-group">
// //             <label>
// //               <input type="radio" name="isrc" value="no" checked={isrcOption==="no"} onChange={()=>setIsrcOption("no")} /> No
// //             </label>
// //             <label>
// //               <input type="radio" name="isrc" value="yes" checked={isrcOption==="yes"} onChange={()=>setIsrcOption("yes")} /> Yes
// //             </label>
// //           </div>

// //           {isrcOption === "yes" && (
// //             <input
// //               type="text"
// //               placeholder="Enter ISRC Code *"
// //               className="form-input"
// //               value={isrcCode}
// //               onChange={e => setIsrcCode(e.target.value)}
// //             />
// //           )}

// //           {isrcOption === "no" && (
// //             <>
// //               <textarea
// //                 className="form-input"
// //                 value="We'll generate one for you when we send your release."
// //                 readOnly
// //                 rows={3}
// //               />
// //               <p className="help-text">
// //                 Enter a code only if you already have one. Otherwise one will be generated when you distribute and it will be displayed on your track's info page.
// //               </p>
// //             </>
// //           )}
// //         </div>

// //         {/* Save Button */}
// //         <button
// //           type="button"
// //           className="btn-secondary"
// //           onClick={handleSaveAndContinue}
// //           disabled={isSaving}
// //         >
// //           {isSaving ? "Saving..." : "Save & Continue"}
// //         </button>

// //       </div>
// //     </div>
// //   );
// // };

// // export default TrackDetails;



// /* ------------------------------------ */
// /* PAGE CONTAINER - full width layout  */
// /* ------------------------------------ */

// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import "../styles/TrackDetails.css";

// const allLanguages = [
//   "Ahirani","Arabic","Assamese","Awadhi","Banjara","Bengali","Bhojpuri","Burmese",
//   "Chhattisgarhi","Chinese","Dogri","English","French","Garhwali","Garo","Gujarati",
//   "Haryanvi","Himachali","Hindi","Iban","Indonesian","Instrumental","Italian",
//   "Japanese","Javanese","Kannada","Kashmiri","Khasi","Kokborok","Konkani","Korean",
//   "Kumauni","Latin","Maithili","Malay","Malayalam","Mandarin","Manipuri","Marathi",
//   "Marwari","Naga","Nagpuri","Nepali","Odia","Pali","Persian","Punjabi","Rajasthani",
//   "Sainthili","Sambalpuri","Sanskrit","Santali","Sindhi","Sinhala","Spanish","Swahili",
//   "Tamil","Telugu","Thai","Tibetan","Tulu","Turkish","Ukrainian","Urdu","Zxx"
// ];

// const TrackDetails = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { track = {} } = location.state || {};

//   // 🎯 State variables
//   const [trackTitle, setTrackTitle] = useState(track.trackTitle || "");
//   const [catalogId, setCatalogId] = useState(track.catalogId || "");
//   const [primaryArtist, setPrimaryArtist] = useState(track.primaryArtist || "");
//   const [composer, setComposer] = useState(track.composer || "");
//   const [director, setDirector] = useState(track.director || "");
//   const [producer, setProducer] = useState(track.producer || "");
//   const [lyricist, setLyricist] = useState(track.lyricist || "");

//   const [lyricsLanguage, setLyricsLanguage] = useState(track.lyricsLanguage || "");
//   const [lyricsLanguageOption, setLyricsLanguageOption] = useState(track.lyricsLanguageOption || "Select Language");
//   const [filteredLanguages, setFilteredLanguages] = useState(allLanguages);
//   const [showDropdown, setShowDropdown] = useState(false);

//   const dropdownRef = useRef(null);

//   // const [crbts, setCrbts] = useState(track.crbts || [{ name: "", time: "00:00:00" }]);
//   const [crbts, setCrbts] = useState([{ name: "", hours: "00", minutes: "00", seconds: "00" }]);

//   const [isrcOption, setIsrcOption] = useState(track.isrcOption || "no");
//   const [isrcCode, setIsrcCode] = useState(track.isrcCode || "");
//   const [explicitStatus, setExplicitStatus] = useState(track.explicitStatus || "");

//   const [isSaving, setIsSaving] = useState(false);




//   const [activeClock, setActiveClock] = useState(null);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Filter languages based on input
//   const handleInputChange = (value) => {
//     setLyricsLanguage(value);
//     const filtered = allLanguages.filter(lang =>
//       lang.toLowerCase().startsWith(value.toLowerCase())
//     );
//     setFilteredLanguages(filtered);
//     setShowDropdown(true);
//   };

//   // CRBT handlers
//   const handleAddCrbt = () => setCrbts([...crbts, { name: "", time: "00:00:00" }]);
  
//   const handleDeleteCrbt = (index) => {
//     if (crbts.length > 1) setCrbts(crbts.filter((_, i) => i !== index));
//   };


//   const handleCrbtChange = (index, field, value) => {
//   const updatedCrbts = [...crbts];
//   updatedCrbts[index][field] = value;
//   setCrbts(updatedCrbts);
// };


//   // Save track and send to webhook
//   const handleSaveAndContinue = async () => {
//     if (isSaving) return;
//     setIsSaving(true);

//     try {
//       // Validation
//       if (!trackTitle.trim()) { alert("Please enter track title."); setIsSaving(false); return; }
//       if (!primaryArtist.trim()) { alert("Please enter primary artist."); setIsSaving(false); return; }
//       if (lyricsLanguageOption === "Select Language" && !lyricsLanguage.trim()) { alert("Please select a language."); setIsSaving(false); return; }
//       if (!explicitStatus.trim()) { alert("Please select explicit content status."); setIsSaving(false); return; }
//       if (isrcOption === "yes" && !isrcCode.trim()) { alert("Please enter ISRC code."); setIsSaving(false); return; }

//       const trackData = {
//         created_by: atob(localStorage.getItem("userId")),
//         trackTitle: trackTitle.trim(),
//         catalogId: catalogId.trim(),
//         primaryArtist: primaryArtist.trim(),
//         composer: composer.trim(),
//         director: director.trim(),
//         producer: producer.trim(),
//         lyricist: lyricist.trim(),
//         lyricsLanguage,
//         lyricsLanguageOption,
//         crbts,
//         isrcOption,
//         isrcCode: isrcOption === "yes" ? isrcCode.trim() : "",
//         explicitStatus,
//       };

//       // Save to localStorage safely
//       let tracks = [];
//       try {
//         tracks = JSON.parse(localStorage.getItem("uploadedTracks") || "[]");
//         if (!Array.isArray(tracks)) tracks = [];
//       } catch (err) {
//         console.error("Error parsing localStorage uploadedTracks:", err);
//         tracks = [];
//       }
//       tracks.push({ ...trackData, detailsCompleted: true });
//       localStorage.setItem("uploadedTracks", JSON.stringify(tracks));

//       // Send to Webhook
//       try {
//         const res = await fetch("/api/53f9354c-859b-42c2-b569-c001fb8927f5", {
//           method: "POST",
//           headers: { "Content-type": "application/json" },
//           body: JSON.stringify(trackData),
//         });
//         if (!res.ok) throw new Error(`Webhook error: ${res.status}`);
//         console.log("Track data sent to Webhook!");
//       } catch (err) {
//         console.error("Error sending track data to webhook:", err);
//         alert("Track saved locally, but failed to send to webhook.");
//       }

//       // Redirect to UploadTracks page
//       navigate("/upload-tracks");

//     } catch (err) {
//       console.error("Error saving track:", err);
//       alert("An unexpected error occurred while saving track.");
//     } finally {
//       setIsSaving(false);
//     }
//   };




//   const handleWheel = (e) => {
//   e.preventDefault(); // Prevent page scroll
//   const input = e.target;
//   const step = input.step ? parseInt(input.step) : 1;
//   let value = parseInt(input.value || 0);

//   if (e.deltaY < 0) {
//     // Scroll up → increment
//     value += step;
//   } else {
//     // Scroll down → decrement
//     value -= step;
//   }

//   // Clamp value based on min/max
//   const min = input.min ? parseInt(input.min) : Number.MIN_SAFE_INTEGER;
//   const max = input.max ? parseInt(input.max) : Number.MAX_SAFE_INTEGER;
//   if (value < min) value = min;
//   if (value > max) value = max;

//   input.value = String(value).padStart(2, "0");

//   // Trigger onChange manually
//   const event = new Event("input", { bubbles: true });
//   input.dispatchEvent(event);
// };


//   return (
//     <div className="page-container">
//       <div className="track-details-container">
//         <h2 className="form-title">Track Details</h2>

//         {/* Track Title */}
//         <div className="form-section">
//           <label className="section-title">Track Title <span className="required">*</span></label>
//           <input type="text" placeholder="e.g. I got my summer" className="form-input" value={trackTitle} onChange={e => setTrackTitle(e.target.value)} />
//         </div>

//         {/* Version / Catalog ID */}
//         <div className="form-section">
//           <label className="section-title">Version</label>
//           <input type="text" placeholder="e.g. 3.0" className="form-input" value={catalogId} onChange={e => setCatalogId(e.target.value)} />
//         </div>

//         {/* Artists */}
//         <div className="form-section">
//           <label className="section-title">Artists</label>
//           {[ 
//             { label: "Primary Artist *", value: primaryArtist, setter: setPrimaryArtist },
//             { label: "Composer", value: composer, setter: setComposer },
//             { label: "Director", value: director, setter: setDirector },
//             { label: "Producer", value: producer, setter: setProducer },
//             { label: "Lyricist", value: lyricist, setter: setLyricist }
//           ].map((field, idx) => (
//             <div className="form-subsection" key={idx} style={{ marginBottom: "10px" }}>
//               <label className="subsection-title ">{field.label}</label>
//               <input type="text" placeholder={field.label} className="form-input" value={field.value} onChange={e => field.setter(e.target.value)} />
//             </div>
//           ))}
//         </div>

//         {/* Language of Lyrics */}
//         <div className="form-section">
//           <label className="section-title">Language of Lyrics</label>
//           <div className="radio-group">
//             <label>
//               <input type="radio" name="lyricsOption" value="Select Language" checked={lyricsLanguageOption==="Select Language"} onChange={e => setLyricsLanguageOption(e.target.value)} />
//               Select Language
//             </label>
//             <label>
//               <input type="radio" name="lyricsOption" value="Instrumental" checked={lyricsLanguageOption==="Instrumental"} onChange={e => setLyricsLanguageOption(e.target.value)} />
//               Instrumental
//             </label>
//           </div>
//           {/* {lyricsLanguageOption === "Select Language" && (
//             <div ref={dropdownRef} style={{ position: "relative", marginTop: "10px" }}>
//               <input type="text" placeholder="Select Language *" value={lyricsLanguage} onChange={e => handleInputChange(e.target.value)} className="form-input" />
//               {showDropdown && filteredLanguages.length > 0 && (
//                 <ul className="dropdown-list">
//                   {filteredLanguages.map((lang, idx) => (
//                     <li key={idx} onClick={() => { setLyricsLanguage(lang); setShowDropdown(false); }}>{lang}</li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           )} */}
//           {lyricsLanguageOption === "Select Language" && (
//   <div ref={dropdownRef} className="dropdown-container">
//     <input
//       type="text"
//       placeholder="Select Language *"
//       className="form-input"
//       value={lyricsLanguage}
//       onChange={e => handleInputChange(e.target.value)}
//       onFocus={() => setShowDropdown(true)}
//     />
//     {showDropdown && filteredLanguages.length > 0 && (
//       <ul className="dropdown-list">
//         {filteredLanguages.map((lang, idx) => (
//           <li
//             key={idx}
//             onClick={() => {
//               setLyricsLanguage(lang);
//               setShowDropdown(false);
//             }}
//           >
//             {lang}
//           </li>
//         ))}
//       </ul>
//     )}
//   </div>
// )}

//         </div>

//         {/* Explicit Content */}
//         {lyricsLanguageOption === "Select Language" && lyricsLanguage && (
//           <div className="form-section">
//             <label className="section-title">Explicit Content <span className="required">*</span></label>
//             <div className="radio-group" style={{ flexDirection: "column" }}>
//               {[ 
//                 { label: "Explicit", help: "The track lyrics or title include explicit language (such as drug references, sexual, violent or discriminatory language, swearing etc.) not suitable for children." },
//                 { label: "Not Explicit", help: "The track does NOT include any explicit language in lyrics or title." },
//                 { label: "Cleaned", help: "It is cleaned." }
//               ].map((option, idx) => (
//                 <label key={idx} style={{ marginBottom: "8px" }}>
//                   <input type="radio" value={option.label} checked={explicitStatus===option.label} onChange={() => setExplicitStatus(option.label)} />
//                   {option.label}
//                   {explicitStatus===option.label && <p className="help-text">{option.help}</p>}
//                 </label>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* CRBT */}
//         {/* <div className="form-section">
//           <label className="section-title">Add CRBT</label>
//           {crbts.map((crbt, index) => (
//             <div className="crbt-row" key={index}>
//               <input type="text" value={crbt.time} className="form-input" onChange={e => handleCrbtChange(index,"time",e.target.value)} />
//               {index>0 && <button type="button" className="add-btn" onClick={() => handleDeleteCrbt(index)}>🗑</button>}
//             </div>
//           ))}
//         </div> */}
// <div className="form-section">
//   <label className="section-title">Add CRBT</label>

//   {crbts.map((crbt, index) => (
//     <div className="crbt-row" key={index} style={{ alignItems: "center", gap: "8px" }}>
//       <div className="time-display" onClick={() => setActiveClock(index)}>
//         {`${crbt.hours.padStart(2, "0")}:${crbt.minutes.padStart(2, "0")}:${crbt.seconds.padStart(2, "0")}`}
//       </div>

//       {index > 0 && (
//         <button
//           type="button"
//           className="add-btn"
//           onClick={() => handleDeleteCrbt(index)}
//         >
//           🗑
//         </button>
//       )}

//       {activeClock === index && (
//         <div className="clock-popup">
//           <div className="clock-selectors">
//             <div>
//               <label>HH</label>
//               <select
//                 value={crbt.hours}
//                 onChange={(e) => handleCrbtChange(index, "hours", e.target.value)}
//               >
//                 {Array.from({ length: 24 }, (_, i) => (
//                   <option key={i} value={String(i).padStart(2, "0")}>
//                     {String(i).padStart(2, "0")}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label>MM</label>
//               <select
//                 value={crbt.minutes}
//                 onChange={(e) => handleCrbtChange(index, "minutes", e.target.value)}
//               >
//                 {Array.from({ length: 60 }, (_, i) => (
//                   <option key={i} value={String(i).padStart(2, "0")}>
//                     {String(i).padStart(2, "0")}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label>SS</label>
//               <select
//                 value={crbt.seconds}
//                 onChange={(e) => handleCrbtChange(index, "seconds", e.target.value)}
//               >
//                 {Array.from({ length: 60 }, (_, i) => (
//                   <option key={i} value={String(i).padStart(2, "0")}>
//                     {String(i).padStart(2, "0")}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className="clock-actions">
//             <button onClick={() => setActiveClock(null)}>Cancel</button>
//             <button
//               onClick={() => {
//                 setActiveClock(null);
//               }}
//             >
//               OK
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   ))}
// </div>



//         {/* ISRC */}
//         <div className="form-section">
//           <label className="section-title">Do you have an ISRC? <span className="required">*</span></label>
//           <div className="radio-group">
//             <label>
//               <input type="radio" name="isrc" value="no" checked={isrcOption==="no"} onChange={()=>setIsrcOption("no")} /> No
//             </label>
//             <label>
//               <input type="radio" name="isrc" value="yes" checked={isrcOption==="yes"} onChange={()=>setIsrcOption("yes")} /> Yes
//             </label>
//           </div>

//           {isrcOption === "yes" && (
//             <input
//               type="text"
//               placeholder="Enter ISRC Code *"
//               className="form-input"
//               value={isrcCode}
//               onChange={e => setIsrcCode(e.target.value)}
//             />
//           )}

//           {isrcOption === "no" && (
//             <>
              
//               <p className="help-text">
//                 Enter a code only if you already have one. Otherwise one will be generated when you distribute and it will be displayed on your track's info page.
//               </p>
//             </>
//           )}
//         </div>

//         {/* Save Button */}
//         <button
//           type="button"
//           className="btn-secondary"
//           onClick={handleSaveAndContinue}
//           disabled={isSaving}
//         >
//           {isSaving ? "Saving..." : "Save & Continue"}
//         </button>

//       </div>
//     </div>
//   );
// };

// export default TrackDetails;
























import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/TrackDetails.css";

const allLanguages = [
  "Ahirani","Arabic","Assamese","Awadhi","Banjara","Bengali","Bhojpuri","Burmese",
  "Chhattisgarhi","Chinese","Dogri","English","French","Garhwali","Garo","Gujarati",
  "Haryanvi","Himachali","Hindi","Iban","Indonesian","Instrumental","Italian",
  "Japanese","Javanese","Kannada","Kashmiri","Khasi","Kokborok","Konkani","Korean",
  "Kumauni","Latin","Maithili","Malay","Malayalam","Mandarin","Manipuri","Marathi",
  "Marwari","Naga","Nagpuri","Nepali","Odia","Pali","Persian","Punjabi","Rajasthani",
  "Sainthili","Sambalpuri","Sanskrit","Santali","Sindhi","Sinhala","Spanish","Swahili",
  "Tamil","Telugu","Thai","Tibetan","Tulu","Turkish","Ukrainian","Urdu","Zxx"
];

const TrackDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { track = {} } = location.state || {};

  // State variables
  const [trackTitle, setTrackTitle] = useState(track.trackTitle || "");
  const [catalogId, setCatalogId] = useState(track.catalogId || "");
  const [primaryArtist, setPrimaryArtist] = useState(track.primaryArtist || "");
  const [composer, setComposer] = useState(track.composer || "");
  const [director, setDirector] = useState(track.director || "");
  const [producer, setProducer] = useState(track.producer || "");
  const [lyricist, setLyricist] = useState(track.lyricist || "");

  const [lyricsLanguage, setLyricsLanguage] = useState(track.lyricsLanguage || "");
  const [lyricsLanguageOption, setLyricsLanguageOption] = useState(track.lyricsLanguageOption || "Select Language");
  const [filteredLanguages, setFilteredLanguages] = useState(allLanguages);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  const [crbts, setCrbts] = useState(track.crbts || [{ name: "", time: "00:00:00" }]);
  const [isrcOption, setIsrcOption] = useState(track.isrcOption || "no");
  const [isrcCode, setIsrcCode] = useState(track.isrcCode || "");
  const [explicitStatus, setExplicitStatus] = useState(track.explicitStatus || "");

  const [isSaving, setIsSaving] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  const handleInputFocus = () => {
  setFilteredLanguages(allLanguages); // show full list when focused
  setShowDropdown(true);
};
  // Filter languages based on input
  const handleInputChange = (value) => {
    setLyricsLanguage(value);
    const filtered = allLanguages.filter(lang =>
      lang.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredLanguages(filtered);
    setShowDropdown(true);
  };

  // CRBT handlers
  const handleAddCrbt = () => setCrbts([...crbts, { name: "", time: "00:00:00" }]);
  const handleDeleteCrbt = (index) => {
    if (crbts.length > 1) setCrbts(crbts.filter((_, i) => i !== index));
  };
  const handleCrbtChange = (index, field, value) => {
    const updatedCrbts = [...crbts];
    updatedCrbts[index][field] = value;
    setCrbts(updatedCrbts);
  };



  // Save track and update localStorage
  const handleSaveAndContinue = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      // Validation
      if (!trackTitle.trim()) { alert("Please enter track title."); setIsSaving(false); return; }
      if (!primaryArtist.trim()) { alert("Please enter primary artist."); setIsSaving(false); return; }
      if (lyricsLanguageOption === "Select Language" && !lyricsLanguage.trim()) { alert("Please select a language."); setIsSaving(false); return; }
      if (!explicitStatus.trim()) { alert("Please select explicit content status."); setIsSaving(false); return; }
      if (isrcOption === "yes" && !isrcCode.trim()) { alert("Please enter ISRC code."); setIsSaving(false); return; }

      const trackData = {
        created_by: atob(localStorage.getItem("userId")),
        trackTitle: trackTitle.trim(),
        catalogId: catalogId.trim(),
        primaryArtist: primaryArtist.trim(),
        composer: composer.trim(),
        director: director.trim(),
        producer: producer.trim(),
        lyricist: lyricist.trim(),
        lyricsLanguage,
        lyricsLanguageOption,
        crbts,
        isrcOption,
        isrcCode: isrcOption === "yes" ? isrcCode.trim() : "",
        explicitStatus,
        detailsCompleted: true,
      };

      // Update existing track if editing
      let tracks = JSON.parse(localStorage.getItem("uploadedTracks") || "[]");

      const existingIndex = tracks.findIndex(
        (t) => t.id === track.id
      );

      if (existingIndex !== -1) {
        tracks[existingIndex] = { ...tracks[existingIndex], ...trackData };
      } else {
        tracks.push({ ...trackData, id: Date.now() + Math.random() });
      }

      localStorage.setItem("uploadedTracks", JSON.stringify(tracks));

      // Optional: send to webhook
      try {
        await fetch("/api/53f9354c-859b-42c2-b569-c001fb8927f5", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(trackData),
        });
        console.log("Track data sent to Webhook!");
      } catch (err) {
        console.error("Webhook failed:", err);
      }

      navigate("/upload-tracks");
    } catch (err) {
      console.error("Error saving track:", err);
      alert("An unexpected error occurred while saving track.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="track-details-container">
        <h2 className="form-title">Track Details</h2>

        {/* Track Title */}
        <div className="form-section">
          <label className="section-title">Track Title <span className="required">*</span></label>
          <input type="text" placeholder="e.g. I got my summer" className="form-input" value={trackTitle} onChange={e => setTrackTitle(e.target.value)} />
        </div>

        {/* Version / Catalog ID */}
        <div className="form-section">
          <label className="section-title">Version</label>
          <input type="text" placeholder="e.g. 3.0" className="form-input" value={catalogId} onChange={e => setCatalogId(e.target.value)} />
        </div>

        {/* Artists */}
        <div className="form-section">
          <label className="section-title">Artists</label>
          {[ 
            { label: "Primary Artist *", value: primaryArtist, setter: setPrimaryArtist },
            { label: "Composer", value: composer, setter: setComposer },
            { label: "Director", value: director, setter: setDirector },
            { label: "Producer", value: producer, setter: setProducer },
            { label: "Lyricist", value: lyricist, setter: setLyricist }
          ].map((field, idx) => (
            <div className="form-subsection" key={idx} style={{ marginBottom: "10px" }}>
              <label className="subsection-title">{field.label}</label>
              <input type="text" placeholder={field.label} className="form-input" value={field.value} onChange={e => field.setter(e.target.value)} />
            </div>
          ))}
        </div>

        {/* Language of Lyrics */}
        <div className="form-section">
          <label className="section-title">Language of Lyrics</label>
          <div className="radio-group">
            <label>
              <input type="radio" name="lyricsOption" value="Select Language" checked={lyricsLanguageOption==="Select Language"} onFocus={handleInputFocus} onChange={e => setLyricsLanguageOption(e.target.value)} />
              Select Language
            </label>
            <label>
              <input type="radio" name="lyricsOption" value="Instrumental" checked={lyricsLanguageOption==="Instrumental"} onChange={e => setLyricsLanguageOption(e.target.value)} />
              Instrumental
            </label>
          </div>

          
          {lyricsLanguageOption === "Select Language" && (
            <div ref={dropdownRef} style={{ position: "relative", marginTop: "10px" }}>
              <input type="text" placeholder="Select Language *" value={lyricsLanguage}  onChange={e => handleInputChange(e.target.value)} className="form-input"  />
              {showDropdown && filteredLanguages.length > 0 && (
                <ul className="dropdown-list">
                  {filteredLanguages.map((lang, idx) => (
                    <li key={idx} onClick={() => { setLyricsLanguage(lang); setShowDropdown(false); }}>{lang}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Explicit Content */}
        {lyricsLanguageOption === "Select Language" && lyricsLanguage && (
          <div className="form-section">
            <label className="section-title">Explicit Content <span className="required">*</span></label>
            <div className="radio-group" style={{ flexDirection: "column" }}>
              {[ 
                { label: "Explicit", help: "The track lyrics or title include explicit language (such as drug references, sexual, violent or discriminatory language, swearing etc.) not suitable for children." },
                { label: "Not Explicit", help: "The track does NOT include any explicit language in lyrics or title." },
                { label: "Cleaned", help: "It is cleaned." }
              ].map((option, idx) => (
                <label key={idx} style={{ marginBottom: "8px" }}>
                  <input type="radio" value={option.label} checked={explicitStatus===option.label} onChange={() => setExplicitStatus(option.label)} />
                  {option.label}
                  {explicitStatus===option.label && <p className="help-text">{option.help}</p>}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* CRBT */}
        {/* <div className="form-section">
          <label className="section-title">Add CRBT</label>
          {crbts.map((crbt, index) => (
            <div className="crbt-row" key={index}>
              <input type="text" value={crbt.time} className="form-input" onChange={e => handleCrbtChange(index,"time",e.target.value)} />
              {index>0 && <button type="button" className="add-btn" onClick={() => handleDeleteCrbt(index)}>🗑</button>}
            </div>
          ))}
        </div> */}

        {/* <div className="form-section">
//           <label className="section-title">Add CRBT</label>
//           {crbts.map((crbt, index) => (
//             <div className="crbt-row" key={index}>
//               <input type="text" value={crbt.time} className="form-input" onChange={e => handleCrbtChange(index,"time",e.target.value)} />
//               {index>0 && <button type="button" className="add-btn" onClick={() => handleDeleteCrbt(index)}>🗑</button>}
//             </div>
//           ))}
//         </div> */}
              {/* <div className="form-section">
                <label className="section-title">Add CRBT</label>

                {crbts.map((crbt, index) => (
                  <div className="crbt-row" key={index} style={{ alignItems: "center", gap: "8px" }}>
                    <div className="time-display" onClick={() => setActiveClock(index)}>
                      {`${crbt.hours.padStart(2, "0")}:${crbt.minutes.padStart(2, "0")}:${crbt.seconds.padStart(2, "0")}`}
                    </div>

                    {index > 0 && (
                      <button
                        type="button"
                        className="add-btn"
                        onClick={() => handleDeleteCrbt(index)}
                      >
                        🗑
                      </button>
                    )}

                    {activeClock === index && (
                      <div className="clock-popup">
                        <div className="clock-selectors">
                          <div>
                            <label>HH</label>
                            <select
                              value={crbt.hours}
                              onChange={(e) => handleCrbtChange(index, "hours", e.target.value)}
                            >
                              {Array.from({ length: 24 }, (_, i) => (
                                <option key={i} value={String(i).padStart(2, "0")}>
                                  {String(i).padStart(2, "0")}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label>MM</label>
                            <select
                              value={crbt.minutes}
                              onChange={(e) => handleCrbtChange(index, "minutes", e.target.value)}
                            >
                              {Array.from({ length: 60 }, (_, i) => (
                                <option key={i} value={String(i).padStart(2, "0")}>
                                  {String(i).padStart(2, "0")}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label>SS</label>
                            <select
                              value={crbt.seconds}
                              onChange={(e) => handleCrbtChange(index, "seconds", e.target.value)}
                            >
                              {Array.from({ length: 60 }, (_, i) => (
                                <option key={i} value={String(i).padStart(2, "0")}>
                                  {String(i).padStart(2, "0")}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="clock-actions">
                          <button onClick={() => setActiveClock(null)}>Cancel</button>
                          <button
                            onClick={() => {
                              setActiveClock(null);
                            }}
                          >
                            OK
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div> */}


        {/* ISRC */}
        <div className="form-section">
          <label className="section-title">Do you have an ISRC? <span className="required">*</span></label>
          <div className="radio-group">
            <label>
              <input type="radio" name="isrc" value="no" checked={isrcOption==="no"} onChange={()=>setIsrcOption("no")} /> No
            </label>
            <label>
              <input type="radio" name="isrc" value="yes" checked={isrcOption==="yes"} onChange={()=>setIsrcOption("yes")} /> Yes
            </label>
          </div>

          {isrcOption === "yes" && (
            <input
              type="text"
              placeholder="Enter ISRC Code *"
              className="form-input"
              value={isrcCode}
              onChange={e => setIsrcCode(e.target.value)}
            />
          )}

          {isrcOption === "no" && (
            <p className="help-text" style={{ marginTop: "10px" }}>
              We'll generate one for you when we send your release.
            </p>
          )}
        </div>

        {/* Save Button */}
        <button
          type="button"
          className="btn-secondary"
          onClick={handleSaveAndContinue}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save & Continue"}
        </button>
      </div>
    </div>
  );
};

export default TrackDetails;