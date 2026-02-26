# Production Deployment Guide: Render

Follow these steps to deploy the Prayer Realm backend to production on Render.

## 1. Prerequisites
- A [Render](https://render.com) account.
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (Render does not provide a managed MongoDB service).
- Your code must be pushed to a GitHub/GitLab/Bitbucket repository.

## 2. MongoDB Atlas Setup
1. Create a new cluster on MongoDB Atlas.
2. Create a database user (username/password).
3. In **Network Access**, allow access from "Anywhere" (0.0.0.0/0) or better yet, use the IP addresses Render provides (requires Render paid tier).
4. Get your connection string: `mongodb+srv://<username>:<password>@cluster.mongodb.net/prayerrealm?retryWrites=true&w=majority`.

## 3. Create Render Web Service
1. Log in to your Render Dashboard.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. **Configuration Settings:**
   - **Name:** `prayer-realm-api` (or your choice).
   - **Environment:** `Node`.
   - **Region:** Choose the one closest to your users.
   - **Branch:** `main` (or your production branch).
   - **Root Directory:** `server` (CRITICAL: Since your backend is in the `/server` folder).
   - **Build Command:** `npm install && npm run build`.
   - **Start Command:** `npm start`.

## 4. Environment Variables
In the Render dashboard under your service, go to **Environment** and add all variables from `.env.example`:

| Key | Value (Example) |
| --- | --- |
| `NODE_ENV` | `production` |
| `PORT` | `10000` (Render's default) |
| `MONGODB_URI` | `your_mongodb_atlas_connection_string` |
| `JWT_ACCESS_SECRET` | `generate_a_long_random_string` |
| `JWT_REFRESH_SECRET` | `generate_another_long_random_string` |
| `JWT_ACCESS_EXPIRATION` | `15m` |
| `JWT_REFRESH_EXPIRATION` | `7d` |
| `OPENAI_API_KEY` | `your_openai_key` |
| `PAYSTACK_SECRET_KEY` | `your_live_paystack_key` |
| `PAYSTACK_WEBHOOK_SECRET` | `your_paystack_webhook_hash` |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` |

## 5. Webhook Configuration
- Take your Render service URL (e.g., `https://prayer-realm-api.onrender.com`).
- Go to your Paystack/PayPal dashboard.
- Set the Webhook URL to: `https://prayer-realm-api.onrender.com/api/donations/paystack/webhook`.

## 6. Logs & Health Check
- Monitor the **Logs** tab on Render to ensure the server starts correctly.
- The health check endpoint is: `https://your-app.onrender.com/health`.
