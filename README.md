# 🏠 ZameenClone — MERN Real Estate Portal (Vercel-ready)

A full-stack property marketplace inspired by [Zameen.com](https://www.zameen.com), built on the **MERN** stack (MongoDB, Express, React, Node.js) and configured to deploy on **Vercel** as a single project (static React frontend + serverless Express API).

> Demo project — not affiliated with Zameen.com. Listing photos are royalty-free images from Unsplash.

---

## ✨ Features

- **20 seeded property listings** across Lahore, Karachi, Islamabad & Rawalpindi
- **Search & filters** — keyword, city, type, purpose (buy/rent), price range, bedrooms, sorting, pagination
- **Property detail pages** with image gallery, amenities, specs and agent contact
- **JWT authentication** — register/login as a buyer/renter or an agent
- **Agent dashboard** — post, edit and delete listings
- **Favorites**, **agent profiles**, **profile editing**
- Responsive, Zameen-style green UI

## 🧱 Tech Stack

| Layer    | Technology                                      |
|----------|-------------------------------------------------|
| Frontend | React 18 (Vite), React Router, Axios, plain CSS |
| Backend  | Node.js, Express (runs as a Vercel function)    |
| Database | MongoDB + Mongoose (MongoDB Atlas for prod)     |
| Auth     | JWT + bcryptjs                                  |
| Hosting  | Vercel                                          |

---

## 📁 Structure

```
zameen-clone/
├── api/
│   └── index.js          # Vercel serverless entry — wraps the Express app
├── backend/
│   ├── app.js            # Express app (routes + middleware) — no listen()
│   ├── server.js         # Local dev server (app.listen)
│   ├── config/db.js      # Cached Mongo connection (serverless-safe)
│   ├── models/           # User, Property
│   ├── controllers/      # auth, property, user logic
│   ├── routes/           # auth, properties, users, seed
│   ├── middleware/auth.js
│   └── seed/
│       ├── seedData.js   # reusable seedDatabase() + the 20 listings
│       └── seed.js       # CLI: npm run seed
├── frontend/             # Vite React app (builds to frontend/dist)
├── vercel.json           # build + routing config
├── package.json          # root: API deps + build script
└── .vercelignore
```

How routing works on Vercel: `vercel.json` builds the frontend to `frontend/dist` and serves it statically; requests to `/api/*` are rewritten to the serverless function in `api/index.js`; all other paths fall back to `index.html` for client-side routing.

---

## 🚀 Deploy to Vercel

### 1. Create a MongoDB Atlas database (free tier)
1. Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free **M0** cluster.
2. **Database Access** → add a user (username + password).
3. **Network Access** → add IP `0.0.0.0/0` (allow from anywhere — Vercel uses dynamic IPs).
4. **Connect → Drivers** → copy the connection string, e.g.
   `mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/zameen_clone?retryWrites=true&w=majority`
   (add `/zameen_clone` before the `?` so it uses that database).

### 2. Push the project to GitHub
```bash
cd zameen-clone
git init && git add . && git commit -m "ZameenClone MERN"
git branch -M main
git remote add origin https://github.com/<you>/zameen-clone.git
git push -u origin main
```

### 3. Import into Vercel
1. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
2. Leave the build settings as detected (they come from `vercel.json` — **don't** set a root directory).
3. Add **Environment Variables**:

   | Key           | Value                                            |
   |---------------|--------------------------------------------------|
   | `MONGO_URI`   | your Atlas connection string                     |
   | `JWT_SECRET`  | any long random string                           |
   | `SEED_SECRET` | any random string (used once to load demo data)  |

4. Click **Deploy**.

### 4. Seed the production database (once)
After the first deploy, populate the 20 listings + demo users by calling the protected seed endpoint:
```bash
curl -X POST "https://<your-app>.vercel.app/api/seed?secret=<SEED_SECRET>"
```
You should get `{"message":"Database seeded","properties":20,...}`. Visit your site — listings appear.
(You can instead seed locally; see below. The endpoint wipes and reloads the demo data, so remove `SEED_SECRET` afterwards if you like.)

> **Tip:** You can also deploy from the CLI: `npm i -g vercel && vercel`. Set the env vars with `vercel env add`.

---

## 💻 Run Locally

### Prerequisites
- Node.js 18+
- MongoDB running locally **or** an Atlas connection string

### Backend
```bash
cd backend
npm install
cp .env.example .env        # set MONGO_URI, JWT_SECRET
npm run seed                # loads 20 properties + demo users
npm run dev                 # API on http://localhost:5000
```

### Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev                 # app on http://localhost:5173
```
Vite proxies `/api` → `http://localhost:5000` automatically. Open **http://localhost:5173**.

---

## 🔑 Demo Accounts
Password for all accounts: **`password123`**

| Role  | Email                 |
|-------|-----------------------|
| Agent | imran@zameenclone.pk  |
| Agent | ayesha@zameenclone.pk |
| Agent | bilal@zameenclone.pk  |
| User  | user@zameenclone.pk   |

Log in as an **agent** to post/edit/delete listings; as a **user** to save favorites; or register a new account.

---

## 🔌 API Reference

| Method | Endpoint                              | Auth        | Description                |
|--------|---------------------------------------|-------------|----------------------------|
| POST   | `/api/auth/register`                  | —           | Register                   |
| POST   | `/api/auth/login`                     | —           | Login                      |
| GET    | `/api/auth/me`                        | Bearer      | Current user               |
| GET    | `/api/properties`                     | —           | List + filters/search      |
| GET    | `/api/properties/:id`                 | —           | Single property            |
| POST   | `/api/properties`                     | Agent       | Create listing             |
| PUT    | `/api/properties/:id`                 | Owner/Admin | Update listing             |
| DELETE | `/api/properties/:id`                 | Owner/Admin | Delete listing             |
| GET    | `/api/users/:id`                      | —           | Public agent profile       |
| PUT    | `/api/users/profile`                  | Bearer      | Update own profile         |
| GET    | `/api/users/me/listings`              | Bearer      | My listings                |
| GET    | `/api/users/me/favorites`             | Bearer      | My favorites               |
| POST   | `/api/users/me/favorites/:propertyId` | Bearer      | Toggle favorite            |
| POST   | `/api/seed?secret=...`                | Seed secret | (Re)seed the demo data     |

**Query params for `/api/properties`:** `q, city, type, purpose, minPrice, maxPrice, bedrooms, sort (newest|priceAsc|priceDesc), page, limit, featured, agent`

---

## 🧪 Tests
`backend/_test.mjs` spins up an in-memory MongoDB and exercises the full API (seed, filters, sort, auth, favorites, role guards, CRUD):
```bash
cd backend && npm install && npm test
```

## 📝 Notes
- Re-run `npm run seed` (or hit `/api/seed`) anytime to reset the database.
- The serverless DB connection is cached across invocations (`backend/config/db.js`) to avoid exhausting Atlas connections.
