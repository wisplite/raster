## Raster: A Simple and Powerful Self-Hosted Photo/Video Management Solution

Raster is a free and open-source photo/video management solution, with a focus on simplicity where it matters.

## Why Raster?
I started developing Raster because I found the other self-hosted galleries either lacking in features or difficult to install and maintain.

I wanted a solution that was:
- Lightweight and easy to run
- Simple, clean UI
- Albums, content tags, and descriptions
- Public albums for showcasing work
- Private shared albums with multi-user uploads
- Comments and likes in shared albums
- Proper panorama support
- Modern tech stack

## Quick start

As of this moment, Raster is VERY early in development, and as such production builds are not ready yet. The instructions below are for testing and development. Do not use Raster for production until more progress has been made.

Backend (API):
```bash
cd backend
go run ./cmd/server
# Server runs on http://localhost:8080
# A SQLite database (raster.db) will be created automatically in the backend directory.
```

Frontend (web app):
```bash
cd frontend
npm i
npm run dev
# App runs on http://localhost:5173
```

## Project structure
- `backend/`: Go API using Gin + GORM (SQLite default)
- `frontend/`: React app (Vite, Tailwind)

## Status
In early development. Expect rapid updates.

## Contributing
Issues and PRs are welcome.