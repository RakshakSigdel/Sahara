# EchoMind — AI Voice Cognitive Screening Platform

> A modern, accessible web application for voice-based cognitive health screening using AI analysis.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/          # Navbar, Footer, MobileTabBar, PageContainer
│   ├── ui/              # Reusable: Button, Input, Card, Badge, etc.
│   ├── shared/          # Cross-feature components
│   └── features/        # Feature-specific components
│       ├── screening/   # Recording controls, waveform, prompts
│       └── results/     # Risk indicator, markers
├── contexts/
│   ├── AuthContext.jsx       # Auth state & mock login/signup
│   ├── ThemeContext.jsx      # Dark mode & accessibility
│   └── ScreeningContext.jsx  # Screening flow state
├── pages/
│   ├── LandingPage.jsx       # Public landing (10 sections)
│   ├── DashboardPage.jsx     # User dashboard with charts
│   ├── HistoryPage.jsx       # Test history timeline
│   ├── ProfilePage.jsx       # 4-tab profile settings
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   └── ResetPasswordPage.jsx
│   ├── screening/
│   │   ├── ConsentPage.jsx
│   │   ├── TestSelectionPage.jsx
│   │   ├── RecordingPage.jsx
│   │   ├── ProcessingPage.jsx
│   │   └── ResultsPage.jsx
│   └── learn/
│       └── LearnHubPage.jsx  # 6-tab educational content
├── styles/
│   └── globals.css           # Base resets
├── utils/
│   ├── cn.js                 # classnames utility
│   ├── api.js                # Mock API functions
│   └── performance.js        # Debounce, throttle utilities
├── App.jsx                   # Routing with lazy loading
├── main.jsx                  # Entry point with providers
└── index.css                 # Tailwind v4 + theme tokens
```

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#0A7C7C` (Deep Teal) |
| Secondary | `#A8D5B5` (Sage) |
| Accent | `#E07A5F` (Coral) |
| Text Primary | `#1A2E35` (Navy Dark) |
| Font UI | Inter |
| Font Data | JetBrains Mono |

## 🛠 Tech Stack

- **React 19** + Vite
- **Tailwind CSS v4** (with `@theme` tokens)
- **Framer Motion** — page transitions, animations
- **Recharts** — dashboard & history charts
- **Lucide React** — icon system
- **react-hook-form** — form validation
- **react-router-dom** — client-side routing

## 📄 Route Map

| Route | Page | Auth | Chrome |
|-------|------|------|--------|
| `/` | Landing | Public | ✅ |
| `/learn` | Learn Hub | Public | ✅ |
| `/auth/login` | Login | Public | ❌ |
| `/auth/signup` | Signup | Public | ❌ |
| `/auth/forgot-password` | Forgot Password | Public | ❌ |
| `/auth/reset-password` | Reset Password | Public | ❌ |
| `/dashboard` | Dashboard | Protected | ✅ |
| `/history` | Test History | Protected | ✅ |
| `/profile` | Profile Settings | Protected | ✅ |
| `/screen/consent` | Consent | Protected | ❌ |
| `/screen/select` | Test Selection | Protected | ✅ |
| `/screen/record` | Recording | Protected | ❌ |
| `/screen/processing` | AI Processing | Protected | ❌ |
| `/screen/results` | Results | Protected | ✅ |

## 🔧 Environment Variables

```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_APPLE_CLIENT_ID=your-apple-client-id
```

## 📋 Key Features

- **Voice Screening Flow** — Consent → Select Test → Record → AI Processing → Results
- **Canvas Waveform** — 56-bar real-time audio visualizer
- **Animated Risk Ring** — SVG progress ring with score display
- **Educational Hub** — 6 tabs covering dementia stages, statistics, prevention
- **Score Tracking** — Recharts area chart with historical trend
- **4-Tab Profile** — Personal info, preferences, privacy, notifications
- **Responsive** — Mobile-first with MobileTabBar navigation
- **Accessibility** — Keyboard nav, screen reader optimizations, reduce-motion support

## 📄 License

MIT
