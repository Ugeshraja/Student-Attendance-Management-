# EduTrack - Student Attendance Management System

> "Smart Attendance, Smarter Education."

EduTrack is a modern, responsive, and secure Student Attendance Management System designed for schools. The application features a premium light-themed UI utilizing glassmorphism and soft UI accents, a clean Spring Boot REST API backend with JWT authentication, and a MySQL database.

---

## Folder Structure

```text
edutrack/
├── database/
│   └── schema.sql                  # MySQL database schema and seed data
├── edutrack-backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/edutrack/
│   │   │   │   ├── config/         # Security configs and MVC setups
│   │   │   │   ├── controller/     # REST controllers for Auth, Profiles, etc.
│   │   │   │   ├── dto/            # Data Transfer Objects
│   │   │   │   ├── entity/         # JPA Entity classes (User, Student, etc.)
│   │   │   │   ├── exception/      # Exceptions & Global Exception Handler
│   │   │   │   ├── mapper/         # Entity to DTO Conversion Mappers
│   │   │   │   ├── repository/     # Spring Data JPA Repositories
│   │   │   │   ├── security/       # JWT tokens, Auth Filters, User Details
│   │   │   │   ├── service/        # Business Logic Service Interfaces
│   │   │   │   ├── serviceImpl/    # Business Logic Service Implementations
│   │   │   │   └── EduTrackApplication.java # Application main launcher
│   │   │   └── resources/
│   │   │       └── application.properties # Main backend configurations
│   └── pom.xml                     # Maven project configuration file
├── edutrack-frontend/
│   ├── src/
│   │   ├── assets/                 # Icons and image placeholders
│   │   ├── components/
│   │   │   ├── Common/             # Sidebar, Navbar, Logo, Guard Route
│   │   │   └── Layouts/            # Main layout wrapper
│   │   ├── pages/
│   │   │   ├── Teacher/            # Attendance, Students, Reports, profile
│   │   │   ├── Student/            # Student dashboard, personal profile
│   │   │   ├── LandingPage.jsx     # Marketing home section
│   │   │   ├── LoginPage.jsx       # Auth sign-in card
│   │   │   ├── NotFoundPage.jsx    # Custom 404 page
│   │   │   └── ServerErrorPage.jsx # Custom 500 page
│   │   ├── services/
│   │   │   └── api.js              # Axios instance setup with JWT interceptor
│   │   ├── App.jsx                 # Routing configuration
│   │   ├── index.css               # Main premium stylesheet
│   │   └── main.jsx                # React DOM entry point
│   ├── .env                        # Environment variables configurations
│   ├── package.json                # Frontend packages lists
│   └── vite.config.js              # Vite configuration
├── .gitignore                      # Root git ignore
├── LICENSE                         # Project license (MIT)
└── README.md                       # Complete documentation guide
```

---

## Core Features

- **Teacher Roles**:
  - Add, Edit, Delete, and Search Student profiles.
  - Load Class & Section attendance sheets dynamically.
  - Submit or edit daily attendance (Present, Absent, Leave) with custom remarks.
  - Compile class-wise and student-wise reports over custom date ranges.
  - Export reports as CSV, Excel sheet spreadsheets, or print as a clean PDF layout.
- **Student Roles**:
  - View personal profile details.
  - Track overall attendance percentage rates.
  - Monitor counts for Present, Absent, and Leave logs.
  - View monthly attendance graphs and history charts.
  - Export personal attendance statements.
- **Shared Features**:
  - Update profile details and change account passwords securely.
  - Upload profile avatars.
  - JWT token security.
  - Soft light theme with Glassmorphic visual card effects.

---

## Installation & Local Execution Guide

### Prerequisites
- Java 21 JDK
- Maven 3.x
- Node.js 18+ & npm
- MySQL Server 8.x

### 1. Database Setup
1. Open your MySQL client and run:
   ```sql
   CREATE DATABASE edutrack_db;
   ```
