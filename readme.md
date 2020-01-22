# Shopify Independents

## Usage in Production

```javascript
import Independents from "@playgroundinc/shopify-equity-react";

const endpoint =
  process.env.ENDPOINT || "https://shopify.com/independents.json";
const MOUNT_POINT = document.getElementById("App");

const independents = new Independents(endpoint, MOUNT_POINT);
independents.init();
```

## Local Development

```javascript
npm i
npm start // Browser will open to localhost:3000 via WebPack Dev Server
```

## Development Tips and Tricks

Styles are managed as CSS Modules via Webpack. In local development, they will be represented as `[filename]__[classname]`, however in production to prevent conflict, they are overwritten as base64 hashes.
