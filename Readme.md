# 🚀 Business Nexus — Investor & Entrepreneur Collaboration Platform

A full-featured collaboration platform connecting investors with entrepreneurs. Built as part of an Advanced Frontend Internship on top of the base Nexus repository.

**Live Demo:** [nexus-sigma-self.vercel.app](https://nexus-sigma-self.vercel.app)

---

## 📋 Project Overview

Business Nexus is a React + TypeScript + Tailwind CSS platform that enables investors to discover promising startups and entrepreneurs to connect with the right investors — all in one place.

---

## ✅ Completed Milestones

### Week 1 — Setup & Scheduling

**Milestone 1: Setup & Theme**
- Forked and configured the base Nexus repository
- Established a consistent UI theme: violet/purple primary, amber secondary, teal accent
- Dot-grid background pattern, glass navbar, responsive layout

**Milestone 2: Meeting Scheduling Calendar**
- Full calendar grid with month navigation
- Add/modify availability slots
- Send, accept, and decline meeting requests
- Confirmed meetings displayed on dashboard

---

### Week 2 — Video Calling & Documents

**Milestone 3: Video Calling Section**
- Pre-call screen with participant selection
- Active call UI: mute, camera toggle, screen share, chat panel, participants panel
- Picture-in-Picture (PiP) floating widget — draggable with snap-to-corner
- Global `CallContext` managing call state across the app

**Milestone 4: Document Processing Chamber**
- Drag-and-drop file upload zone
- Real PDF preview via iframe
- E-signature pad (draw or type)
- Status labels: Draft / In Review / Signed
- Search and filter by document status

---

### Week 3 — Payments, Security & Polish

**Milestone 5: Payment Section**
- Mock payment UI styled like Stripe/PayPal
- Deposit, Withdraw, Transfer, and Fund Deal flows (simulation)
- Transaction history table with amount, sender, receiver, status
- Wallet balance widget on both dashboards
- Funding deal flow: Investor → Entrepreneur

**Milestone 6: Security & Access Control**
- Password strength meter (Weak / Fair / Strong)
- Multi-step 2FA setup modal: choose method → setup → OTP verification
- Three 2FA methods: Authenticator App, SMS, Email
- Backup codes panel with reveal, copy, and regenerate
- Trusted devices management with remove button
- Login activity table with success/failed/blocked status
- Security score card (live, updates as features are enabled)
- Role-based UI: separate dashboards and navigation for Investors vs Entrepreneurs

**Milestone 7: Integration & Demo Prep**
- All modules accessible via sidebar navigation
- Custom guided walkthrough tooltip system (no external library)
  - Separate 12-step tours for Investor and Entrepreneur roles
  - Dark overlay with violet spotlight ring highlighting each element
  - Progress bar, step counter, skip/back/next controls
- Responsive mobile sidebar with hamburger menu and drawer
- Purple branded favicon

---

## 🧩 Tech Stack

| Technology | Usage |
|---|---|
| React 18 | UI framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| React Router v6 | Navigation |
| Lucide React | Icons |
| Vite | Build tool |
| Vercel | Deployment |

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── layout/          # Navbar, Sidebar, DashboardLayout
│   ├── tour/            # TourTooltip (guided walkthrough)
│   ├── call/            # FloatingCallWidget
│   └── ui/              # Button, Card, Badge, Input, Avatar
├── context/
│   ├── AuthContext.tsx
│   ├── CallContext.tsx
│   ├── PaymentContext.tsx
│   ├── TwoFactorContext.tsx
│   └── WalkthroughContext.tsx
├── data/
│   ├── users.ts
│   ├── messages.ts
│   ├── payments.ts
│   └── tourSteps.ts
└── pages/
    ├── auth/            # Login, Register
    ├── dashboard/       # EntrepreneurDashboard, InvestorDashboard
    ├── calendar/        # CalendarPage
    ├── videocall/       # VideoCallPage
    ├── documentchamber/ # DocumentChamber
    ├── messages/        # MessagesPage
    ├── payments/        # PaymentsPage
    ├── security/        # SecurityPage
    ├── deals/           # DealsPage
    └── ...
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/nexus-business.git

# Navigate into the project
cd nexus-business

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

---

## 🔐 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Investor | investor@nexus.com | password |
| Entrepreneur | entrepreneur@nexus.com | password |

> All payment and 2FA features are simulations — no real transactions or SMS are sent.

---

## 📱 Responsive Design

The platform is fully responsive:
- **Desktop** — full sidebar + content layout
- **Mobile** — collapsible drawer sidebar via floating hamburger button
- All pages tested at 375px, 768px, and 1280px breakpoints

---

## 👩‍💻 Developed By

**Ayesha** — Frontend Intern  
Advanced Frontend Internship — Nexus Platform  
Deadline: 25 May 2026

---

## 📄 License

Based on the [Nexus base repository](https://github.com/Asakusa-k/Nexus). All enhancements built during internship.