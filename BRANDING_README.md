# Domain-Based SaaS Branding Implementation

This document describes the domain-based SaaS branding system implemented in the frontend.

## Overview

The branding system allows different domains to have customized branding (colors, logos, site names, etc.) while sharing the same codebase. Branding is fetched from the API based on the current domain and applied dynamically.

## Architecture

### 1. **Branding Service** (`src/services/branding.js`)
- Handles domain normalization
- Fetches branding from API
- Manages localStorage caching
- Provides default TuneWave branding fallback

### 2. **Branding Context** (`src/context/BrandingContext.jsx`)
- Global state management for branding
- Loads branding on app initialization
- Applies CSS variables dynamically
- Provides `useBranding()` hook

### 3. **Branding Styles Utility** (`src/utils/brandingStyles.js`)
- Applies CSS variables to `:root`
- Initializes default styles

### 4. **CSS Variables** (`src/index.css`)
- Defines CSS custom properties for theming
- Variables are updated dynamically by BrandingContext

## Usage

### Basic Usage in Components

```jsx
import { useBranding } from "../context/BrandingContext";

function MyComponent() {
  const { branding, loading, domain } = useBranding();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{branding.site.name}</h1>
      <p>{branding.site.description}</p>
      {branding.logoUrl && (
        <img src={branding.logoUrl} alt={branding.site.name} />
      )}
    </div>
  );
}
```

### Using CSS Variables

```css
.my-button {
  background-color: var(--brand-primary);
  color: white;
}

.my-header {
  background-color: var(--brand-header);
}

.my-sidebar {
  background-color: var(--brand-sidebar);
}

.my-footer {
  background-color: var(--brand-footer);
}
```

### Inline Styles with CSS Variables

```jsx
<button style={{ backgroundColor: "var(--brand-primary)" }}>
  Click Me
</button>
```

## API Contract

### Request
```
GET https://spacestation.tunewave.in/api/branding?domainName={domain}
```

### Response Format
```json
{
  "site": {
    "name": "Client Name",
    "description": "Client Description"
  },
  "colors": {
    "primary": "#1278bb",
    "secondary": "#1a9cd8",
    "header": "#ffffff",
    "sidebar": "#f5f5f5",
    "footer": "#2c3e50"
  },
  "logoUrl": "https://example.com/logo.png",
  "footer": {
    "text": "© 2024 Client Name. All rights reserved.",
    "links": [
      {
        "text": "Privacy Policy",
        "url": "https://example.com/privacy",
        "target": "_blank"
      }
    ]
  }
}
```

## Domain Normalization

- Converts to lowercase
- Removes leading "www."
- Examples:
  - `www.example.com` → `example.com`
  - `EXAMPLE.COM` → `example.com`
  - `subdomain.example.com` → `subdomain.example.com`

## Caching

Branding data is cached in localStorage using the key format: `branding_{domain}`

- Cache is checked before API call
- Cache is updated after successful API fetch
- Cache persists across page refreshes

## Fallback Behavior

If the API fails or no tenant is found:
1. Check localStorage cache
2. Use default TuneWave branding
3. Never break the UI

## Default Branding

```javascript
{
  site: {
    name: "TuneWave",
    description: "Music Distribution Platform",
  },
  colors: {
    primary: "#1278bb",
    secondary: "#1a9cd8",
    header: "#ffffff",
    sidebar: "#f5f5f5",
    footer: "#2c3e50",
  },
  logoUrl: null,
  footer: {
    text: "© 2024 TuneWave. All rights reserved.",
    links: [],
  },
}
```

## Example Components

### Navbar (Updated)
- Uses `branding.logoUrl` for logo
- Falls back to default logo if branding logo fails to load

### Footer (New)
- Displays `branding.footer.text`
- Renders `branding.footer.links`
- Uses `--brand-footer` CSS variable

### BrandingExample (Demo)
- Shows all branding data
- Demonstrates CSS variable usage
- Useful for testing and development

## Initialization Flow

1. App starts → `main.jsx` renders
2. `BrandingProvider` mounts → Detects current domain
3. Normalizes domain → Removes "www.", lowercase
4. Checks localStorage cache → Returns cached if found
5. Fetches from API → `GET /api/branding?domainName={domain}`
6. Applies CSS variables → Updates `:root` styles
7. Updates context state → Components can access branding

## Production Considerations

- No hardcoded domains
- Works in development and production
- Handles SSR/build-time safely (guards with `typeof window`)
- Graceful error handling
- No breaking changes to existing code

## Testing

To test with different domains:
1. Open browser DevTools
2. Navigate to Application → Local Storage
3. Clear `branding_{domain}` entries
4. Change `window.location.hostname` (or use different domain)
5. Refresh page

## Troubleshooting

**Branding not loading:**
- Check browser console for errors
- Verify API endpoint is accessible
- Check network tab for API call
- Verify domain normalization

**Colors not applying:**
- Check if CSS variables are set: `getComputedStyle(document.documentElement).getPropertyValue('--brand-primary')`
- Verify `applyBrandingStyles()` is called
- Check browser DevTools → Elements → :root for CSS variables

**Logo not showing:**
- Check `branding.logoUrl` value
- Verify image URL is accessible
- Check `onError` handler fallback

