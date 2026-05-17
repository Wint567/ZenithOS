# ZenithOS

Premium frontend-only SaaS admin dashboard built with Next.js 15, TypeScript, Tailwind CSS, Zustand, Framer Motion, Recharts, and Lucide React.

ZenithOS is designed as a portfolio-grade SaaS product experience. It includes a marketing site, authentication flows, an executive dashboard, management views, analytics, billing, settings, realtime simulation, command navigation, notifications, and an AI assistant without requiring a backend.

## Screenshots

Recommended portfolio screenshots:

- `/` - premium marketing landing page with animated dashboard preview
- `/dashboard` - executive command center with KPIs, charts, onboarding, realtime activity, and AI recommendations
- `/orders` - advanced table, filters, pagination, order modal, timeline
- `/analytics` - revenue intelligence and customer growth charts
- `/billing` - subscription, usage, invoices, and payment methods
- Mobile viewport - bottom navigation, responsive cards, mobile overlays

## Features

- Premium marketing landing page with hero, dashboard preview, trusted companies, features, pricing, testimonials, FAQ, CTA, and footer
- Authentication pages for login, register, forgot password, and reset password
- Dashboard with KPI cards, revenue charts, onboarding progress, recent activity, realtime feed, and AI recommendations
- Orders management with search, status filters, sorting, pagination, empty state, modal, and event timeline
- Users management with avatars, roles, statuses, profile drawer, activity history, and security timeline
- Products page with inventory cards, stock indicators, hover motion, and preview modal
- Analytics page with Recharts visualizations for revenue, customers, acquisition, and conversion
- Billing page with current plan, usage statistics, invoices, payment methods, and upgrade comparison
- Settings page with profile, appearance, notifications, security, and connected accounts
- Zustand-powered theme, command palette, sidebar, onboarding, notifications, realtime activity, and toast state
- Advanced command palette with navigation, quick actions, theme switching, users, orders, keyboard selection, and highlighted matches
- Notification dropdown with unread counter, grouped notifications, animated stacking, and mark-all-read
- Fake realtime event simulation for orders, users, payments, security, and system alerts
- Floating Zenith AI assistant with mock recommendations and chat-style interface
- Responsive app shell with desktop sidebar, collapsible groups, workspace switcher, mobile drawer, and bottom navigation
- Frontend-only fake API layer using Promise delays and local mock data

## Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Zustand
- Framer Motion
- Recharts
- Lucide React

## Architecture

```txt
src/
  app/                 Next.js routes, route groups, layouts, global styles
  shared/ui/           Reusable design-system primitives
  features/            Cross-page product features
  widgets/             Page-level composed interfaces
  layouts/             Application shell and navigation layout
  store/               Zustand global UI/product state
  hooks/               Reusable client hooks
  lib/                 Utility functions
  mock/                Mock data and fake async APIs
  types/               Shared domain types
```

The architecture separates primitives, features, widgets, and routes so the project can scale like a real product. UI primitives stay generic. Features own product behavior such as auth, command palette, notifications, realtime, theme, and AI assistant. Widgets compose complete page experiences. Mock APIs keep the project frontend-only while still allowing loading states and realistic async flows.

## Setup

```bash
npm install
npm run dev
```

Open:

```bash
http://localhost:3000
```

## Production Build

```bash
npm run build
npm run typecheck
```

The application is statically buildable and does not require environment variables, databases, servers, or external backend services.

## Deployment

Deploy directly to Vercel:

1. Push the repository to GitHub.
2. Import the repository in Vercel.
3. Use the default Next.js framework settings.
4. Build command: `npm run build`
5. Output: managed by Next.js/Vercel.

## Lighthouse Targets

Expected targets for the portfolio deployment:

- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

Actual scores should be measured after deployment because they depend on hosting, network conditions, and screenshot/media choices.

## Frontend-Only Data Model

ZenithOS intentionally avoids backend dependencies. Data comes from:

- `src/mock/data.ts` for realistic business entities and metrics
- `src/mock/api.ts` for fake async requests
- `localStorage` through Zustand persistence for UI preferences
- interval-based realtime simulation for live notifications and activity

No SQL, Prisma, Firebase, Supabase, Express, NestJS, or backend server is used.

## Keyboard Shortcuts

- `Cmd/Ctrl + K` - open command palette
- `/` - open global search
- `Esc` - close overlays
- `G` then `D` - dashboard
- `G` then `O` - orders
- `G` then `U` - users
- `G` then `P` - products
- `G` then `A` - analytics
- `G` then `B` - billing
- `G` then `S` - settings

## Why It Works As A Portfolio Project

ZenithOS demonstrates senior frontend skills across architecture, product UX, visual design, typed state, responsive systems, fake async infrastructure, dashboards, data visualization, overlays, command UX, realtime simulation, and production polish. It feels like a funded SaaS product because the interface is cohesive, animated with restraint, data-rich, keyboard-friendly, and alive with simulated operational events.
