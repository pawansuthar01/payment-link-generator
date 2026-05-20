# Payment Link App

Minimal Vite + React app with a tiny Express backend to create Razorpay Payment Links.

Setup:

1. Install dependencies (root + client):

```bash
npm install
cd client && npm install
```

2. Copy `.env.example` to `.env` and fill your Razorpay keys:

```bash
cp .env.example .env
# edit .env and set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
```

3. Run frontend and backend together (dev) from project root:

```bash
npm run dev:full
```

APIs (backend):
- `POST /api/create-link` — forwards body to Razorpay Payment Links API
- `GET /api/link/:id` — fetch link details
