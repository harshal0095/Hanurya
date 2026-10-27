# Hanurya

Hanurya is a Next.js storefront with an Express API and a PostgreSQL database.

## Local development

1. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL`.
2. Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL`.
3. Install dependencies with `npm ci` in the repository root and `npm ci` in `backend`.
4. Start the API from `backend` with `npm run dev`.
5. Start the storefront from the repository root with `npm run dev`.

## Production configuration

Configure values through your hosting provider's environment/secret manager. Never commit real credentials.

### Suggested hosting: Vercel + Render + Neon

1. Create a PostgreSQL project in Neon. Copy both the pooled connection string and the direct connection string from Neon; keep SSL enabled.
2. In Render, create a Blueprint from this repository and select `render.yaml`. In the new `hanurya-api` service, set:
   - `DATABASE_URL` to Neon's pooled connection string.
   - `DIRECT_URL` to Neon's direct (non-pooler) connection string for Prisma migrations.
   - `CLIENT_URLS` to the exact Vercel frontend origin (for the first deploy, use the Vercel `*.vercel.app` origin; add a custom-domain origin later if needed).
   - The three Cloudinary credentials for persistent product image storage.
   - The generated `JWT_SECRET` is managed by Render; do not replace it with a public value.
3. Deploy the Next.js project to Vercel with the repository root as the project root. Add `NEXT_PUBLIC_API_URL` as `https://<your-render-service>.onrender.com/api`, plus `NEXT_PUBLIC_UPI_ID` and `NEXT_PUBLIC_UPI_PAYEE_NAME`. These `NEXT_PUBLIC_` values are public; never place API keys or secrets in them. Set them before the production build.
4. After Vercel assigns the site's URL, set that exact HTTPS origin in Render's `CLIENT_URLS`, save, and redeploy the API. Do not use `*`.
5. Verify the Render health check is green, then test registration, product loading, UPI quote, order submission, admin payment review, and status updates before sharing the website.

### Frontend

- `NEXT_PUBLIC_API_URL`: HTTPS API base URL, including `/api` (for example `https://api.example.com/api`).
- `NEXT_PUBLIC_UPI_ID` and `NEXT_PUBLIC_UPI_PAYEE_NAME`: public merchant details shown in the manual UPI checkout. Set them before building/deploying; checkout stays disabled if either is missing.
- The value is public and must not contain secrets.
- Production builds fail unless this is a valid HTTPS API URL ending in `/api`; this prevents a deployed storefront from silently trying to call `localhost`.

### Backend

- `NODE_ENV=production`
- `DATABASE_URL`: production PostgreSQL connection string with TLS enabled.
- `DIRECT_URL`: direct PostgreSQL connection for Prisma migrations (recommended with Neon pooled application connections).
- `JWT_SECRET`: unique random value of at least 32 bytes. Generate one with `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`.
- `CLIENT_URLS`: comma-separated exact HTTPS frontend origins, without paths or wildcards.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`: required for persistent production image uploads.
- Product and collection records, customer accounts, orders, stock, and signed-in customer carts/wishlists are stored in Neon. Guest carts are temporary and are not saved across refreshes.
- Uploaded image files are stored in Cloudinary; Neon stores their persistent URLs. Do not rely on files under `public/uploads` for production.
- `PORT`: use the port supplied by the hosting platform.
- `TRUST_PROXY_HOPS`: set only to the exact number of trusted reverse-proxy hops in front of the API; leave at `0` when the API is directly exposed.

The API health endpoint (`/api/health`) checks PostgreSQL and returns `503` if the database is unavailable. Configure the hosting platform to use it as a readiness check. If running multiple API instances, configure a shared rate-limit store before relying on login/registration throttling; the default store is process-local.

### Database and first administrator

The checked-in Prisma migrations create the original schema, order fulfillment, inventory reservation, and signed-in cart/wishlist tables. For a new database, Render applies them on startup with `npm run migrate:deploy`; locally, run `npx prisma migrate deploy` from `backend`.

To move existing product images from a local `public/uploads` directory into Cloudinary and update their Neon URLs, configure valid Cloudinary credentials in `backend/.env`, ensure the referenced files exist locally, and run `npm run images:migrate` from `backend`. The migration updates each product URL only after its image upload succeeds.

If your database already has the original tables created by `prisma db push`, take a backup and compare it to `20261025120000_initial` first. If it matches, mark that baseline as already applied with `npx prisma migrate resolve --applied 20261025120000_initial`, then run `npx prisma migrate deploy` to apply the order fields. Do not mark a migration applied unless the database schema actually matches it.

Provision the first administrator only after confirming the API is connected to the intended database:

1. Set `BOOTSTRAP_ADMIN_EMAIL` and a unique `BOOTSTRAP_ADMIN_PASSWORD` (16–72 bytes) in the backend environment.
2. Run `npm run admin:bootstrap` from `backend`.
3. Remove both bootstrap values from the environment immediately afterward.

The bootstrap script refuses to run if an administrator already exists and never resets passwords. Change later admin credentials through a dedicated, secured account-management process.

## Manual UPI orders

Checkout requests an authoritative product/stock quote from the API, collects delivery details, and stores the order in the customer's account with `PAYMENT_REVIEW` status. Customers do not need to enter a UPI transaction reference; admins match the QR payment using the amount, submission time, and customer details. The customer-facing order page refreshes automatically while open.

In the admin dashboard's **Orders** section, verify each reference directly in the merchant's payment account before choosing **Verify payment & confirm**. Confirmation reserves product stock and starts a seven-day delivery estimate; the customer then sees **Order confirmed**. Admins can progress accepted orders through preparing, shipped, and delivered. Rejected payments are not automatically refunded, so handle any refund separately and contact the customer.

This is a manual review process, not an automatic bank/Razorpay verification. Never accept a payment based only on the customer's submitted reference or screenshot.

## Build and validation

- Frontend: `npm run lint`, `npm run build`, and `npm audit`.
- Backend: `npm test`, `npm run build`, and `npm audit` from `backend`.

Deploy only after CI/build checks pass, required environment variables are configured, HTTPS and database migrations are verified, and a production smoke test confirms the API health endpoint, storefront, sign-in, admin authorization, and image upload behavior.
