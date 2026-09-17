# Resume Builder

A full-stack **Resume Builder web application** that allows users to
create, manage, and export professional resumes through a simple web
interface.

The project uses a **Spring Boot + MongoDB backend** and a lightweight
**HTML/CSS/JavaScript frontend**. It also includes authentication, email
verification, image upload, resume templates, PDF import/export
functionality, and Razorpay payment integration.

------------------------------------------------------------------------

## 🚀 Features

### 🔐 Authentication & Security

-   User registration and login
-   JWT-based authentication
-   Email verification
-   Resend verification email
-   Forgot password flow
-   Reset password flow
-   Spring Security integration
-   Protected API endpoints

### 📄 Resume Management

-   Create a resume
-   Update resume information
-   View saved resumes
-   Delete resumes
-   Resume data stored in MongoDB
-   Resume templates
-   Resume import/export functionality

### 🖼️ Image Upload

-   Profile image upload
-   Cloudinary integration for image storage

### 💳 Payment

-   Razorpay payment integration
-   Payment controller and service
-   Payment information stored in MongoDB

### 🎨 Frontend

-   Login page
-   Registration page
-   Dashboard
-   Resume builder interface
-   Resume templates/plans page
-   Forgot password page
-   Reset password page
-   Responsive styling
-   JavaScript-based API integration

------------------------------------------------------------------------

## 🛠️ Tech Stack

### Backend

-   Java
-   Spring Boot
-   Spring Security
-   JWT
-   Spring Data MongoDB
-   Maven
-   Lombok
-   Cloudinary
-   Razorpay
-   SMTP / Brevo email service

### Frontend

-   HTML5
-   CSS3
-   JavaScript
-   Fetch/AJAX API communication
-   Local Storage for authentication/session data

### Database

-   MongoDB

------------------------------------------------------------------------

## 📁 Project Structure

``` text
ResumeBuilder/
└── resumebuilderapi/
    ├── src/
    │   └── main/
    │       └── java/
    │           └── com/jai/resumebuilderapi/
    │               ├── config/
    │               │   ├── CloudinaryConfig.java
    │               │   ├── MongoConfig.java
    │               │   └── SecurityConfig.java
    │               │
    │               ├── controller/
    │               │   ├── AuthController.java
    │               │   ├── EmailController.java
    │               │   ├── PaymentController.java
    │               │   ├── ResumeController.java
    │               │   ├── ResumeImportController.java
    │               │   └── TemplatesController.java
    │               │
    │               ├── document/
    │               │   ├── Payment.java
    │               │   ├── Resume.java
    │               │   └── User.java
    │               │
    │               ├── dto/
    │               │   ├── AuthResponse.java
    │               │   ├── CreateResumeRequest.java
    │               │   ├── LoginRequest.java
    │               │   ├── RegisterRequest.java
    │               │   └── ResendVerificationRequest.java
    │               │
    │               ├── exception/
    │               │   ├── GlobalExceptionHandler.java
    │               │   └── ResourceExistsException.java
    │               │
    │               ├── repository/
    │               │   ├── PaymentRepository.java
    │               │   ├── ResumeRepository.java
    │               │   └── UserRepository.java
    │               │
    │               ├── security/
    │               │   ├── JwtAuthenticationEntryPoint.java
    │               │   └── JwtAuthenticationFilter.java
    │               │
    │               ├── service/
    │               │   ├── AuthService.java
    │               │   ├── EmailService.java
    │               │   ├── FileUploadService.java
    │               │   ├── PaymentService.java
    │               │   ├── ResumeImportService.java
    │               │   ├── ResumeService.java
    │               │   └── TemplatesService.java
    │               │
    │               ├── util/
    │               │   ├── AppConstants.java
    │               │   └── JwtUtil.java
    │               │
    │               └── ResumebuilderapiApplication.java
    │
    ├── frontend/
    │   ├── css/
    │   │   ├── auth.css
    │   │   └── style.css
    │   │
    │   ├── js/
    │   │   ├── api.js
    │   │   ├── auth.js
    │   │   ├── dashboard.js
    │   │   ├── plans.js
    │   │   └── script.js
    │   │
    │   ├── dashboard.html
    │   ├── forgot-password.html
    │   ├── index.html
    │   ├── login.html
    │   ├── plans.html
    │   ├── register.html
    │   └── reset-password.html
    │
    ├── pom.xml
    ├── mvnw
    ├── mvnw.cmd
    └── HELP.md
```

------------------------------------------------------------------------

## ⚙️ Requirements

Before running the project, install:

-   Java JDK 17 or compatible version configured for the project
-   Maven (optional because Maven Wrapper is included)
-   MongoDB
-   Git
-   A modern web browser
-   IDE such as IntelliJ IDEA or VS Code

External services used by the application:

-   MongoDB
-   Cloudinary
-   Razorpay
-   Brevo/SMTP for email

------------------------------------------------------------------------

## 🔧 Backend Configuration

Create/update the application's configuration file with your local
credentials.

Example:

