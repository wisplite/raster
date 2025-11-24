## Raster: A Simple and Powerful Self-Hosted Media Gallery

Raster is a free and open-source photo/video management solution, with a focus on simplicity where it matters.

## Why Raster?
I started developing Raster because I found the other self-hosted galleries either lacking in features or difficult to install and maintain.

I wanted a solution that was:
- Lightweight and easy to run
- Simple, clean UI
- Had albums, content tags, and descriptions
- Public albums for showcasing work
- Private shared albums with multi-user uploads
- Comments and likes in shared albums
- Proper panorama/large image support
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
Currently supports:
- Creating albums
- Uploading/viewing images
- Protected root user and anon/guest account

Features needed before v1 release:
- Image metadata editing
- Album editing
- Album thumbnails
- Video support
- Image/Album deleting
- User access management
- Mobile support

Planned features for v2:
- Auto-tiling for large images
- Comments and liking
- Image tags
- Smart image search
- Extremely granular configuration
- S3/Cloud bucket storage backend

## Contributing
Issues and PRs are welcome.