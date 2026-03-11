import PageMeta from "../../components/common/PageMeta";
import { useMemo, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Table, { TableColumns } from "../../components/ui/table/Table";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import DatePicker from "../../components/form/date-picker";
import { MOCK_ORDERS } from "./mockOrders";

const columns: TableColumns = [
  { header: "Order #", accessor: "order_number", sortable: true },
  { header: "Customer", accessor: "customer_name", sortable: true },
  { header: "Status", accessor: "order_status", sortable: true },
  { header: "Assigned To", accessor: "assigned_to", sortable: true },
  { header: "Scheduled", accessor: "scheduled_at", sortable: true },
  { header: "Created", accessor: "created_at", sortable: true },
];

export default function OrdersList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MOCK_ORDERS.filter((o) => {
      const matchesSearch =
        !q ||
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.address.toLowerCase().includes(q) ||
        o.order_uuid.toLowerCase().includes(q);

      const matchesStatus = !status || o.order_status === status;
      const matchesScheduled = !scheduledDate || o.scheduled_at === scheduledDate;
      const matchesDelivery = !deliveryDate || o.delivery_date === deliveryDate;

      return matchesSearch && matchesStatus && matchesScheduled && matchesDelivery;
    });
  }, [search, status, scheduledDate, deliveryDate]);

  return (
    <>
      <PageMeta
        title="Orders"
        description="Manage all delivery orders in the system."
      />
      <ComponentCard
        title="Orders"
        desc="Overview of all delivery orders, their status, assignment, and scheduling."
      >
        <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label>Search</Label>
            <Input
              value={search}
              type="search"
              placeholder="Order #, customer, address…"
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <Label>Status</Label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: "", label: "All" },
                { value: "pending_assignment", label: "Pending assignment" },
                { value: "assigned", label: "Assigned" },
                { value: "out_for_delivery", label: "Out for delivery" },
                { value: "delivered", label: "Delivered" },
                { value: "cancelled", label: "Cancelled" },
              ]}
            />
          </div>
          <div>
            <DatePicker
              value={scheduledDate}
              id="scheduled_date"
              label="Scheduled Date"
              minDate={""}
              dateFormat="Y-m-d"
              placeholder="Select the date"
              clearButton={true}
              onChange={(_dates, dateStr) => setScheduledDate(dateStr)}
            />
          </div>
          <div>
            <DatePicker
              value={deliveryDate}
              id="delivery_date"
              label="Delivery Date"
              minDate={""}
              dateFormat="Y-m-d"
              placeholder="Select the date"
              clearButton={true}
              onChange={(_dates, dateStr) => setDeliveryDate(dateStr)}
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={filtered as unknown as Record<string, string>[]}
          viewPath="/admin/orders/:order_uuid"
        />
      </ComponentCard>
    </>
  );
}

