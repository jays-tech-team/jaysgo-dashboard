import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import PageMeta from "../../components/common/PageMeta";

const ORDERS_BY_STATUS_OPTIONS: ApexOptions = {
  chart: {
    type: "bar",
    height: 260,
    toolbar: { show: false },
    fontFamily: "Outfit, sans-serif",
  },
  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: "40%",
    },
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: [
      "Pending assignment",
      "Out for delivery",
      "Delivered",
      "Cancelled",
    ],
    axisTicks: { show: false },
    axisBorder: { show: false },
    labels: {
      style: { fontSize: "11px" },
    },
  },
  yaxis: {
    labels: { style: { fontSize: "11px" } },
  },
  grid: {
    yaxis: { lines: { show: true } },
    xaxis: { lines: { show: false } },
  },
  colors: ["#0ea5e9"],
  tooltip: {
    y: {
      formatter: (val) => `${val} orders`,
    },
  },
};

const ORDERS_BY_STATUS_SERIES = [
  {
    name: "Orders",
    data: [18, 47, 320, 6],
  },
];

const DELIVERY_TREND_OPTIONS: ApexOptions = {
  chart: {
    type: "area",
    height: 260,
    toolbar: { show: false },
    fontFamily: "Outfit, sans-serif",
  },
  dataLabels: { enabled: false },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  xaxis: {
    categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yaxis: {
    labels: { style: { fontSize: "11px" } },
  },
  grid: {
    yaxis: { lines: { show: true } },
    xaxis: { lines: { show: false } },
  },
  colors: ["#22c55e", "#f97316"],
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 0.5,
      opacityFrom: 0.6,
      opacityTo: 0.05,
      stops: [0, 90, 100],
    },
  },
  tooltip: {
    shared: true,
    intersect: false,
  },
};

const DELIVERY_TREND_SERIES = [
  {
    name: "Delivered orders",
    data: [280, 310, 295, 340, 360, 410, 390],
  },
  {
    name: "On-time rate (%)",
    data: [93, 92, 94, 95, 96, 95, 94],
  },
];

export default function Home() {
  return (
    <>
      <PageMeta
        title="Delivery Operations Dashboard"
        description="Overview of today’s delivery performance."
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Top KPI cards */}
        <div className="col-span-12 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p className="text-xs font-medium uppercase text-gray-500">
              Orders today
            </p>
            <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">
              128
            </p>
            <p className="mt-1 text-xs text-emerald-500">+12% vs yesterday</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p className="text-xs font-medium uppercase text-gray-500">
              In-progress
            </p>
            <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">
              47
            </p>
            <p className="mt-1 text-xs text-amber-500">
              18 orders waiting assignment
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p className="text-xs font-medium uppercase text-gray-500">
              Avg. delivery time
            </p>
            <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">
              32m
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Last 24 hours
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p className="text-xs font-medium uppercase text-gray-500">
              On-time rate
            </p>
            <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">
              94%
            </p>
            <p className="mt-1 text-xs text-emerald-500">
              Target: 95% on-time
            </p>
          </div>
        </div>

        {/* Orders by status (ApexCharts bar) */}
        <div className="col-span-12 xl:col-span-7">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Orders by status (today)
                </h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Visual breakdown of orders across key delivery stages.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Chart
                options={ORDERS_BY_STATUS_OPTIONS}
                series={ORDERS_BY_STATUS_SERIES}
                type="bar"
                height={260}
              />
            </div>
          </div>
        </div>

        {/* Right column: trend chart + issues + quick links */}
        <div className="col-span-12 xl:col-span-5 space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Delivered orders & on-time rate (last 7 days)
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Monitor delivery volume and punctuality over the past week.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Chart
                options={DELIVERY_TREND_OPTIONS}
                series={DELIVERY_TREND_SERIES}
                type="area"
                height={260}
              />
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-amber-300 bg-amber-50 p-4 shadow-sm dark:border-amber-500/60 dark:bg-amber-500/10">
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-amber-200/40 to-transparent dark:from-amber-500/15 pointer-events-none" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-500/20 dark:text-amber-100">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  Attention needed
                </p>
                <p className="mt-3 text-xs text-amber-900/80 dark:text-amber-50">
                  Resolve these items to keep deliveries flowing smoothly.
                </p>
              </div>
              <a
                href="/admin/assignments"
                className="inline-flex items-center rounded-full bg-amber-600 px-3 py-1.5 text-xs font-medium text-white shadow-theme-xs hover:bg-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:ring-offset-gray-900"
              >
                Go to assignments
              </a>
            </div>

            <ul className="mt-4 space-y-3 text-xs text-amber-950/90 dark:text-amber-50">
              <li className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">Pending assignment backlog</p>
                  <p className="text-[11px] text-amber-900/70 dark:text-amber-100/80">
                    Orders waiting more than 10 minutes for an assignee.
                  </p>
                </div>
                <span className="inline-flex items-center justify-center rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-900 dark:bg-amber-500/20 dark:text-amber-50">
                  18
                </span>
              </li>
              <li className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">Agents near capacity</p>
                  <p className="text-[11px] text-amber-900/70 dark:text-amber-100/80">
                    Agents with more than 80% of their capacity in use.
                  </p>
                </div>
                <span className="inline-flex items-center justify-center rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-semibold text-orange-900 dark:bg-orange-500/20 dark:text-orange-50">
                  3
                </span>
              </li>
              <li className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">Paused partner companies</p>
                  <p className="text-[11px] text-amber-900/70 dark:text-amber-100/80">
                    Partners not accepting new deliveries right now.
                  </p>
                </div>
                <span className="inline-flex items-center justify-center rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-semibold text-rose-900 dark:bg-rose-500/20 dark:text-rose-50">
                  2
                </span>
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Quick links
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <a
                href="/admin/assignments"
                className="rounded-lg border border-gray-200 px-3 py-2 text-center font-medium text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-white/5"
              >
                Manage assignments
              </a>
              <a
                href="/admin/orders"
                className="rounded-lg border border-gray-200 px-3 py-2 text-center font-medium text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-white/5"
              >
                View orders
              </a>
              <a
                href="/admin/agents"
                className="rounded-lg border border-gray-200 px-3 py-2 text-center font-medium text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-white/5"
              >
                Agents
              </a>
              <a
                href="/admin/companies"
                className="rounded-lg border border-gray-200 px-3 py-2 text-center font-medium text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-white/5"
              >
                Companies
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
