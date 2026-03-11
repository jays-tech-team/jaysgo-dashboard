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
          order_status_name: found.order_status.replaceAll("_", " "),
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
              order_status_name: next.replaceAll("_", " "),
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
                onChange={(val) => setStatusSelection(val || [])}
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

