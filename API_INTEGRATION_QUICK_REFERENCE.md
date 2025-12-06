# API Integration - Quick Reference Guide
## For Interview Preparation

---

## 🚀 Quick Start

### **1. Making an API Call**

```javascript
// Step 1: Import the service
import * as ArtistsService from "../services/artists";

// Step 2: Call the function
try {
  const artists = await ArtistsService.getArtists({ status: "active" });
  console.log(artists);
} catch (error) {
  console.error("Error:", error);
}
```

---

## 📁 Service File Template

```javascript
import axios from "axios";

const API_BASE = "/api/resource";

const getAuthHeaders = () => {
  const token = localStorage.getItem("jwtToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getResource = async (params = {}) => {
  const response = await axios.get(`${API_BASE}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const createResource = async (data) => {
  const response = await axios.post(API_BASE, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
```

---

## 🔐 Authentication Headers

```javascript
// Standard JSON Request
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <token>"
}

// File Upload Request
{
  "Content-Type": "multipart/form-data",
  "Authorization": "Bearer <token>"
}
```

---

## 📡 HTTP Methods

| Method | Purpose | Example |
|--------|---------|---------|
| **GET** | Fetch data | `axios.get(url, { headers })` |
| **POST** | Create resource | `axios.post(url, data, { headers })` |
| **PUT** | Update resource | `axios.put(url, data, { headers })` |
| **DELETE** | Delete resource | `axios.delete(url, { headers })` |

---

## 📤 File Upload Pattern

```javascript
const formData = new FormData();
formData.append('file', fileObject);
formData.append('releaseId', releaseId);

const response = await axios.post(url, formData, {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data',
  },
  timeout: 600000,  // 10 minutes
});
```

---

## ⚠️ Error Handling Pattern

```javascript
try {
  const data = await Service.function();
} catch (error) {
  if (error.response) {
    // Server responded with error (4xx, 5xx)
    const status = error.response.status;
    const message = error.response.data?.message;
  } else if (error.request) {
    // No response received (network error)
  } else {
    // Request setup error
  }
}
```

---

## 📋 Common Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| **200** | Success | Use response.data |
| **201** | Created | Resource created successfully |
| **400** | Bad Request | Check request data |
| **401** | Unauthorized | Remove token, redirect to login |
| **403** | Forbidden | User lacks permission |
| **404** | Not Found | Resource doesn't exist |
| **500** | Server Error | Try again later |

---

## 🔄 Response Handling

```javascript
// Always extract .data
const response = await axios.get(url);
const actualData = response.data;  // ✅ Correct
const wrong = response;            // ❌ Wrong

// Handle different formats
const data = Array.isArray(response.data) 
  ? response.data 
  : response.data.items || [];
```

---

## 💡 Component Integration

```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  try {
    setLoading(true);
    const result = await Service.getData();
    setData(result);
  } catch (error) {
    toast.error("Failed to fetch data");
  } finally {
    setLoading(false);
  }
};
```

---

## 🎯 Key Interview Questions & Answers

### **Q: Why use a service layer?**
**A:** 
- Separates API logic from UI components
- Reusable across multiple components
- Single source of truth for endpoints
- Easier to test and maintain

### **Q: How do you handle authentication?**
**A:**
- JWT Bearer tokens stored in localStorage
- `getAuthHeaders()` helper function adds token to every request
- On 401/403 errors, remove token and redirect to login
- Token retrieved from localStorage: `localStorage.getItem("jwtToken")`

### **Q: How do you handle different response formats?**
**A:**
- Check if response is array or object
- Try common property names: `data`, `items`, `results`
- Provide fallback empty array if format unexpected
- Log warnings for debugging

### **Q: How do you handle file uploads?**
**A:**
- Use `FormData` object
- Set `Content-Type: multipart/form-data`
- Include Authorization header with Bearer token
- Set timeout for large files (10 minutes)
- Use `onUploadProgress` for progress tracking

### **Q: What's your error handling strategy?**
**A:**
- Three-tier approach:
  1. Server errors (`error.response`) - extract message, handle status codes
  2. Network errors (`error.request`) - show network error message
  3. Setup errors - show generic error message
- User-friendly messages extracted from error response
- Log errors for debugging

---

## 📝 Service Files Overview

| File | Purpose | Key Functions |
|------|---------|---------------|
| `auth.js` | Authentication | `login()`, `verifyToken()`, `getUserEntities()` |
| `artists.js` | Artist management | `getArtists()`, `createArtist()`, `updateArtist()` |
| `enterprises.js` | Enterprise management | `getEnterprises()`, `createEnterprise()` |
| `files.js` | File operations | `uploadAudio()`, `getFiles()`, `deleteFile()` |
| `releases.js` | Release management | `getReleases()`, `createRelease()`, `updateRelease()` |
| `tracks.js` | Track operations | `createTrack()`, `updateTrack()`, `getTracksByReleaseId()` |

---

## 🔍 Debugging Tips

```javascript
// Log request details
console.log("Request URL:", url);
console.log("Request Headers:", headers);
console.log("Request Data:", data);

// Log response details
console.log("Response Status:", response.status);
console.log("Response Data:", response.data);

// Log error details
console.error("Error Status:", error.response?.status);
console.error("Error Data:", error.response?.data);
console.error("Error Message:", error.message);
```

---

## ✅ Checklist Before Interview

- [ ] Understand service layer pattern
- [ ] Know how authentication works (JWT tokens)
- [ ] Understand error handling (3 types)
- [ ] Know file upload process (FormData)
- [ ] Understand response handling (extract .data)
- [ ] Know common HTTP methods (GET, POST, PUT, DELETE)
- [ ] Understand status codes (200, 401, 404, 500)
- [ ] Know how to integrate services in components
- [ ] Understand proxy configuration (Vite)
- [ ] Know best practices (centralized, reusable, maintainable)

---

## 🎓 Remember These Points

1. **Always use service layer** - Don't call axios directly in components
2. **Always include auth headers** - Use `getAuthHeaders()` helper
3. **Always handle errors** - Wrap API calls in try-catch
4. **Always extract response.data** - Don't use response directly
5. **Always validate inputs** - Check required fields before API call
6. **Always provide user feedback** - Use toast notifications
7. **Always log errors** - For debugging purposes

---

**Good luck with your interview! 🚀**


