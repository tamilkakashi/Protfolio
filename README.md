# Tamilarasan M — Developer Portfolio

A responsive portfolio focused on backend and full-stack development.

## Profile

MCA graduate (2026) with a backend-focused MERN stack background and three months of experience as a Backend Developer Intern at MoviCloud Labs. Interested in entry-level Backend Developer and Full-Stack Developer roles.

## Tech stack

- **Backend:** Node.js, Express.js, REST APIs
- **Data:** MongoDB, Mongoose
- **Frontend:** React, JavaScript, HTML, CSS
- **Workflow:** Git, GitHub, npm

## Featured projects

### MediFind Nearby API

A Node.js, Express and MongoDB API concept for finding clinics, hospitals and pharmacies by city, type or geographic proximity. Includes geospatial search, filtering, pagination, query validation, error handling, rate limiting, and environment-based configuration.

- [Browse source code](./MediFind-Nearby-API)
- Demo records are fictional and unverified. This is a portfolio project, not a medical directory or emergency service.

### Banking App Prototype

A learning prototype exploring account registration, data views, deposits and withdrawals with a React client and a separate Express/MongoDB server.

- [Frontend source](https://github.com/tamilkakashi/Bank-Client)
- Prototype only; not suitable for real financial data. The backend requires credential rotation and stronger authentication/authorization before it should be treated as secure.

## Portfolio structure

- `index.html` — portfolio homepage
- `asset/css/pt1.css` — responsive layout and design system
- `asset/js/script.js` — navigation, email-copy interaction and current year
- `asset/resume/resume.html` — résumé page with print-to-PDF support
- `MediFind-Nearby-API/` — sample backend API project

## Run the portfolio locally

Because the site uses relative assets, serve the repository root with a local static server, for example VS Code Live Server. Open `index.html` in the browser through that server.

## Notes

- The résumé page avoids publishing a residential address; review all résumé content and dates before sending it to an employer.
- Environment files such as `.env` should never be committed. The MediFind API uses `.env.example` as a template and expects a local `.env` file for credentials.
- This repository presents project work honestly; it does not claim production deployment or automated tests that have not been verified.
