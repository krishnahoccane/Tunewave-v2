# Track Upload Flow - Complete Explanation

## Overview
This document explains the complete flow of uploading tracks and files in the Tunewave application, from creating a release to uploading audio files.

---

## 🎯 **PHASE 1: Create Release** (`CreateRelease.jsx`)

### **Trigger:** User fills out release form and clicks "Create Release"

### **Flow:**

1. **User Input** → Form submission
   - User enters: title, genre, dates, cover art, etc.
   - Clicks "Create Release" button

2. **Form Validation** → Check required fields
   - Validates all required fields are filled
   - Formats dates to ISO format
   - Maps contributors data

3. **API Call: POST `/api/releases`**
   ```javascript
   POST /api/releases
   Body: {
     title, genre, dates, coverArtUrl, etc.
     trackIds: []  // Empty initially
   }
   ```

4. **Response Handling**
   - Extracts `releaseId` from response
   - Saves `releaseMetadata` to `localStorage`
   - Navigates to `/upload-tracks` with `releaseMetadata` in state

5. **Storage**
   ```javascript
   localStorage.setItem("releaseMetadata", JSON.stringify({
     releaseId: 2051,
     releaseTitle: "aBBa",
     // ... all release data
   }))
   ```

---

## 🎵 **PHASE 2: Upload Tracks Page** (`UploadTracks.jsx`)

### **Component Initialization**

1. **Load Release Metadata**
   ```javascript
   // Priority 1: From navigation state (if coming from CreateRelease)
   const releaseMetadataFromState = location.state || {};
   
   // Priority 2: From localStorage (if page refreshed)
   const releaseMetadataFromStorage = JSON.parse(
     localStorage.getItem("releaseMetadata") || "{}"
   );
   
   // Use state if available, otherwise storage
   const releaseMetadata = Object.keys(releaseMetadataFromState).length > 0 
     ? releaseMetadataFromState 
     : releaseMetadataFromStorage;
   ```

2. **Load Existing Tracks**
   ```javascript
   const [tracks, setTracks] = useState(() =>
     JSON.parse(localStorage.getItem("uploadedTracks") || "[]")
   );
   ```

3. **Initialize File Storage**
   ```javascript
   // Global Map persists File objects across navigation
   const globalFileObjects = new Map();
   const fileObjectsRef = useRef(globalFileObjects);
   ```

---

## 📁 **PHASE 3: User Uploads Audio Files**

### **Trigger:** User clicks upload area or file input

### **Flow:**

1. **File Selection** → `handleTrackUpload(e)`
   - User selects one or more audio files (WAV, FLAC)
   - Files are validated for format

2. **For Each File:**
   ```javascript
   files.forEach((file) => {
     // Create blob URL for preview
     const audioURL = URL.createObjectURL(file);
     const audio = new Audio(audioURL);
     
     // Wait for metadata to load
     audio.onloadedmetadata = () => {
       // Generate unique track ID
       const trackId = Date.now() + Math.random();
       
       // Create track object
       const newTrack = {
         id: trackId,
         name: file.name,
         format: file.type,
         url: audioURL,  // Blob URL for preview
         duration: audio.duration,
         metadata: {},
         detailsCompleted: false,
       };
       
       // ⚠️ CRITICAL: Store File object for later upload
       fileObjectsRef.current.set(trackId, file);
       globalFileObjects.set(trackId, file);
       
       newTracks.push(newTrack);
     };
   });
   ```

3. **Save to State & Storage**
   ```javascript
   const updatedTracks = [...tracks, ...newTracks];
   saveTracksToStorage(updatedTracks);  // Updates state + localStorage
   ```

**Why File objects are stored separately:**
- File objects cannot be serialized to JSON
- They're stored in a global Map that persists across navigation
- This allows users to navigate away and come back without losing files

---

## ✏️ **PHASE 4: User Edits Track Details**

### **Trigger:** User clicks "Edit" on a track

### **Flow:**

