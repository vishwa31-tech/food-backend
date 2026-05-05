# Server

## Setup

1. Create `server/.env` (or update the existing one) and set:
   - `MONGODB_URI`
   - `CLIENT_URL` (default: `http://localhost:5173`)
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
2. Install deps: `npm install`
3. Run: `npm run dev`

## Payment API

- `POST /api/payments/razorpay/order` creates a Mongo order (`paymentStatus=pending`) + Razorpay order.
- `POST /api/payments/razorpay/verify` verifies the signature and updates the Mongo order (`paymentStatus=paid|failed`).

