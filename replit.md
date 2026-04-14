# S International Travel Platform

## Overview

Full-stack travel booking platform built with React + Vite frontend and Express backend. Covers flights, hotels, holiday packages, authentication, bookings, payments, and contact.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui + framer-motion + Zustand
- **Backend**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Routing**: Wouter
- **Build**: esbuild (CJS bundle for API)

## Artifacts

- `artifacts/s-international` — React + Vite frontend (served at `/`)
- `artifacts/api-server` — Express API server (served at `/api`)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Pages

- `/` — Home with hero search, offers, destinations, testimonials
- `/flights` — Flight search with filters and results
- `/hotels` — Hotel search with filters and listing cards
- `/holidays` — Holiday package browsing with filters
- `/contact` — Contact form with FAQ and office info
- `/login` — User login
- `/signup` — User registration
- `/bookings` — Protected user bookings page
- `/checkout` — Booking checkout review
- `/payment` — Payment method selection and processing
- `/confirmation` — Booking confirmation

## API Endpoints

- `POST /api/auth/signup` — Register new user
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout
- `GET /api/auth/session` — Get current session
- `GET /api/flights/search` — Search flights
- `GET /api/hotels/search` — Search hotels
- `GET /api/holidays/search` — Search holiday packages
- `POST /api/bookings` — Create booking
- `GET /api/bookings` — Get user bookings
- `GET /api/bookings/:id` — Get booking by ID
- `POST /api/payments/process` — Process payment
- `POST /api/contact` — Submit contact inquiry
- `GET /api/offers` — Featured offers
- `GET /api/destinations/popular` — Popular destinations
- `GET /api/testimonials` — Customer testimonials

## Data

All travel data is in `artifacts/api-server/src/data/` (flights, hotels, holidays, offers, destinations, testimonials). Easily replaceable with real APIs.

## Database Schema

- `users` — registered users
- `sessions` — auth sessions
- `bookings` — user bookings
- `contact_inquiries` — contact form submissions
