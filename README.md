# SwiftRide Backend 

A production-grade ride-hailing backend with an integrated **Safety Routing Engine** — built with Node.js, PostgreSQL, PostGIS, Redis, WebSockets, and BullMQ.

> SwiftRide is not an ride hailing app. It extends the core ride-hailing platform with a crowd-sourced safety routing system that scores routes based on user reviews, nearby police stations, hospitals, and crime-prone areas — helping riders choose between the fastest and safest route.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Express.js | Widely used, excellent ecosystem |
| Database | PostgreSQL + PostGIS | Relational + geospatial queries in one DB |
| ORM | Prisma | Type-safe, clean schema, auto-generated client |
| Cache & Pub/Sub | Redis | Token storage, real-time events, job queue |
| Job Queue | BullMQ | Recurring surge pricing calculation |
| Real-Time | WebSockets (ws) | Live driver location push to rider |
| File Storage | Cloudinary | KYC document storage with 5MB limit |
| Route Planning | OpenRouteService API | Real route options with distance and duration |
| Validation | Zod | Schema-based request validation |
| Auth | JWT (Access + Refresh tokens) | Stateless, role-based authentication |
| Deployment | Railway | One-click deploy with managed PostgreSQL |

---

## Features

### Core Modules
- **Authentication & RBAC** — JWT access (15min) + refresh (7d) tokens, bcrypt password hashing, role-based middleware (RIDER, DRIVER, ADMIN, SUPER_ADMIN)
- **Driver KYC Verification** — Real file upload to Cloudinary, KYC state machine (PENDING → APPROVED/REJECTED), admin review queue
- **Geospatial Driver Matching** — PostGIS ST_DWithin radius queries, finds nearest 5 verified online drivers within 5km, auto-expands to 10km if none found
- **Ride Lifecycle State Machine** — Enforced state transitions (REQUESTED → ACCEPTED → DRIVER_ARRIVING → IN_PROGRESS → COMPLETED), invalid transitions rejected at service layer
- **Real-Time Location Tracking** — WebSocket connections identified by JWT auth, driver location updates pushed to rider instantly without polling
- **Surge Pricing Engine** — BullMQ job runs every 5 minutes, calculates demand/supply ratio per zone, applies 1.5x/2.0x/3.0x multipliers, cached in Redis
- **Fare Calculation** — PostGIS ST_Distance for accurate distance, duration tracking, surge multiplier applied: `(baseFare + perKm × distance + perMin × duration) × surge`
- **Ratings System** — 24-hour rating window after ride completion, rolling average updated on user profile, prevents duplicate ratings
- **Admin Panel** — User management with ban/unban, KYC review queue, analytics (revenue, active drivers, completed rides, average fare)

### Safety Routing Engine (Unique Feature)
- Riders choose between **Fastest Route** or **Safest Route** before requesting a ride
- Safety score calculated from:
  - Crowd-sourced user safety ratings from past rides in the area (50% weight)
  - Nearby police stations and hospitals via OpenRouteService Places API (30% weight)
  - Historical incident reports from user reviews (20% weight)
- Routes classified as 🟢 GREEN (7-10), 🟡 YELLOW (4-7), 🔴 RED (0-4)
- Real route data (distance, duration) from OpenRouteService Directions API
- Safety scores improve over time as more users submit reviews

---

## Architecture

```
Client (Postman / Mobile App)
        │
        ├── HTTP REST API (Express.js)
        │       ├── Auth & RBAC (JWT + Zod validation)
        │       ├── KYC (Cloudinary file upload)
        │       ├── Ride State Machine
        │       ├── Safety Routing (ORS API)
        │       └── Admin Panel
        │
        ├── WebSocket Server (ws)
        │       └── Real-time driver location → rider
        │
        └── Background Jobs (BullMQ + Redis)
                └── Surge pricing every 5 minutes

PostgreSQL + PostGIS
        ├── User, Driver, Ride, Rating tables
        ├── ST_DWithin — driver radius search
        └── ST_Distance — fare calculation

Redis
        ├── WebSocket client registry (Map)
        └── BullMQ job queue storage
```

---

## Database Schema

| Table | Purpose |
|-------|---------|
| User | All users — riders, drivers, admins |
| Driver | Driver profile, KYC status, online status |
| KycDocument | Uploaded documents with Cloudinary URLs |
| DriverLocation | Real-time driver coordinates (PostGIS) |
| Ride | Complete ride record with state, fare, safety score |
| Rating | Post-ride ratings with 24hr window |
| SurgeZone | Surge multiplier per zone, updated every 5 mins |