1. **Navigate to Track Details Page**
   ```javascript
   navigate("/track-details", {
     state: { track, trackIdx: idx }
   });
   ```

2. **User Fills Form**
   - Track title, ISRC, language, version, explicit status
   - Saves back to `localStorage`

3. **Return to UploadTracks**
   - Track data updated in `localStorage`
   - `detailsCompleted: true` flag set

---

## 🚀 **PHASE 5: Process & Upload** (`handleNextStep()`)

### **Trigger:** User clicks "Next" or "Continue" button

### **Pre-checks:**
```javascript
// 1. Check tracks exist
if (tracks.length === 0) {
  toast.dark("⚠️ Please upload at least one track");
  return;
}

// 2. Check all details completed
if (tracks.some((t) => !t.detailsCompleted)) {
  toast.dark("ℹ️ Please complete track details");
  return;
}

// 3. Check releaseId exists
const releaseId = releaseMetadata.releaseId;
if (!releaseId) {
  toast.dark("⚠️ Release ID not found");
  return;
}
```

---

## 🔢 **STEP 0: Calculate Next Track Number**

### **Purpose:** Avoid duplicate trackNumber errors

### **Flow:**

1. **Fetch Existing Tracks** (3 fallback methods)
   ```javascript
   // Method 1: Try release endpoint (may include tracks)
   GET /api/releases/{releaseId}
   
   // Method 2: Try tracks service
   GET /api/tracks?releaseId={releaseId}
   
   // Method 3: Fallback - fetch by trackIds
   GET /api/tracks/{trackId} (for each trackId)
   ```

2. **Extract Track Numbers**
   ```javascript
   const existingTrackNumbers = existingTracks
     .map(t => t.trackNumber)
     .filter(n => n !== undefined && n !== null && n > 0);
   ```

3. **Calculate Next Number**
   ```javascript
   if (existingTrackNumbers.length > 0) {
     const maxTrackNumber = Math.max(...existingTrackNumbers);
     nextTrackNumber = maxTrackNumber + 1;
   } else {
     nextTrackNumber = 1;  // Start from 1 if no tracks exist
   }
   ```

---

## 📝 **STEP 1: Create Track** (For each track)

### **API Call:**
```javascript
POST /api/tracks
Body: {
  releaseId: 2051,
  trackNumber: 1,  // Calculated from Step 0
  title: "Track Name",
  durationSeconds: 180,
  explicitFlag: false,
  isrc: "ISRC123",
  language: "en",
  trackVersion: "1.0",
  primaryArtistId: 0,
  audioFileId: 0  // Will be updated after file upload
}
```

### **Response:**
```javascript
{
  trackId: 2024,
  // ... other track data
}
```

### **Extract trackId:**
```javascript
const trackId = createdTrack.trackId || createdTrack.id;
```

---

## 📤 **STEP 2: Upload Audio File** (For each track)

### **Check File Object Exists:**
```javascript
const fileObject = fileObjectsRef.current.get(track.id);
if (!fileObject) {
  // Skip upload, track created but no file
  console.warn("No file object found for track");
}
```

### **API Call:**
```javascript
POST /api/files/UploadAudio?releaseId={releaseId}&trackId={trackId}
Content-Type: multipart/form-data
Body: FormData {
  file: <File object>
}
```

### **Service Function:** `FilesService.uploadAudio()`
```javascript
// In files.js
export const uploadAudio = async ({ releaseId, trackId, file }) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const url = `/api/files/UploadAudio?releaseId=${releaseId}&trackId=${trackId}`;
  
  const response = await axios.post(url, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
    timeout: 600000,  // 10 minutes
  });
  
  return response.data;
};
```

### **Response Handling:**
```javascript
const uploadResult = await FilesService.uploadAudio({
  releaseId: Number(releaseId),
  trackId: Number(trackId),
  file: fileObject,
});

// Extract fileId from response (try multiple field names)
const fileId = uploadResult?.fileId || 
              uploadResult?.id || 
              uploadResult?.data?.fileId || 
              uploadResult?.data?.id ||
              uploadResult?.file?.fileId ||
              uploadResult?.file?.id;
```

