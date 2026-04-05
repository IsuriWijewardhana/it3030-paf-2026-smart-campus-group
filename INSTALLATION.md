# Learning Management System - Installation Guide

This guide provides detailed instructions for setting up the Learning Management System (LMS) on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Java Development Kit (JDK) 17 or higher**
   - Verify installation: `java -version`
   - [Download JDK](https://adoptium.net/en-GB/temurin/releases/?version=17)

2. **Node.js and npm**
   - Verify installation: `node -v` and `npm -v`
   - [Download Node.js](https://nodejs.org/en/download)

3. **MongoDB Community Server**
   - Verify installation: `mongod --version`
   - [Download MongoDB](https://www.mongodb.com/try/download/community)
   - Ensure MongoDB service is running

4. **Git** (for cloning the repository)
   - Verify installation: `git --version`
   - [Download Git](https://git-scm.com/downloads)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Yashini-Hettiarachchi/LMS.git
cd LMS
```

### 2. Set Up the Backend

1. Navigate to the backend directory:
   ```bash
   cd demo
   ```

2. Build the project using Maven wrapper:
   ```bash
   ./mvnw clean install
   ```

3. Start the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

4. The backend server will start on port 8089. Verify it's running by accessing:
   - http://localhost:8089/api/v1/courses/getall

### 3. Set Up the Frontend

1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. The React application will automatically open in your default browser at:
   - http://localhost:3000

## Configuration

### Database Configuration

The application is configured to connect to MongoDB at localhost:27017. If your MongoDB is running on a different host or port, update the following file:

- `demo/src/main/resources/application.properties`

```properties
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017
spring.data.mongodb.database=exercise
```

### Backend Port Configuration

If you need to change the backend port (default: 8089), update:

- `demo/src/main/resources/application.properties`

```properties
server.port=8089
```

### Frontend API URL Configuration

If you change the backend port, you'll need to update the API URL in the frontend:

- Update the API_URL constant in each component that makes API calls

## Troubleshooting

### Common Issues

1. **MongoDB Connection Issues**:
   - Ensure MongoDB is running: `sc query mongodb` (Windows) or `systemctl status mongodb` (Linux)
   - Check MongoDB logs for errors

2. **Backend Won't Start**:
   - Verify Java version is 17+: `java -version`
   - Check if port 8089 is already in use: `netstat -ano | findstr 8089` (Windows) or `lsof -i:8089` (Linux)

3. **Frontend Issues**:
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check browser console for errors

4. **CORS Issues**:
   - The backend is configured to allow cross-origin requests from any origin
   - If you're experiencing CORS issues, check the network tab in browser developer tools

## Next Steps

After installation, you can:

1. Register a new user account
2. Log in with your credentials
3. Create, view, edit, and delete courses
4. Explore the various features of the LMS

For more information, refer to the [README.md](README.md) file.