``` properties
server.port=8080

spring.data.mongodb.uri=mongodb://localhost:27017/resume-builder-v2

# JWT
jwt.secret=YOUR_JWT_SECRET
jwt.expiration=YOUR_JWT_EXPIRATION

# Cloudinary
cloudinary.cloud-name=YOUR_CLOUD_NAME
cloudinary.api-key=YOUR_API_KEY
cloudinary.api-secret=YOUR_API_SECRET

# Razorpay
razorpay.key.id=YOUR_RAZORPAY_KEY_ID
razorpay.key.secret=YOUR_RAZORPAY_KEY_SECRET

# SMTP / Brevo
spring.mail.host=smtp-relay.brevo.com
spring.mail.port=587
spring.mail.username=YOUR_SMTP_USERNAME
spring.mail.password=YOUR_SMTP_PASSWORD
```

**Important:** Never upload real passwords, JWT secrets, API secrets, or
payment keys to GitHub.

Use environment variables or a local configuration file that is excluded
from Git.

------------------------------------------------------------------------

## ▶️ Run the Backend

Open a terminal in the backend project folder:

``` bash
cd ResumeBuilder/resumebuilderapi
```

### Windows

``` bash
mvnw.cmd spring-boot:run
```

### Linux / macOS

``` bash
./mvnw spring-boot:run
```

Or run:

``` bash
mvn spring-boot:run
```

The backend will normally start on:

``` text
http://localhost:8080
```

------------------------------------------------------------------------

## 🌐 Run the Frontend

The frontend is located inside:

``` text
frontend/
```

You can open `index.html` with a browser or use a local development
server.

For VS Code, the **Live Server** extension can be used.

Example frontend pages:

``` text
index.html
login.html
register.html
dashboard.html
plans.html
forgot-password.html
reset-password.html
```

Make sure the JavaScript API configuration points to the running
backend:

``` javascript
const API_URL = "http://localhost:8080";
```

------------------------------------------------------------------------

## 🔑 Authentication Flow

The application uses JWT authentication.

Basic flow:

``` text
Register
   ↓
Email Verification
   ↓
Login
   ↓
JWT Token
   ↓
Store Token
   ↓
Send Token with Protected Requests
   ↓
Spring Security JWT Filter
   ↓
Authenticated User
```

The frontend uses the authentication token for protected API requests.

------------------------------------------------------------------------

## 🔌 Main Backend Modules

  Module                      Purpose
  --------------------------- ---------------------------------------------
  `AuthController`            Registration, login and authentication APIs
  `EmailController`           Email-related operations
  `ResumeController`          Resume CRUD operations
  `ResumeImportController`    Resume import functionality
  `TemplatesController`       Resume template operations
  `PaymentController`         Payment-related APIs
  `AuthService`               Authentication business logic
  `ResumeService`             Resume business logic
  `PaymentService`            Razorpay/payment business logic
  `EmailService`              Email sending
  `FileUploadService`         File/image upload
  `JwtUtil`                   JWT creation and validation
  `JwtAuthenticationFilter`   JWT request authentication
  `SecurityConfig`            Spring Security configuration

------------------------------------------------------------------------

## 🗄️ MongoDB Collections

The application contains MongoDB documents for:

-   `User`
-   `Resume`
-   `Payment`

Database example:

``` text
resume-builder-v2
```

------------------------------------------------------------------------

## 🧪 API Testing

You can test backend APIs using:

-   Postman
-   Browser
-   Frontend application

Typical authentication endpoints include:

``` text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-email
```

Other API routes are handled by the Resume, Payment, Email, Import, and
Templates controllers.

------------------------------------------------------------------------

## 🔒 Security

This project implements:

-   JWT authentication
-   Password encryption
-   Spring Security
-   Protected API routes
-   Authentication filter
-   Authentication entry point
-   Email verification
-   Secure external-service credentials

### Never commit secrets

Do not commit:

``` text
JWT secret
MongoDB production password
Cloudinary API secret
Razorpay secret
SMTP password
```

Add sensitive local configuration to `.gitignore` where appropriate.

------------------------------------------------------------------------

## 🚀 Future Improvements

Possible future enhancements:

-   Multiple professional resume templates
-   Drag-and-drop resume sections
-   Live resume preview
-   AI-powered resume suggestions
-   AI job description matching
-   Resume download as PDF
-   User profile management
-   Admin dashboard
-   Cloud deployment
-   Automated CI/CD
-   Improved mobile responsiveness

------------------------------------------------------------------------

## 📸 Application Pages

The project includes:

-   Home page
-   Login
-   Registration
-   Dashboard
-   Resume builder
-   Resume templates
-   Plans/payment page
-   Forgot password
-   Reset password

------------------------------------------------------------------------

## 👨‍💻 Author

**Jai Agrawal**

B.Tech IT Student

GitHub: `jaiagrawal2004`

------------------------------------------------------------------------

## 📜 License

This project is created for educational, portfolio, and learning
purposes.

------------------------------------------------------------------------

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on
GitHub.