2. The schema structure and seed data will be automatically created on the backend's first startup via Hibernate's `ddl-auto=update` and a custom seeder runner.
3. If you prefer to seed manually, execute the query script located inside the [schema.sql](file:///C:/Users/ugesh/.gemini/antigravity/scratch/edutrack/database/schema.sql) file.

### 2. Backend Startup
1. Navigate to the backend directory:
   ```bash
   cd edutrack-backend
   ```
2. Update database credentials inside [application.properties](file:///C:/Users/ugesh/.gemini/antigravity/scratch/edutrack/edutrack-backend/src/main/resources/application.properties) or set environment variables:
   ```properties
   spring.datasource.username=YOUR_MYSQL_USERNAME
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   The backend API will start on `http://localhost:8080/api`.

### 3. Frontend Startup
1. Navigate to the frontend directory:
   ```bash
   cd edutrack-frontend
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Make sure the API base URL is set correctly in the [.env](file:///C:/Users/ugesh/.gemini/antigravity/scratch/edutrack/edutrack-frontend/.env) file:
   ```text
   VITE_API_BASE_URL=http://localhost:8080/api
   ```
4. Run the local development server:
   ```bash
   npm run dev
   ```
   The application will start on `http://localhost:5173`.

---

## Live Deployment Guide

### 1. Deploy MySQL Cloud Database (e.g. Railway or Aiven)
1. Provision a new MySQL instance on your cloud host.
2. Note your database credentials connection string (`mysql://user:password@host:port/database`).
3. Formulate the JDBC connection URL:
   `jdbc:mysql://host:port/database?useSSL=false&allowPublicKeyRetrieval=true`

### 2. Deploy Backend on Render
1. Create a **Web Service** on Render and connect your GitHub Repository.
2. Select environment runtime **Docker** or **Java** (Render natively supports Java web builds).
3. Build Command: `mvn clean package -DskipTests`
4. Start Command: `java -jar target/edutrack-backend-0.0.1-SNAPSHOT.jar`
5. Configure the following **Environment Variables**:
   - `DB_URL`: JDBC url of your cloud database.
   - `DB_USERNAME`: Database username.
   - `DB_PASSWORD`: Database password.
   - `JWT_SECRET`: Base64 encoded key (e.g., `9a67471ec97303e3874d1a10052b6d194914c62c3e1e626e2e50587b1c312781`).
   - `JWT_EXPIRATION`: `86400000` (24 Hours in milliseconds).
   - `PORT`: `8080` (Render will override this dynamically).
   - `FRONTEND_URL`: URL of your deployed Vercel frontend (e.g. `https://edutrack.vercel.app`).
6. Deploy the Web Service.

### 3. Deploy Frontend on Vercel
1. Select new project on Vercel and connect your GitHub Repository.
2. Set root directory path to: `edutrack-frontend`.
3. Choose framework preset: **Vite**.
4. Configure Build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Configure **Environment Variables**:
   - `VITE_API_BASE_URL`: URL of your deployed Render service (e.g. `https://edutrack-backend.onrender.com/api`).
6. Deploy.

---

## API Documentation

### 1. Authentication
- **POST** `/auth/login`
  - Payload: `{ "username": "teacher1", "password": "Password123", "role": "TEACHER" }`
  - Returns: JWT session details, usernames, role, name, profilePicture, class/section mappings.

### 2. Metadata
- **GET** `/metadata/classes`
  - Returns: List of all classes (id, name).
- **GET** `/metadata/sections`
  - Returns: List of all sections (id, name).

### 3. Teacher Controls
- **GET** `/teacher/dashboard/stats`
  - Returns: Counts (total students, present, absent, leaves today), attendance percentage, recent logs.
- **GET** `/teacher/students`
  - Returns: List of student profiles managed by the teacher.
- **POST** `/teacher/students`
  - Payload: Complete student directory object (rollNumber, name, gender, classId, sectionId, email, parentName, parentMobile, username, password).
- **PUT** `/teacher/students/{id}`
  - Payload: Updated student details.
- **DELETE** `/teacher/students/{id}`
  - Deletes student directory record and user login credentials.
- **GET** `/teacher/students/search?query=nameOrRoll`
  - Returns: Filtered list of students matching query criteria.

### 4. Attendance
- **GET** `/attendance?classId=1&sectionId=1&date=2026-06-27`
  - Returns: Student attendance sheet for specific class, section and date.
- **POST** `/attendance`
  - Payload: `{ "classId": 1, "sectionId": 1, "date": "2026-06-27", "records": [{ "studentId": 1, "status": "PRESENT", "remarks": "On Time" }] }`
  - Updates or creates daily attendance records.
- **GET** `/attendance/student/stats`
  - Returns: Personal stats breakdown for logged-in student.
- **GET** `/attendance/student/history`
  - Returns: Historical list of attendance logs for logged-in student.

### 5. Reports
- **GET** `/reports/class?classId=1&sectionId=1&startDate=2026-06-01&endDate=2026-06-27`
  - Returns: Class-wise summaries and attendance logs for date range.
- **GET** `/reports/student/{id}?startDate=2026-06-01&endDate=2026-06-27`
  - Returns: Specific student-wise attendance logs for date range.

### 6. Profile
- **GET** `/profile/me`
  - Returns: Logged-in user profile details (Student/Teacher).
- **PUT** `/profile/me`
  - Payload: Update details object (name, email, phone / parentName, parentMobile, address).
- **PUT** `/profile/change-password`
  - Payload: `{ "oldPassword": "...", "newPassword": "..." }`
- **POST** `/profile/picture`
  - Multipart Request: `file`
  - Returns: Static path of uploaded picture URL.