---

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register user |
| POST | /api/auth/login | Public | Login |
| POST | /api/auth/refresh | Public | Refresh access token |
| GET | /api/auth/me | Authenticated | Get current user |

### KYC
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/kyc/upload | Driver | Upload KYC document (real file) |
| GET | /api/kyc/my-docs | Driver | Get my documents |
| POST | /api/kyc/review | Admin | Approve or reject document |

### Location
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| PATCH | /api/location/update | Driver | Update driver location |
| GET | /api/location/nearest | Rider | Find nearest drivers |
| PATCH | /api/location/online | Driver | Go online |
| PATCH | /api/location/offline | Driver | Go offline |

### Rides
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/ride/request | Rider | Request a ride (FASTEST or SAFEST) |
| PATCH | /api/ride/accept | Driver | Accept ride |
| PATCH | /api/ride/start | Driver | Start ride |
| PATCH | /api/ride/complete | Driver | Complete ride (calculates fare) |
| GET | /api/ride/history | Rider/Driver | View ride history |

### Safety
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/safety/score | Rider | Get route options with safety scores |

### Surge
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/surge/:zoneId | Authenticated | Get surge zone data |
| PATCH | /api/surge/:zoneId | Admin | Manually override surge multiplier |

### Ratings
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/rating/submit | Rider/Driver | Submit post-ride rating |

### Admin
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/admin/users | Admin | Get all users with role filter |
| PATCH | /api/admin/ban/:userId | Admin | Ban user |
| PATCH | /api/admin/unban/:userId | Admin | Unban user |
| GET | /api/admin/analytics | Admin | Revenue, rides, active drivers |

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- Docker (for PostgreSQL with PostGIS and Redis)
- Cloudinary account (free)
- OpenRouteService API key (free)

### 1. Clone the repository
```bash
git clone https://github.com/Vaishnavii-23/SwiftRide-Backend.git
cd SwiftRide-Backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start PostgreSQL with PostGIS and Redis using Docker
```bash
docker run -d --name postgis -p 5433:5432 -e POSTGRES_PASSWORD=password -e POSTGRES_DB=swiftride postgis/postgis
docker run -d --name redis -p 6379:6379 redis
```

### 4. Enable PostGIS extension
```bash
docker exec -it postgis psql -U postgres -d swiftride -c "CREATE EXTENSION IF NOT EXISTS postgis;"
```

### 5. Configure environment variables
```bash
cp .env.example .env
```
Fill in your values in `.env`

### 6. Run database migrations
```bash
npx prisma migrate dev
```

### 7. Start the server
```bash
node src/server.js
```

Server runs on `http://localhost:3000`

---

## Environment Variables

```env
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5433/swiftride
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_strong_secret
JWT_REFRESH_SECRET=your_strong_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ORS_API_KEY=your_ors_key
```

---

## Key Engineering Decisions

**Why PostGIS over storing lat/lng?**
ST_DWithin performs radius queries in a single indexed SQL call. Storing plain coordinates requires fetching all drivers and calculating distance in application code — O(n) vs O(log n).

**Why separate accessToken and refreshToken?**
Short-lived access tokens (15min) limit the damage if stolen. Refresh tokens (7d) allow seamless renewal without re-authentication. Two separate secrets mean a compromised access secret doesn't invalidate refresh tokens.

**Why BullMQ for surge pricing?**
Surge calculation is expensive — querying ride counts and driver counts every request would be wasteful. BullMQ runs it as a background job every 5 minutes and caches the result. Every fare calculation reads from cache, not the database.

**Why WebSockets over polling?**
Polling location every 3 seconds from 1000 concurrent riders = 333 requests/second of unnecessary load. WebSockets maintain persistent connections and push updates only when location changes.

**Why the Safety Routing Engine?**
Standard ride-hailing apps optimize only for speed. SwiftRide adds a safety layer — particularly valuable for women travelling alone at night. Safety scores are crowd-sourced and improve over time, creating a network effect where more users = more accurate scores.

---

## Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT secrets generated with `crypto.randomBytes(64)`
- Helmet.js removes fingerprinting headers
- Rate limiting: 100 requests per 15 minutes per IP
- Zod validation on all incoming requests
- KYC files validated by type and size (max 5MB) before Cloudinary upload
- RBAC enforced at middleware layer — not just controller
- `.env` excluded from git via `.gitignore`
