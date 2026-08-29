# 🩺 MediCare Connect — Hospital Appointment & Healthcare Management System

A comprehensive, full-stack modern healthcare web application built with **Next.js 16 (App Router)**, **Tailwind CSS**, **Node.js / Express 5.x**, and **MongoDB**. MediCare Connect bridges patients, certified doctors, and medical administrators into a single unified digital healthcare ecosystem.

---

## 🔗 Project Submission Details & Live Links

| Item | Details |
| :--- | :--- |
| **Live Site URL** | [https://assignment-10-medi-care-client.vercel.app](https://assignment-10-medi-care-client.vercel.app) |
| **Server API Live URL** | [https://assignment-10-medi-care-server.vercel.app](https://assignment-10-medi-care-server.vercel.app) |
| **GitHub Repository (Client)** | [Assignment-10-MediCare-Client](https://github.com/WakilIsrakAbir/Assignment-10-MediCare-Client) |
| **GitHub Repository (Server)** | [Assignment-10-MediCare-Server](https://github.com/WakilIsrakAbir/Assignment-10-MediCare-Server) |

### 🔑 Test Credentials (Admin / Doctor / Patient)

| Role | Email | Password | Access / Notes |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@medicare.com` | `admin123` | Full access to user management, doctor verification, payment records & analytics |
| **Doctor Specialist** | `sarah.johnson@medicare.com` | `Doctor@123` | Schedule management, appointment requests & digital prescriptions |
| **Patient** | `patient@medicare.com` | `Patient@123` | Specialist booking, Stripe consultation fee payments & review management |

---

## ✨ Key Features & Architecture

### 1. 🛡️ Authentication & Authorization
- **Multi-Method Auth:** Email/Password authentication and Google OAuth 2.0 (Firebase Popup) with automatic MongoDB profile synchronization.
- **Strong Validation:** Strict client & server-side password validation ($\ge 6$ characters, at least 1 number, at least 1 special character).
- **Role-Based Access Control (RBAC):** Dynamic role authorization ensuring Patients, Doctors, and Admins access their specific dashboard interfaces.
- **Secure JWT Sessions:** HTTP-only cookie and Bearer token synchronization with persistent storage.

### 2. 🔍 Doctor Directory & Smart Discovery
- **Advanced Search:** Real-time search across doctor names, medical specialties, clinical keywords, and hospital affiliations.
- **Multi-Field Sorting:** Sort specialists by highest patient rating, years of experience, or consultation fees.
- **Dynamic Pagination:** Server-side paginated queries on the Find Doctors page.
- **Layout Format Toggle (Optional Feature):** Switch between **Interactive Grid Cards** and **Structured Table View** seamlessly.

### 3. 💳 Stripe Payment Gateway Integration
- Secure Stripe payment modal for consultation fee settlement before confirming appointments.
- Real-time transaction ID generation and permanent logging in the database.

### 4. 📊 Role-Specific Dashboards

#### 👤 Patient Dashboard:
- **Overview:** Summary of upcoming appointments, consultation history, total payments, and reviews.
- **My Appointments (CRUD):** View booked visits, **Reschedule** date/time slots, and cancel appointments.
- **Payment History:** Complete record of paid consultations with Stripe transaction IDs and timestamps.
- **My Reviews (CRUD):** Add, **Edit**, and **Delete** star ratings and written testimonials for treated doctors.
- **Digital Prescriptions:** View and print doctor-issued prescriptions.

#### 👨‍⚕️ Doctor Dashboard:
- **Overview:** Real-time KPIs for total patients, today's visits, and patient review ratings.
- **Schedule Management (CRUD):** Add, update, and remove weekly consultation days and time slots.
- **Appointment Handling:** Accept or reject booking requests, and mark appointments as **Completed** (auto-navigates to prescription creation).
- **Digital Prescriptions (CRUD):** Create and update clinical prescriptions with medication dosage, frequency, and instructions.
- **Profile Management:** Update clinical qualifications, consultation fees, experience, and profile images.

#### 👑 Admin Dashboard (Analytics & Oversight):
- **Visual Analytics with Recharts:** Doctor performance ratings distribution, monthly appointment volume, patient trends, and revenue metrics.
- **User Management:** View all registered accounts, suspend/activate accounts, and delete users.
- **Doctor Verification:** Review new doctor applications, approve verified badges, or revoke status.
- **Appointment Monitoring:** Track status across all platform bookings in real-time.
- **Payment Records:** View and filter all Stripe transactions across the entire ecosystem.

### 5. 🎨 UI/UX & Design Highlights
- **Modern Design:** Curated healthcare palette with rich gradients, glassmorphism, and responsive layouts for Mobile, Tablet, and Desktop.
- **Framer Motion Animations:** Smooth staggered entrances on hero banners, specialty cards, and statistics.
- **Resilient Image Handling:** Automatic fallback avatars and `referrerPolicy="no-referrer"` for Google profile pictures.
- **Custom Loading & 404 Pages:** Medical-themed pulsing loading indicators and friendly custom 404 page.

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Frontend Framework** | Next.js 16.3 (React 19, App Router) |
| **Styling** | Tailwind CSS v4 |
| **Icons & UI** | Lucide React, Framer Motion |
| **Charts** | Recharts Data Visualization |
| **Authentication** | Firebase Auth SDK & JWT |
| **Payments** | Stripe.js & `@stripe/react-stripe-js` |
| **HTTP Client** | Axios (with token interceptors) |
| **Notifications** | React Hot Toast |
| **Deployment** | Vercel Serverless Platform |

---

## 📁 Project Structure

```
assignment-10-medicare-client/
├── public/
├── src/
│   ├── app/
│   │   ├── about/             # About Us Page
│   │   ├── contact/           # Contact & Support Page
│   │   ├── dashboard/
│   │   │   ├── admin/         # Admin Management Portal (Recharts, Users, Doctors, Payments)
│   │   │   ├── doctor/        # Doctor Portal (Schedule, Requests, Prescriptions)
│   │   │   └── patient/       # Patient Portal (Appointments, Payments, Reviews)
│   │   ├── doctors/
│   │   │   ├── [id]/          # Doctor Details & Booking Page
│   │   │   └── page.jsx       # Doctor Directory (Search, Sort, Layout Toggle, Pagination)
│   │   ├── login/             # Login Page (Email/Password + Google Login)
│   │   ├── register/          # Register Page (Validation & Roles)
│   │   ├── profile/           # User Profile Management
│   │   ├── not-found.jsx      # Custom 404 Error Page
│   │   ├── loading.jsx        # Global Route Loader
│   │   ├── layout.jsx         # Root Layout with Navbar & Footer
│   │   └── page.jsx           # Homepage with Hero, Featured Doctors, Stats, Reviews
│   ├── components/            # Reusable UI, Home, Booking & Layout Components
│   ├── context/               # AuthContext (JWT & Firebase Auth Sync)
│   ├── lib/                   # Firebase Client Configuration
│   └── services/              # Axios API Client Instance
├── .env.local                 # Environment Variables
└── package.json
```

---

## ⚙️ Environment Variables Setup

Create a `.env.local` file in the root of the client directory:

```env
NEXT_PUBLIC_API_URL=https://assignment-10-medi-care-server.vercel.app/api
NEXT_PUBLIC_BETTER_AUTH_URL=https://assignment-10-medi-care-server.vercel.app/api/better-auth
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51U7gXMF0VtnVe0v7a4sGoVStlae8faPtIBaukne8yhOI0nLGqVo4QsTRZoMcrRZzzww0f8woPF8NFSZJAyMBHhxL00FbeZOPxA

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAs2VFX8lYsz0kQV2lPPKqqMdVwqz7za8g
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=medicare-67ca9.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=medicare-67ca9
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=medicare-67ca9.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=354162516328
NEXT_PUBLIC_FIREBASE_APP_ID=1:354162516328:web:63a83a2e50cbe6640ab6dd
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-Q4EXYBMGZN
```

---

## 🚀 Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/WakilIsrakAbir/Assignment-10-MediCare-Client.git
   cd Assignment-10-MediCare-Client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---
