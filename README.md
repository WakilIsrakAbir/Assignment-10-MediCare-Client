# 🩺 MediCare Connect — Hospital Appointment & Healthcare Management System

A modern, responsive, and feature-rich full-stack healthcare web application built with **Next.js 16 (App Router)**, **Tailwind CSS**, and **Express / MongoDB**.

---

## 🌟 Live Demo & Source Code
- **Client Repository:** [GitHub Client](https://github.com/WakilIsrakAbir/Assignment-10-MediCare-Client)
- **Server Repository:** [GitHub Server](https://github.com/WakilIsrakAbir/Assignment-10-MediCare-Server)

---

## 🚀 Key Features & Highlights

### 1. User & Role Management
- **Role-Based Access:** Dedicated interfaces and workflows for **Patients**, **Doctors**, and **Administrators**.
- **Authentication & Security:** Email/Password registration with strict password strength validation ($\ge 6$ characters, at least 1 number, at least 1 special character), Google OAuth Sign-in, and persistent JWT sessions.

### 2. Specialist Discovery & Booking
- **Advanced Search & Filtering:** Find doctors by name, clinical department, hospital affiliation, and consultation fees.
- **Sorting & Pagination:** Sort by highest patient ratings, clinical experience, or consultation fee.
- **Interactive Scheduling:** Real-time day and slot selection for doctor consultations.

### 3. Patient & Doctor Portals
- **Patient Dashboard:** View upcoming appointments, consultation history, payment logs, and doctor reviews.
- **Doctor Dashboard:** Manage consultation schedule, view patient requests, update profile details, and issue prescriptions.
- **Admin Dashboard:** Platform analytics, verification of doctor credentials, and user management.

### 4. Rich Healthcare UI/UX
- **Smooth Animations:** Framer Motion transitions across hero banners and dynamic counter statistics.
- **Custom Error & Loading Pages:** Medical-themed pulsing loaders and friendly custom 404 page.
- **Responsive Layout:** Optimized for mobile screens, tablets, and desktop devices.
- **Interactive Toasts:** Real-time feedback with `react-hot-toast`.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 16 (React 19, App Router)
- **Styling:** Tailwind CSS (Modern inline utilities)
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Authentication:** Firebase Client & JWT Integration
- **HTTP Client:** Axios with bearer interceptors

### Backend
- **Framework:** Node.js & Express.js 5.x
- **Database:** MongoDB & Mongoose ODM
- **Security:** JSON Web Tokens (JWT), Bcrypt.js, Cookie-Parser, CORS

---

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/WakilIsrakAbir/Assignment-10-MediCare-Client.git
cd Assignment-10-MediCare-Client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 📄 Pages & Route Structure
- `/` — Homepage (Hero banner, featured specialists, clinical departments, live stats, patient testimonials, benefits)
- `/doctors` — Specialist directory with search, filter, sort, and pagination
- `/doctors/[id]` — Doctor profile and appointment scheduling
- `/about` — Platform mission and quality standards
- `/contact` — 24/7 support and medical inquiry desk
- `/login` — User sign-in with JWT and Google OAuth
- `/register` — Account creation with strong password validation
- `/dashboard` — Role-based dashboard overview and appointments
- `/profile` — Personal profile and contact information settings
- `/_not-found` — Custom 404 error page

---

## 🛡️ License
ISC License © MediCare Connect
