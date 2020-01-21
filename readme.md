# Shopify Independents

## Usage

```javascript
import Independents from 'package-name';

const endpoint = process.env.ENDPOINT || 'https://shopify.com/independents.json';
const MOUNT_POINT = document.getElementById('App');

const independents = new Independents(endpoint, MOUNT_POINT);
independents.init();
```
