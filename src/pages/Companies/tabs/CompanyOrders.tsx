import ComponentCard from "../../../components/common/ComponentCard";
import Table, { TableColumns } from "../../../components/ui/table/Table";
import { useMemo, useState } from "react";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import DatePicker from "../../../components/form/date-picker";

const columns: TableColumns = [
  { header: "Order ID", accessor: "order_number", sortable: true },
  { header: "Customer", accessor: "customer_name", sortable: true },
  { header: "Address", accessor: "address", sortable: false },
  { header: "Status", accessor: "order_status", sortable: true },
  { header: "Assigned To", accessor: "assigned_to", sortable: true },
  { header: "Created At", accessor: "created_at", sortable: true },
];

const MOCK_ORDERS = [
  {
    order_uuid: "ord_1024",
    order_number: "#ORD-1024",
    customer_name: "Jane Doe",
    address: "221B Baker Street, London",
    order_status: "pending_assignment",
    assigned_to: "Unassigned",
    scheduled_at: "2026-03-12",
    delivery_date: "2026-03-12",
    created_at: "2026-03-09",
  },
  {
    order_uuid: "ord_1025",
    order_number: "#ORD-1025",
    customer_name: "John Smith",
    address: "742 Evergreen Terrace, Springfield",
    order_status: "out_for_delivery",
    assigned_to: "Driver - Alex",
    scheduled_at: "2026-03-11",
    delivery_date: "2026-03-11",
    created_at: "2026-03-09",
  },
  {
    order_uuid: "ord_1026",
    order_number: "#ORD-1026",
    customer_name: "Acme Corp",
    address: "1600 Amphitheatre Parkway, CA",
    order_status: "delivered",
    assigned_to: "Company - FastShip",
    scheduled_at: "2026-03-10",
    delivery_date: "2026-03-10",
    created_at: "2026-03-09",
  },
];

export default function CompanyOrders() {
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
    <ComponentCard
      title="Company Orders"
      desc="Overview of all delivery orders for this company."
    >
      <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label>Search</Label>
          <Input
            value={search}
            type="search"
            placeholder="Order #, customer, address…"
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
            onChange={(_dates, dateStr) => setScheduledDate(dateStr)}
          />
        </div>
        <div>
          <DatePicker
            value={deliveryDate}
            id="delivery_date"
            label="Delivery Date"
            onChange={(_dates, dateStr) => setDeliveryDate(dateStr)}
          />
        </div>
      </div>
      <Table
        columns={columns}
        data={filtered as unknown as Record<string, string>[]}
      />
    </ComponentCard>
  );
}
