import { useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";

export default function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <>
      <PageMeta
        title={`Order ${orderId ?? ""}`}
        description="Detailed view of a single delivery order."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ComponentCard
          title="Order Summary"
          desc="High-level information about this order."
          className="md:col-span-2"
        >
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Order ID:
              </span>{" "}
              {orderId || "-"}
            </p>
            <p>
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Status:
              </span>{" "}
              Pending assignment
            </p>
            <p>
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Customer:
              </span>{" "}
              Jane Doe
            </p>
            <p>
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Address:
              </span>{" "}
              221B Baker Street, London
            </p>
          </div>
        </ComponentCard>

        <ComponentCard
          title="Assignment"
          desc="Who is responsible for delivering this order."
        >
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Assigned To:
              </span>{" "}
              Unassigned
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              In a later iteration this section can be wired to real data and
              allow re-assignment to agents or delivery partners.
            </p>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}

