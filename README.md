# Smart Campus Facilities & Assets Catalogue

A full-stack web application for managing facilities/assets with social collaboration features such as likes, comments, follows, and notifications.

## Project Overview

This system provides:
- User registration and login
- Facilities and assets catalogue CRUD
- Entry visibility (public/private)
- Catalogue filtering and search (including Location/Capacity text filters in UI)
- Profile pages, follow/unfollow, notifications, likes, and comments

## Tech Stack

- Backend: Spring Boot (Java 17)
- Frontend: React (Create React App)
- Database: MongoDB
- Auth: Custom JWT-based flow

## Repository Structure

- `demo/` - Spring Boot backend
- `frontend/` - React frontend

## Prerequisites

- JDK 17+
- Node.js and npm
- MongoDB Community Server

Recommended:
- MongoDB Compass
- VS Code Java Extension Pack
- VS Code Spring Boot tools

## Run Locally

### 1. Start MongoDB

Ensure MongoDB is running locally on `localhost:27017`.

### 2. Start Backend

From project root:

```bash
cd demo
./mvnw spring-boot:run
```

Windows (PowerShell/CMD):

```powershell
cd demo
.\mvnw.cmd spring-boot:run
```

Backend default port: `8089`

### 3. Start Frontend

From project root:

```bash
cd frontend
npm install
npm start
```

Frontend default URL: `http://localhost:3000`

## Build Commands

Backend:

```bash
cd demo
./mvnw clean package
```

Frontend:

```bash
cd frontend
npm run build
```

## Key Features

### Facilities & Assets Catalogue

- Create, view, edit, and delete catalogue entries
- Track status, details/specifications, and related documents
- Public/private sharing of entries
- Search bar and filters for Location and Capacity (client-side)

### User & Social Features

- Register/login users
- Profile management
- Follow/unfollow users
- Like and comment on catalogue entries
- Notification support

## Main API Areas

Authentication:
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

Catalogue (LearningPlan module):
- `POST /api/v1/learning-plans/save`
- `GET /api/v1/learning-plans/getall`
- `GET /api/v1/learning-plans/public`
- `GET /api/v1/learning-plans/{id}`
- `PUT /api/v1/learning-plans/edit/{id}`
- `DELETE /api/v1/learning-plans/delete/{id}`
- `GET /api/v1/learning-plans/user/{userId}`

Additional modules exist for comments, likes, follows, profiles, and notifications under `/api/v1/*`.

## Configuration

Backend config file:
- `demo/src/main/resources/application.properties`

Common settings:
- MongoDB host/port/database
- Server port (`server.port=8089`)

Frontend API base URL:
- Components use `REACT_APP_API_URL` when available, otherwise fallback to local defaults.

## Notes

- Do not compile the Spring Boot app using single-file `javac` commands. Always run with Maven wrapper (`mvnw`/`mvnw.cmd`) so dependencies are resolved.
- CRA-related lint warnings may appear during frontend builds; they do not block production build output unless configured as errors.
