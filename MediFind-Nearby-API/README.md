# MediFind Nearby API

A backend-focused REST API for finding nearby clinics, hospitals, and pharmacies. Built with Node.js, Express, and MongoDB, with geospatial search and a small, reproducible demo dataset.

> This is an educational portfolio project. It is not a medical service, does not verify real facilities, and must not be used for emergency decisions.

## Features

- Facility search by city, type, and name
- Geospatial “near me” search using MongoDB's 2dsphere index
- Paginated results with a bounded page size
- Input validation and consistent JSON errors
- Helmet security headers, request rate limiting, and configurable CORS
- Environment-based database configuration; no credentials committed
- Seed script with clearly fictional demo records

## Requirements

- Node.js 20 or later
- MongoDB running locally or a MongoDB Atlas connection string

## Run locally

From the root of the cloned repository:

```bash
cd MediFind-Nearby-API
npm install
```

Copy `.env.example` to `.env` and configure `MONGODB_URI`. Never commit your real `.env` file.

Start the API:

```bash
npm run dev
```

In another terminal, add demo records:

```bash
npm run seed
```

Health check: [http://localhost:5000/api/health](http://localhost:5000/api/health)

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Check whether the API process is responding |
| GET | `/api/facilities` | List facilities; supports `city`, `type`, `search`, `page`, and `limit` |
| GET | `/api/facilities/nearby?lat=11.94&lng=79.49&radiusKm=10` | Find facilities near a coordinate |
| GET | `/api/facilities/:id` | Fetch one facility by MongoDB ID |

Facility types: `clinic`, `hospital`, `pharmacy`.

Example:

```bash
curl "http://localhost:5000/api/facilities?city=Villupuram&type=pharmacy"
curl "http://localhost:5000/api/facilities/nearby?lat=11.94&lng=79.49&radiusKm=15"
```

Coordinates use latitude and longitude in decimal degrees. The nearby endpoint caps the search radius at 100 km.

## Data model

A facility includes a name, type, address, city, state, phone number, opening-hours text, a GeoJSON point, and a demo verification flag. The seed data is invented sample data; it does not represent confirmed businesses.

## Project structure

```
MediFind-Nearby-API/
├── server.js
├── src/
│   ├── config/db.js
│   ├── controllers/facilityController.js
│   ├── middleware/errorHandler.js
│   ├── models/Facility.js
│   └── routes/facilities.js
├── scripts/seed.js
├── .env.example
├── .gitignore
└── package.json
```

## Security notes

- No credentials should be stored in source control.
- Public read endpoints are rate-limited, but this project has no admin/authentication workflow.
- Do not put patient records or other sensitive personal data into this demo.
- Before production use, add authentication and authorization for management actions, stronger monitoring, automated tests, and privacy/legal review.

## Next improvements

1. Add API tests and CI.
2. Add admin authentication and facility-management endpoints.
3. Add a React frontend with map and distance sorting.
4. Add facility verification and freshness timestamps.
