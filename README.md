# Full-Stack MERN Authentication Flow

This project is a complete MERN (MongoDB, Express, React, Node.js) stack application demonstrating a comprehensive authentication system. It includes user registration with OTP verification, login (email/password and Google OAuth), protected routes, and a secure password reset functionality.

## Features ✨

- **User Registration**: Sign up with name, email, and password.
- **OTP Verification**: New accounts are verified via a 6-digit code sent to their email.
- **Email/Password Login**: Standard credential-based login.
- **Google OAuth 2.0 Login**: Secure one-click login using Google accounts.
- **Protected Routes**: Client-side and server-side route protection using JSON Web Tokens (JWT).
- **Password Reset**: Secure "Forgot Password" flow using unique, expiring tokens sent via email.
- **Global Auth State**: React Context API is used for managing authentication state across the app.
- **Responsive UI**: Built with Vite, React, and styled with Tailwind CSS.

---

## Tech Stack 🛠️

- **Frontend**: React, React Router, Tailwind CSS, Axios, Vite
- **Backend**: Node.js, Express.js, MongoDB (with Mongoose)
- **Authentication**: JWT, Passport.js (for Google OAuth), bcryptjs
- **Emailing**: Nodemailer

---

## Getting Started 🚀

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local instance or a cloud service like MongoDB Atlas)
- A Google account for setting up OAuth credentials.
- An email account (like Gmail) for sending OTP and password reset emails.

### Setup Instructions

#### 1. Clone the Repository

```bash
git clone <repository_url>
cd authentication-flow