import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import OrderStatusSelect from "../../components/form/OrderStatusSelect";
import EntitySearchSelect from "../../components/form/EntitySearchSelect";
import { toast } from "sonner";
import LiveTrackingCard from "../../components/orders/LiveTrackingCard";
import { MOCK_ORDERS } from "./mockOrders";

type OrderDetailsRecord = Record<string, unknown>;

type OrderProduct = {
  name: string;
  category: "cake" | "flower";
  weight: string;
  dimensions: string;
  imageUrl: string;
  deliveryNotes?: string;
};

export default function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDetailsRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assigneeType, setAssigneeType] = useState<"agent" | "shop">("agent");
  const [assigneeUuid, setAssigneeUuid] = useState<string>("");
  const [isSavingAssignment, setIsSavingAssignment] = useState(false);

  const [statusSelection, setStatusSelection] = useState<string[]>([]);
  const [isSavingStatus, setIsSavingStatus] = useState(false);

  const orderUuid = orderId || null;

  const MOCK_ORDER_PRODUCTS: Record<string, OrderProduct[]> = useMemo(
    () => ({
      ord_1024: [
        {
          name: "Birthday Cake",
          category: "cake",
          weight: "1.5 kg",
          dimensions: "20 x 20 x 10 cm",
          imageUrl:
            "https://res.cloudinary.com/dth6wcygw/image/upload/q_auto/v1770018181/ANPH9934_hjxchz.jpg",
          deliveryNotes: "Keep refrigerated. Handle with care.",
        },
        {
          name: "Rose Bouquet",
          category: "flower",
          weight: "0.6 kg",
          dimensions: "60 x 25 x 25 cm",
          imageUrl:
            "https://res.cloudinary.com/dth6wcygw/image/upload/q_auto/v1770376380/ANPH1259_Large_zyb8hy.jpg",
          deliveryNotes: "Store in cool place. Do not place in direct sun.",
        },
      ],
      ord_1025: [
        {
          name: "Chocolate Fudge Cake",
          category: "cake",
          weight: "2.0 kg",
          dimensions: "22 x 22 x 12 cm",
          imageUrl:
            "https://res.cloudinary.com/dth6wcygw/image/upload/q_auto/v1770018181/ANPH9934_hjxchz.jpg",
          deliveryNotes: "Deliver before 6 PM. Keep level during transport.",
        },
      ],
      ord_1026: [
        {
          name: "Wedding Cake",
          category: "cake",
          weight: "4.5 kg",
          dimensions: "30 x 30 x 25 cm",
          imageUrl:
            "https://res.cloudinary.com/dth6wcygw/image/upload/q_auto/v1770018181/ANPH9934_hjxchz.jpg",
          deliveryNotes: "Top tier is fragile. Requires signature on delivery.",
        },
        {
          name: "Luxury Flower Arrangement",
          category: "flower",
          weight: "1.2 kg",
          dimensions: "55 x 35 x 30 cm",
          imageUrl:
            "https://res.cloudinary.com/dth6wcygw/image/upload/q_auto/v1770376380/ANPH1259_Large_zyb8hy.jpg",
          deliveryNotes: "May be left with security desk.",
        },
      ],
    }),
    [],
  );

  const headerTitle = useMemo(() => {
    const orderNumber =
      (order?.order_number as string | undefined) ||
      (order?.order_no as string | undefined) ||
      (order?.order_id as string | undefined);
    return `Order ${orderNumber || orderId || ""}`;
  }, [order, orderId]);

  useEffect(() => {
    if (!orderUuid) return;
    setIsLoading(true);
    const found =
      MOCK_ORDERS.find((o) => o.order_uuid === orderUuid) ||
      MOCK_ORDERS.find((o) => o.order_number === orderUuid);
    const nextOrder: OrderDetailsRecord | null = found
      ? {
          ...found,
          order_status_slug: found.order_status,
          order_status_name: found.order_status.replace("_", " "),
          shipping_address: found.address,
        }
      : null;
    setOrder(nextOrder);
    if (found?.order_status) setStatusSelection([found.order_status]);
    setIsLoading(false);
  }, [orderUuid]);

  async function saveAssignment() {
    if (!orderUuid) return;
    if (!assigneeUuid) {
      toast.error("Please select an assignee");
      return;
    }
    setIsSavingAssignment(true);
    try {
      const label =
        (assigneeType === "agent"
          ? MOCK_AGENTS.find((a) => a.value === assigneeUuid)?.label
          : MOCK_COMPANIES.find((c) => c.value === assigneeUuid)?.label) ||
        "Assigned";
      setOrder((prev) =>
        prev
          ? {
              ...prev,
              assigned_to:
                assigneeType === "agent" ? `Driver - ${label}` : `Company - ${label}`,
            }
          : prev,
      );
      toast.success("Assignment updated (dummy)");
      setIsAssignModalOpen(false);
    } finally {
      setIsSavingAssignment(false);
    }
  }

  async function saveStatus() {
    if (!orderUuid) return;
    const next = statusSelection?.[0];
    if (!next) {
      toast.error("Please select a status");
      return;
    }
    setIsSavingStatus(true);
    try {
      setOrder((prev) =>
        prev
          ? {
              ...prev,
              order_status: next,
              status: next,
              order_status_slug: next,
              order_status_name: next.replace("_", " "),
            }
          : prev,
      );
      toast.success("Status updated (dummy)");
    } finally {
      setIsSavingStatus(false);
    }
  }

  const MOCK_AGENTS = useMemo(
    () => [
      { value: "agent_alex", label: "Alex Johnson" },
      { value: "agent_maria", label: "Maria Garcia" },
      { value: "agent_chen", label: "Chen Wei" },
    ],
    [],
  );

  const MOCK_COMPANIES = useMemo(
    () => [
      { value: "comp_fastship", label: "FastShip Logistics" },
      { value: "comp_greenroute", label: "GreenRoute Delivery" },
      { value: "comp_express", label: "ExpressWheels" },
    ],
    [],
  );

  return (
    <>
      <PageMeta
        title={headerTitle}
        description="Detailed view of a single delivery order."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ComponentCard
          title="Order Summary"
          desc="High-level information about this order."
          className="md:col-span-2"
          actions={
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAssignModalOpen(true)}
                disabled={!orderUuid}
              >
                Assign / Reassign
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={saveStatus}
                disabled={!orderUuid || isSavingStatus}
              >
                Change Status
              </Button>
            </div>
          }
        >
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Order ID:
              </span>{" "}
              {orderUuid || "-"}
            </p>
            <p>
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Status:
              </span>{" "}
              {(order?.order_status_name as string | undefined) ||
                (order?.order_status as string | undefined) ||
                (order?.status as string | undefined) ||
                "-"}
            </p>
            <p>
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Customer:
              </span>{" "}
              {(order?.customer_name as string | undefined) ||
                (order?.recipient_name as string | undefined) ||
                "-"}
            </p>
            <p>
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Address:
              </span>{" "}
              {(order?.shipping_address as string | undefined) ||
                (order?.address as string | undefined) ||
                "-"}
            </p>

            <div className="pt-2">
              <OrderStatusSelect
                value={statusSelection}
                onChange={(val) => setStatusSelection((prev) =>{
                if(Array.isArray(val)){
                  return [...prev, ...val];
                }
                return [...prev, val];
                } )}
                label="Delivery Status"
                placeholder="Select status"
              />
              {isLoading && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Loading…
                </p>
              )}
            </div>
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
              {(order?.assigned_to as string | undefined) ||
                (order?.assignee_name as string | undefined) ||
                "Unassigned"}
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Use “Assign / Reassign” to manually set the driver/company.
            </p>
          </div>
        </ComponentCard>

        <ComponentCard
          title="Products"
          desc="Items included in this delivery, with weight, dimensions, and delivery notes."
          className="md:col-span-3"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-2 pr-4 font-medium text-gray-600 dark:text-gray-300">
                    Image
                  </th>
                  <th className="py-2 pr-4 font-medium text-gray-600 dark:text-gray-300">
                    Product
                  </th>
                  <th className="py-2 px-4 font-medium text-gray-600 dark:text-gray-300">
                    Category
                  </th>
                  <th className="py-2 px-4 font-medium text-gray-600 dark:text-gray-300">
                    Weight
                  </th>
                  <th className="py-2 px-4 font-medium text-gray-600 dark:text-gray-300">
                    Dimensions
                  </th>
                  <th className="py-2 px-4 font-medium text-gray-600 dark:text-gray-300">
                    Delivery Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {(orderUuid && MOCK_ORDER_PRODUCTS[orderUuid]) ? (
                  MOCK_ORDER_PRODUCTS[orderUuid].map((product, index) => (
                    <tr
                      key={`${orderUuid}-product-${index}`}
                      className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                    >
                      <td className="py-2 pr-4">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-16 w-16 rounded object-cover border border-gray-200 dark:border-gray-700"
                        />
                      </td>
                      <td className="py-2 pr-4 text-gray-900 dark:text-gray-100">
                        {product.name}
                      </td>
                      <td className="py-2 px-4 text-gray-900 dark:text-gray-100">
                        {product.category}
                      </td>
                      <td className="py-2 px-4 text-gray-900 dark:text-gray-100">
                        {product.weight}
                      </td>
                      <td className="py-2 px-4 text-gray-900 dark:text-gray-100">
                        {product.dimensions}
                      </td>
                      <td className="py-2 px-4 text-gray-700 dark:text-gray-300">
                        {product.deliveryNotes || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="py-3 pr-4 text-gray-500 dark:text-gray-400"
                      colSpan={4}
                    >
                      No products found for this order.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </ComponentCard>

        <div className="md:col-span-3">
          <LiveTrackingCard orderUuid={orderUuid} />
        </div>
      </div>

      <Modal
        isOpen={isAssignModalOpen}
        isFullscreen={false}
        onClose={() => setIsAssignModalOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold">Assign order</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Search for a driver (agent) or company (shop), then assign.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={assigneeType === "agent" ? "primary" : "outline"}
              onClick={() => {
                setAssigneeType("agent");
                setAssigneeUuid("");
              }}
            >
              Driver
            </Button>
            <Button
              size="sm"
              variant={assigneeType === "shop" ? "primary" : "outline"}
              onClick={() => {
                setAssigneeType("shop");
                setAssigneeUuid("");
              }}
            >
              Company
            </Button>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Select assignee</div>
            <EntitySearchSelect
              options={assigneeType === "agent" ? MOCK_AGENTS : MOCK_COMPANIES}
              value={assigneeUuid}
              onChange={(v) => setAssigneeUuid(v)}
              placeholder="Type to search…"
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Dummy selector (no API).
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAssignModalOpen(false)}
              disabled={isSavingAssignment}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={saveAssignment}
              disabled={isSavingAssignment}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

