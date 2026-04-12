# 🎓 Guidely — Career Mentorship Platform

<div align="center">

![Guidely Banner](https://img.shields.io/badge/Guidely-Career%20Mentorship-6366f1?style=for-the-badge&logo=graduation-cap&logoColor=white)

**Connect with world-class mentors. Transform your career.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Test Credentials](#test-credentials)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)

---

## 🌟 Overview

**Guidely** is a full-stack career mentorship platform that connects aspiring developers, designers, and career-switchers with verified, world-class mentors from top companies (Google, Stripe, Meta, Netflix, and more).

The platform enables:
- 🔍 Discovering and browsing verified mentors by skill, company, and role
- 📅 Booking 1-on-1 video sessions, code reviews, and portfolio reviews
- 🎥 Conducting HD video meetings directly in the browser — no downloads required
- 📊 Tracking mentorship progress and session history
- 🛡️ Admin tools for platform management and moderation

---

## 🚀 Live Demo

> **Production:** [https://guidely-client.vercel.app](https://guidely-client.vercel.app)

---

## 🔐 Test Credentials

Use these credentials to explore the platform without registering a new account.

> [!IMPORTANT]
> These are demo accounts for testing purposes only. Please do not change the passwords.

### 👑 Admin Account
```
Email:    sabbir53rahman@gmail.com
Password: 12345678
```
**Access:** Full platform management — user moderation, mentor verification, analytics, and admin dashboard.

---

### 🧑‍🏫 Mentor Account
```
Email:    asif@gmail.com
Password: 12345678
```
**Access:** Mentor dashboard — manage profile, availability, sessions, and earnings.

---

### 🎓 Student Account
```
Email:    najirvai@gmail.com
Password: 12345678
```
**Access:** Student dashboard — browse mentors, book sessions, track progress, and manage bookings.

---

## ✨ Features

### 🏠 Landing Page
- Animated hero section with mentor showcase
- "How It Works" interactive 3-step timeline
- Embedded HD video meeting preview
- Marquee-style testimonials wall with career before/after stories
- Upcoming group workshops (coming soon teaser with waitlist)
- Comparison table: Guidely vs. Online Courses vs. YouTube
- Glassmorphic FAQ accordion
- Final CTA with social proof stats

### 👤 Authentication
- Role-based registration (Student / Mentor)
- JWT-based authentication with secure cookie storage
- Protected routes via Next.js middleware

### 🎓 Student Portal
- Browse and filter mentors by skill, company, and rating
- Book 1-on-1 sessions with real-time availability
- Session history and upcoming bookings dashboard
- Profile management

### 🧑‍🏫 Mentor Portal
- Create and manage detailed mentor profile
- Set availability and pricing
- Review and manage session requests
- Track earnings and student reviews

### 👑 Admin Portal
- Platform-wide user management (view, block, delete)
- Mentor verification dashboard
- Session oversight and analytics

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com) + [Base UI](https://base-ui.com) |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org) |
| **Forms** | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| **Icons** | [Lucide React](https://lucide.dev) |
| **HTTP Client** | [Axios](https://axios-http.com) |
| **Auth** | JWT via HTTP-only cookies |
| **Deployment** | [Vercel](https://vercel.com) |
| **Package Manager** | [pnpm](https://pnpm.io) |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (admin)/          # Admin dashboard routes
│   ├── (auth)/           # Login & registration pages
│   ├── (mentor)/         # Mentor portal routes
│   ├── (student)/        # Student portal routes
│   ├── about/            # About page
│   ├── mentors/          # Public mentor listing & profiles
│   ├── globals.css       # Global styles & CSS variables
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/
│   ├── landing/          # Landing page sections
│   ├── layout/           # Navbar, Footer
│   └── ui/               # Reusable UI components (shadcn)
├── constants/            # App-wide constants
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions & configs
├── middleware/           # Route middleware helpers
├── redux/                # Redux store, slices, API services
├── types/                # TypeScript type definitions
├── utils/                # Helper utilities
└── middleware.ts         # Next.js route protection middleware
```

---

## 🏃 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sabbir53rahman/Guidely-Client.git
cd Guidely-Client

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your values (see Environment Variables section)

# 4. Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🔧 Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

---

## 📦 Available Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

---

## 🚢 Deployment

This project is deployed on **Vercel**. To deploy your own instance:

1. Push the repository to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Add environment variables in the Vercel dashboard
4. Deploy!

> [!NOTE]
> Video files in `/public` require the custom headers configured in `next.config.ts` to stream correctly on Vercel's CDN edge.

---

<div align="center">

Built with ❤️ by **Sabbir Rahman**

</div>
# LuxeLiving_client
