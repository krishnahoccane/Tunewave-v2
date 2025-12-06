# API Integration Implementation Guide
## Tunewave v2 - Detailed Technical Explanation

---

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Service Layer Pattern](#service-layer-pattern)
3. [Authentication & Authorization](#authentication--authorization)
4. [API Request Structure](#api-request-structure)
5. [Response Handling](#response-handling)
6. [Error Handling](#error-handling)
7. [File Upload Implementation](#file-upload-implementation)
8. [Real-World Examples](#real-world-examples)
9. [Best Practices](#best-practices)

---

## 🏗️ Architecture Overview

### **Project Structure**
```
src/
├── services/          # Centralized API service layer
│   ├── auth.js       # Authentication endpoints
│   ├── artists.js    # Artist CRUD operations
│   ├── enterprises.js # Enterprise management
│   ├── files.js      # File upload/download
│   ├── releases.js   # Release management
│   └── tracks.js     # Track operations
├── pages/            # React components using services
└── components/       # Reusable UI components
```

### **Key Technologies**
- **HTTP Client**: Axios
- **Authentication**: JWT Bearer Tokens
- **State Management**: React Hooks (useState, useEffect)
- **Storage**: localStorage for token persistence
- **Proxy**: Vite dev server proxy for API routing

---

## 🔧 Service Layer Pattern

### **Why Service Layer?**
- **Separation of Concerns**: Business logic separated from UI components
- **Reusability**: Same API calls can be used across multiple components
- **Maintainability**: Single source of truth for API endpoints
- **Testability**: Easy to mock and test API calls independently

### **Service File Structure**

Each service file follows this pattern:

```javascript
// src/services/artists.js
import axios from "axios";

// 1. Define API Base URL
const API_BASE = "/api/artists";

// 2. Authentication Helper Function
const getAuthHeaders = () => {
  const token = localStorage.getItem("jwtToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// 3. API Functions (CRUD operations)
export const getArtists = async (params = {}) => {
  // Implementation
};

export const createArtist = async (artistData) => {
  // Implementation
};

// 4. Default Export (optional)
export default {
  getArtists,
  createArtist,
};
```

---

## 🔐 Authentication & Authorization

### **Token Storage**
- **Location**: `localStorage` with key `"jwtToken"`
- **Retrieval**: `localStorage.getItem("jwtToken")`
- **Storage**: After successful login via `/api/auth/login`

### **Authentication Flow**

#### **1. Login Process**
```javascript
// src/services/auth.js
export const login = async ({ email, password }) => {
  const response = await axios.post(
    `${API_BASE}/login`,
    { email, password },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data; // Returns: { token, fullName, role, ... }
};
```

#### **2. Token Usage in Requests**
```javascript
// Every authenticated request includes:
const getAuthHeaders = () => {
  const token = localStorage.getItem("jwtToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,  // JWT Bearer Token
  };
};
```

#### **3. Token Verification**
```javascript
// Verify token validity
export const verifyToken = async (token) => {
  const response = await axios.get(`${API_BASE}/verify`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
```

### **Header Structure**
```javascript
// Standard Headers for JSON Requests
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <jwt_token>"
}

// Headers for File Uploads
{
  "Content-Type": "multipart/form-data",
  "Authorization": "Bearer <jwt_token>"
}
```

---

## 📡 API Request Structure

### **Base URL Configuration**

#### **Development (Vite Proxy)**
```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://spacestation.tunewave.in",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

**How it works:**
- Frontend makes request to: `/api/artists`
- Vite proxy forwards to: `https://spacestation.tunewave.in/api/artists`
- Handles CORS issues during development

### **Request Types**

#### **1. GET Request (Fetch Data)**
```javascript
// Example: Get list of artists with filters
export const getArtists = async (params = {}) => {
  // Build query string
  const queryParams = new URLSearchParams();
  
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null) {
      queryParams.append(key, params[key]);
    }
  });
  
  const url = `${API_BASE}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  
  const response = await axios.get(url, {
    headers: getAuthHeaders(),
  });
  
  return response.data;
};

// Usage in component:
const artists = await ArtistsService.getArtists({ 
  status: "active", 
  search: "John" 
});
```

#### **2. POST Request (Create Resource)**
```javascript
// Example: Create new artist
export const createArtist = async (artistData) => {
  const response = await axios.post(API_BASE, artistData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Usage:
const newArtist = await ArtistsService.createArtist({
  name: "John Doe",
  email: "john@example.com",
  status: "active"
});
```

#### **3. PUT Request (Update Resource)**
```javascript
// Example: Update existing artist
export const updateArtist = async (artistId, artistData) => {
  const response = await axios.put(`${API_BASE}/${artistId}`, artistData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Usage:
const updated = await ArtistsService.updateArtist(123, {
  name: "John Updated",
  status: "inactive"
});
```

#### **4. DELETE Request**
```javascript
// Example: Delete artist
export const deleteArtist = async (artistId) => {
  const response = await axios.delete(`${API_BASE}/${artistId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
```

---

## 📥 Response Handling

### **Response Structure**
```javascript
// Axios wraps the response:
{
  data: {},           // Actual response data from server
  status: 200,        // HTTP status code
  statusText: "OK",   // HTTP status text
  headers: {},        // Response headers
  config: {}          // Request configuration
}
```

### **Extracting Data**
```javascript
// Always extract .data property
const response = await axios.get(url, { headers });
const actualData = response.data;  // This is what you need
```

### **Handling Different Response Formats**

#### **Example: Flexible Response Parsing**
```javascript
// src/services/enterprises.js
export const getEnterprises = async (params = {}) => {
  const response = await axios.get(url, {
    headers: getAuthHeaders(),
  });
  
  const responseData = response.data;
  
  // Handle different response formats
  if (Array.isArray(responseData)) {
    return responseData;  // Direct array
  } else if (responseData && typeof responseData === 'object') {
    // Try common property names
    return responseData.data || 
           responseData.enterprises || 
           responseData.items || 
           responseData.results ||
           [];
  }
  
  return [];
};
```

---

## ⚠️ Error Handling

### **Error Types**

#### **1. Server Response Errors (4xx, 5xx)**
```javascript
try {
  const response = await ArtistsService.getArtists();
} catch (error) {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const errorData = error.response.data;
    
    // Extract error message
    const errorMessage = 
      errorData?.message || 
      errorData?.error || 
      errorData?.title ||
      `Server Error (${status})`;
    
    // Handle specific status codes
    if (status === 401 || status === 403) {
      // Unauthorized - redirect to login
      localStorage.removeItem("jwtToken");
      navigate("/login");
    } else if (status === 404) {
      // Not found
      toast.error("Resource not found");
    } else if (status >= 500) {
      // Server error
      toast.error("Server error. Please try again later.");
    } else {
      toast.error(errorMessage);
    }
  }
}
```

#### **2. Network Errors (No Response)**
```javascript
catch (error) {
  if (error.request) {
    // Request was made but no response received
    toast.error("Network error: Unable to reach the server.");
  }
}
```

#### **3. Request Setup Errors**
```javascript
catch (error) {
  // Error setting up request
  toast.error(`Error: ${error.message}`);
}
```

### **Complete Error Handling Pattern**
```javascript
// Example from CreateEnterprise.jsx
try {
  const data = await EnterprisesService.createEnterprise(formData);
  toast.success("Enterprise created successfully!");
  navigate("/enterprises");
} catch (error) {
  console.error("Axios error details:", error);
  
  if (error.response) {
    // Server responded with error
    const errorMessage = 
      error.response.data?.message || 
      error.response.data?.error || 
      error.response.data?.title ||
      error.response.data?.detail ||
      (error.response.data?.errors && JSON.stringify(error.response.data.errors)) ||
      `Server Error (${error.response.status})`;
    
    toast.dark(`Backend Error: ${errorMessage}`, { autoClose: 5000 });
  } else if (error.request) {
    // No response received
    toast.dark("Network error: Unable to reach the server.");
  } else {
    // Request setup error
    toast.dark(`Error: ${error.message}`);
  }
}
```

---

## 📤 File Upload Implementation

### **Multipart Form Data**

#### **Standard File Upload**
```javascript
// src/services/files.js
export const uploadFileDirectly = async ({ releaseId, trackId, fileType, file }) => {
  const token = localStorage.getItem("jwtToken");
  
  // Create FormData object
  const formData = new FormData();
  formData.append('releaseId', releaseId);
  formData.append('trackId', trackId);
  formData.append('fileType', fileType);
  formData.append('file', file);  // File object from input
  
  const response = await axios.post(`${API_BASE}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',  // Important!
    },
    timeout: 600000,  // 10 minutes for large files
  });
  
  return response.data;
};
```

#### **Audio Upload with Progress Tracking**
```javascript
export const uploadAudio = async ({ releaseId, trackId, file }) => {
  const token = localStorage.getItem("jwtToken");
  
  // Validate inputs
  if (!releaseId || releaseId === 0) {
    throw new Error("releaseId is required");
  }
  if (!file) {
    throw new Error("file is required");
  }
  
  const formData = new FormData();
  formData.append('file', file);
  
  const url = `${API_BASE}/UploadAudio?releaseId=${releaseId}&trackId=${trackId}`;
  
  const response = await axios.post(url, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
    timeout: 600000,
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`Upload progress: ${percentCompleted}%`);
        // Update UI progress bar here
      }
    },
  });
  
  return response.data;
};
```

### **File Upload Flow**
```
1. User selects file → File object created
2. Create FormData → Append file and metadata
3. POST request with multipart/form-data header
4. Backend processes file → Returns fileId and URLs
5. Update track/release with fileId
```

---

## 💡 Real-World Examples

### **Example 1: Fetching Data in Component**

```javascript
// src/pages/ArtistsList.jsx
import { useState, useEffect } from "react";
import * as ArtistsService from "../services/artists";
import { toast } from "react-toastify";

const ArtistsList = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchArtists();
  }, []);
  
  const fetchArtists = async () => {
    try {
      setLoading(true);
      const data = await ArtistsService.getArtists({ 
        status: "active" 
      });
      setArtists(data);
    } catch (error) {
      console.error("Error fetching artists:", error);
      
      if (error.response?.status === 401) {
        // Unauthorized - redirect to login
        localStorage.removeItem("jwtToken");
        navigate("/login");
      } else {
        toast.error("Failed to fetch artists");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      {loading ? <p>Loading...</p> : (
        artists.map(artist => <div key={artist.id}>{artist.name}</div>)
      )}
    </div>
  );
};
```

### **Example 2: Creating Resource with Form Data**

```javascript
// src/pages/CreateArtist.jsx
import { useState } from "react";
import * as ArtistsService from "../services/artists";
import { toast } from "react-toastify";

const CreateArtist = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "active"
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await ArtistsService.createArtist(formData);
      toast.success("Artist created successfully!");
      navigate("/artists");
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data?.message || "Failed to create artist";
        toast.error(errorMessage);
      } else {
        toast.error("Network error. Please try again.");
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      <button type="submit">Create</button>
    </form>
  );
};
```

### **Example 3: File Upload with Progress**

```javascript
// src/pages/UploadTracks.jsx
import { useState } from "react";
import * as FilesService from "../services/files";

const UploadTracks = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleFileUpload = async (file, releaseId, trackId) => {
    try {
      const response = await FilesService.uploadAudio({
        releaseId,
        trackId,
        file
      });
      
      console.log("Upload successful:", response);
      toast.success("File uploaded successfully!");
    } catch (error) {
      if (error.response?.status === 405) {
        toast.error("Upload endpoint not found");
      } else if (error.response) {
        toast.error(error.response.data?.message || "Upload failed");
      } else {
        toast.error("Network error during upload");
      }
    }
  };
  
  return (
    <input 
      type="file" 
      onChange={(e) => {
        const file = e.target.files[0];
        handleFileUpload(file, releaseId, trackId);
      }}
    />
  );
};
```

---

## ✅ Best Practices

### **1. Centralized Service Layer**
- ✅ All API calls in `src/services/` directory
- ✅ One service file per resource (artists, enterprises, etc.)
- ✅ Consistent naming: `getResource`, `createResource`, `updateResource`, `deleteResource`

### **2. Authentication**
- ✅ Always use `getAuthHeaders()` helper function
- ✅ Store token in `localStorage` after login
- ✅ Remove token on 401/403 errors
- ✅ Verify token before making requests

### **3. Error Handling**
- ✅ Always wrap API calls in try-catch
- ✅ Check `error.response` for server errors
- ✅ Check `error.request` for network errors
- ✅ Provide user-friendly error messages
- ✅ Log errors for debugging

### **4. Response Handling**
- ✅ Always extract `response.data`
- ✅ Handle different response formats gracefully
- ✅ Validate response structure before using
- ✅ Provide fallback values for missing data

### **5. File Uploads**
- ✅ Use `FormData` for multipart/form-data
- ✅ Set appropriate timeout for large files
- ✅ Implement progress tracking
- ✅ Validate file size and type before upload

### **6. Code Organization**
- ✅ Export functions individually: `export const functionName`
- ✅ Provide default export object for convenience
- ✅ Add JSDoc comments for function documentation
- ✅ Use consistent parameter naming

---

## 🔍 Key Interview Points

### **1. Why Service Layer Pattern?**
- **Separation of Concerns**: UI components don't need to know API details
- **Reusability**: Same API functions used across multiple components
- **Maintainability**: Change API endpoint in one place
- **Testability**: Easy to mock services for testing

### **2. Authentication Strategy**
- **JWT Bearer Tokens**: Stateless authentication
- **localStorage**: Client-side token storage
- **Automatic Headers**: Every request includes Authorization header
- **Token Refresh**: Can implement refresh token flow

### **3. Error Handling Approach**
- **Three-Tier Error Handling**: response errors, network errors, setup errors
- **User-Friendly Messages**: Extract meaningful messages from error responses
- **Status Code Handling**: Different actions for 401, 404, 500, etc.
- **Logging**: Console logs for debugging in development

### **4. File Upload Challenges**
- **Multipart Form Data**: Required for file uploads
- **Large File Handling**: Timeout configuration (10 minutes)
- **Progress Tracking**: `onUploadProgress` callback
- **Error Recovery**: Handle network interruptions

### **5. API Integration Benefits**
- **Type Safety**: Can add TypeScript for better type checking
- **Request Interceptors**: Can add axios interceptors for automatic token injection
- **Response Interceptors**: Can handle common errors globally
- **Caching**: Can implement response caching for better performance

---

## 📚 Additional Resources

### **Axios Documentation**
- Base URL configuration
- Request/Response interceptors
- Error handling
- File uploads

### **JWT Authentication**
- Token structure
- Token expiration
- Refresh token flow
- Security best practices

### **RESTful API Design**
- HTTP methods (GET, POST, PUT, DELETE)
- Status codes
- Request/Response formats
- Error response structure

---

## 🎯 Summary

This project implements a **clean, maintainable API integration** using:

1. **Service Layer Pattern** for organized API calls
2. **JWT Bearer Token Authentication** for secure requests
3. **Comprehensive Error Handling** for robust user experience
4. **Flexible Response Parsing** for different API formats
5. **File Upload Support** with progress tracking
6. **Consistent Code Structure** across all services

The architecture ensures **scalability**, **maintainability**, and **testability** while providing a **great developer experience**.


