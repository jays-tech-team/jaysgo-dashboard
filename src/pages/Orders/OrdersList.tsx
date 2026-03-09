import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Table, { TableColumns } from "../../components/ui/table/Table";

const columns: TableColumns = [
  { header: "Order ID", accessor: "orderId", sortable: true },
  { header: "Customer", accessor: "customer", sortable: true },
  { header: "Address", accessor: "address", sortable: false },
  { header: "Status", accessor: "status", sortable: true },
  { header: "Assigned To", accessor: "assignedTo", sortable: true },
  { header: "Created At", accessor: "createdAt", sortable: true },
];

const mockData = [
  {
    orderId: "#ORD-1024",
    customer: "Jane Doe",
    address: "221B Baker Street, London",
    status: "Pending assignment",
    assignedTo: "Unassigned",
    createdAt: "2026-03-09 09:12",
  },
  {
    orderId: "#ORD-1025",
    customer: "John Smith",
    address: "742 Evergreen Terrace, Springfield",
    status: "Out for delivery",
    assignedTo: "Agent - Alex",
    createdAt: "2026-03-09 09:25",
  },
  {
    orderId: "#ORD-1026",
    customer: "Acme Corp",
    address: "1600 Amphitheatre Parkway, CA",
    status: "Delivered",
    assignedTo: "Company - FastShip",
    createdAt: "2026-03-09 08:45",
  },
];

export default function OrdersList() {
  return (
    <>
      <PageMeta
        title="Orders"
        description="Manage all delivery orders in the system."
      />
      <ComponentCard
        title="Orders"
        desc="Overview of all delivery orders, their status, and assignment."
      >
        <Table columns={columns} data={mockData} />
      </ComponentCard>
    </>
  );
}

