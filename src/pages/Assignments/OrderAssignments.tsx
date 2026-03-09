import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Table, { TableColumns } from "../../components/ui/table/Table";

const ordersColumns: TableColumns = [
  { header: "Order ID", accessor: "orderId", sortable: true },
  { header: "Customer", accessor: "customer", sortable: true },
  { header: "Address", accessor: "address", sortable: false },
  { header: "Status", accessor: "status", sortable: true },
];

const agentsColumns: TableColumns = [
  { header: "Agent / Company", accessor: "name", sortable: true },
  { header: "Type", accessor: "type", sortable: true },
  { header: "Active Deliveries", accessor: "activeDeliveries", sortable: true },
  { header: "Capacity", accessor: "capacity", sortable: true },
];

const unassignedOrders = [
  {
    orderId: "#ORD-2001",
    customer: "Sarah Lee",
    address: "10 Downing Street, London",
    status: "Pending assignment",
  },
  {
    orderId: "#ORD-2002",
    customer: "Michael Brown",
    address: "5th Avenue, New York",
    status: "Pending assignment",
  },
];

const availableAssignees = [
  {
    name: "Alex Johnson",
    type: "Agent",
    activeDeliveries: "2",
    capacity: "5",
  },
  {
    name: "FastShip Logistics",
    type: "Company",
    activeDeliveries: "18",
    capacity: "40",
  },
];

export default function OrderAssignments() {
  const handleMockAssign = () => {
    // Placeholder handler – replace with real API integration later.
    // Intentionally left without side effects.
  };

  return (
    <>
      <PageMeta
        title="Order Assignments"
        description="Assign incoming orders to agents or delivery partners."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ComponentCard
          title="Unassigned Orders"
          desc="New orders waiting to be assigned."
          actions={
            <button
              type="button"
              onClick={handleMockAssign}
              className="inline-flex items-center rounded-md bg-brand-500 px-3 py-2 text-xs font-medium text-white shadow-theme-xs hover:bg-brand-600"
            >
              Auto-assign (mock)
            </button>
          }
        >
          <Table columns={ordersColumns} data={unassignedOrders} />
        </ComponentCard>

        <ComponentCard
          title="Agents & Companies"
          desc="Current capacity and load for each assignee."
        >
          <Table columns={agentsColumns} data={availableAssignees} />
        </ComponentCard>
      </div>
    </>
  );
}

