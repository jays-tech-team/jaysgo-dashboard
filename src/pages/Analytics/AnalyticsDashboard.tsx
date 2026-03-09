import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";

export default function AnalyticsDashboard() {
  return (
    <>
      <PageMeta
        title="Delivery Analytics"
        description="Key metrics for your delivery operations."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ComponentCard
          title="Orders Today"
          desc="Total orders created today."
        >
          <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
            128
          </p>
        </ComponentCard>

        <ComponentCard
          title="In-Progress Deliveries"
          desc="Orders currently out for delivery."
        >
          <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
            47
          </p>
        </ComponentCard>

        <ComponentCard
          title="Average Delivery Time"
          desc="Across completed orders in the last 24h."
        >
          <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
            32m
          </p>
        </ComponentCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <ComponentCard
          title="Orders by Status"
          desc="How orders are distributed across statuses."
        >
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Pending assignment</span>
              <span className="font-medium">18</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Out for delivery</span>
              <span className="font-medium">47</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Delivered</span>
              <span className="font-medium">320</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Cancelled</span>
              <span className="font-medium">6</span>
            </div>
          </div>
        </ComponentCard>

        <ComponentCard
          title="Top Performing Agents"
          desc="Based on completed deliveries in the last 7 days."
        >
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between">
              <span>Alex Johnson</span>
              <span className="font-medium">84 deliveries</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Maria Garcia</span>
              <span className="font-medium">73 deliveries</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Chen Wei</span>
              <span className="font-medium">69 deliveries</span>
            </li>
          </ul>
        </ComponentCard>
      </div>
    </>
  );
}

