## Jays Delivery Admin Dashboard

This project is an admin dashboard for managing delivery operations. It lets operations teams monitor orders, assign them to agents or partner companies, and track key delivery metrics from a single place.

### Features

- **Dashboard**: High-level overview of delivery performance.
- **Orders**: View delivery orders and drill into order details.
- **Assignments**: Assign unallocated orders to agents or partner companies.
- **Agents & Companies**: Manage delivery agents and partner companies.
- **Analytics**: See key metrics like orders per day, in-progress deliveries, and top performers.
- **Settings**: Configure system-level options (delivery-related settings can be added here).

### Getting started

#### Requirements

- Node.js 18+ (recommended)
- npm (comes with Node.js)

#### Install dependencies

```bash
npm install
```

#### Run in development

```bash
npm run dev
```

This will start the Vite dev server. Open the printed URL (usually `http://localhost:5173`) in your browser.

#### Build for production

```bash
npm run build
```

#### Preview production build

```bash
npm run preview
```

### Project structure (high level)

- `src/pages/Dashboard` – Main admin dashboard.
- `src/pages/Orders` – Orders list and order details pages.
- `src/pages/Agents` – Delivery agents list.
- `src/pages/Companies` – Delivery companies/partners list.
- `src/pages/Analytics` – Delivery analytics dashboard.
- `src/pages/Assignments` – Order assignment workflow.
- `src/layout` – App layout and sidebar.
- `src/context` – Auth, sidebar, and other shared context.
