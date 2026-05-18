# ZenithOS

ZenithOS is a premium frontend-only SaaS operating system prototype built with Next.js 15, TypeScript, Tailwind CSS, Zustand, Framer Motion, Recharts, Lucide React, and Playwright.

The project is designed as a senior-level frontend portfolio showcase: it simulates a believable SaaS product without a backend, using typed mock data, localStorage persistence, fake async APIs, realtime-style events, operational audit history, command UX, analytics, integrations, and polished responsive UI.

## What It Demonstrates

- Production-inspired Next.js App Router architecture
- Typed frontend domain modeling for users, orders, products, invoices, integrations, audit events, dashboard widgets, notifications, and AI history
- Reusable UI primitives and a documented `/design-system`
- Persisted Zustand stores for session, theme, sidebar, onboarding, workspace state, table preferences, dashboard layout, integrations, and AI messages
- Enterprise-style table interactions: selection, bulk actions, density, column visibility, keyboard navigation, export, and mobile card mode
- Deep entity routes for `/orders/[id]`, `/users/[id]`, `/products/[id]`, and `/billing/invoices/[id]`
- Dashboard personalization with persisted widgets, presets, resizing, drag-to-reorder, and accessible fallback controls
- Operational realism through audit logs, notifications, integration sync logs, contextual Zenith AI, and connected entity relationships
- Interaction-focused Playwright E2E tests across desktop and mobile Chromium emulation

## Screenshots To Capture

Recommended portfolio screenshots:

- `/` - marketing landing page and animated analytics preview
- `/dashboard` - customizable executive dashboard
- `/orders` - enterprise table with bulk actions
- `/audit` - operational audit log
- `/integrations` - marketplace connect/sync flows
- `/analytics` - interactive analytics dashboard
- `/design-system` - internal design system reference
- Mobile `/dashboard`, `/orders`, and `/integrations` - responsive shell, bottom navigation, and touch layouts

## Core Features

- Marketing landing page with hero, analytics preview, pricing, testimonials, FAQ, CTA, responsive navigation, and footer
- Auth pages for login, register, forgot password, and reset password with validation, loading states, and password strength
- Fake route protection with persisted demo session
- Dashboard with KPI cards, revenue charts, audit activity, onboarding, realtime activity, AI recommendations, dashboard presets, widget visibility, widget sizing, and drag-to-reorder
- Orders with search, filters, pagination, reusable enterprise table, row selection, bulk status mutation, CSV/JSON export, mobile cards, and detail routes
- Users with roles, statuses, invite flow, profile drawer, role mutation, security timeline, and full detail route
- Products with inventory cards, create/edit flow, stock state, preview modal, and full detail route
- Analytics with date range, segment filtering, metric overlays, previous-period comparison, annotations, legends, hover tooltips, and snapshot export
- Billing with plan state, usage, invoices, payment methods, invoice detail routes, and invoice export
- Audit logs with search, severity filter, date grouping, export, event details, and enterprise table behavior
- Integrations marketplace for Slack, GitHub, Stripe, Discord, Notion, Linear, and Zapier with permission modal, connect/disconnect, sync logs, notifications, and audit events
- Command palette with keyboard open, search, navigation, quick actions, integration sync, exports, and theme switching
- Zenith AI assistant with route-aware context, persisted AI history, recommendations, and action buttons
- Notification dropdown and toast system with animated UI and persisted notification state
- Dark/light theme system with semantic tokens and a refined light mode

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Zustand
- Framer Motion
- Recharts
- Lucide React
- Playwright

## Architecture

```txt
src/
  app/                 App Router pages, route groups, layouts, global styles
  shared/ui/           Reusable primitives: Button, Input, Modal, Drawer, Table, Tabs, etc.
  features/            Cross-page product systems: auth, command palette, notifications, realtime, theme, AI
  widgets/             Page-level composed experiences
  layouts/             App shell, sidebar, topbar, mobile navigation
  store/               Zustand UI and workspace stores
  hooks/               Reusable hooks
  lib/                 Utilities such as formatting and browser exports
  mock/                Mock data and fake async APIs
  types/               Shared typed domain models
tests/e2e/             Playwright interaction tests
```

The codebase separates low-level primitives from product features and page widgets. This keeps the UI system reusable while allowing product workflows like integrations, audit logs, AI, and dashboard customization to evolve independently.

## State & Persistence

ZenithOS uses Zustand with localStorage persistence:

- `useAppStore` owns session, theme, sidebar, command palette, toasts, and UI-level preferences.
- `useWorkspaceStore` owns business-like state: orders, users, products, invoices, metrics, integrations, notifications, audit logs, dashboard widgets, table preferences, and AI history.
- Actions mutate persisted state and create connected side effects. For example, updating selected orders creates audit events and notifications; connecting an integration creates sync logs, audit entries, and a toast.

No backend, database, ORM, or external service is required.

## Design System

The `/design-system` route documents:

- semantic color tokens
- layered surfaces
- typography hierarchy
- component states
- buttons and badges
- forms and skeletons
- accessibility expectations
- responsive/table behavior
- motion philosophy

The UI uses semantic CSS variables so light and dark modes can be refined independently without rewriting component markup.

## Accessibility Notes

Implemented accessibility work includes:

- semantic buttons, links, dialogs, menus, tabs, and tables
- named dialogs for command palette, AI assistant, modal, and drawer surfaces
- focus traps and Escape close behavior for modals/drawers
- keyboard navigation in command palette and enterprise tables
- `aria-sort` for sortable enterprise table headers
- labelled row-selection controls
- visible focus rings through a semantic focus token
- chart containers with descriptive `role="img"` labels
- reduced-motion handling in global styles

## Testing

Install dependencies and Playwright browsers:

```bash
npm install
npx playwright install chromium
```

Run checks:

```bash
npm run typecheck
npm run build
npm run test:e2e
```

Current E2E coverage includes:

- authentication and protected route behavior
- command palette navigation and theme switching
- dashboard layout persistence
- enterprise table selection and bulk mutations
- integration connect flow and audit history
- modal Escape behavior
- Zenith AI interaction
- mobile shell/navigation smoke coverage

The suite runs in Chromium desktop and Chromium mobile emulation. Mobile intentionally skips desktop-only canvas/table tests while still covering auth, command, integrations, modals, and AI.

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
- `G` then `L` - audit logs
- `G` then `I` - integrations
- `G` then `Y` - design system

## Local Development

```bash
npm install
npm run dev
```

Open:

```bash
http://localhost:3000
```

Use the login page’s “Continue as demo admin” button to enter the protected product experience.

## Deployment

ZenithOS deploys directly to Vercel with default Next.js settings:

- Build command: `npm run build`
- No environment variables required
- No backend services required
- No database migrations required

## Performance Considerations

- App Router static generation is used where possible.
- Charts are isolated to client widgets.
- Heavy workflows are mock-driven and localStorage-backed.
- Motion is kept subtle and short.
- Browser exports use generated blobs rather than server work.
- E2E tests verify key interaction paths before public release.

## Frontend-Only Constraint

ZenithOS intentionally does not use:

- SQL
- Prisma
- Supabase
- Firebase
- Express
- NestJS
- MongoDB
- external backend services

Everything is simulated on the frontend with mock data, fake async APIs, Zustand, localStorage, and browser-native exports.

## Portfolio Value

ZenithOS is built to show more than visual polish. It demonstrates product thinking, state architecture, reusable UI engineering, accessibility awareness, responsive design, analytics UX, command-driven workflows, operational auditability, and automated interaction testing in a cohesive frontend-only SaaS prototype.
