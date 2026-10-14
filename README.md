# Project N

## Run locally

Use Node.js 24 or newer. The development command starts the Vite storefront and the Node API:

```powershell
npm install
npm run dev
```

The API reads admin credentials from `.env.local`. Copy `.env.example` to `.env.local` and set a
private username and password there before starting the server. Do not commit `.env.local`.

## Shared inventory and product photos

Product inventory is stored in the SQLite database at `server-data/inventory.sqlite`. Photos uploaded
from the admin inventory screen are stored under `server-data/uploads` and served by the Node API.
Both locations are ignored by Git and must be kept on persistent storage.

On the first admin sign-in, the server imports the existing inventory from that browser once. Sign in
from the browser that contains the latest admin edits first, then reload the storefront in other
browsers to see the shared catalog and uploaded photos. Later sign-ins do not overwrite the shared
database with an older browser copy.

To run the built application with the API:

```powershell
npm run build
$env:NODE_ENV = "production"
npm start
```

Deploy the app on a Node.js host with a persistent disk for `server-data`, and configure
`ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `PORT` as server environment variables. Static-only hosting
does not run the API and cannot share admin edits or uploaded files between browsers.

Orders, inquiries, and carts continue to use browser-local storage.