---

## 🔗 **STEP 3: Link File to Track**

### **Update Track with audioFileId:**
```javascript
PUT /api/tracks/{trackId}
Body: {
  audioFileId: 2003  // From upload response
}
```

### **Service Function:** `TracksService.updateTrack()`
```javascript
await TracksService.updateTrack(trackId, { audioFileId });
```

---

## 🔄 **STEP 4: Update Release with Track IDs**

### **After All Tracks Processed:**

```javascript
// Collect all trackIds
const trackIds = createdTracks.map(t => t.trackId).filter(id => id);

// Update release
POST /api/releases/{releaseId}
Body: {
  trackIds: [2024, 2025, 2026]  // Array of track IDs
}
```

**Purpose:** Links tracks to the release so they appear together

---

## ✅ **STEP 5: Success & Navigation**

### **Final Steps:**
```javascript
// 1. Show success message
toast.success("✅ Tracks created and files uploaded successfully!");

// 2. Save processed tracks to localStorage
localStorage.setItem("uploadedTracks", JSON.stringify(createdTracks));

// 3. Navigate to next page
navigate("/select-stores", {
  state: { 
    ...releaseMetadata, 
    tracks: createdTracks 
  }
});
```

---

## 🔍 **Error Handling**

### **Track Creation Error:**
- Catches error, logs details
- Throws: `"Failed to process track: {error message}"`
- Stops processing remaining tracks

### **File Upload Error:**
- Logs full error response from backend
- Extracts error message from response
- Throws: `"Failed to upload audio file: {error message}"`
- Track is created but file upload fails

### **Common Errors:**
1. **500 Error** → Backend server error (check backend logs)
2. **400 Error** → Validation error (check request data)
3. **Network Error** → Connection issue
4. **"TrackNumber already exists"** → Fixed by Step 0 logic

---

## 📊 **Data Flow Summary**

```
User Uploads File
    ↓
File Object Stored in globalFileObjects Map
    ↓
Track Object Created (with blob URL for preview)
    ↓
Track Saved to localStorage
    ↓
User Edits Track Details
    ↓
Track Updated in localStorage
    ↓
User Clicks "Next"
    ↓
Calculate Next Track Number (Step 0)
    ↓
For Each Track:
    ├─ Create Track via API (Step 1)
    ├─ Upload File via API (Step 2)
    ├─ Update Track with audioFileId (Step 3)
    └─ Collect trackId
    ↓
Update Release with trackIds (Step 4)
    ↓
Navigate to Next Page
```

---

## 🗂️ **Storage Locations**

### **localStorage:**
- `releaseMetadata` → Release data (from CreateRelease)
- `uploadedTracks` → Array of track objects (metadata only, no File objects)

### **Global Map (in-memory):**
- `globalFileObjects` → Map<trackId, File object>
  - Persists across navigation
  - Cannot be serialized to JSON
  - Cleared on page refresh (files need to be re-uploaded)

---

## 🔑 **Key Points**

1. **File Objects** are stored separately because they can't be serialized
2. **Track Numbers** are calculated to avoid duplicates
3. **Sequential Processing** - tracks are processed one by one (not parallel)
4. **Error Handling** - if one track fails, entire process stops
5. **State Management** - uses localStorage for persistence across navigation
6. **API Sequence** - Create track → Upload file → Update track → Update release

---

## 🐛 **Current Issue: 500 Error**

When uploading audio files, you're getting a 500 error from the backend. This means:

- ✅ Frontend is correctly sending the request
- ✅ File is being sent properly
- ❌ Backend is failing to process the file

**To Debug:**
1. Check browser console for detailed error logs
2. Check backend server logs for the actual error
3. Verify backend endpoint `/api/files/UploadAudio` is working
4. Check file size/format limits on backend


